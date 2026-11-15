import { act, render, screen, within } from '@testing-library/react';
import axe from 'axe-core';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AdsPageHeader } from '../src/page-header';
import { renderWithTheme } from './test-utils';

afterEach(() => vi.restoreAllMocks());

describe('AdsPageHeader', () => {
	it('renders one semantic H1 with optional description and actions', () => {
		render(
			<main>
				<AdsPageHeader
					data-testid="page-header"
					title="Consultas"
					description="Dados do período"
					actions={
						<>
							<a href="#filters">Filtros</a>
							<button type="button">Exportar</button>
						</>
					}
				/>
				<section aria-labelledby="filters">
					<h2 id="filters">Filtros</h2>
				</section>
			</main>,
		);
		const header = screen.getByTestId('page-header');
		expect(header.tagName).toBe('HEADER');
		expect(within(header).getByRole('heading', { level: 1, name: 'Consultas' })).toBeVisible();
		expect(within(header).getByText('Dados do período').tagName).toBe('P');
		expect(within(header).getByRole('link', { name: 'Filtros' })).toHaveAttribute(
			'href',
			'#filters',
		);
		expect(within(header).getByRole('button', { name: 'Exportar' })).toBeVisible();
		expect(screen.getAllByRole('main')).toHaveLength(1);
		expect(screen.getByRole('heading', { level: 2, name: 'Filtros' })).toBeVisible();
	});

	it('omits optional slots while preserving native attributes and custom classes', () => {
		const { container } = render(
			<AdsPageHeader title="Página" id="my-header" className="custom" />,
		);
		const header = container.querySelector('header');
		expect(header).toHaveAttribute('id', 'my-header');
		expect(header).toHaveClass('custom', 'ads-page-header');
		expect(within(header as HTMLElement).getByRole('heading', { level: 1 })).toHaveTextContent(
			'Página',
		);
		expect(header?.querySelector('.ads-page-header__actions')).toBeNull();
		expect(header?.querySelector('.ads-page-header__description')).toBeNull();
	});

	it.each(['light', 'dark'] as const)('supports %s theme and long headings', (theme) => {
		const long = 'RelatorioSemEspacos'.repeat(12);
		const { container } = renderWithTheme(
			<AdsPageHeader title={long} actions={<button>Uma ação</button>} />,
			theme,
		);
		expect(container.firstElementChild).toHaveAttribute('data-theme', theme);
		expect(screen.getByRole('heading', { name: long })).toHaveClass('ads-page-header__title');
		expect(screen.getByRole('button', { name: 'Uma ação' })).toBeInTheDocument();
	});

	it('has no detectable accessibility violations', async () => {
		const { container } = render(
			<main>
				<AdsPageHeader title="Registros" description="Resumo" actions={<button>Salvar</button>} />
			</main>,
		);
		expect((await axe.run(container)).violations).toEqual([]);
	});

	it('hydrates server markup without mismatches', async () => {
		const page = (
			<main>
				<AdsPageHeader title="SSR" description="Hidratação" actions={<button>Continuar</button>} />
			</main>
		);
		const container = document.createElement('div');
		container.innerHTML = renderToString(page);
		document.body.appendChild(container);
		const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		let root: ReturnType<typeof hydrateRoot> | undefined;
		try {
			await act(async () => {
				root = hydrateRoot(container, page);
			});
			expect(errors).not.toHaveBeenCalled();
			expect(container.querySelectorAll('main')).toHaveLength(1);
			expect(container.querySelectorAll('h1')).toHaveLength(1);
		} finally {
			if (root) await act(async () => root?.unmount());
			container.remove();
		}
	});
});
