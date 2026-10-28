import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AdsAutocomplete, AdsCombobox, AdsField } from '../src/index.js';

const states = [
  { value: 'SP', label: 'São Paulo' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'PR', label: 'Paraná', disabled: true },
];

describe('AdsCombobox', () => {
  it('navigates by keyboard and submits the selected value rather than its label', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <form>
        <AdsField label="Estado" description="Digite o nome">
          <AdsCombobox options={states} name="uf" onValueChange={onValueChange} />
        </AdsField>
      </form>,
    );
    const input = screen.getByRole('combobox', { name: 'Estado' });
    fireEvent.focus(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveAccessibleDescription('Digite o nome');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('-option-0'));
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith('RJ', expect.objectContaining({ label: 'Rio de Janeiro' }));
    expect(input).toHaveValue('Rio de Janeiro');
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(container.querySelector('input[name="uf"]')).toHaveValue('RJ');
    fireEvent.click(screen.getByRole('button', { name: 'Limpar seleção' }));
    expect(onValueChange).toHaveBeenLastCalledWith(null, null);
    expect(input).toHaveValue('');
    expect(container.querySelector('input[name="uf"]')).toHaveValue('');
    expect(input).toHaveFocus();
  });

  it('keeps controlled state in the consumer and supports distinct label/value', () => {
    const changed = vi.fn();
    const { rerender } = render(
      <AdsCombobox aria-label="Estado" options={states} value="SP" onValueChange={changed} />,
    );
    const input = screen.getByRole('combobox', { name: 'Estado' });
    expect(input).toHaveValue('São Paulo');
    fireEvent.focus(input);
    fireEvent.click(screen.getByRole('option', { name: 'Rio de Janeiro' }));
    expect(changed).toHaveBeenCalledWith('RJ', expect.any(Object));
    expect(input).toHaveValue('São Paulo');
    rerender(<AdsCombobox aria-label="Estado" options={states} value="RJ" onValueChange={changed} />);
    expect(input).toHaveValue('Rio de Janeiro');
  });

  it('filters, skips disabled options, keeps selection on editing, and supports custom rendering', () => {
    const select = vi.fn();
    render(
      <AdsCombobox
        aria-label="UF"
        defaultValue="SP"
        options={states}
        onValueChange={select}
        renderOption={(item) => <span>{item.label} [{item.value}]</span>}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'UF' });
    fireEvent.change(input, { target: { value: 'par' } });
    expect(screen.getByRole('option')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('option')).toHaveTextContent('Paraná [PR]');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(select).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports error, disabled, and stable SSR ids', () => {
    render(
      <>
        <AdsField label="Inválido" error="Selecione uma opção" validationState="error">
          <AdsCombobox options={states} />
        </AdsField>
        <AdsField label="Desabilitado">
          <AdsCombobox disabled options={states} />
        </AdsField>
      </>,
    );
    const invalid = screen.getByRole('combobox', { name: 'Inválido' });
    expect(invalid).toHaveAttribute('aria-invalid', 'true');
    expect(invalid).toHaveAccessibleDescription('Selecione uma opção');
    expect(screen.getByRole('combobox', { name: 'Desabilitado' })).toBeDisabled();
    const html = renderToString(
      <div>
        <AdsCombobox aria-label="A" options={states} />
        <AdsCombobox aria-label="B" options={states} />
      </div>,
    );
    const ids = Array.from(html.matchAll(/id="(ads-combobox-input-[^"]+)"/g)).map((match) => match[1]);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });

  it('has no detectable axe violations when its list is open', async () => {
    render(<AdsField label="Estado"><AdsCombobox options={states} /></AdsField>);
    fireEvent.focus(screen.getByRole('combobox'));
    const result = await axe.run(document.body);
    expect(result.violations).toEqual([]);
  });
});

describe('AdsAutocomplete', () => {
  it('filters local values synchronously', () => {
    render(<AdsField label="Estado"><AdsAutocomplete options={states} /></AdsField>);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Rio' } });
    expect(screen.getAllByRole('option')).toHaveLength(1);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input).toHaveValue('Rio de Janeiro');
  });

  it('discards stale async responses even when the provider ignores abort', async () => {
    const pending = new Map<string, (options: typeof states) => void>();
    const loadOptions = vi.fn((query: string, _signal: AbortSignal) =>
      new Promise<typeof states>((resolve) => pending.set(query, resolve)),
    );
    render(<AdsField label="Busca"><AdsAutocomplete debounceMs={0} loadOptions={loadOptions} /></AdsField>);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 's' } });
    await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(1));
    expect(screen.getByRole('status')).toHaveTextContent('Buscando opções');
    fireEvent.change(input, { target: { value: 'sao' } });
    await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(2));
    await act(async () => pending.get('sao')?.([{ value: 'SP', label: 'São Paulo' }]));
    expect(screen.getByRole('option')).toHaveTextContent('São Paulo');
    await act(async () => pending.get('s')?.([{ value: 'RJ', label: 'Rio de Janeiro' }]));
    expect(screen.getByRole('option')).toHaveTextContent('São Paulo');
    expect(screen.queryByRole('option', { name: 'Rio de Janeiro' })).not.toBeInTheDocument();
  });

  it('exposes error and empty states', async () => {
    const loadOptions = vi.fn(async (query: string) => {
      if (query === 'erro') throw new Error('Falha simulada');
      return [];
    });
    render(<AdsField label="Busca"><AdsAutocomplete debounceMs={0} loadOptions={loadOptions} /></AdsField>);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'erro' } });
    expect(await screen.findByText('Falha simulada')).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'vazio' } });
    expect(await screen.findByText('Nenhuma opção encontrada')).toBeInTheDocument();
  });
});
