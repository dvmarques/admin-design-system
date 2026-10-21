import type { HTMLAttributes } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
	AdsBreadcrumb,
	AdsDropdown,
	AdsNav,
	AdsPagination,
	AdsTabs,
	getAdsPaginationItems,
} from '../src/index.js';

describe('navigation components', () => {
	it('renders breadcrumb semantics and current page', () => {
		render(<AdsBreadcrumb items={[{ href: '/home', label: 'Início' }, { label: 'Relatórios' }]} />);
		expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
		expect(screen.getByText('Relatórios')).toHaveAttribute('aria-current', 'page');
		expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute('href', '/home');
	});

	it('renders active nav destination', () => {
		render(
			<AdsNav
				items={[
					{ href: '/dashboard', label: 'Dashboard', current: true },
					{ label: 'Sair', onClick: vi.fn() },
				]}
			/>,
		);
		expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
		expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveClass(
			'min-h-10',
			'bg-surface-selected',
			'text-on-surface-selected',
		);
	});

	it('supports manual tabs keyboard navigation', async () => {
		render(
			<AdsTabs defaultValue="one">
				<AdsTabs.List>
					<AdsTabs.Trigger value="one">Um</AdsTabs.Trigger>
					<AdsTabs.Trigger value="two">Dois</AdsTabs.Trigger>
				</AdsTabs.List>
				<AdsTabs.Panel value="one">Painel um</AdsTabs.Panel>
				<AdsTabs.Panel value="two">Painel dois</AdsTabs.Panel>
			</AdsTabs>,
		);
		const first = screen.getByRole('tab', { name: 'Um' });
		const second = screen.getByRole('tab', { name: 'Dois' });
		expect(first).toHaveAttribute('aria-selected', 'true');
		expect(first).toHaveAttribute('data-state', 'active');
		first.focus();
		fireEvent.keyDown(first, { key: 'ArrowRight' });
		expect(second).toHaveFocus();
		await userEvent.setup().keyboard('{Enter}');
		expect(screen.getByText('Painel dois')).toBeInTheDocument();
		expect(second).toHaveAttribute('data-state', 'active');
		expect(second).toHaveClass(
			'bg-surface-selected',
			'text-on-surface-selected',
			'border-b-primary',
			'border-b-2',
		);
	});

	it('gives each tab state one explicit set of classes, with no conflicting utilities', () => {
		render(
			<AdsTabs defaultValue="one">
				<AdsTabs.List>
					<AdsTabs.Trigger value="one">Um</AdsTabs.Trigger>
					<AdsTabs.Trigger value="two">Dois</AdsTabs.Trigger>
				</AdsTabs.List>
			</AdsTabs>,
		);
		const active = screen.getByRole('tab', { name: 'Um' });
		const inactive = screen.getByRole('tab', { name: 'Dois' });

		expect(active).toHaveClass(
			'bg-surface-selected',
			'text-on-surface-selected',
			'border-b-primary',
		);
		expect(active).not.toHaveClass('bg-transparent', 'text-text-secondary', 'text-primary');
		expect(active).not.toHaveClass('border-b-border', 'border-primary');

		expect(inactive).toHaveClass(
			'bg-transparent',
			'text-text-secondary',
			'border-b-border',
			'hover:text-text',
			'hover:bg-surface-hover',
		);
		expect(inactive).not.toHaveClass('text-primary', 'bg-surface-selected', 'border-b-primary');
	});

	it('moves the selected styles with the active tab', () => {
		render(
			<AdsTabs defaultValue="one">
				<AdsTabs.List>
					<AdsTabs.Trigger value="one">Um</AdsTabs.Trigger>
					<AdsTabs.Trigger value="two">Dois</AdsTabs.Trigger>
				</AdsTabs.List>
			</AdsTabs>,
		);
		const first = screen.getByRole('tab', { name: 'Um' });
		const second = screen.getByRole('tab', { name: 'Dois' });

		fireEvent.click(second);

		expect(second).toHaveClass('bg-surface-selected', 'border-b-primary');
		expect(first).not.toHaveClass('bg-surface-selected', 'border-b-primary');
		expect(first).toHaveClass('bg-transparent', 'text-text-secondary');
	});

	it('colors breadcrumb links with public text tokens instead of the browser default', () => {
		render(
			<AdsBreadcrumb
				items={[
					{ href: '/home', label: 'Início' },
					{ href: '/reports', label: 'Relatórios' },
					{ label: 'Mensal' },
				]}
			/>,
		);

		for (const name of ['Início', 'Relatórios']) {
			expect(screen.getByRole('link', { name })).toHaveClass('text-text-muted', 'hover:text-text');
		}
		expect(screen.getByText('Mensal')).toHaveClass('text-text');
	});

	it('removes the native underline from AdsNav links and keeps aria-current', () => {
		render(
			<AdsNav
				items={[
					{ href: '/a', label: 'A', current: true },
					{ href: '/b', label: 'B' },
				]}
			/>,
		);
		expect(screen.getByRole('link', { name: 'A' })).toHaveClass('no-underline');
		expect(screen.getByRole('link', { name: 'A' })).toHaveAttribute('aria-current', 'page');
		expect(screen.getByRole('link', { name: 'B' })).toHaveClass('no-underline');
	});

	it('opens dropdown and restores focus after Escape', () => {
		render(
			<AdsDropdown>
				<AdsDropdown.Trigger>Mais</AdsDropdown.Trigger>
				<AdsDropdown.Content>
					<AdsDropdown.Item onSelect={() => undefined}>Editar</AdsDropdown.Item>
				</AdsDropdown.Content>
			</AdsDropdown>,
		);
		const trigger = screen.getByRole('button', { name: 'Mais' });
		fireEvent.click(trigger);
		expect(screen.getByRole('menu')).toBeInTheDocument();
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('styles menu items as actions and disabled text', () => {
		render(
			<AdsDropdown defaultOpen>
				<AdsDropdown.Trigger>Ações</AdsDropdown.Trigger>
				<AdsDropdown.Content>
					<AdsDropdown.Item href="#edit">Editar</AdsDropdown.Item>
					<AdsDropdown.Item disabled>Arquivar</AdsDropdown.Item>
				</AdsDropdown.Content>
			</AdsDropdown>,
		);
		expect(screen.getByRole('menuitem', { name: 'Editar' })).toHaveClass(
			'box-border',
			'max-w-full',
			'font-sans',
			'no-underline',
			'border-0',
		);
		expect(screen.getByRole('menuitem', { name: 'Arquivar' })).toHaveClass(
			'bg-transparent',
			'border-0',
			'text-text-muted',
		);
	});

	it('keeps the inherited page font on AdsPagination buttons, which use AdsButton', () => {
		render(<AdsPagination page={1} pageCount={3} onPageChange={vi.fn()} />);
		const previous = screen.getByRole('button', { name: 'Página anterior' });
		expect(previous).toBeDisabled();
		expect(previous).toHaveClass('[font-family:inherit]');
		expect(screen.getByRole('button', { name: 'Página 2' })).toHaveClass('[font-family:inherit]');
	});

	it('calculates compact pagination and disables boundaries', () => {
		expect(getAdsPaginationItems(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
		render(<AdsPagination page={1} pageCount={3} onPageChange={vi.fn()} />);
		expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute(
			'aria-current',
			'page',
		);
		expect(screen.getByRole('button', { name: 'Página 1' })).toHaveClass('ads-button');
		expect(screen.getByRole('button', { name: 'Página 1' })).toHaveClass(
			'min-h-10',
			'tabular-nums',
		);
		expect(screen.getByRole('list')).toHaveClass('list-none');
	});

	describe('consumer links', () => {
		const Link = ({ href, ...props }: { href: string } & HTMLAttributes<HTMLAnchorElement>) => (
			<a data-consumer-link="" href={href} {...props} />
		);

		it('renders the consumer link in AdsNav without nested interactive content', () => {
			render(
				<AdsNav
					items={[
						{
							current: true,
							label: 'Início',
							renderLink: (props) => <Link href="/inicio" {...props} />,
						},
						{ label: 'Relatórios', renderLink: (props) => <Link href="/relatorios" {...props} /> },
					]}
				/>,
			);
			const current = screen.getByRole('link', { name: 'Início' });
			expect(current).toHaveAttribute('data-consumer-link');
			expect(current).toHaveAttribute('aria-current', 'page');
			expect(current).toHaveClass('ads-nav-item', 'no-underline', 'border-primary');
			expect(screen.getByRole('link', { name: 'Relatórios' })).not.toHaveAttribute('aria-current');
			expect(screen.queryByRole('button')).toBeNull();
			expect(
				screen.getByRole('navigation').querySelectorAll('a a, button a, a button'),
			).toHaveLength(0);
		});

		it('keeps disabled AdsNav items as disabled buttons even with renderLink', () => {
			render(
				<AdsNav
					items={[
						{ disabled: true, label: 'Off', renderLink: (props) => <Link href="/x" {...props} /> },
					]}
				/>,
			);
			expect(screen.getByRole('button', { name: 'Off' })).toBeDisabled();
			expect(screen.queryByRole('link')).toBeNull();
		});

		it('styles the consumer link in AdsBreadcrumb like the built-in link', () => {
			render(
				<AdsBreadcrumb
					items={[
						{ label: 'Início', renderLink: (props) => <Link href="/" {...props} /> },
						{ label: 'Mensal' },
					]}
				/>,
			);
			const link = screen.getByRole('link', { name: 'Início' });
			expect(link).toHaveAttribute('data-consumer-link');
			expect(link).toHaveClass('text-text-muted', 'hover:text-text');
			expect(screen.getByText('Mensal')).toHaveAttribute('aria-current', 'page');
		});

		it('renders consumer links in AdsPagination with aria-current and the item style', () => {
			const onPageChange = vi.fn();
			render(
				<AdsPagination
					onPageChange={onPageChange}
					page={2}
					pageCount={3}
					renderPageLink={(page, props) => <Link href={`/?pagina=${page}`} {...props} />}
				/>,
			);
			const current = screen.getByRole('link', { name: 'Página 2' });
			expect(current).toHaveAttribute('href', '/?pagina=2');
			expect(current).toHaveAttribute('aria-current', 'page');
			expect(current).toHaveClass('ads-pagination-item', 'bg-primary');
			expect(screen.getByRole('link', { name: 'Página anterior' })).toHaveAttribute(
				'href',
				'/?pagina=1',
			);
			expect(screen.queryByRole('button')).toBeNull();
			expect(
				screen.getByRole('navigation').querySelectorAll('a a, button a, a button'),
			).toHaveLength(0);
		});

		it('keeps the previous and next controls disabled at the limits', () => {
			render(
				<AdsPagination
					page={1}
					pageCount={2}
					renderPageLink={(page, props) => <Link href={`/?pagina=${page}`} {...props} />}
				/>,
			);
			expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled();
			expect(screen.getByRole('link', { name: 'Próxima página' })).toBeInTheDocument();
		});
	});
});
