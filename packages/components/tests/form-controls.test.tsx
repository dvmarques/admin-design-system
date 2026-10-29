import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import {
	AdsButton,
	AdsCheckbox,
	AdsField,
	AdsInput,
	AdsInputGroup,
	AdsRadio,
	AdsSelect,
	AdsSelectionGroup,
	AdsSwitch,
	AdsTextarea,
} from '../src';
import { renderWithTheme } from './test-utils';

describe('text form controls', () => {
	it('preserves native input attributes and exposes validation state', () => {
		render(<AdsInput aria-label="Nome" name="name" validationState="error" />);

		const input = screen.getByRole('textbox', { name: 'Nome' });
		expect(input).toHaveAttribute('name', 'name');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveClass(
			'ads-form-control',
			'border-form-invalid',
			'min-h-[var(--ads-dimension-field-md)]',
		);
	});

	it('counts padding and border inside the width of every text control', () => {
		const { container } = render(
			<form>
				{(['sm', 'md', 'lg'] as const).map((size) => (
					<AdsInput aria-label={`Texto ${size}`} key={size} size={size} />
				))}
				{(['default', 'success', 'error'] as const).map((validationState) => (
					<AdsInput
						aria-label={`Estado ${validationState}`}
						key={validationState}
						validationState={validationState}
					/>
				))}
				<AdsInput aria-label="Desabilitado" disabled />
				<AdsTextarea aria-label="Descrição" />
				<AdsSelect aria-label="Status">
					<option value="active">Ativo</option>
				</AdsSelect>
			</form>,
		);

		const controls = [...container.querySelectorAll('.ads-form-control')];
		expect(controls).toHaveLength(9);
		for (const control of controls) expect(control).toHaveClass('box-border', 'w-full');
	});

	it('renders textarea and select with native interaction', () => {
		render(
			<form>
				<AdsTextarea aria-label="Descrição" defaultValue="Inicial" />
				<AdsSelect aria-label="Status" defaultValue="active">
					<option value="active">Ativo</option>
					<option value="inactive">Inativo</option>
				</AdsSelect>
			</form>,
		);

		const textarea = screen.getByRole('textbox', { name: 'Descrição' });
		fireEvent.change(textarea, { target: { value: 'Atualizada' } });
		expect(textarea).toHaveValue('Atualizada');
		expect(screen.getByRole('combobox', { name: 'Status' })).toHaveValue('active');
	});

	it('distinguishes readonly from disabled controls', () => {
		render(
			<>
				<AdsInput aria-label="Somente leitura" readOnly />
				<AdsInput aria-label="Desabilitado" disabled />
			</>,
		);
		expect(screen.getByRole('textbox', { name: 'Somente leitura' })).toHaveClass(
			'[&[readonly]]:bg-surface-muted',
			'[&[readonly]]:cursor-default',
		);
		expect(screen.getByRole('textbox', { name: 'Desabilitado' })).toBeDisabled();
	});

	it.each(['light', 'dark'] as const)('supports the %s theme and custom class', (theme) => {
		const { container } = renderWithTheme(
			<AdsInput aria-label="E-mail" className="custom-input" size="lg" />,
			theme,
		);
		expect(container.firstElementChild).toHaveAttribute('data-theme', theme);
		expect(screen.getByRole('textbox', { name: 'E-mail' })).toHaveClass('custom-input', 'text-sm');
	});

	it('has no detectable accessibility violations', async () => {
		const { container } = render(<AdsInput aria-label="Nome" />);
		expect((await axe.run(container)).violations).toEqual([]);
	});
});

describe('selection form controls', () => {
	it('supports controlled and uncontrolled native selection', () => {
		render(
			<form>
				<AdsCheckbox label="Aceito" defaultChecked />
				<AdsRadio label="Opção A" name="choice" value="a" />
				<AdsRadio label="Opção B" name="choice" value="b" />
				<AdsSwitch label="Notificações" />
			</form>,
		);

		expect(screen.getByRole('checkbox', { name: 'Aceito' })).toBeChecked();
		const optionB = screen.getByRole('radio', { name: 'Opção B' });
		fireEvent.click(optionB);
		expect(optionB).toBeChecked();
		const notifications = screen.getByRole('checkbox', { name: 'Notificações' });
		fireEvent.keyDown(notifications, { key: ' ' });
		expect(notifications).toBeInTheDocument();
	});

	it('communicates invalid state and remains keyboard focusable', () => {
		render(<AdsCheckbox aria-label="Termos" validationState="error" />);
		const checkbox = screen.getByRole('checkbox', { name: 'Termos' });
		expect(checkbox).toHaveAttribute('aria-invalid', 'true');
		checkbox.focus();
		expect(checkbox).toHaveFocus();
	});

	it.each(['light', 'dark'] as const)(
		'uses semantic field backgrounds for unchecked %s checkboxes and radios',
		(theme) => {
			renderWithTheme(
				<>
					<AdsCheckbox label="Aceito" />
					<AdsRadio label="Opção" name="choice" value="option" />
				</>,
				theme,
			);

			for (const label of ['Aceito', 'Opção']) {
				const indicator = screen.getByRole(label === 'Aceito' ? 'checkbox' : 'radio', {
					name: label,
				}).nextElementSibling;
				expect(indicator).toHaveClass('bg-form-background', 'border-border-control');
			}
		},
	);

	it('centers a visible switch thumb for every size and moves it by the matching track distance', () => {
		render(
			<>
				<AdsSwitch label="Pequeno" size="sm" />
				<AdsSwitch label="Médio" size="md" />
				<AdsSwitch label="Grande" size="lg" />
			</>,
		);

		const [small, medium, large] = ['Pequeno', 'Médio', 'Grande'].map(
			(label) => screen.getByRole('checkbox', { name: label }).nextElementSibling as HTMLElement,
		);
		expect(small).toHaveClass('h-5', 'w-9', 'peer-checked:[&>span]:translate-x-4');
		expect(small.firstElementChild).toHaveClass('top-0.5', 'bg-surface-muted');
		expect(medium).toHaveClass('h-6', 'w-10', 'peer-checked:[&>span]:translate-x-4');
		expect(medium.firstElementChild).toHaveClass('top-1', 'bg-surface-muted');
		expect(large).toHaveClass('h-7', 'w-12', 'peer-checked:[&>span]:translate-x-5');
		expect(large.firstElementChild).toHaveClass('top-1', 'h-5', 'w-5', 'bg-surface-muted');
	});

	it.each(['light', 'dark'] as const)('renders selection controls in the %s theme', (theme) => {
		const { container } = renderWithTheme(<AdsSwitch label="Ativo" size="lg" />, theme);
		expect(container.firstElementChild).toHaveAttribute('data-theme', theme);
		expect(screen.getByRole('checkbox', { name: 'Ativo' })).toBeVisible();
	});

	it('has no detectable accessibility violations', async () => {
		const { container } = render(
			<fieldset>
				<legend>Preferências</legend>
				<AdsCheckbox label="E-mail" />
			</fieldset>,
		);
		expect((await axe.run(container)).violations).toEqual([]);
	});
});

describe('field composition', () => {
	it('gives the label the <control id>-label id', () => {
		render(
			<>
				<AdsField label="Vencimento">
					<AdsInput id="due" />
				</AdsField>
				<AdsField label="Nome">
					<AdsInput />
				</AdsField>
			</>,
		);
		expect(screen.getByText('Vencimento')).toHaveAttribute('id', 'due-label');
		const generated = screen.getByRole('textbox', { name: 'Nome' });
		expect(screen.getByText('Nome')).toHaveAttribute('id', `${generated.id}-label`);
	});

	it('associates label, description and error with the control', () => {
		render(
			<AdsField
				description="Use seu e-mail corporativo"
				error="Informe um e-mail válido"
				label="E-mail"
				validationState="error"
			>
				<AdsInput type="email" />
			</AdsField>,
		);

		const input = screen.getByRole('textbox', { name: 'E-mail' });
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input.getAttribute('aria-describedby')).toMatch(/description/);
		expect(input.getAttribute('aria-describedby')).toMatch(/error/);
		expect(screen.getByRole('alert')).toHaveTextContent('Informe um e-mail válido');
	});

	it('drops the addon frame and follows the field height when the addon is a button', () => {
		const { container } = render(
			<>
				<AdsInputGroup
					endContent={<AdsButton type="button">Buscar</AdsButton>}
					startContent={
						<AdsButton type="button" variant="secondary">
							Filtros
						</AdsButton>
					}
				>
					<AdsInput aria-label="Busca" />
				</AdsInputGroup>
				<AdsInputGroup endContent="BRL">
					<AdsInput aria-label="Valor" />
				</AdsInputGroup>
			</>,
		);

		const [start, end] = [
			container.querySelector('.ads-input-group__start'),
			container.querySelector('.ads-input-group__end'),
		];
		for (const addon of [start, end]) {
			expect(addon).toHaveClass(
				'has-[>.ads-button]:p-0',
				'has-[>.ads-button]:border-0',
				'has-[>.ads-button]:bg-transparent',
				'has-[>.ads-button]:items-stretch',
				'[&>.ads-button]:min-h-0!',
				'[&>.ads-button]:translate-y-0!',
			);
		}
		expect(start).toHaveClass('[&>.ads-button]:rounded-r-none', 'has-[>.ads-button]:-mr-px');
		expect(end).toHaveClass('[&>.ads-button]:rounded-l-none', 'has-[>.ads-button]:-ml-px');
		// O adendo de texto mantém a moldura; o que muda é só o que a variante `has` ativa.
		expect(screen.getByText('BRL')).toHaveClass('border', 'bg-surface-muted', 'px-3');
		expect(screen.getByRole('button', { name: 'Buscar' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Filtros' })).toBeInTheDocument();
	});

	it('keeps currency and buttons unbroken without changing global button styles', () => {
		const { container } = render(
			<AdsInputGroup
				startContent="R$"
				endContent={
					<>
						<AdsButton>Limpar</AdsButton>
						<AdsButton>Restaurar</AdsButton>
					</>
				}
			>
				<AdsInput aria-label="Valor" />
			</AdsInputGroup>,
		);
		const start = container.querySelector('.ads-input-group__start');
		const end = container.querySelector('.ads-input-group__end');
		expect(start).toHaveClass('shrink-0', 'whitespace-nowrap');
		expect(end).toHaveClass('shrink-0', 'whitespace-nowrap');
		expect(container.querySelector('.ads-input-group')).toHaveClass(
			'max-w-full',
			'overflow-x-auto',
			'[&>.ads-form-control]:min-w-[4rem]',
		);
		expect(end).toHaveClass('[&>.ads-button]:whitespace-nowrap');
		expect(screen.getByRole('button', { name: 'Limpar' })).not.toHaveClass('whitespace-nowrap');
	});

	it('keeps several buttons in one addon contiguous with only the outer corner rounded', () => {
		const { container } = render(
			<AdsInputGroup
				endContent={
					<>
						<AdsButton type="button" variant="secondary">
							Limpar
						</AdsButton>
						<AdsButton type="button">Buscar</AdsButton>
					</>
				}
				startContent={
					<>
						<AdsButton type="button" variant="secondary">
							Filtros
						</AdsButton>
						<AdsButton type="button" variant="secondary">
							Ordem
						</AdsButton>
					</>
				}
			>
				<AdsInput aria-label="Busca" />
			</AdsInputGroup>,
		);

		expect(container.querySelector('.ads-input-group__start')).toHaveClass(
			'[&>.ads-button+.ads-button]:-ml-px',
			'[&>.ads-button]:rounded-r-none',
			'[&>.ads-button:not(:first-child)]:rounded-l-none',
		);
		expect(container.querySelector('.ads-input-group__end')).toHaveClass(
			'[&>.ads-button+.ads-button]:-ml-px',
			'[&>.ads-button]:rounded-l-none',
			'[&>.ads-button:not(:last-child)]:rounded-r-none',
		);
		expect(screen.getAllByRole('button')).toHaveLength(4);
	});

	it('preserves consumer ids and composes input and selection groups', async () => {
		const { container } = render(
			<>
				<AdsInputGroup startContent="R$">
					<AdsInput aria-label="Valor" id="value" />
				</AdsInputGroup>
				<AdsSelectionGroup legend="Canais">
					<AdsCheckbox label="E-mail" />
					<AdsCheckbox label="SMS" />
				</AdsSelectionGroup>
			</>,
		);
		expect(screen.getByRole('textbox', { name: 'Valor' })).toHaveAttribute('id', 'value');
		expect(container.querySelector('.ads-input-group')).toHaveClass(
			'[&>.ads-form-control]:rounded-l-none',
		);
		expect(screen.getByRole('textbox', { name: 'Valor' })).toHaveClass('rounded-md');
		expect(screen.getByRole('group', { name: 'Canais' })).toBeInTheDocument();
		// Resets the browser fieldset frame, which otherwise shows a default border in dark themes.
		expect(screen.getByRole('group', { name: 'Canais' })).toHaveClass(
			'm-0',
			'min-w-0',
			'border-0',
			'p-0',
		);
		expect((await axe.run(container)).violations).toEqual([]);
	});
});
