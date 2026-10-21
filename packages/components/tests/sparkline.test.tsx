import { act, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AdsSparkline } from '../src/sparkline';

const nbsp = new RegExp(String.fromCharCode(160), 'g');
const name = (element: Element) => (element.getAttribute('aria-label') ?? '').replace(nbsp, ' ');

describe('AdsSparkline', () => {
	it('draws a line through the points and exposes a generated accessible summary', () => {
		const { container } = render(<AdsSparkline label="Receita diária" values={[10, 8, 20, 18]} />);
		const image = screen.getByRole('img', { name: /Receita diária/ });
		expect(name(image)).toBe('Receita diária: 4 pontos, de 10 a 18, mínimo 8, máximo 20.');
		expect(container.querySelector('.ads-sparkline-line')?.getAttribute('d')).toBe(
			'M0 24L33.33 28L66.67 4L100 8',
		);
		expect(container.querySelector('.ads-sparkline-dot')?.getAttribute('d')).toBe('M100 8h0');
	});

	it('formats values in pt-BR by default and accepts formatValue', () => {
		const { rerender } = render(<AdsSparkline values={[1000.5, 2000]} />);
		expect(name(screen.getByRole('img'))).toBe(
			'Tendência: 2 pontos, de 1.000,5 a 2.000, mínimo 1.000,5, máximo 2.000.',
		);
		rerender(<AdsSparkline formatValue={(value) => `R$ ${value}`} values={[1, 2]} />);
		expect(name(screen.getByRole('img'))).toBe(
			'Tendência: 2 pontos, de R$ 1 a R$ 2, mínimo R$ 1, máximo R$ 2.',
		);
	});

	it('names the first and last points with labels and lets summary replace the text', () => {
		const { rerender } = render(<AdsSparkline labels={['jan', 'fev', 'mar']} values={[3, 5, 4]} />);
		expect(name(screen.getByRole('img'))).toBe(
			'Tendência: 3 pontos, de 3 (jan) a 4 (mar), mínimo 3, máximo 5.',
		);
		rerender(<AdsSparkline summary="Vendas estáveis" values={[3, 5, 4]} />);
		expect(screen.getByRole('img', { name: 'Vendas estáveis' })).toBeTruthy();
	});

	it('renders nothing without valid points', () => {
		const { container, rerender } = render(<AdsSparkline values={[]} />);
		expect(container.innerHTML).toBe('');
		rerender(<AdsSparkline values={[null, undefined, Number.NaN, Infinity]} />);
		expect(container.innerHTML).toBe('');
	});

	it('draws only a marker for a single valid point and ignores invalid values in the line', () => {
		const { container, rerender } = render(<AdsSparkline values={[7]} />);
		expect(container.querySelector('.ads-sparkline-line')).toBeNull();
		expect(container.querySelector('.ads-sparkline-dot')?.getAttribute('d')).toBe('M50 16h0');
		expect(name(screen.getByRole('img'))).toBe('Tendência: 1 ponto, valor 7.');

		rerender(<AdsSparkline values={[1, null, 3]} />);
		expect(container.querySelector('.ads-sparkline-line')?.getAttribute('d')).toBe('M0 28L100 4');
		expect(name(screen.getByRole('img'))).toContain('2 pontos');
	});

	it('draws a flat line for constant series and clamps to min and max', () => {
		const { container, rerender } = render(<AdsSparkline values={[5, 5, 5]} />);
		expect(container.querySelector('.ads-sparkline-line')?.getAttribute('d')).toBe(
			'M0 16L50 16L100 16',
		);
		rerender(<AdsSparkline max={10} min={0} values={[-5, 5, 20]} />);
		expect(container.querySelector('.ads-sparkline-line')?.getAttribute('d')).toBe(
			'M0 28L50 16L100 4',
		);
		rerender(<AdsSparkline max={0} min={10} values={[1, 2]} />);
		expect(container.querySelector('.ads-sparkline-line')?.getAttribute('d')).toBe('M0 16L100 16');
	});

	it('sets the tone, class and svg attributes', () => {
		const { container } = render(
			<AdsSparkline className="minha-classe" data-testid="spark" tone="negative" values={[1, 2]} />,
		);
		const svg = container.querySelector('svg') as SVGElement;
		expect(svg.getAttribute('data-tone')).toBe('negative');
		expect(svg.classList.contains('ads-sparkline')).toBe(true);
		expect(svg.classList.contains('minha-classe')).toBe(true);
		expect(svg.getAttribute('data-testid')).toBe('spark');
		expect(svg.getAttribute('preserveAspectRatio')).toBe('none');
	});

	it('has no accessibility violations', async () => {
		const { container } = render(
			<>
				<AdsSparkline values={[1, 3, 2]} />
				<AdsSparkline tone="positive" values={[4]} />
			</>,
		);
		const results = await axe.run(container);
		expect(results.violations).toEqual([]);
	});
});

describe('AdsSparkline SSR', () => {
	const Sample = () => <AdsSparkline label="Receita" tone="positive" values={[1, 3, null, 2]} />;

	it('renders on the server without a client directive', async () => {
		const html = renderToString(<Sample />);
		expect(html).toContain('role="img"');
		expect(html).toContain('Receita: 3 pontos');
		const source = await readFile(resolve(import.meta.dirname, '../src/sparkline.tsx'), 'utf8');
		expect(source).not.toMatch(/use client|useEffect|useState|ResizeObserver/);
	});

	it('hydrates without warnings or markup changes', async () => {
		const html = renderToString(<Sample />);
		const container = document.createElement('div');
		container.innerHTML = html;
		document.body.appendChild(container);
		const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const onRecoverableError = vi.fn();
		let root!: ReturnType<typeof hydrateRoot>;
		await act(async () => {
			root = hydrateRoot(container, <Sample />, { onRecoverableError });
		});
		expect(error).not.toHaveBeenCalled();
		expect(onRecoverableError).not.toHaveBeenCalled();
		expect(container.innerHTML).toBe(html);
		error.mockRestore();
		act(() => root.unmount());
		container.remove();
	});
});

describe('AdsSparkline styles', () => {
	it('ships tone colors from public tokens and a forced-colors fallback', async () => {
		const css = await readFile(resolve(import.meta.dirname, '../dist/styles.css'), 'utf8');
		expect(css).toMatch(/\.ads-sparkline\{[^}]*var\(--ads-color-chart1\)/);
		expect(css).toMatch(/\[data-tone=positive\]\{color:var\(--ads-color-success\)/);
		expect(css).toMatch(/\[data-tone=negative\]\{color:var\(--ads-color-danger\)/);
		expect(css).toContain('vector-effect:non-scaling-stroke');
		expect(css).toMatch(/forced-colors:\s*active\)\{[^@]*\.ads-sparkline/);
	});
});
