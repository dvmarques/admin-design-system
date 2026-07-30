import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { AdsSurface } from '../src/surface';
import { renderWithTheme } from './test-utils';

describe('AdsSurface', () => {
	it.each([
		['neutral', 'bg-surface'],
		['raised', 'bg-surface-raised'],
		['outlined', 'bg-transparent'],
	] as const)('renders the %s visual level', (variant, expectedClass) => {
		render(<AdsSurface variant={variant}>Conteúdo</AdsSurface>);

		const surface = screen.getByText('Conteúdo');
		expect(surface).toHaveClass('ads-surface', expectedClass, 'min-w-0');
	});

	it.each(['light', 'dark'] as const)('uses the %s theme and accommodates content', (theme) => {
		const { container } = renderWithTheme(
			<AdsSurface className="custom-surface">Conteúdo responsivo</AdsSurface>,
			theme,
		);

		expect(container.firstElementChild).toHaveAttribute('data-theme', theme);
		expect(screen.getByText('Conteúdo responsivo')).toHaveClass('custom-surface');
	});

	it('does not have detectable accessibility violations', async () => {
		const { container } = render(<AdsSurface>Conteúdo</AdsSurface>);

		const results = await axe.run(container);
		expect(results.violations).toEqual([]);
	});
});
