import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdsField, AdsPasswordInput } from '../src/index.js';

describe('AdsPasswordInput', () => {
  it('masks by default and toggles without submitting forms', () => {
    render(<AdsField label="Senha"><AdsPasswordInput defaultValue="secret" /></AdsField>);
    const input = screen.getByLabelText('Senha') as HTMLInputElement;
    expect(input.type).toBe('password');
    expect(input.value).toBe('secret');
    const toggle = screen.getByRole('button', { name: 'Mostrar senha' });
    fireEvent.click(toggle);
    expect(input.type).toBe('text');
    expect(input.value).toBe('secret');
    expect(input).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Ocultar senha' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Ocultar senha' }));
    expect(input.type).toBe('password');
  });

  it('disables both controls and supports invalid state', () => {
    render(<AdsField label="Senha" error="Senha inválida" validationState="error"><AdsPasswordInput disabled /></AdsField>);
    expect(screen.getByLabelText('Senha')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Mostrar senha' })).toBeDisabled();
    expect(screen.getByLabelText('Senha')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Senha inválida');
  });

  it('supports hiding the toggle', () => {
    render(<AdsPasswordInput aria-label="Senha" showVisibilityToggle={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
