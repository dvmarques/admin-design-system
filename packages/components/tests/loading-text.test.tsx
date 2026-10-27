import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AdsLoadingText } from '../src/loading-text';
import { renderWithTheme } from './test-utils';

describe('AdsLoadingText', () => {
	it('renders plain text without a loading state by default', () => {
		render(<AdsLoadingText>Concluído</AdsLoadingText>);
		const text = screen.getByText('Concluído');
		expect(text.tagName).toBe('SPAN');
		expect(text).toHaveClass('ads-loading-text');
		expect(text).not.toHaveAttribute('data-loading');
		expect(text).not.toHaveAttribute('role');
		expect(text).not.toHaveAttribute('aria-live');
	});

	it.each(['slow', 'normal', 'fast'] as const)('supports %s shimmer speed', (speed) => {
		render(<AdsLoadingText loading speed={speed}>Processando</AdsLoadingText>);
		const text = screen.getByText('Processando');
		expect(text).toHaveAttribute('data-loading', 'true');
		expect(text).toHaveAttribute('data-speed', speed);
		expect(text).not.toHaveAttribute('role');
	});

	it('supports semantic element, custom class and HTML properties', () => {
		render(
			<AdsLoadingText as="p" className="custom" id="job-status" loading>
				Linha 1{'\n'}Linha 2
			</AdsLoadingText>,
		);
		const element = document.getElementById('job-status');
		expect(element?.tagName).toBe('P');
		expect(element).toHaveClass('ads-loading-text', 'custom');
		expect(element?.textContent).toBe('Linha 1\nLinha 2');
	});

	it.each(['light', 'dark'] as const)('renders on the %s theme', (theme) => {
		const { container } = renderWithTheme(<AdsLoadingText loading>Atualizando</AdsLoadingText>, theme);
		expect(container.firstElementChild).toHaveAttribute('data-theme', theme);
		expect(screen.getByText('Atualizando')).toBeVisible();
	});

	it('renders on the server without a client boundary', () => {
		expect(renderToStaticMarkup(<AdsLoadingText loading>Executando</AdsLoadingText>)).toContain('Executando');
	});

	it('does not introduce accessibility violations', async () => {
		const { container } = render(<AdsLoadingText loading>Processando</AdsLoadingText>);
		expect((await axe.run(container)).violations).toEqual([]);
	});
});
