import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import {
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
		expect(input).toHaveClass('ads-form-control', 'border-form-invalid');
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

	it.each(['light', 'dark'] as const)('supports the %s theme and custom class', (theme) => {
		const { container } = renderWithTheme(
			<AdsInput aria-label="E-mail" className="custom-input" size="lg" />,
			theme,
		);
		expect(container.firstElementChild).toHaveAttribute('data-theme', theme);
		expect(screen.getByRole('textbox', { name: 'E-mail' })).toHaveClass('custom-input', 'text-lg');
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
		expect(screen.getByRole('group', { name: 'Canais' })).toBeInTheDocument();
		expect((await axe.run(container)).violations).toEqual([]);
	});
});
