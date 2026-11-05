import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AdsTimePicker } from '../src/time-picker';
import { AdsField } from '../src/field';

describe('AdsTimePicker', () => {
	it('edita valor HH:mm em 24h e serializa exatamente um campo', () => {
		const change = vi.fn();
		const { container } = render(
			<form>
				<AdsTimePicker name="hora" onValueChange={change} />
			</form>,
		);
		fireEvent.change(screen.getByRole('combobox', { name: 'Horas' }), { target: { value: '15' } });
		fireEvent.change(screen.getByRole('combobox', { name: 'Minutos' }), {
			target: { value: '30' },
		});
		expect(change).toHaveBeenLastCalledWith('15:30');
		expect(new FormData(container.querySelector('form')!).getAll('hora')).toEqual(['15:30']);
	});

	it('converte meia-noite e meio-dia em modo 12h sem alterar o contrato', () => {
		const change = vi.fn();
		render(<AdsTimePicker defaultValue="00:15" format="12h" onValueChange={change} />);
		expect(screen.getByRole('combobox', { name: 'Horas' })).toHaveValue('12');
		expect(screen.getByRole('combobox', { name: 'Período' })).toHaveValue('AM');
		fireEvent.change(screen.getByRole('combobox', { name: 'Período' }), {
			target: { value: 'PM' },
		});
		expect(change).toHaveBeenLastCalledWith('12:15');
	});

	it('respeita passo e limites inclusivos, invalidando minutos fora da faixa', () => {
		const change = vi.fn();
		render(
			<AdsTimePicker
				defaultValue="09:30"
				min="09:15"
				max="10:30"
				minuteStep={15}
				onValueChange={change}
			/>,
		);
		const mins = screen.getByRole('combobox', { name: 'Minutos' });
		expect(mins.querySelector('option[value="10"]')).toBeDisabled();
		expect(mins.querySelector('option[value="15"]')).not.toBeDisabled();
		fireEvent.change(screen.getByRole('combobox', { name: 'Horas' }), { target: { value: '10' } });
		expect(change).toHaveBeenLastCalledWith('10:30');
		expect(mins.querySelector('option[value="45"]')).toBeDisabled();
	});

	it('não comite valor até completar duas partes e limpa valor inválido', () => {
		const change = vi.fn();
		render(<AdsTimePicker defaultValue="12:30" min="12:00" max="13:00" onValueChange={change} />);
		fireEvent.change(screen.getByRole('combobox', { name: 'Horas' }), { target: { value: '' } });
		expect(change).toHaveBeenLastCalledWith(null);
		fireEvent.change(screen.getByRole('combobox', { name: 'Horas' }), { target: { value: '13' } });
		expect(screen.getByRole('combobox', { name: 'Minutos' })).toHaveValue('');
		fireEvent.change(screen.getByRole('combobox', { name: 'Minutos' }), {
			target: { value: '00' },
		});
		expect(change).toHaveBeenLastCalledWith('13:00');
	});

	it('preserva valor controlado se o pai não atualizar a prop', () => {
		const change = vi.fn();
		const { rerender } = render(<AdsTimePicker value="08:20" onValueChange={change} />);
		fireEvent.change(screen.getByRole('combobox', { name: 'Horas' }), { target: { value: '09' } });
		expect(change).toHaveBeenLastCalledWith('09:20');
		expect(screen.getByRole('combobox', { name: 'Horas' })).toHaveValue('08');
		rerender(<AdsTimePicker value="09:20" onValueChange={change} />);
		expect(screen.getByRole('combobox', { name: 'Horas' })).toHaveValue('09');
	});

	it('integra AdsField, required, estado disabled e descrição acessível', () => {
		render(
			<>
				<AdsField
					description="De 09:00 a 18:00"
					error="Obrigatório"
					label="Horário"
					validationState="error"
				>
					<AdsTimePicker required />
				</AdsField>
				<AdsTimePicker aria-label="Bloqueado" defaultValue="12:00" disabled />
			</>,
		);
		const hour = screen.getByRole('combobox', { name: 'Horário' });
		expect(hour).toBeRequired();
		expect(hour).toHaveAttribute('aria-invalid', 'true');
		expect(hour.getAttribute('aria-describedby')).toContain('-error');
		expect(screen.getByRole('combobox', { name: 'Minutos' })).toHaveAttribute(
			'aria-invalid',
			'true',
		);
		expect(screen.getByRole('combobox', { name: 'Bloqueado' })).toBeDisabled();
	});

	it('assinala valores externos malformados e não os submete', () => {
		const { container } = render(
			<form>
				<AdsTimePicker value="25:93" name="horario" />
			</form>,
		);
		expect(screen.getByRole('combobox', { name: 'Horas' })).toHaveAttribute('aria-invalid', 'true');
		expect(new FormData(container.querySelector('form')!).get('horario')).toBe('');
	});

	it('renderiza no servidor sem tempo global e não cria campos adicionais com nome', () => {
		const html = renderToString(
			<AdsField label="Hora">
				<AdsTimePicker defaultValue="23:45" name="hora" />
			</AdsField>,
		);
		expect(html).toContain('ads-time-picker');
		expect(html).toContain('name="hora"');
		expect(html).toContain('value="23:45"');
	});

	it('não tem violações axe para os controles com label', async () => {
		const { container } = render(
			<AdsField label="Agendamento">
				<AdsTimePicker defaultValue="11:45" />
			</AdsField>,
		);
		const results = await axe.run(container);
		expect(results.violations).toHaveLength(0);
	});
});
