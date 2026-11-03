import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AdsField, AdsMultiSelect } from '../src/index.js';

const options = [
	{ value: 'sp', label: 'São Paulo' },
	{ value: 'rj', label: 'Rio de Janeiro' },
	{ value: 'mg', label: 'Minas Gerais', disabled: true },
	{ value: 'pr', label: 'Paraná' },
];

describe('AdsMultiSelect', () => {
	it('seleciona múltiplos valores, serializa cada valor e remove chips', () => {
		const onValueChange = vi.fn();
		const { container } = render(
			<form>
				<AdsField label="Estados" description="Selecione mais de um">
					<AdsMultiSelect name="uf" options={options} onValueChange={onValueChange} />
				</AdsField>
			</form>,
		);
		const input = screen.getByRole('combobox', { name: 'Estados' });
		fireEvent.focus(input);
		expect(input).toHaveAttribute('aria-expanded', 'true');
		expect(input).toHaveAccessibleDescription(/Selecione mais de um/);
		fireEvent.click(screen.getByRole('option', { name: 'São Paulo' }));
		fireEvent.click(screen.getByRole('option', { name: 'Rio de Janeiro' }));
		expect(new FormData(container.querySelector('form')!).getAll('uf')).toEqual(['sp', 'rj']);
		expect(screen.getByRole('option', { name: 'Rio de Janeiro' })).toHaveAttribute('aria-selected', 'true');
		fireEvent.click(screen.getByRole('button', { name: 'Remover São Paulo' }));
		expect(onValueChange).toHaveBeenLastCalledWith(['rj']);
		expect(new FormData(container.querySelector('form')!).getAll('uf')).toEqual(['rj']);
		fireEvent.click(screen.getByRole('button', { name: 'Limpar todas as seleções' }));
		expect(new FormData(container.querySelector('form')!).getAll('uf')).toEqual([]);
	});

	it('modo controlado apenas solicita mudança; não modifica o valor antes da confirmação', () => {
		const callback = vi.fn();
		const { rerender } = render(
			<AdsMultiSelect aria-label="Estados" onValueChange={callback} options={options} value={[]} />,
		);
		const input = screen.getByRole('combobox', { name: 'Estados' });
		fireEvent.focus(input);
		fireEvent.click(screen.getByRole('option', { name: 'São Paulo' }));
		expect(callback).toHaveBeenCalledWith(['sp']);
		expect(screen.queryByRole('button', { name: 'Remover São Paulo' })).toBeNull();
		rerender(
			<AdsMultiSelect aria-label="Estados" onValueChange={callback} options={options} value={['sp']} />,
		);
		expect(screen.getByRole('button', { name: 'Remover São Paulo' })).toBeInTheDocument();
	});

	it('navega e ignora itens desabilitados; Backspace remove última seleção', () => {
		render(<AdsMultiSelect aria-label="Estados" options={options} />);
		const input = screen.getByRole('combobox', { name: 'Estados' });
		fireEvent.focus(input);
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('-option-3'));
		fireEvent.keyDown(input, { key: 'Enter' });
		expect(screen.getByRole('button', { name: 'Remover Paraná' })).toBeInTheDocument();
		fireEvent.keyDown(input, { key: 'Backspace' });
		expect(screen.queryByRole('button', { name: 'Remover Paraná' })).toBeNull();
		fireEvent.keyDown(input, { key: 'Escape' });
		expect(input).toHaveAttribute('aria-expanded', 'false');
	});

	it('busca sem acentos, limita inclusões sem bloquear remoção e preserva valor inicial', () => {
		render(
			<AdsMultiSelect
				aria-label="Estados"
				defaultValue={['sp']}
				maxSelections={1}
				options={options}
			/>,
		);
		const input = screen.getByRole('combobox', { name: 'Estados' });
		fireEvent.focus(input);
		fireEvent.change(input, { target: { value: 'parana' } });
		expect(screen.getByRole('option', { name: 'Paraná' })).toHaveAttribute('aria-disabled', 'true');
		fireEvent.click(screen.getByRole('option', { name: 'Paraná' }));
		expect(screen.queryByRole('button', { name: 'Remover Paraná' })).toBeNull();
		fireEvent.click(screen.getByRole('button', { name: 'Remover São Paulo' }));
		fireEvent.change(input, { target: { value: 'parana' } });
		fireEvent.click(screen.getByRole('option', { name: 'Paraná' }));
		expect(screen.getByRole('button', { name: 'Remover Paraná' })).toBeInTheDocument();
	});

	it('required valida o input visível, não a consulta, e reset restaura valor inicial', () => {
		const { container } = render(
			<form>
				<AdsField label="Estados">
					<AdsMultiSelect defaultValue={['sp']} name="uf" options={options} required />
				</AdsField>
			</form>,
		);
		const form = container.querySelector('form')!;
		const input = screen.getByRole('combobox', { name: 'Estados' }) as HTMLInputElement;
		expect(input.validity.valid).toBe(true);
		fireEvent.click(screen.getByRole('button', { name: 'Limpar todas as seleções' }));
		expect(input.validity.valid).toBe(false);
		fireEvent.change(input, { target: { value: 'Rio' } });
		expect(input.validity.valid).toBe(false);
		fireEvent.reset(form);
		expect(new FormData(form).getAll('uf')).toEqual(['sp']);
		expect(input).toHaveValue('');
		expect(input.validity.valid).toBe(true);
	});

	it('desabilitado não serializa, readOnly impede mudanças e estados são anunciados', () => {
		const { container } = render(
			<form>
				<AdsMultiSelect aria-label="Desabilitado" disabled defaultValue={['sp']} name="uf" options={options} />
				<AdsMultiSelect aria-label="Leitura" defaultValue={['sp']} options={options} readOnly />
				<AdsField error="Erro simulado" label="Falhou" validationState="error">
					<AdsMultiSelect error="Sem conexão" options={options} />
				</AdsField>
				<AdsMultiSelect aria-label="Carregando" loading options={options} />
				<AdsMultiSelect aria-label="Vazio" emptyText="Sem opções" options={[]} />
			</form>,
		);
		expect(new FormData(container.querySelector('form')!).getAll('uf')).toEqual([]);
		expect(screen.getByRole('combobox', { name: 'Leitura' })).toHaveAttribute('readonly');
		expect(screen.getByRole('combobox', { name: 'Falhou' })).toHaveAttribute('aria-invalid', 'true');
		fireEvent.focus(screen.getByRole('combobox', { name: 'Vazio' }));
		expect(screen.getByText('Sem opções')).toBeInTheDocument();
	});

	it('não quebra SSR e não apresenta violações automáticas de acessibilidade', async () => {
		expect(renderToString(<AdsMultiSelect aria-label="Estados" options={options} />)).toContain('role="combobox"');
		const { container } = render(
			<AdsField label="Estados">
				<AdsMultiSelect options={options} />
			</AdsField>,
		);
		fireEvent.focus(screen.getByRole('combobox', { name: 'Estados' }));
		const result = await axe.run(container);
		expect(result.violations).toEqual([]);
	});

	it('estado controlado pode ser gerido por consumidor React', () => {
		function Demo() {
			const [value, setValue] = useState<string[]>([]);
			return <AdsMultiSelect aria-label="Equipes" onValueChange={setValue} options={options} value={value} />;
		}
		render(<Demo />);
		const input = screen.getByRole('combobox', { name: 'Equipes' });
		fireEvent.focus(input);
		fireEvent.click(screen.getByRole('option', { name: 'Rio de Janeiro' }));
		expect(screen.getByRole('button', { name: 'Remover Rio de Janeiro' })).toBeInTheDocument();
	});
});
