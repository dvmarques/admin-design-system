import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import axe from 'axe-core';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AdsButton, AdsPopover } from '@admin-ds/components';
import {
	AdsBulkActionBar,
	AdsConfirmDialog,
	AdsListFlow,
	AdsStepForm,
	type AdsSmartTableColumn,
	type AdsStepDefinition,
} from '../src/index.js';

async function expectNoViolations(container: HTMLElement) {
	const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
	expect(results.violations.map((violation) => violation.id)).toEqual([]);
}

describe('AdsBulkActionBar', () => {
	it('renders nothing visible without selection but keeps an empty status region', () => {
		render(
			<AdsBulkActionBar onClear={() => {}} selectedCount={0}>
				<AdsButton>Excluir</AdsButton>
			</AdsBulkActionBar>,
		);
		expect(screen.queryByRole('group', { name: 'Ações em massa' })).toBeNull();
		expect(screen.queryByRole('button', { name: 'Excluir' })).toBeNull();
		expect(screen.getByRole('status')).toBeEmptyDOMElement();
	});

	it('shows the actions and announces the selected count', () => {
		const onClear = vi.fn();
		const { rerender } = render(
			<AdsBulkActionBar onClear={onClear} selectedCount={3}>
				<AdsButton>Excluir</AdsButton>
			</AdsBulkActionBar>,
		);
		expect(screen.getByRole('status')).toHaveTextContent('3 itens selecionados');
		const group = screen.getByRole('group', { name: 'Ações em massa' });
		expect(within(group).getByRole('button', { name: 'Excluir' })).toBeTruthy();
		fireEvent.click(within(group).getByRole('button', { name: 'Limpar seleção' }));
		expect(onClear).toHaveBeenCalledTimes(1);
		rerender(<AdsBulkActionBar selectedCount={1} />);
		expect(screen.getByRole('status')).toHaveTextContent('1 item selecionado');
		expect(screen.queryByRole('button', { name: 'Limpar seleção' })).toBeNull();
	});

	it('has no axe violations', async () => {
		const { container } = render(
			<AdsBulkActionBar onClear={() => {}} selectedCount={2}>
				<AdsButton>Excluir</AdsButton>
			</AdsBulkActionBar>,
		);
		await expectNoViolations(container);
	});
});

describe('AdsConfirmDialog', () => {
	function Harness({ onConfirm = () => {}, pending = false }) {
		const [open, setOpen] = useState(false);
		return (
			<>
				<button onClick={() => setOpen(true)} type="button">
					Excluir
				</button>
				<AdsConfirmDialog
					description="Esta ação não pode ser desfeita."
					onConfirm={onConfirm}
					onOpenChange={setOpen}
					open={open}
					pending={pending}
					title="Excluir 2 itens?"
				/>
			</>
		);
	}

	it('opens with name, description and focus on Cancel', () => {
		render(<Harness />);
		fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
		const dialog = screen.getByRole('alertdialog', { name: 'Excluir 2 itens?' });
		expect(dialog).toHaveAccessibleDescription('Esta ação não pode ser desfeita.');
		return waitFor(() => expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus());
	});

	it('cancels with Escape, restores focus and does not confirm', () => {
		const onConfirm = vi.fn();
		render(<Harness onConfirm={onConfirm} />);
		const trigger = screen.getByRole('button', { name: 'Excluir' });
		trigger.focus();
		fireEvent.click(trigger);
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(screen.queryByRole('alertdialog')).toBeNull();
		expect(trigger).toHaveFocus();
		expect(onConfirm).not.toHaveBeenCalled();
	});

	it('confirms without closing by itself', () => {
		const onConfirm = vi.fn();
		render(<Harness onConfirm={onConfirm} />);
		fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
		fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
		expect(onConfirm).toHaveBeenCalledTimes(1);
		expect(screen.getByRole('alertdialog')).toBeTruthy();
	});

	it('makes both actions unavailable while pending without disabling them', () => {
		const onConfirm = vi.fn();
		render(<Harness onConfirm={onConfirm} pending />);
		fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
		const cancel = screen.getByRole('button', { name: 'Cancelar' });
		const confirm = screen.getByRole('button', { name: /Confirmar/ });
		for (const button of [cancel, confirm]) {
			expect(button).toHaveAttribute('aria-disabled', 'true');
			expect(button).not.toBeDisabled();
		}
		fireEvent.click(confirm);
		fireEvent.click(cancel);
		expect(onConfirm).not.toHaveBeenCalled();
		expect(screen.getByRole('alertdialog')).toBeTruthy();
	});

	it('keeps focus on Confirm while pending and after it ends', () => {
		const dialog = (pending: boolean) => (
			<AdsConfirmDialog
				onConfirm={() => {}}
				onOpenChange={() => {}}
				open
				pending={pending}
				title="Excluir?"
			/>
		);
		const { rerender } = render(dialog(false));
		const confirm = screen.getByRole('button', { name: 'Confirmar' });
		confirm.focus();
		rerender(dialog(true));
		expect(confirm).toHaveAttribute('aria-disabled', 'true');
		expect(confirm).not.toBeDisabled();
		expect(confirm).toHaveFocus();
		rerender(dialog(false));
		expect(confirm).not.toHaveAttribute('aria-disabled');
		expect(confirm).toHaveFocus();
	});

	it('keeps Escape and backdrop suspended while pending even when passed explicitly', () => {
		const onOpenChange = vi.fn();
		render(
			<AdsConfirmDialog
				closeOnBackdrop
				closeOnEscape
				onConfirm={() => {}}
				onOpenChange={onOpenChange}
				open
				pending
				title="Excluir?"
			/>,
		);
		fireEvent.keyDown(document, { key: 'Escape' });
		fireEvent.mouseDown(document.querySelector('[data-overlay="backdrop"]') as HTMLElement);
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it('closes only an inner popover with Escape while pending and never cancels the dialog', async () => {
		const onOpenChange = vi.fn();
		function WithPopover() {
			const [popoverOpen, setPopoverOpen] = useState(false);
			return (
				<AdsConfirmDialog
					onConfirm={() => {}}
					onOpenChange={onOpenChange}
					open
					pending
					title="Excluir?"
				>
					<AdsPopover
						aria-label="Detalhes"
						content={<AdsButton>Ver</AdsButton>}
						onOpenChange={setPopoverOpen}
						open={popoverOpen}
					>
						<AdsButton variant="secondary">Detalhes</AdsButton>
					</AdsPopover>
				</AdsConfirmDialog>
			);
		}
		render(<WithPopover />);
		fireEvent.click(screen.getByRole('button', { name: 'Detalhes' }));
		await screen.findByRole('dialog', { name: 'Detalhes' });
		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Detalhes' })).toBeNull());
		expect(screen.getByRole('alertdialog', { name: 'Excluir?' })).toBeTruthy();
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(onOpenChange).not.toHaveBeenCalled();
		expect(screen.getByRole('alertdialog', { name: 'Excluir?' })).toBeTruthy();
	});

	it('honors closeOnEscape={false} when not pending', () => {
		const onOpenChange = vi.fn();
		render(
			<AdsConfirmDialog
				closeOnEscape={false}
				onConfirm={() => {}}
				onOpenChange={onOpenChange}
				open
				title="Excluir?"
			/>,
		);
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(onOpenChange).not.toHaveBeenCalled();
		fireEvent.mouseDown(document.querySelector('[data-overlay="backdrop"]') as HTMLElement);
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it('moves focus to returnFocusRef when the opener left the page', () => {
		function Removed() {
			const [open, setOpen] = useState(false);
			const [gone, setGone] = useState(false);
			const fallback = useRef<HTMLButtonElement>(null);
			return (
				<>
					<button ref={fallback} type="button">
						Destino
					</button>
					{gone ? null : (
						<button onClick={() => setOpen(true)} type="button">
							Abrir
						</button>
					)}
					<AdsConfirmDialog
						onConfirm={() => {
							setGone(true);
							setOpen(false);
						}}
						onOpenChange={setOpen}
						open={open}
						returnFocusRef={fallback}
						title="Excluir?"
					/>
				</>
			);
		}
		render(<Removed />);
		const opener = screen.getByRole('button', { name: 'Abrir' });
		opener.focus();
		fireEvent.click(opener);
		const confirm = screen.getByRole('button', { name: 'Confirmar' });
		confirm.focus();
		fireEvent.click(confirm);
		expect(screen.queryByRole('alertdialog')).toBeNull();
		expect(screen.getByRole('button', { name: 'Destino' })).toHaveFocus();
	});

	it('keeps a backdrop click from moving focus to the body', () => {
		const backdrop = () => document.querySelector<HTMLElement>('[data-overlay="backdrop"]');
		const { unmount } = render(<Harness pending />);
		fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
		expect(fireEvent.mouseDown(backdrop() as HTMLElement)).toBe(false);
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
		unmount();

		render(<Harness />);
		const trigger = screen.getByRole('button', { name: 'Excluir' });
		trigger.focus();
		fireEvent.click(trigger);
		expect(fireEvent.mouseDown(backdrop() as HTMLElement)).toBe(false);
		expect(screen.queryByRole('alertdialog')).toBeNull();
		expect(trigger).toHaveFocus();
	});

	it('cancels with a click on the backdrop, but not on the panel', () => {
		render(<Harness />);
		fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
		fireEvent.mouseDown(screen.getByRole('alertdialog'));
		expect(screen.getByRole('alertdialog')).toBeTruthy();
		fireEvent.mouseDown(document.querySelector('[data-overlay="backdrop"]') as HTMLElement);
		expect(screen.queryByRole('alertdialog')).toBeNull();
	});

	it('does not cancel with a click on the backdrop while pending', () => {
		render(<Harness pending />);
		fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
		fireEvent.mouseDown(document.querySelector('[data-overlay="backdrop"]') as HTMLElement);
		expect(screen.getByRole('alertdialog')).toBeTruthy();
	});

	it('does not cancel with Escape while pending', () => {
		render(<Harness pending />);
		fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(screen.getByRole('alertdialog')).toBeTruthy();
	});

	it('is an alertdialog by default and a dialog when not destructive, unless role is explicit', () => {
		const { rerender } = render(
			<AdsConfirmDialog onConfirm={() => {}} onOpenChange={() => {}} open title="Excluir?" />,
		);
		expect(screen.getByRole('alertdialog', { name: 'Excluir?' })).toHaveAttribute(
			'aria-modal',
			'true',
		);
		rerender(
			<AdsConfirmDialog
				destructive={false}
				onConfirm={() => {}}
				onOpenChange={() => {}}
				open
				title="Salvar?"
			/>,
		);
		expect(screen.getByRole('dialog', { name: 'Salvar?' })).toBeTruthy();
		rerender(
			<AdsConfirmDialog
				onConfirm={() => {}}
				onOpenChange={() => {}}
				open
				role="dialog"
				title="Excluir?"
			/>,
		);
		expect(screen.getByRole('dialog', { name: 'Excluir?' })).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Confirmar' }).className).toContain('bg-danger');
	});

	it('has no axe violations', async () => {
		render(<Harness />);
		fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
		await expectNoViolations(screen.getByRole('alertdialog').parentElement as HTMLElement);
	});
});

interface User {
	id: string;
	name: string;
}
const users: User[] = [
	{ id: 'u1', name: 'Ana' },
	{ id: 'u2', name: 'Bruno' },
];
const columns: AdsSmartTableColumn<User>[] = [{ id: 'name', label: 'Nome', cell: (u) => u.name }];

describe('AdsListFlow', () => {
	function Flow({ onClearSelection }: { onClearSelection?: () => void }) {
		const [selected, setSelected] = useState<string[]>([]);
		const [filters, setFilters] = useState({});
		return (
			<AdsListFlow<User>
				bulkActions={<AdsButton>Excluir selecionados</AdsButton>}
				caption="Usuários"
				columns={columns}
				filterBar={{
					filters: [{ id: 'q', label: 'Busca', type: 'text' }],
					onChange: setFilters,
					value: filters,
				}}
				getRowId={(u) => u.id}
				getRowLabel={(u) => u.name}
				{...(onClearSelection && { onClearSelection })}
				onSelectionChange={setSelected}
				pagination={{ page: 1, pageCount: 3, onPageChange: () => {} }}
				rows={users}
				selectedIds={selected}
			/>
		);
	}

	it('composes filters, bulk bar, table and pagination', () => {
		render(<Flow />);
		expect(screen.getByRole('region', { name: 'Filtros' })).toBeTruthy();
		expect(screen.getByRole('table', { name: 'Usuários' })).toBeTruthy();
		expect(screen.getByRole('navigation')).toBeTruthy();
		expect(screen.queryByRole('group', { name: 'Ações em massa' })).toBeNull();
	});

	it('shows the bulk bar once a row is selected, announced only once', () => {
		render(<Flow />);
		fireEvent.click(screen.getByRole('checkbox', { name: 'Selecionar Ana' }));
		const group = screen.getByRole('group', { name: 'Ações em massa' });
		expect(within(group).getByRole('button', { name: 'Excluir selecionados' })).toBeTruthy();
		const announcements = screen
			.getAllByRole('status')
			.filter((node) => /selecionad/.test(node.textContent ?? ''));
		expect(announcements).toHaveLength(1);
		expect(announcements[0]).toHaveTextContent('1 item selecionado');
	});

	it('clears the selection through onSelectionChange by default', () => {
		render(<Flow />);
		fireEvent.click(screen.getByRole('checkbox', { name: 'Selecionar Ana' }));
		fireEvent.click(screen.getByRole('button', { name: 'Limpar seleção' }));
		expect(screen.queryByRole('group', { name: 'Ações em massa' })).toBeNull();
		expect(screen.getByRole('checkbox', { name: 'Selecionar Ana' })).not.toBeChecked();
	});

	it('moves focus to "select all" when "Limpar seleção" removes the bar', () => {
		render(<Flow />);
		fireEvent.click(screen.getByRole('checkbox', { name: 'Selecionar Ana' }));
		const clear = screen.getByRole('button', { name: 'Limpar seleção' });
		clear.focus();
		fireEvent.click(clear);
		expect(screen.queryByRole('group', { name: 'Ações em massa' })).toBeNull();
		expect(
			screen.getByRole('checkbox', { name: 'Selecionar todas as linhas da página' }),
		).toHaveFocus();
	});

	it('keeps focus off the body after deleting from the bar through the confirm dialog', () => {
		function Deleting() {
			const [selected, setSelected] = useState<string[]>(['u1', 'u2']);
			const [confirming, setConfirming] = useState(false);
			return (
				<>
					<AdsListFlow<User>
						bulkActions={<AdsButton onClick={() => setConfirming(true)}>Excluir</AdsButton>}
						caption="Usuários"
						columns={columns}
						getRowId={(u) => u.id}
						getRowLabel={(u) => u.name}
						onSelectionChange={setSelected}
						rows={users}
						selectedIds={selected}
					/>
					<AdsConfirmDialog
						onConfirm={() => {
							setSelected([]);
							setConfirming(false);
						}}
						onOpenChange={setConfirming}
						open={confirming}
						title="Excluir 2 itens?"
					/>
				</>
			);
		}
		render(<Deleting />);
		const trigger = screen.getByRole('button', { name: 'Excluir' });
		trigger.focus();
		fireEvent.click(trigger);
		const confirm = screen.getByRole('button', { name: 'Confirmar' });
		confirm.focus();
		fireEvent.click(confirm);
		expect(screen.queryByRole('alertdialog')).toBeNull();
		expect(document.activeElement).not.toBe(document.body);
		expect(
			screen.getByRole('checkbox', { name: 'Selecionar todas as linhas da página' }),
		).toHaveFocus();
	});

	it('uses onClearSelection when provided', () => {
		const onClear = vi.fn();
		render(<Flow onClearSelection={onClear} />);
		fireEvent.click(screen.getByRole('checkbox', { name: 'Selecionar Ana' }));
		fireEvent.click(screen.getByRole('button', { name: 'Limpar seleção' }));
		expect(onClear).toHaveBeenCalledTimes(1);
	});

	it('keeps the table selection summary without bulk actions', () => {
		render(
			<AdsListFlow<User>
				caption="Usuários"
				columns={columns}
				getRowId={(u) => u.id}
				onSelectionChange={() => {}}
				rows={users}
				selectedIds={['u1']}
			/>,
		);
		expect(screen.getByText('1 linha selecionada')).toBeTruthy();
	});

	it('has no axe violations', async () => {
		const { container } = render(<Flow />);
		fireEvent.click(screen.getByRole('checkbox', { name: 'Selecionar Ana' }));
		await expectNoViolations(container);
	});
});

describe('AdsStepForm', () => {
	function Form({
		onSubmit = () => {},
		submitting = false,
		cancel,
	}: {
		onSubmit?: () => void;
		submitting?: boolean;
		cancel?: () => void;
	}) {
		const [step, setStep] = useState('a');
		const [name, setName] = useState('');
		const [showError, setShowError] = useState(false);
		const steps: AdsStepDefinition[] = [
			{
				id: 'a',
				label: 'Dados',
				validate: () => {
					const ok = name.trim() !== '';
					setShowError(!ok);
					return ok;
				},
				content: (
					<label>
						Nome
						<input
							aria-invalid={showError || undefined}
							onChange={(event) => setName(event.target.value)}
							value={name}
						/>
					</label>
				),
			},
			{
				id: 'b',
				label: 'Notas',
				validate: () => false,
				content: (
					<label>
						Observação
						<input defaultValue="" />
					</label>
				),
			},
			{ id: 'c', label: 'Revisão', content: <p>Resumo para {name}</p> },
		];
		return (
			<AdsStepForm
				activeStepId={step}
				aria-label="Cadastro"
				{...(cancel && { onCancel: cancel })}
				onActiveStepChange={setStep}
				onSubmit={onSubmit}
				steps={steps}
				submitting={submitting}
			/>
		);
	}

	const next = () => fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));

	it('removes the invalid-step alert once the field is fixed, without moving focus', () => {
		render(<Form />);
		next();
		expect(screen.getByRole('alert')).toHaveTextContent('Corrija os campos');
		const field = screen.getByLabelText('Nome');
		expect(field).toHaveFocus();
		fireEvent.change(field, { target: { value: 'Ana' } });
		expect(screen.queryByRole('alert')).toBeNull();
		expect(field).toHaveFocus();
		expect(field).not.toHaveAttribute('aria-invalid');
	});

	it('shows the progress indicator and marks the current step', () => {
		render(<Form />);
		const items = within(screen.getByRole('list', { name: 'Etapas' })).getAllByRole('listitem');
		expect(items[0]).toHaveAttribute('aria-current', 'step');
		expect(items[1]).not.toHaveAttribute('aria-current');
		expect(items[0]).toHaveTextContent('etapa atual');
		expect(items[2]).toHaveTextContent('pendente');
		expect(screen.getByRole('progressbar', { name: 'Etapa 1 de 3' })).toHaveAttribute(
			'aria-valuenow',
			'1',
		);
		expect(screen.getByRole('button', { name: 'Voltar' })).toBeDisabled();
	});

	it('does not move focus on the initial render', () => {
		render(<Form />);
		expect(document.body).toHaveFocus();
	});

	it('blocks an invalid step, alerts and focuses the invalid field', () => {
		render(<Form />);
		next();
		expect(screen.getByRole('alert')).toHaveTextContent('Corrija os campos');
		expect(screen.getByLabelText('Nome')).toHaveFocus();
		expect(screen.getByRole('heading', { name: 'Dados' })).toBeVisible();
	});

	it('falls back to the heading when no field is marked invalid', () => {
		render(<Form />);
		fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana' } });
		next();
		next();
		expect(screen.getByRole('alert')).toBeTruthy();
		expect(screen.getByRole('heading', { name: 'Notas' })).toHaveFocus();
	});

	it('advances, announces and focuses the new step heading', () => {
		render(<Form />);
		fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana' } });
		next();
		expect(screen.getByRole('heading', { name: 'Notas' })).toHaveFocus();
		expect(screen.getByRole('status')).toHaveTextContent('Etapa 2 de 3: Notas');
		const items = within(screen.getByRole('list', { name: 'Etapas' })).getAllByRole('listitem');
		expect(items[0]).toHaveTextContent('concluída');
		expect(items[1]).toHaveAttribute('aria-current', 'step');
	});

	it('keeps the typed data going back, without validating', () => {
		render(<Form />);
		fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana' } });
		next();
		fireEvent.change(screen.getByLabelText('Observação'), { target: { value: 'nota' } });
		fireEvent.click(screen.getByRole('button', { name: 'Voltar' }));
		expect(screen.queryByRole('alert')).toBeNull();
		expect(screen.getByLabelText('Nome')).toHaveValue('Ana');
		expect(screen.getByRole('heading', { name: 'Dados' })).toHaveFocus();
		// A etapa inativa continua montada, oculta, com o valor digitado.
		expect(
			(document.querySelector('section[hidden] input') as HTMLInputElement | null)?.value,
		).toBe('nota');
	});

	it('confirms on the last step only after validation', () => {
		const onSubmit = vi.fn();
		function Last({ valid }: { valid: boolean }) {
			const [step, setStep] = useState('z');
			return (
				<AdsStepForm
					activeStepId={step}
					onActiveStepChange={setStep}
					onSubmit={onSubmit}
					steps={[{ id: 'z', label: 'Revisão', content: <p>ok</p>, validate: () => valid }]}
				/>
			);
		}
		const { rerender } = render(<Last valid={false} />);
		fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
		expect(onSubmit).not.toHaveBeenCalled();
		expect(screen.getByRole('alert')).toBeTruthy();
		rerender(<Last valid />);
		fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
		expect(onSubmit).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('alert')).toBeNull();
	});

	it('replaces Next by the submit action on the last step', () => {
		render(
			<AdsStepForm
				activeStepId="b"
				onActiveStepChange={() => {}}
				onSubmit={() => {}}
				steps={[
					{ id: 'a', label: 'A', content: null },
					{ id: 'b', label: 'B', content: null },
				]}
			/>,
		);
		expect(screen.queryByRole('button', { name: 'Próxima' })).toBeNull();
		expect(screen.getByRole('button', { name: 'Confirmar' })).toBeTruthy();
	});

	it('disables actions and sets aria-busy while submitting', () => {
		render(<Form cancel={() => {}} submitting />);
		for (const name of ['Cancelar', 'Voltar', 'Próxima']) {
			expect(screen.getByRole('button', { name })).toBeDisabled();
		}
		expect(screen.getByRole('form', { name: 'Cadastro' })).toHaveAttribute('aria-busy', 'true');
	});

	it('does not submit or advance with Enter in a field', () => {
		const onSubmit = vi.fn();
		render(<Form onSubmit={onSubmit} />);
		const input = screen.getByLabelText('Nome');
		fireEvent.change(input, { target: { value: 'Ana' } });
		fireEvent.submit(input.closest('form') as HTMLFormElement);
		expect(onSubmit).not.toHaveBeenCalled();
		expect(screen.getByRole('heading', { name: 'Dados' })).toBeVisible();
	});

	it('is strictly controlled by activeStepId', () => {
		const onChange = vi.fn();
		render(
			<AdsStepForm
				activeStepId="a"
				onActiveStepChange={onChange}
				onSubmit={() => {}}
				steps={[
					{ id: 'a', label: 'A', content: null },
					{ id: 'b', label: 'B', content: null },
				]}
			/>,
		);
		next();
		expect(onChange).toHaveBeenCalledWith('b');
		expect(screen.getByRole('heading', { name: 'A' })).toBeVisible();
	});

	it('has no axe violations', async () => {
		const { container } = render(<Form cancel={() => {}} />);
		next();
		await expectNoViolations(container);
	});
});

describe('AdsStepForm indicator navigation and async validation', () => {
	function Wizard({
		onSubmit = () => {},
		onStepChange = () => {},
		validateA = () => true,
		validateC,
		submitting = false,
	}: {
		onSubmit?: () => void;
		onStepChange?: (id: string) => void;
		validateA?: () => boolean | Promise<boolean>;
		validateC?: () => boolean | Promise<boolean>;
		submitting?: boolean;
	}) {
		const [step, setStep] = useState('a');
		return (
			<AdsStepForm
				activeStepId={step}
				aria-label="Fluxo"
				onActiveStepChange={(id) => {
					onStepChange(id);
					setStep(id);
				}}
				onSubmit={onSubmit}
				steps={[
					{
						id: 'a',
						label: 'Dados',
						validate: validateA,
						content: (
							<label>
								Nome
								<input defaultValue="" />
							</label>
						),
					},
					{ id: 'b', label: 'Notas', content: <p>Notas</p> },
					{
						id: 'c',
						label: 'Revisão',
						content: <p>Resumo</p>,
						...(validateC && { validate: validateC }),
					},
				]}
				submitting={submitting}
			/>
		);
	}
	const steps = () => within(screen.getByRole('list', { name: 'Etapas' }));
	const next = () => fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));

	function deferred() {
		let resolve!: (value: boolean) => void;
		const promise = new Promise<boolean>((res) => {
			resolve = res;
		});
		return { promise, resolve };
	}

	it('exposes no indicator controls before any step was validated', () => {
		render(<Wizard />);
		expect(steps().queryAllByRole('button')).toHaveLength(0);
	});

	it('goes back through the indicator, keeping data and focusing the heading', async () => {
		const onStepChange = vi.fn();
		render(<Wizard onStepChange={onStepChange} />);
		fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana' } });
		next();
		const back = steps().getByRole('button', { name: /Dados/ });
		expect(back).toHaveAttribute('type', 'button');
		fireEvent.click(back);
		expect(onStepChange).toHaveBeenLastCalledWith('a');
		expect(screen.getByLabelText('Nome')).toHaveValue('Ana');
		await waitFor(() => expect(screen.getByRole('heading', { name: 'Dados' })).toHaveFocus());
	});

	it('allows returning to a validated step without validating again', () => {
		const validateA = vi.fn(() => true);
		const onStepChange = vi.fn();
		render(<Wizard onStepChange={onStepChange} validateA={validateA} />);
		next();
		fireEvent.click(steps().getByRole('button', { name: /Dados/ }));
		expect(validateA).toHaveBeenCalledTimes(1);
		// "Notas" nunca foi validada: "Revisão" continua sem controle; "Notas" é navegável.
		expect(steps().queryByRole('button', { name: /Revisão/ })).toBeNull();
		fireEvent.click(steps().getByRole('button', { name: /Notas/ }));
		expect(onStepChange).toHaveBeenLastCalledWith('b');
		expect(validateA).toHaveBeenCalledTimes(1);
	});

	it('removes forward navigation after editing a validated step', () => {
		render(<Wizard />);
		next();
		fireEvent.click(steps().getByRole('button', { name: /Dados/ }));
		expect(steps().getByRole('button', { name: /Notas/ })).toBeTruthy();
		fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'x' } });
		expect(steps().queryByRole('button', { name: /Notas/ })).toBeNull();
	});

	it('does not navigate by the indicator while submitting', () => {
		const { rerender } = render(<Wizard />);
		next();
		expect(steps().getByRole('button', { name: /Dados/ })).toBeTruthy();
		rerender(<Wizard submitting />);
		expect(steps().queryAllByRole('button')).toHaveLength(0);
	});

	it('keeps a synchronous validate synchronous', () => {
		const onStepChange = vi.fn();
		render(<Wizard onStepChange={onStepChange} />);
		next();
		expect(onStepChange).toHaveBeenCalledWith('b');
		expect(screen.getByRole('form', { name: 'Fluxo' })).not.toHaveAttribute('aria-busy');
	});

	it('shows a busy state while an async validate is pending and advances once it resolves', async () => {
		const gate = deferred();
		const validateA = vi.fn(() => gate.promise);
		const onStepChange = vi.fn();
		render(<Wizard onStepChange={onStepChange} validateA={validateA} />);
		const button = screen.getByRole('button', { name: 'Próxima' });
		button.focus();
		next();
		expect(screen.getByRole('form', { name: 'Fluxo' })).toHaveAttribute('aria-busy', 'true');
		expect(button).toHaveAttribute('aria-disabled', 'true');
		expect(button).toHaveFocus();
		expect(screen.getByRole('status')).toHaveTextContent('Validando');
		expect(onStepChange).not.toHaveBeenCalled();
		next();
		expect(validateA).toHaveBeenCalledTimes(1);
		gate.resolve(true);
		await waitFor(() => expect(onStepChange).toHaveBeenCalledWith('b'));
		expect(onStepChange).toHaveBeenCalledTimes(1);
		expect(screen.getByRole('form', { name: 'Fluxo' })).not.toHaveAttribute('aria-busy');
	});

	it('treats an async false as an invalid step', async () => {
		const onStepChange = vi.fn();
		render(<Wizard onStepChange={onStepChange} validateA={() => Promise.resolve(false)} />);
		next();
		expect(await screen.findByRole('alert')).toHaveTextContent('Corrija os campos');
		expect(onStepChange).not.toHaveBeenCalled();
		expect(screen.getByRole('heading', { name: 'Dados' })).toBeVisible();
		expect(screen.getByRole('form', { name: 'Fluxo' })).not.toHaveAttribute('aria-busy');
	});

	it('treats a rejected validate as an invalid step', async () => {
		const onStepChange = vi.fn();
		render(<Wizard onStepChange={onStepChange} validateA={() => Promise.reject(new Error('x'))} />);
		next();
		expect(await screen.findByRole('alert')).toBeTruthy();
		expect(onStepChange).not.toHaveBeenCalled();
	});

	it('submits once after an async validation of the last step', async () => {
		const gate = deferred();
		const onSubmit = vi.fn();
		render(<Wizard onSubmit={onSubmit} validateC={() => gate.promise} />);
		next();
		next();
		const submit = screen.getByRole('button', { name: 'Confirmar' });
		fireEvent.click(submit);
		fireEvent.click(submit);
		expect(onSubmit).not.toHaveBeenCalled();
		gate.resolve(true);
		await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
	});

	it('discards an async result that arrives after unmount', async () => {
		const gate = deferred();
		const onStepChange = vi.fn();
		const { unmount } = render(
			<Wizard onStepChange={onStepChange} validateA={() => gate.promise} />,
		);
		next();
		unmount();
		gate.resolve(true);
		await Promise.resolve();
		await Promise.resolve();
		expect(onStepChange).not.toHaveBeenCalled();
	});

	it('has no axe violations with the navigable indicator and while validating', async () => {
		const gate = deferred();
		const { container } = render(<Wizard validateA={() => gate.promise} />);
		await expectNoViolations(container);
		next();
		await expectNoViolations(container);
		gate.resolve(true);
		await waitFor(() => expect(steps().queryAllByRole('button').length).toBeGreaterThan(0));
		await expectNoViolations(container);
	});
});

describe('admin flows package', () => {
	it('does not import the Next.js router', () => {
		for (const file of ['bulk-action-bar', 'confirm-dialog', 'list-flow', 'step-form']) {
			const source = readFileSync(join(import.meta.dirname, '..', 'src', `${file}.tsx`), 'utf8');
			expect(source).not.toMatch(/from ['"]next(\/|['"])/);
		}
	});
});
