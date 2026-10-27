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
		render(
			<AdsLoadingText loading speed={speed}>
				Processando
			</AdsLoadingText>,
		);
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
		const { container } = renderWithTheme(
			<AdsLoadingText loading>Atualizando</AdsLoadingText>,
			theme,
		);
		expect(container.firstElementChild).toHaveAttribute('data-theme', theme);
		expect(screen.getByText('Atualizando')).toBeVisible();
	});

	it('renders on the server without a client boundary', () => {
		expect(renderToStaticMarkup(<AdsLoadingText loading>Executando</AdsLoadingText>)).toContain(
			'Executando',
		);
	});

	it('does not expose speed or loading attributes while inactive', () => {
		render(<AdsLoadingText speed="fast">Concluído</AdsLoadingText>);
		const text = screen.getByText('Concluído');
		expect(text).not.toHaveAttribute('data-loading');
		expect(text).not.toHaveAttribute('data-speed');
	});

	it('forwards HTML attributes and keeps rich children intact', () => {
		render(
			<AdsLoadingText aria-label="Status da execução" data-testid="status" loading title="Job 42">
				<strong>Job 42</strong> em execução
			</AdsLoadingText>,
		);
		const element = screen.getByTestId('status');
		expect(element).toHaveAttribute('aria-label', 'Status da execução');
		expect(element).toHaveAttribute('title', 'Job 42');
		expect(element.querySelector('strong')).toHaveTextContent('Job 42');
		expect(element).toHaveTextContent('Job 42 em execução');
	});

	it('serializes the loading state in server markup without live-region attributes', () => {
		const markup = renderToStaticMarkup(
			<AdsLoadingText as="p" loading speed="slow">
				Linha 1{'\n'}Linha 2
			</AdsLoadingText>,
		);
		expect(markup).toBe(
			'<p class="ads-loading-text" data-loading="true" data-speed="slow">Linha 1\nLinha 2</p>',
		);
		expect(markup).not.toMatch(/aria-live|aria-busy|role=/);
	});

	it('does not introduce accessibility violations', async () => {
		const { container } = render(<AdsLoadingText loading>Processando</AdsLoadingText>);
		expect((await axe.run(container)).violations).toEqual([]);
	});
});
