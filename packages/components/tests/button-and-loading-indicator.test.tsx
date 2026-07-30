import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { AdsButton } from '../src/button';
import { AdsLoadingIndicator } from '../src/loading-indicator';
import { renderWithTheme } from './test-utils';

describe('AdsButton', () => {
	it('renders a native button with the default variant and type', () => {
		render(<AdsButton>Salvar</AdsButton>);

		const button = screen.getByRole('button', { name: 'Salvar' });
		expect(button).toHaveAttribute('type', 'button');
		expect(button).toHaveClass('ads-button', 'bg-primary');
	});

	it.each([
		['secondary', 'bg-surface'],
		['danger', 'bg-danger'],
		['ghost', 'bg-transparent'],
	] as const)('applies the %s variant', (variant, expectedClass) => {
		render(<AdsButton variant={variant}>Salvar</AdsButton>);

		expect(screen.getByRole('button')).toHaveClass(expectedClass);
	});

	it('prevents activation and reports busy while loading', () => {
		const onClick = vi.fn();
		render(
			<AdsButton isLoading onClick={onClick}>
				Salvar
			</AdsButton>,
		);

		const button = screen.getByRole('button', { name: 'Salvar' });
		button.focus();
		fireEvent.keyDown(button, { key: 'Enter' });
		fireEvent.click(button);

		expect(button).toBeDisabled();
		expect(button).toHaveAttribute('aria-busy', 'true');
		expect(onClick).not.toHaveBeenCalled();
	});

	it.each(['light', 'dark'] as const)(
		'renders the %s theme with a visible focusable button',
		(theme) => {
			const { container } = renderWithTheme(<AdsButton>Salvar</AdsButton>, theme);

			expect(container.firstElementChild).toHaveAttribute('data-theme', theme);
			expect(screen.getByRole('button')).toBeVisible();
		},
	);

	it('does not have detectable accessibility violations', async () => {
		const { container } = render(<AdsButton>Salvar</AdsButton>);

		const results = await axe.run(container);
		expect(results.violations).toEqual([]);
	});
});

describe('AdsLoadingIndicator', () => {
	it('exposes an accessible indeterminate status with the selected size', () => {
		render(<AdsLoadingIndicator label="Salvando dados" size="lg" />);

		const indicator = screen.getByRole('status', { name: 'Salvando dados' });
		expect(indicator).toHaveClass('ads-loading-indicator');
		expect(indicator.firstElementChild).toHaveClass('h-6', 'w-6', 'motion-reduce:animate-none');
	});

	it.each(['light', 'dark'] as const)('renders in the %s theme', (theme) => {
		const { container } = renderWithTheme(<AdsLoadingIndicator />, theme);

		expect(container.firstElementChild).toHaveAttribute('data-theme', theme);
		expect(screen.getByRole('status', { name: 'Carregando' })).toBeVisible();
	});

	it('does not have detectable accessibility violations', async () => {
		const { container } = render(<AdsLoadingIndicator />);

		const results = await axe.run(container);
		expect(results.violations).toEqual([]);
	});
});
