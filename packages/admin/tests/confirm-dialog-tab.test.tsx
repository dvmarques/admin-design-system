import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { AdsConfirmDialog } from '../src/index.js';

function pressTab(shiftKey = false) {
	return { handled: !fireEvent.keyDown(document, { key: 'Tab', shiftKey }) };
}

describe('AdsConfirmDialog: Tab usa a elegibilidade do foco inicial', () => {
	function renderWith(pending = false) {
		return render(
			<AdsConfirmDialog
				onConfirm={() => {}}
				onOpenChange={() => {}}
				open
				pending={pending}
				title="Excluir?"
			>
				<fieldset disabled>
					<input aria-label="Em fieldset desabilitado" />
				</fieldset>
				<div inert>
					<button type="button">Inerte</button>
				</div>
			</AdsConfirmDialog>,
		);
	}

	it.each([false, true])(
		'Shift+Tab em Cancelar vai a Confirmar e Tab volta (pending: %s)',
		async (pending) => {
			renderWith(pending);
			const cancel = screen.getByRole('button', { name: 'Cancelar' });
			const confirm = screen.getByRole('button', { name: 'Confirmar' });
			await waitFor(() => expect(cancel).toHaveFocus());
			// Com controles inelegíveis antes de Cancelar, ele é o primeiro destino elegível.
			expect(pressTab(true).handled).toBe(true);
			expect(confirm).toHaveFocus();
			expect(pressTab().handled).toBe(true);
			expect(cancel).toHaveFocus();
		},
	);

	it('mantém Escape e o retorno de foco ao cancelar', async () => {
		function Harness() {
			const [open, setOpen] = useState(false);
			return (
				<>
					<button onClick={() => setOpen(true)} type="button">
						Origem
					</button>
					<AdsConfirmDialog
						onConfirm={() => {}}
						onOpenChange={setOpen}
						open={open}
						title="Excluir?"
					>
						<fieldset disabled>
							<input aria-label="Inelegível" />
						</fieldset>
					</AdsConfirmDialog>
				</>
			);
		}
		render(<Harness />);
		const origin = screen.getByRole('button', { name: 'Origem' });
		origin.focus();
		fireEvent.click(origin);
		await waitFor(() => expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus());
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
		await waitFor(() => expect(origin).toHaveFocus());
	});
});
