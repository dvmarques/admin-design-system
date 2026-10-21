import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { StrictMode, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AdsButton } from '../src/button';
import { AdsDialog, AdsDrawer } from '../src/overlay-dialog';
import { AdsPopover } from '../src/overlay-anchored';
import { AdsToast } from '../src/overlay-toast';

// O container do Testing Library é o filho de `body` que contém a página.
function pageRoot() {
	return document.querySelector<HTMLElement>('[data-testid="page"]')!.parentElement!;
}

function Page({ children }: { children?: React.ReactNode }) {
	return (
		<main data-testid="page">
			<AdsButton>Fundo</AdsButton>
			{children}
		</main>
	);
}

function DialogFixture({ drawer = false }: { drawer?: boolean }) {
	const [open, setOpen] = useState(false);
	const Overlay = drawer ? AdsDrawer : AdsDialog;
	return (
		<Page>
			<AdsButton onClick={() => setOpen(true)}>Abrir</AdsButton>
			<Overlay onOpenChange={setOpen} open={open} title="Modal">
				<AdsButton>Dentro</AdsButton>
			</Overlay>
		</Page>
	);
}

async function openModal() {
	fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
	await screen.findByRole('dialog', { name: 'Modal' });
	await waitFor(() => expect(pageRoot()).toHaveAttribute('inert'));
}

describe('modal inert background', () => {
	it.each([
		['dialog', false],
		['drawer', true],
	])(
		'makes the page inert while the %s is open and restores it on close',
		async (_name, drawer) => {
			render(<DialogFixture drawer={drawer} />);
			expect(pageRoot()).not.toHaveAttribute('inert');
			await openModal();
			const root = document.querySelector('[data-ads-overlay-layer="modal"]')!;
			expect(root).not.toHaveAttribute('inert');
			expect(root.contains(screen.getByRole('dialog', { name: 'Modal' }))).toBe(true);
			fireEvent.keyDown(document, { key: 'Escape' });
			await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
			expect(pageRoot()).not.toHaveAttribute('inert');
		},
	);

	it('restores the page when the modal is unmounted without closing', async () => {
		const { rerender } = render(
			<>
				<Page />
				<AdsDialog onOpenChange={() => undefined} open title="Modal" />
			</>,
		);
		await waitFor(() => expect(pageRoot()).toHaveAttribute('inert'));
		rerender(<Page />);
		await waitFor(() => expect(pageRoot()).not.toHaveAttribute('inert'));
	});

	it('keeps an inert region the consumer already applied', async () => {
		const region = document.body.appendChild(document.createElement('div'));
		region.setAttribute('inert', '');
		render(<DialogFixture />);
		await openModal();
		expect(region).toHaveAttribute('inert');
		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(pageRoot()).not.toHaveAttribute('inert'));
		expect(region).toHaveAttribute('inert');
		region.remove();
	});

	it('does not touch non-rendered nodes or aria-hidden', async () => {
		const style = document.body.appendChild(document.createElement('style'));
		render(<DialogFixture />);
		await openModal();
		expect(style).not.toHaveAttribute('inert');
		expect(pageRoot()).not.toHaveAttribute('aria-hidden');
		style.remove();
	});

	it('keeps popups opened inside the modal interactive and the page inert', async () => {
		function Fixture() {
			const [open, setOpen] = useState(true);
			const [popover, setPopover] = useState(false);
			return (
				<Page>
					<AdsDialog onOpenChange={setOpen} open={open} title="Modal">
						<AdsPopover content="Conteúdo" onOpenChange={setPopover} open={popover}>
							<AdsButton>Detalhes</AdsButton>
						</AdsPopover>
					</AdsDialog>
				</Page>
			);
		}
		render(<Fixture />);
		await waitFor(() => expect(pageRoot()).toHaveAttribute('inert'));
		fireEvent.click(screen.getByRole('button', { name: 'Detalhes' }));
		const popover = await screen.findByText('Conteúdo');
		expect(popover.closest('[data-ads-overlay-root]')).not.toHaveAttribute('inert');
		expect(pageRoot()).toHaveAttribute('inert');
	});

	it('makes a popup opened before the modal inert', async () => {
		function Fixture() {
			const [open, setOpen] = useState(false);
			return (
				<Page>
					<AdsPopover content="Conteúdo" onOpenChange={() => undefined} open>
						<AdsButton>Detalhes</AdsButton>
					</AdsPopover>
					<AdsButton onClick={() => setOpen(true)}>Abrir</AdsButton>
					<AdsDialog onOpenChange={setOpen} open={open} title="Modal" />
				</Page>
			);
		}
		render(<Fixture />);
		const popoverRoot = (await screen.findByText('Conteúdo')).closest('[data-ads-overlay-root]')!;
		expect(popoverRoot).not.toHaveAttribute('inert');
		await openModal();
		expect(popoverRoot).toHaveAttribute('inert');
	});

	it('never makes a toast inert', async () => {
		render(
			<>
				<Page />
				<AdsToast>Salvo</AdsToast>
				<AdsDialog onOpenChange={() => undefined} open title="Modal" />
			</>,
		);
		await waitFor(() => expect(pageRoot()).toHaveAttribute('inert'));
		const toastRoot = screen.getByRole('status').closest('[data-ads-overlay-root]')!;
		expect(toastRoot).toHaveAttribute('data-ads-overlay-layer', 'toast');
		expect(toastRoot).not.toHaveAttribute('inert');
	});

	it('makes only the newest modal interactive and restores in any closing order', async () => {
		function Fixture() {
			const [first, setFirst] = useState(true);
			const [second, setSecond] = useState(false);
			return (
				<Page>
					<AdsDialog onOpenChange={setFirst} open={first} title="Primeiro">
						<AdsButton onClick={() => setSecond(true)}>Abrir segundo</AdsButton>
						<AdsButton onClick={() => setFirst(false)}>Fechar primeiro</AdsButton>
					</AdsDialog>
					<AdsDialog onOpenChange={setSecond} open={second} title="Segundo">
						<AdsButton onClick={() => setSecond(false)}>Fechar segundo</AdsButton>
					</AdsDialog>
				</Page>
			);
		}
		render(<Fixture />);
		const firstDialog = await screen.findByRole('dialog', { name: 'Primeiro' });
		const firstRoot = firstDialog.closest('[data-ads-overlay-root]')!;
		await waitFor(() => expect(pageRoot()).toHaveAttribute('inert'));
		expect(firstRoot).not.toHaveAttribute('inert');

		fireEvent.click(screen.getByRole('button', { name: 'Abrir segundo' }));
		const secondDialog = await screen.findByRole('dialog', { name: 'Segundo' });
		await waitFor(() => expect(firstRoot).toHaveAttribute('inert'));
		expect(secondDialog.closest('[data-ads-overlay-root]')).not.toHaveAttribute('inert');

		// O primeiro fecha primeiro: o fundo continua inerte porque o segundo segue aberto.
		fireEvent.click(screen.getByRole('button', { name: 'Fechar primeiro' }));
		await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Primeiro' })).toBeNull());
		expect(pageRoot()).toHaveAttribute('inert');
		fireEvent.click(screen.getByRole('button', { name: 'Fechar segundo' }));
		await waitFor(() => expect(pageRoot()).not.toHaveAttribute('inert'));
	});

	it('restores the first modal when only the second closes', async () => {
		function Fixture() {
			const [second, setSecond] = useState(false);
			return (
				<Page>
					<AdsDialog onOpenChange={() => undefined} open title="Primeiro">
						<AdsButton onClick={() => setSecond(true)}>Abrir segundo</AdsButton>
					</AdsDialog>
					<AdsDialog onOpenChange={setSecond} open={second} title="Segundo" />
				</Page>
			);
		}
		render(<Fixture />);
		const firstRoot = (await screen.findByRole('dialog', { name: 'Primeiro' })).closest(
			'[data-ads-overlay-root]',
		)!;
		fireEvent.click(screen.getByRole('button', { name: 'Abrir segundo' }));
		await waitFor(() => expect(firstRoot).toHaveAttribute('inert'));
		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(firstRoot).not.toHaveAttribute('inert'));
		expect(pageRoot()).toHaveAttribute('inert');
	});

	it('behaves the same in StrictMode, including repeated open and close', async () => {
		render(
			<StrictMode>
				<DialogFixture />
			</StrictMode>,
		);
		for (let round = 0; round < 2; round += 1) {
			await openModal();
			fireEvent.keyDown(document, { key: 'Escape' });
			await waitFor(() => expect(pageRoot()).not.toHaveAttribute('inert'));
		}
	});

	it('opens and closes in the same tick without leaving the page inert', async () => {
		function Fixture() {
			const [open, setOpen] = useState(false);
			return (
				<Page>
					<AdsButton
						onClick={() => {
							setOpen(true);
							setOpen(false);
						}}
					>
						Alternar
					</AdsButton>
					<AdsDialog onOpenChange={setOpen} open={open} title="Modal" />
				</Page>
			);
		}
		render(<Fixture />);
		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'Alternar' }));
		});
		expect(pageRoot()).not.toHaveAttribute('inert');
		expect(document.querySelector('[data-ads-overlay-layer="modal"]')).toBeNull();
	});

	it('does not change the server rendered markup', () => {
		const html = renderToString(
			<Page>
				<AdsDialog onOpenChange={() => undefined} open title="Modal" />
			</Page>,
		);
		expect(html).not.toContain('inert');
		expect(html).not.toContain('data-ads-overlay-layer');
	});

	it('has no detectable accessibility violations with the modal open', async () => {
		render(<DialogFixture />);
		await openModal();
		const results = await axe.run(document.body);
		expect(results.violations).toEqual([]);
	});
});
