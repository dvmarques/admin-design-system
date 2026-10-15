import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import axe from 'axe-core';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AdsButton } from '@admin-ds/components';
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
		const dialog = screen.getByRole('dialog', { name: 'Excluir 2 itens?' });
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
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger).toHaveFocus();
		expect(onConfirm).not.toHaveBeenCalled();
	});

	it('confirms without closing by itself', () => {
		const onConfirm = vi.fn();
		render(<Harness onConfirm={onConfirm} />);
		fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
		fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
		expect(onConfirm).toHaveBeenCalledTimes(1);
		expect(screen.getByRole('dialog')).toBeTruthy();
	});

	it('disables both actions while pending', () => {
		render(<Harness pending />);
		fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
		expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
		expect(screen.getByRole('button', { name: /Confirmar/ })).toBeDisabled();
	});

	it('does not cancel with Escape while pending', () => {
		render(<Harness pending />);
		fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(screen.getByRole('dialog')).toBeTruthy();
	});

	it('has no axe violations', async () => {
		render(<Harness />);
		fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
		await expectNoViolations(screen.getByRole('dialog').parentElement as HTMLElement);
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

describe('admin flows package', () => {
	it('does not import the Next.js router', () => {
		for (const file of ['bulk-action-bar', 'confirm-dialog', 'list-flow', 'step-form']) {
			const source = readFileSync(join(import.meta.dirname, '..', 'src', `${file}.tsx`), 'utf8');
			expect(source).not.toMatch(/from ['"]next(\/|['"])/);
		}
	});
});
