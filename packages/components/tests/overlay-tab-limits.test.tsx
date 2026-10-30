import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StrictMode, useState, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { AdsDialog, AdsDrawer } from '../src/overlay-dialog';

/** Dispara Tab e informa se a biblioteca assumiu a navegação (`preventDefault`). */
function pressTab(shiftKey = false) {
	const notPrevented = fireEvent.keyDown(document, { key: 'Tab', shiftKey });
	return { handled: !notPrevented };
}

const overlays = [
	['AdsDialog', AdsDialog],
	['AdsDrawer', AdsDrawer],
] as const;

function renderOverlay(Overlay: (typeof overlays)[number][1], children: ReactNode, strict = false) {
	const tree = (
		<Overlay onOpenChange={() => {}} open showCloseButton={false} title="Limites">
			{children}
		</Overlay>
	);
	return render(strict ? <StrictMode>{tree}</StrictMode> : tree);
}

describe.each(overlays)('%s: foco inicial com open inicial verdadeiro', (_name, Overlay) => {
	it('foca o primeiro controle elegível em StrictMode', async () => {
		renderOverlay(
			Overlay,
			<>
				<button>Primeiro</button>
				<button>Último</button>
			</>,
			true,
		);
		await waitFor(() => expect(screen.getByRole('button', { name: 'Primeiro' })).toHaveFocus());
	});

	it('foca o contêiner em StrictMode quando não há controle elegível', async () => {
		renderOverlay(Overlay, <p>Sem controles</p>, true);
		const layer = screen.getByRole('dialog', { name: 'Limites' });
		await waitFor(() => expect(layer).toHaveFocus());
	});
});

describe.each(overlays)(
	'%s: fechar e reabrir após abertura na montagem em StrictMode',
	(_name, Overlay) => {
		it('fecha com Escape e reabre recebendo o foco inicial de novo', async () => {
			function Fixture() {
				const [open, setOpen] = useState(true);
				return (
					<>
						<button onClick={() => setOpen(true)}>Abrir</button>
						<Overlay onOpenChange={setOpen} open={open} showCloseButton={false} title="Limites">
							<button>Dentro</button>
						</Overlay>
					</>
				);
			}
			render(
				<StrictMode>
					<Fixture />
				</StrictMode>,
			);
			await waitFor(() => expect(screen.getByRole('button', { name: 'Dentro' })).toHaveFocus());
			fireEvent.keyDown(document, { key: 'Escape' });
			await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
			fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
			await waitFor(() => expect(screen.getByRole('button', { name: 'Dentro' })).toHaveFocus());
		});
	},
);

describe.each(overlays)('%s: grupos de rádio nas pontas do ciclo', (_name, Overlay) => {
	it('Tab a partir do marcado de um grupo na última posição dá a volta', async () => {
		renderOverlay(
			Overlay,
			<>
				<button>Primeiro</button>
				<input aria-label="A" name="g" type="radio" />
				<input aria-label="B" defaultChecked name="g" type="radio" />
				<input aria-label="C" name="g" type="radio" />
			</>,
		);
		const first = screen.getByRole('button', { name: 'Primeiro' });
		await waitFor(() => expect(first).toHaveFocus());
		screen.getByRole('radio', { name: 'B' }).focus();
		expect(pressTab().handled).toBe(true);
		expect(first).toHaveFocus();
	});

	it('Shift+Tab a partir do marcado de um grupo na primeira posição dá a volta', async () => {
		renderOverlay(
			Overlay,
			<>
				<input aria-label="A" name="g" type="radio" />
				<input aria-label="B" defaultChecked name="g" type="radio" />
				<input aria-label="C" name="g" type="radio" />
				<button>Último</button>
			</>,
		);
		await waitFor(() => expect(screen.getByRole('radio', { name: 'B' })).toHaveFocus());
		expect(pressTab(true).handled).toBe(true);
		expect(screen.getByRole('button', { name: 'Último' })).toHaveFocus();
	});

	it('sem marcado, o primeiro rádio é a parada do Tab e o último a do Shift+Tab', async () => {
		renderOverlay(
			Overlay,
			<>
				<input aria-label="A" name="g" type="radio" />
				<input aria-label="B" name="g" type="radio" />
				<input aria-label="C" name="g" type="radio" />
			</>,
		);
		const a = screen.getByRole('radio', { name: 'A' });
		const c = screen.getByRole('radio', { name: 'C' });
		await waitFor(() => expect(a).toHaveFocus());
		// Tab no primeiro (única parada do grupo) já é a ponta: volta ao próprio grupo, sem sair do modal.
		expect(pressTab().handled).toBe(true);
		expect(a).toHaveFocus();
		// Shift+Tab: a parada do grupo é o último rádio.
		c.focus();
		expect(pressTab(true).handled).toBe(true);
		expect(c).toHaveFocus();
	});

	it('o grupo é uma parada só: Tab no meio do ciclo segue nativo', async () => {
		renderOverlay(
			Overlay,
			<>
				<button>Primeiro</button>
				<input aria-label="A" defaultChecked name="g" type="radio" />
				<input aria-label="B" name="g" type="radio" />
				<button>Último</button>
			</>,
		);
		await waitFor(() => expect(screen.getByRole('button', { name: 'Primeiro' })).toHaveFocus());
		screen.getByRole('radio', { name: 'A' }).focus();
		expect(pressTab().handled).toBe(false);
	});

	it('rádios sem name, com names diferentes ou em formulários distintos são paradas próprias', async () => {
		renderOverlay(
			Overlay,
			<>
				<button>Primeiro</button>
				<input aria-label="Sem nome 1" type="radio" />
				<input aria-label="Sem nome 2" type="radio" />
				<input aria-label="X" name="x" type="radio" />
				<input aria-label="Y" name="y" type="radio" />
				<form>
					<input aria-label="F1" name="z" type="radio" />
				</form>
				<form>
					<input aria-label="F2" name="z" type="radio" />
				</form>
			</>,
		);
		await waitFor(() => expect(screen.getByRole('button', { name: 'Primeiro' })).toHaveFocus());
		// O último rádio (F2, sozinho em seu formulário) é a ponta.
		screen.getByRole('radio', { name: 'F2' }).focus();
		expect(pressTab().handled).toBe(true);
		expect(screen.getByRole('button', { name: 'Primeiro' })).toHaveFocus();
		// Sem nome 2 está no meio: nativo.
		screen.getByRole('radio', { name: 'Sem nome 2' }).focus();
		expect(pressTab().handled).toBe(false);
	});

	it('rádio desabilitado não conta para o grupo', async () => {
		renderOverlay(
			Overlay,
			<>
				<button>Primeiro</button>
				<input aria-label="A" name="g" type="radio" />
				<input aria-label="B" disabled name="g" type="radio" />
				<input aria-label="C" defaultChecked disabled name="g" type="radio" />
			</>,
		);
		await waitFor(() => expect(screen.getByRole('button', { name: 'Primeiro' })).toHaveFocus());
		// Sem marcado elegível, A (único elegível) é a parada: ponta final.
		screen.getByRole('radio', { name: 'A' }).focus();
		expect(pressTab().handled).toBe(true);
		expect(screen.getByRole('button', { name: 'Primeiro' })).toHaveFocus();
	});
});

describe.each(overlays)('%s: tabindex positivo e ordem real de tabulação', (_name, Overlay) => {
	it('Tab no último da ordem real vai ao primeiro da ordem real', async () => {
		renderOverlay(
			Overlay,
			<>
				<button>Sem tabindex</button>
				<button tabIndex={2}>Dois</button>
				<button tabIndex={1}>Um</button>
				<button>Fim no documento</button>
			</>,
		);
		const um = screen.getByRole('button', { name: 'Um' });
		await waitFor(() => expect(um).toHaveFocus());
		// Ordem real: Um, Dois, Sem tabindex, Fim no documento. Tab no último volta ao primeiro (Um).
		screen.getByRole('button', { name: 'Fim no documento' }).focus();
		expect(pressTab().handled).toBe(true);
		expect(um).toHaveFocus();
		// Dois está no meio da ordem real, embora seja o segundo no documento: nativo.
		screen.getByRole('button', { name: 'Dois' }).focus();
		expect(pressTab().handled).toBe(false);
		// Shift+Tab no primeiro da ordem real vai ao último da ordem real.
		um.focus();
		expect(pressTab(true).handled).toBe(true);
		expect(screen.getByRole('button', { name: 'Fim no documento' })).toHaveFocus();
	});

	it('o último de documento com tabindex positivo não é a ponta final', async () => {
		renderOverlay(
			Overlay,
			<>
				<button>A</button>
				<button>B</button>
				<button tabIndex={1}>Positivo no fim</button>
			</>,
		);
		const positivo = screen.getByRole('button', { name: 'Positivo no fim' });
		await waitFor(() => expect(positivo).toHaveFocus());
		// Em ordem real, B é o último: Tab nele volta ao Positivo.
		screen.getByRole('button', { name: 'B' }).focus();
		expect(pressTab().handled).toBe(true);
		expect(positivo).toHaveFocus();
		// Tab no Positivo avança nativo para A.
		expect(pressTab().handled).toBe(false);
	});
});
