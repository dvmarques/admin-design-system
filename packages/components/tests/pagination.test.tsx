import { StrictMode, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	AdsPagination,
	getAdsResponsivePaginationItems,
	type AdsPaginationLinkProps,
} from '../src/pagination.js';

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
	vi.useRealTimers();
});

function Controlled() {
	const [page, setPage] = useState(25);
	return <AdsPagination page={page} pageCount={50} onPageChange={setPage} showPageJump />;
}

describe('responsive pagination contracts', () => {
	it.each([1, 2, 3, 4, 25, 48, 49, 50])(
		'keeps mandatory pages without duplicates at page %i',
		(page) => {
			for (const slots of [0, 3, 5, 7, 20]) {
				const items = getAdsResponsivePaginationItems(page, 50, 2, slots);
				const numbers = items.filter((x): x is number => typeof x === 'number');
				expect(numbers).toEqual([...new Set(numbers)].sort((a, b) => a - b));
				expect(numbers).toEqual(expect.arrayContaining([1, page, 50]));
				items.forEach((item, i) => {
					if (item === 'ellipsis')
						expect(Number(items[i + 1]) - Number(items[i - 1])).toBeGreaterThan(2);
				});
			}
		},
	);
	it('fills one-page gaps and keeps small totals complete when space allows', () => {
		expect(getAdsResponsivePaginationItems(3, 10, 0, 5)).toEqual([1, 2, 3, 'ellipsis', 10]);
		expect(getAdsResponsivePaginationItems(1, 7, 1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
		expect(getAdsResponsivePaginationItems(5, 10, 0, 50)).toEqual([
			1,
			'ellipsis',
			5,
			'ellipsis',
			10,
		]);
	});
	it.each([0, 1, 2])('handles total %i', (count) => {
		const spy = vi.fn();
		render(<AdsPagination page={1} pageCount={count} onPageChange={spy} showPageJump />);
		expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled();
		if (count < 2) expect(screen.getByRole('button', { name: 'Próxima página' })).toBeDisabled();
		expect(document.querySelectorAll('[aria-current="page"]')).toHaveLength(count ? 1 : 0);
		expect(spy).not.toHaveBeenCalled();
	});
	it.each(['', '0', '11', '1.5', '1e1'])(
		'rejects invalid jump %j without submitting the parent form',
		(value) => {
			const navigate = vi.fn(),
				submit = vi.fn();
			render(
				<form onSubmit={submit}>
					<AdsPagination page={2} pageCount={10} onPageChange={navigate} showPageJump />
				</form>,
			);
			const field = screen.getByRole('spinbutton');
			fireEvent.change(field, { target: { value } });
			fireEvent.keyDown(field, { key: 'Enter' });
			expect(navigate).not.toHaveBeenCalled();
			expect(submit).not.toHaveBeenCalled();
			expect(field).toHaveAttribute('aria-invalid', 'true');
			expect(screen.getByRole('alert')).toBeInTheDocument();
			expect(document.querySelectorAll('form form')).toHaveLength(0);
		},
	);
	it('accepts Enter and click, avoids current-page callbacks and synchronizes total changes', () => {
		const spy = vi.fn();
		const { rerender } = render(
			<AdsPagination page={2} pageCount={10} onPageChange={spy} showPageJump />,
		);
		const field = screen.getByRole('spinbutton');
		fireEvent.keyDown(field, { key: 'Enter' });
		expect(spy).not.toHaveBeenCalled();
		fireEvent.change(field, { target: { value: '5' } });
		fireEvent.keyDown(field, { key: 'Enter' });
		expect(spy).toHaveBeenCalledWith(5);
		fireEvent.change(field, { target: { value: '6' } });
		fireEvent.click(screen.getByRole('button', { name: 'Ir' }));
		expect(spy).toHaveBeenLastCalledWith(6);
		rerender(<AdsPagination page={2} pageCount={20} onPageChange={spy} showPageJump />);
		expect(field).toHaveValue(2);
	});
	it('uses the consumer link for jump confirmation and Enter without nested controls', () => {
		const activated = vi.fn();
		const callback = vi.fn();
		render(
			<AdsPagination
				page={2}
				pageCount={10}
				showPageJump
				onPageChange={callback}
				renderPageLink={(p, props) => (
					<a
						href={`?page=${p}`}
						{...props}
						onClick={(event) => {
							event.preventDefault();
							activated(p);
						}}
					/>
				)}
			/>,
		);
		const field = screen.getByRole('spinbutton');
		fireEvent.change(field, { target: { value: '7' } });
		fireEvent.keyDown(field, { key: 'Enter' });
		expect(activated).toHaveBeenCalledWith(7);
		fireEvent.click(screen.getByRole('link', { name: 'Ir' }));
		expect(activated).toHaveBeenCalledTimes(2);
		expect(callback).not.toHaveBeenCalled();
		expect(document.querySelectorAll('a button,button a,a a')).toHaveLength(0);
	});
	it('preserves links and focus during loading and blocks their activation in capture', () => {
		const click = vi.fn();
		const link = (p: number, props: AdsPaginationLinkProps) => (
			<a href={`?page=${p}`} {...props} onClick={click} />
		);
		const { rerender } = render(<AdsPagination page={2} pageCount={3} renderPageLink={link} />);
		const target = screen.getByRole('link', { name: 'Página 3' });
		target.focus();
		rerender(<AdsPagination page={2} pageCount={3} renderPageLink={link} loading />);
		expect(screen.getByRole('link', { name: 'Página 3' })).toBe(target);
		expect(target).toHaveFocus();
		expect(target).toHaveAttribute('aria-disabled', 'true');
		fireEvent.click(target);
		expect(click).not.toHaveBeenCalled();
	});
	it('corrects invalid controlled pages once after commit, defers loading, and never corrects total zero', () => {
		const spy = vi.fn();
		const { rerender } = render(
			<StrictMode>
				<AdsPagination page={25} pageCount={10} loading onPageChange={spy} />
			</StrictMode>,
		);
		expect(spy).not.toHaveBeenCalled();
		rerender(
			<StrictMode>
				<AdsPagination page={25} pageCount={10} onPageChange={spy} />
			</StrictMode>,
		);
		expect(spy).toHaveBeenCalledExactlyOnceWith(10);
		rerender(
			<StrictMode>
				<AdsPagination page={25} pageCount={10} onPageChange={(p) => spy(p)} />
			</StrictMode>,
		);
		expect(spy).toHaveBeenCalledTimes(1);
		rerender(<AdsPagination page={25} pageCount={0} onPageChange={spy} />);
		expect(spy).toHaveBeenCalledTimes(1);
	});
	it('preserves numeric DOM identity across page changes and does not move focus on external updates', () => {
		const { rerender } = render(<AdsPagination page={24} pageCount={50} />);
		const item = screen.getByRole('button', { name: 'Página 25' });
		item.focus();
		rerender(<AdsPagination page={25} pageCount={50} />);
		expect(screen.getByRole('button', { name: 'Página 25' })).toBe(item);
		expect(item).toHaveFocus();
		const external = document.createElement('button');
		document.body.append(external);
		external.focus();
		rerender(<AdsPagination page={50} pageCount={50} />);
		expect(external).toHaveFocus();
		external.remove();
	});
	it('measures actual controls, responds to resize, stabilizes and cleans up observer/frame', () => {
		vi.useFakeTimers();
		let width = 400;
		let notify: () => void = () => {};
		const disconnect = vi.fn();
		vi.stubGlobal(
			'ResizeObserver',
			class {
				constructor(cb: () => void) {
					notify = cb;
				}
				observe() {}
				disconnect = disconnect;
			},
		);
		vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (
			this: HTMLElement,
		) {
			return this.classList.contains('ads-pagination-scroll') ? width : 0;
		});
		vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
			this: HTMLElement,
		) {
			return { width: this.dataset.navigation ? 100 : 40 } as DOMRect;
		});
		const { unmount } = render(<Controlled />);
		expect(document.querySelectorAll('[data-page]')).toHaveLength(3);
		width = 600;
		act(() => {
			notify();
			vi.runAllTimers();
		});
		expect(screen.getByRole('button', { name: 'Página 24' })).toBeInTheDocument();
		const button = screen.getByRole('button', { name: 'Página 24' });
		button.focus();
		width = 400;
		act(() => {
			notify();
			vi.runAllTimers();
		});
		expect(screen.queryByRole('button', { name: 'Página 24' })).toBeNull();
		expect(screen.getByRole('button', { name: 'Página 25' })).toHaveFocus();
		width = 100;
		act(() => {
			notify();
			vi.runAllTimers();
		});
		expect(screen.getByRole('region', { name: 'Controles de paginação roláveis' })).toHaveAttribute(
			'tabindex',
			'0',
		);
		act(() => {
			notify();
			vi.runAllTimers();
		});
		expect(document.querySelectorAll('[data-page]')).toHaveLength(3);
		notify();
		unmount();
		expect(disconnect).toHaveBeenCalled();
		expect(vi.getTimerCount()).toBe(0);
	});
	it('hydrates deterministic SSR markup and passes automated accessibility checks', async () => {
		const html = renderToString(
			<AdsPagination page={3} pageCount={10} showPageJump navigationMode="arrows" />,
		);
		const host = document.createElement('main');
		host.innerHTML = html;
		document.body.append(host);
		const errors = vi.fn();
		let root: ReturnType<typeof hydrateRoot>;
		await act(async () => {
			root = hydrateRoot(
				host,
				<AdsPagination page={3} pageCount={10} showPageJump navigationMode="arrows" />,
				{ onRecoverableError: errors },
			);
		});
		expect(errors).not.toHaveBeenCalled();
		const result = await axe.run(host, { rules: { 'color-contrast': { enabled: false } } });
		expect(result.violations.map((v) => v.id)).toEqual([]);
		act(() => root.unmount());
		host.remove();
	});
	it('localizes visible controls, errors and accessible names', () => {
		render(
			<AdsPagination
				page={2}
				pageCount={10}
				showPageJump
				labels={{
					previousText: 'Back',
					nextText: 'Forward',
					previous: 'Previous page',
					next: 'Next page',
					jump: 'Go to page',
					jumpButton: 'Go',
					jumpError: 'Invalid page',
					page: (n) => `Page ${n}`,
				}}
			/>,
		);
		expect(screen.getByRole('button', { name: 'Previous page' })).toHaveTextContent('Back');
		fireEvent.change(screen.getByRole('spinbutton', { name: 'Go to page' }), {
			target: { value: '' },
		});
		fireEvent.click(screen.getByRole('button', { name: 'Go' }));
		expect(screen.getByRole('alert')).toHaveTextContent('Invalid page');
	});
});

describe('legacy and boundary focus', () => {
	it('preserves legacy renderPage and custom navigation content', () => {
		const navigate = vi.fn();
		render(
			<AdsPagination
				page={2}
				pageCount={3}
				onPageChange={navigate}
				previousContent={<span>Voltar</span>}
				nextContent={<span>Avançar</span>}
				renderPage={(page, content) => <span data-legacy={page}>{content}</span>}
			/>,
		);
		expect(screen.getByRole('button', { name: 'Página anterior' })).toHaveTextContent('Voltar');
		expect(document.querySelectorAll('[data-legacy]')).toHaveLength(3);
		fireEvent.click(screen.getByRole('button', { name: 'Página 3' }));
		expect(navigate).toHaveBeenCalledExactlyOnceWith(3);
	});
	it('restores focus on the current page when an activated boundary becomes disabled', () => {
		function Boundary() {
			const [page, setPage] = useState(2);
			return <AdsPagination page={page} pageCount={3} onPageChange={setPage} />;
		}
		render(<Boundary />);
		const next = screen.getByRole('button', { name: 'Próxima página' });
		next.focus();
		fireEvent.click(next);
		expect(next).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Página 3' })).toHaveFocus();
	});
	it('blocks auxiliary link activation during loading', () => {
		const click = vi.fn();
		render(
			<AdsPagination
				page={1}
				pageCount={3}
				loading
				renderPageLink={(page, props) => <a href={`?page=${page}`} {...props} onAuxClick={click} />}
			/>,
		);
		fireEvent(
			screen.getByRole('link', { name: 'Página 2' }),
			new MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 1 }),
		);
		expect(click).not.toHaveBeenCalled();
	});
});

it('does not retain a focus-repair request after an unchanged observer notification', () => {
	vi.useFakeTimers();
	let notify: () => void = () => {};
	vi.stubGlobal(
		'ResizeObserver',
		class {
			constructor(cb: () => void) {
				notify = cb;
			}
			observe() {}
			disconnect() {}
		},
	);
	vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(600);
	vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
		this: HTMLElement,
	) {
		return { width: this.dataset.navigation ? 100 : 40 } as DOMRect;
	});
	const { rerender } = render(<AdsPagination page={25} pageCount={50} />);
	screen.getByRole('button', { name: 'Página 24' }).focus();
	act(() => {
		notify();
		vi.runAllTimers();
	});
	rerender(<AdsPagination page={50} pageCount={50} />);
	expect(document.body).toHaveFocus();
});
