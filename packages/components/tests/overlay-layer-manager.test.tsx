import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { StrictMode, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { AdsButton } from '../src/button';
import { AdsPopover } from '../src/overlay-anchored';
import { AdsDialog, AdsDrawer } from '../src/overlay-dialog';

afterEach(() => {
	cleanup();
	document.documentElement.removeAttribute('style');
});

function Stack({ drawer = false }: { drawer?: boolean }) {
	const [outer, setOuter] = useState(false);
	const [inner, setInner] = useState(false);
	const Outer = drawer ? AdsDrawer : AdsDialog;
	return (
		<main>
			<AdsButton onClick={() => setOuter(true)}>Abrir externo</AdsButton>
			<Outer onOpenChange={setOuter} open={outer} title="Externo">
				<AdsButton onClick={() => setInner(true)}>Abrir interno</AdsButton>
				<AdsDialog onOpenChange={setInner} open={inner} title="Interno">
					<AdsButton>Ação interna</AdsButton>
				</AdsDialog>
			</Outer>
		</main>
	);
}

async function openStack() {
	const origin = screen.getByRole('button', { name: 'Abrir externo' });
	origin.focus();
	fireEvent.click(origin);
	await screen.findByRole('dialog', { name: 'Externo' });
	const innerOrigin = screen.getByRole('button', { name: 'Abrir interno' });
	innerOrigin.focus();
	fireEvent.click(innerOrigin);
	await screen.findByRole('dialog', { name: 'Interno' });
}

describe('overlay layer manager', () => {
	it.each([false, true])('only the top modal traps Tab (drawer outer: %s)', async (drawer) => {
		render(<Stack drawer={drawer} />);
		await openStack();
		const inner = screen.getByRole('dialog', { name: 'Interno' });
		const buttons = inner.querySelectorAll('button');
		const last = buttons[buttons.length - 1]!;
		last.focus();
		fireEvent.keyDown(document, { key: 'Tab' });
		expect(inner.contains(document.activeElement)).toBe(true);
		expect(document.activeElement).toBe(buttons[0]);
		fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
		expect(document.activeElement).toBe(last);
	});

	it('pulls stray focus back into the top modal', async () => {
		render(<Stack />);
		await openStack();
		(document.activeElement as HTMLElement).blur();
		fireEvent.keyDown(document, { key: 'Tab' });
		expect(screen.getByRole('dialog', { name: 'Interno' }).contains(document.activeElement)).toBe(
			true,
		);
	});

	it('keeps the lower modal functional after the top one closes', async () => {
		render(<Stack />);
		await openStack();
		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Interno' })).toBeNull());
		expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Abrir interno' }));
		const outer = screen.getByRole('dialog', { name: 'Externo' });
		const buttons = outer.querySelectorAll('button');
		buttons[buttons.length - 1]!.focus();
		fireEvent.keyDown(document, { key: 'Tab' });
		expect(document.activeElement).toBe(buttons[0]);
		expect(document.documentElement.style.overflow).toBe('hidden');
		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
		expect(document.documentElement.style.overflow).toBe('');
	});

	it('locks the page scroll until the last modal closes and restores prior values', async () => {
		document.documentElement.style.overflow = 'scroll';
		render(<Stack />);
		await openStack();
		expect(document.documentElement.style.overflow).toBe('hidden');
		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Interno' })).toBeNull());
		expect(document.documentElement.style.overflow).toBe('hidden');
		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
		expect(document.documentElement.style.overflow).toBe('scroll');
	});

	it('releases the scroll lock when the modal unmounts while open', async () => {
		const { rerender } = render(<AdsDialog onOpenChange={() => undefined} open title="M" />);
		await waitFor(() => expect(document.documentElement.style.overflow).toBe('hidden'));
		rerender(<main />);
		await waitFor(() => expect(document.documentElement.style.overflow).toBe(''));
	});

	it('does not close a parent popover when interacting with a nested popover', async () => {
		function Fixture() {
			const [outer, setOuter] = useState(false);
			const [inner, setInner] = useState(false);
			return (
				<AdsPopover
					content={
						<AdsPopover
							content={<span>Conteúdo interno</span>}
							onOpenChange={setInner}
							open={inner}
						>
							<AdsButton>Abrir filho</AdsButton>
						</AdsPopover>
					}
					onOpenChange={setOuter}
					open={outer}
				>
					<AdsButton>Abrir pai</AdsButton>
				</AdsPopover>
			);
		}
		render(<Fixture />);
		fireEvent.click(screen.getByRole('button', { name: 'Abrir pai' }));
		fireEvent.click(await screen.findByRole('button', { name: 'Abrir filho' }));
		const child = await screen.findByText('Conteúdo interno');
		fireEvent.mouseDown(child);
		expect(screen.getByRole('button', { name: 'Abrir filho' })).toBeTruthy();
		expect(screen.getByText('Conteúdo interno')).toBeTruthy();
	});

	it('closes only the popup on a backdrop click while a popover is open in the modal', async () => {
		let closed = 0;
		function Fixture() {
			const [popover, setPopover] = useState(true);
			return (
				<AdsDialog
					onOpenChange={() => {
						closed += 1;
					}}
					open
					title="Modal"
				>
					<AdsPopover content="Detalhes" onOpenChange={setPopover} open={popover}>
						<AdsButton>Gatilho</AdsButton>
					</AdsPopover>
				</AdsDialog>
			);
		}
		render(<Fixture />);
		await screen.findByText('Detalhes');
		const backdrop = document.querySelector<HTMLElement>('[data-overlay="backdrop"]')!;
		fireEvent.mouseDown(backdrop);
		await waitFor(() => expect(screen.queryByText('Detalhes')).toBeNull());
		expect(closed).toBe(0);
		fireEvent.mouseDown(backdrop);
		expect(closed).toBe(1);
	});

	it('does not intercept Tab from a popover inside the modal', async () => {
		render(
			<AdsDialog onOpenChange={() => undefined} open title="Modal">
				<AdsPopover
					content={<AdsButton>Dentro do popover</AdsButton>}
					onOpenChange={() => undefined}
					open
				>
					<AdsButton>Gatilho</AdsButton>
				</AdsPopover>
			</AdsDialog>,
		);
		const inPopover = await screen.findByRole('button', { name: 'Dentro do popover' });
		inPopover.focus();
		const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
		document.dispatchEvent(event);
		expect(event.defaultPrevented).toBe(false);
		expect(document.activeElement).toBe(inPopover);
	});

	it('falls back to the opener of the surrounding modal when the trigger was removed', async () => {
		function Fixture() {
			const [outer, setOuter] = useState(false);
			const [inner, setInner] = useState(false);
			const [showTrigger, setShowTrigger] = useState(true);
			return (
				<main>
					<AdsButton onClick={() => setOuter(true)}>Abrir externo</AdsButton>
					<AdsDialog onOpenChange={setOuter} open={outer} title="Externo">
						{showTrigger ? (
							<AdsButton onClick={() => setInner(true)}>Abrir interno</AdsButton>
						) : null}
						<AdsDialog onOpenChange={setInner} open={inner} title="Interno">
							<AdsButton onClick={() => setShowTrigger(false)}>Remover gatilho</AdsButton>
						</AdsDialog>
					</AdsDialog>
				</main>
			);
		}
		render(<Fixture />);
		const outerOrigin = screen.getByRole('button', { name: 'Abrir externo' });
		outerOrigin.focus();
		fireEvent.click(outerOrigin);
		const trigger = await screen.findByRole('button', { name: 'Abrir interno' });
		trigger.focus();
		fireEvent.click(trigger);
		fireEvent.click(await screen.findByRole('button', { name: 'Remover gatilho' }));
		expect(screen.queryByRole('button', { name: 'Abrir interno' })).toBeNull();
		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Interno' })).toBeNull());
		await waitFor(() => expect(document.activeElement).toBe(outerOrigin));
	});

	it('does not throw when every opener is gone after the last modal closes', async () => {
		function Fixture() {
			const [open, setOpen] = useState(false);
			const [showTrigger, setShowTrigger] = useState(true);
			return (
				<main>
					{showTrigger ? <AdsButton onClick={() => setOpen(true)}>Abrir</AdsButton> : null}
					<AdsDialog onOpenChange={setOpen} open={open} title="Modal">
						<AdsButton onClick={() => setShowTrigger(false)}>Remover gatilho</AdsButton>
					</AdsDialog>
				</main>
			);
		}
		render(<Fixture />);
		fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
		fireEvent.click(await screen.findByRole('button', { name: 'Remover gatilho' }));
		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
		expect(document.documentElement.style.overflow).toBe('');
	});

	it('leaves no global listeners or styles behind under StrictMode', async () => {
		const added: string[] = [];
		const removed: string[] = [];
		const add = document.addEventListener.bind(document);
		const remove = document.removeEventListener.bind(document);
		document.addEventListener = ((type: string, ...rest: never[]) => {
			added.push(type);
			return add(type, ...(rest as [never]));
		}) as typeof document.addEventListener;
		document.removeEventListener = ((type: string, ...rest: never[]) => {
			removed.push(type);
			return remove(type, ...(rest as [never]));
		}) as typeof document.removeEventListener;
		try {
			const { unmount } = render(
				<StrictMode>
					<Stack />
				</StrictMode>,
			);
			await openStack();
			unmount();
			for (const type of ['keydown', 'mousedown']) {
				expect(added.filter((t) => t === type).length).toBe(
					removed.filter((t) => t === type).length,
				);
			}
			expect(document.documentElement.style.overflow).toBe('');
			expect(document.body.querySelector('[inert]')).toBeNull();
		} finally {
			document.addEventListener = add;
			document.removeEventListener = remove;
		}
	});

	it('renders on the server without touching the document', () => {
		expect(renderToString(<Stack />)).toContain('Abrir externo');
	});

	it('has no detectable accessibility violations with stacked modals', async () => {
		render(<Stack />);
		await openStack();
		const results = await axe.run(document.body);
		expect(results.violations).toEqual([]);
	});
});
