import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StrictMode, useState, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { AdsButton } from '../src/button';
import { AdsDialog, AdsDrawer } from '../src/overlay-dialog';
import { AdsPopover } from '../src/overlay-anchored';

/** Dispara Tab e informa se a biblioteca assumiu a navegação (`preventDefault`). */
function pressTab(shiftKey = false) {
	const notPrevented = fireEvent.keyDown(document, { key: 'Tab', shiftKey });
	return { handled: !notPrevented };
}

const overlays = [
	['AdsDialog', AdsDialog],
	['AdsDrawer', AdsDrawer],
] as const;

/** Cada inelegível é inserido depois do último controle elegível e, em outro caso, antes do primeiro. */
const ineligible: [string, () => ReactNode][] = [
	[
		'fieldset disabled',
		() => (
			<fieldset disabled>
				<input aria-label="Inelegível" />
			</fieldset>
		),
	],
	['hidden', () => <input aria-label="Inelegível" hidden />],
	['display: none', () => <button style={{ display: 'none' }}>Inelegível</button>],
	['visibility: hidden', () => <button style={{ visibility: 'hidden' }}>Inelegível</button>],
	[
		'ancestral com visibility: hidden',
		() => (
			<div style={{ visibility: 'hidden' }}>
				<button>Inelegível</button>
			</div>
		),
	],
	[
		'ancestral hidden',
		() => (
			<div hidden>
				<button>Inelegível</button>
			</div>
		),
	],
	[
		'inert',
		() => (
			<div inert>
				<button>Inelegível</button>
			</div>
		),
	],
	['tabindex negativo diferente de -1', () => <div tabIndex={-2}>Inelegível</div>],
	['tabindex -1 em botão', () => <button tabIndex={-1}>Inelegível</button>],
];

describe.each(overlays)('%s: Tab usa a elegibilidade do foco inicial', (_name, Overlay) => {
	describe.each(ineligible)('com controle inelegível (%s)', (_kind, renderIneligible) => {
		it('Tab no último elegível volta ao primeiro elegível', async () => {
			render(
				<Overlay onOpenChange={() => {}} open showCloseButton={false} title="Filtros">
					{renderIneligible()}
					<button>Primeiro</button>
					<button>Último</button>
					{renderIneligible()}
				</Overlay>,
			);
			const first = screen.getByRole('button', { name: 'Primeiro' });
			const last = screen.getByRole('button', { name: 'Último' });
			await waitFor(() => expect(first).toHaveFocus());
			last.focus();
			expect(pressTab().handled).toBe(true);
			expect(first).toHaveFocus();
		});

		it('Shift+Tab no primeiro elegível vai ao último elegível', async () => {
			render(
				<Overlay onOpenChange={() => {}} open showCloseButton={false} title="Filtros">
					{renderIneligible()}
					<button>Primeiro</button>
					<button>Último</button>
					{renderIneligible()}
				</Overlay>,
			);
			const first = screen.getByRole('button', { name: 'Primeiro' });
			const last = screen.getByRole('button', { name: 'Último' });
			await waitFor(() => expect(first).toHaveFocus());
			expect(pressTab(true).handled).toBe(true);
			expect(last).toHaveFocus();
		});
	});

	it('não captura Tab nos controles intermediários elegíveis', async () => {
		render(
			<Overlay onOpenChange={() => {}} open showCloseButton={false} title="Filtros">
				<fieldset disabled>
					<input aria-label="Inelegível" />
				</fieldset>
				<button>Primeiro</button>
				<button>Meio</button>
				<button>Último</button>
				<fieldset disabled>
					<input aria-label="Inelegível final" />
				</fieldset>
			</Overlay>,
		);
		await waitFor(() => expect(screen.getByRole('button', { name: 'Primeiro' })).toHaveFocus());
		screen.getByRole('button', { name: 'Meio' }).focus();
		expect(pressTab().handled).toBe(false);
		expect(pressTab(true).handled).toBe(false);
	});

	it('trata o primeiro summary de um details como parada de Tab e ignora os demais', async () => {
		render(
			<Overlay onOpenChange={() => {}} open showCloseButton={false} title="Details">
				<button>Primeiro</button>
				<details>
					<summary>Alternar</summary>
					<summary>Conteúdo, não alterna</summary>
				</details>
			</Overlay>,
		);
		const first = screen.getByRole('button', { name: 'Primeiro' });
		await waitFor(() => expect(first).toHaveFocus());
		const toggle = screen.getByText('Alternar');
		toggle.focus();
		expect(pressTab().handled).toBe(true);
		expect(first).toHaveFocus();
		expect(pressTab(true).handled).toBe(true);
		expect(toggle).toHaveFocus();
	});

	it('mantém o contêiner como fallback quando nenhum controle é elegível', async () => {
		render(
			<Overlay onOpenChange={() => {}} open showCloseButton={false} title="Sem controles">
				<fieldset disabled>
					<input aria-label="Inelegível" />
				</fieldset>
				<div inert>
					<button>Inerte</button>
				</div>
			</Overlay>,
		);
		const dialog = screen.getByRole('dialog', { name: 'Sem controles' });
		await waitFor(() => expect(dialog).toHaveFocus());
		expect(pressTab().handled).toBe(true);
		expect(dialog).toHaveFocus();
		expect(pressTab(true).handled).toBe(true);
		expect(dialog).toHaveFocus();
	});

	it('redireciona o Tab quando o controle focado perde a elegibilidade com o modal aberto', async () => {
		function Fixture() {
			const [disabled, setDisabled] = useState(false);
			return (
				<Overlay onOpenChange={() => {}} open showCloseButton={false} title="Dinâmico">
					<button>Primeiro</button>
					<button onClick={() => setDisabled(true)}>Desabilitar fim</button>
					<fieldset disabled={disabled}>
						<button>Alvo</button>
					</fieldset>
				</Overlay>
			);
		}
		render(<Fixture />);
		const first = screen.getByRole('button', { name: 'Primeiro' });
		const middle = screen.getByRole('button', { name: 'Desabilitar fim' });
		await waitFor(() => expect(first).toHaveFocus());
		middle.focus();
		fireEvent.click(middle);
		// O último candidato agora é inelegível: o penúltimo (elegível) vira a ponta.
		expect(pressTab().handled).toBe(true);
		expect(first).toHaveFocus();
		expect(pressTab(true).handled).toBe(true);
		expect(middle).toHaveFocus();
	});

	it('dá a volta quando o elemento ativo ficou inelegível na ponta e segue o fluxo nativo no meio', async () => {
		function Fixture() {
			const [hidden, setHidden] = useState(false);
			return (
				<Overlay onOpenChange={() => {}} open showCloseButton={false} title="Dinâmico">
					<button>Primeiro</button>
					<button onClick={() => setHidden(true)} hidden={hidden}>
						Some
					</button>
					<button hidden={hidden}>Último que some</button>
				</Overlay>
			);
		}
		render(<Fixture />);
		const some = screen.getByRole('button', { name: 'Some' });
		const first = screen.getByRole('button', { name: 'Primeiro' });
		await waitFor(() => expect(first).toHaveFocus());
		some.focus();
		// Ainda há destino elegível adiante: o Tab nativo segue.
		expect(pressTab().handled).toBe(false);
		fireEvent.click(some);
		// O ativo ficou inelegível e já não há destino adiante: volta ao primeiro elegível.
		expect(pressTab().handled).toBe(true);
		expect(first).toHaveFocus();
	});

	it('funciona em StrictMode quando aberto depois da montagem', async () => {
		function Fixture() {
			const [open, setOpen] = useState(false);
			return (
				<>
					<button onClick={() => setOpen(true)}>Abrir</button>
					<Overlay onOpenChange={setOpen} open={open} showCloseButton={false} title="Strict">
						<button>Primeiro</button>
						<button>Último</button>
						<fieldset disabled>
							<input aria-label="Inelegível" />
						</fieldset>
					</Overlay>
				</>
			);
		}
		render(
			<StrictMode>
				<Fixture />
			</StrictMode>,
		);
		fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
		const first = await screen.findByRole('button', { name: 'Primeiro' });
		await waitFor(() => expect(first).toHaveFocus());
		screen.getByRole('button', { name: 'Último' }).focus();
		expect(pressTab().handled).toBe(true);
		expect(first).toHaveFocus();
	});
});

describe('modais aninhados e popup em portal', () => {
	it('o modal superior governa o Tab com a elegibilidade e o inferior não interfere', async () => {
		render(
			<AdsDialog onOpenChange={() => {}} open showCloseButton={false} title="Externo">
				<button>Externo A</button>
				<AdsDrawer onOpenChange={() => {}} open showCloseButton={false} title="Interno">
					<button>Interno A</button>
					<button>Interno B</button>
					<fieldset disabled>
						<input aria-label="Inelegível" />
					</fieldset>
				</AdsDrawer>
			</AdsDialog>,
		);
		const a = screen.getByRole('button', { name: 'Interno A' });
		const b = screen.getByRole('button', { name: 'Interno B' });
		await waitFor(() => expect(a).toHaveFocus());
		b.focus();
		expect(pressTab().handled).toBe(true);
		expect(a).toHaveFocus();
		expect(pressTab(true).handled).toBe(true);
		expect(b).toHaveFocus();
	});

	it('não interrompe o Tab dentro de um popover em portal descendente do modal', async () => {
		function Fixture() {
			const [open, setOpen] = useState(true);
			return (
				<AdsDialog onOpenChange={() => {}} open showCloseButton={false} title="Com popover">
					<AdsPopover
						aria-label="Edição"
						content={
							<>
								<input aria-label="Campo do popover" />
								<button>Fim do popover</button>
							</>
						}
						onOpenChange={setOpen}
						open={open}
					>
						<AdsButton>Gatilho</AdsButton>
					</AdsPopover>
					<fieldset disabled>
						<input aria-label="Inelegível" />
					</fieldset>
				</AdsDialog>
			);
		}
		render(<Fixture />);
		const popoverEnd = await screen.findByRole('button', { name: 'Fim do popover' });
		popoverEnd.focus();
		expect(pressTab().handled).toBe(false);
		expect(popoverEnd).toHaveFocus();
	});
});
