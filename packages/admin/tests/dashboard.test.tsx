import { AdsEmptyState } from '@dvmarques/admin-ds-components';
import { render, screen, within } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { AdsDashboardGrid, AdsDashboardPanel, AdsMetricCard } from '../src/index.js';

describe('AdsMetricCard', () => {
	it('shows title, value and change with the trend as text and a decorative icon', () => {
		const { container } = render(
			<AdsMetricCard change="+12,4%" title="Receita" trend="up" value="R$ 48.200" />,
		);
		expect(screen.getByText('Receita')).toBeTruthy();
		expect(screen.getByText('R$ 48.200')).toBeTruthy();
		const change = container.querySelector('.ads-metric-card-change') as HTMLElement;
		expect(change.textContent).toContain('Em alta');
		expect(change.textContent).toContain('+12,4%');
		expect(change.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
		expect(change.dataset.sentiment).toBe('positive');
	});

	it('derives sentiment from the trend and lets the consumer override it', () => {
		const { container, rerender } = render(
			<AdsMetricCard change="-3%" title="A" trend="down" value="1" />,
		);
		expect(container.querySelector('.ads-metric-card-change')?.getAttribute('data-sentiment')).toBe(
			'negative',
		);
		rerender(<AdsMetricCard change="+3%" sentiment="negative" title="A" trend="up" value="1" />);
		expect(container.querySelector('.ads-metric-card-change')?.getAttribute('data-sentiment')).toBe(
			'negative',
		);
		rerender(<AdsMetricCard change="0%" title="A" trend="neutral" value="1" />);
		expect(container.querySelector('.ads-metric-card-change')?.textContent).toContain('Estável');
	});

	it('accepts a custom trend label and renders progress with an accessible name', () => {
		render(
			<AdsMetricCard
				change="+1"
				progress={{ label: 'Meta mensal', value: 40 }}
				title="Metas"
				trend="up"
				trendLabel="Subiu"
				value="40%"
			/>,
		);
		expect(screen.getByText(/Subiu/)).toBeTruthy();
		expect(screen.getByRole('progressbar', { name: 'Meta mensal' })).toBeTruthy();
	});

	it('shows a down trend with positive sentiment: icon and text keep the real direction', () => {
		const { container } = render(
			<AdsMetricCard
				change="-8%"
				sentiment="positive"
				title="Cancelamentos"
				trend="down"
				value="38"
			/>,
		);
		const change = container.querySelector('.ads-metric-card-change') as HTMLElement;
		expect(change.dataset.sentiment).toBe('positive');
		expect(change.dataset.trend).toBe('down');
		expect(change.textContent).toContain('Em queda');
		expect(change.querySelector('svg path')?.getAttribute('d')).toBe('m5 9 7 7 7-7');
	});

	it('shows the sparkline below the change, colored by the sentiment', () => {
		const { container, rerender } = render(
			<AdsMetricCard
				change="+12%"
				sparkline={{ label: 'Receita diária', values: [1, 3, 2] }}
				title="Receita"
				trend="up"
				value="R$ 1"
			/>,
		);
		const image = screen.getByRole('img', { name: /Receita diária: 3 pontos/ });
		expect(image.classList.contains('ads-metric-card-sparkline')).toBe(true);
		expect(image.getAttribute('data-tone')).toBe('positive');
		expect(container.querySelector('.ads-metric-card-change')?.nextElementSibling).toBe(image);

		rerender(
			<AdsMetricCard
				change="+2%"
				sentiment="negative"
				sparkline={{ values: [1, 3, 2] }}
				title="Receita"
				trend="up"
				value="R$ 1"
			/>,
		);
		expect(screen.getByRole('img').getAttribute('data-tone')).toBe('negative');

		rerender(<AdsMetricCard sparkline={{ values: [1, 3, 2] }} title="Receita" value="R$ 1" />);
		expect(screen.getByRole('img').getAttribute('data-tone')).toBe('default');
		rerender(
			<AdsMetricCard
				change="0%"
				sparkline={{ values: [1, 3] }}
				title="R"
				trend="neutral"
				value="1"
			/>,
		);
		expect(screen.getByRole('img').getAttribute('data-tone')).toBe('default');
	});

	it('omits the sparkline without valid points and outside the normal state', () => {
		const { container, rerender } = render(
			<AdsMetricCard sparkline={{ values: [] }} title="Receita" value="R$ 1" />,
		);
		expect(screen.queryByRole('img')).toBeNull();
		expect(screen.getByText('R$ 1')).toBeTruthy();

		rerender(
			<AdsMetricCard error="Falha" sparkline={{ values: [1, 2] }} title="Receita" value="R$ 1" />,
		);
		expect(screen.queryByRole('img')).toBeNull();
		rerender(<AdsMetricCard empty="Sem dados" sparkline={{ values: [1, 2] }} title="Receita" />);
		expect(screen.queryByRole('img')).toBeNull();

		rerender(<AdsMetricCard loading sparkline={{ values: [1, 2] }} title="Receita" />);
		expect(container.querySelector('.ads-metric-card-skeleton-sparkline')).toBeTruthy();
		rerender(<AdsMetricCard loading title="Receita" />);
		expect(container.querySelector('.ads-metric-card-skeleton-sparkline')).toBeNull();
	});

	it('keeps the markup unchanged without sparkline', () => {
		const { container } = render(
			<AdsMetricCard change="+1%" title="Receita" trend="up" value="R$ 1" />,
		);
		expect(container.querySelector('svg.ads-sparkline')).toBeNull();
		expect(container.querySelectorAll('svg')).toHaveLength(1);
	});

	it('covers loading, error and empty states keeping the title', () => {
		const { rerender } = render(<AdsMetricCard loading title="Receita" value="1" />);
		expect(screen.getByRole('status', { name: 'Carregando métrica' })).toBeTruthy();
		expect(screen.getByText('Receita')).toBeTruthy();
		expect(screen.queryByText('1')).toBeNull();
		rerender(<AdsMetricCard error="Falha ao carregar" title="Receita" value="1" />);
		expect(screen.getByRole('alert').textContent).toBe('Falha ao carregar');
		rerender(<AdsMetricCard empty="Sem dados" title="Receita" value="1" />);
		expect(screen.getByText('Sem dados')).toBeTruthy();
		expect(screen.queryByText('1')).toBeNull();
	});

	it('treats zero as empty and an empty string as normal content', () => {
		const { container, rerender } = render(<AdsMetricCard empty={0} title="Receita" value="1" />);
		expect(container.querySelector('.ads-empty-state')).toHaveAttribute('data-size', 'compact');
		expect(screen.getByText('0')).toHaveClass('ads-empty-state-title');
		expect(screen.queryByText('1')).toBeNull();

		rerender(<AdsMetricCard empty="" title="Receita" value="R$ 10" />);
		expect(container.querySelector('.ads-empty-state')).toBeNull();
		expect(screen.getByText('R$ 10')).toBeTruthy();
	});

	it('renders text as a compact empty state and nodes as informed', () => {
		const { container, rerender } = render(<AdsMetricCard empty="Sem dados" title="Receita" />);
		expect(container.querySelector('.ads-empty-state')).toHaveAttribute('data-size', 'compact');
		expect(screen.getByText('Sem dados')).toHaveClass('ads-empty-state-title');
		expect(screen.queryByRole('alert')).toBeNull();

		rerender(<AdsMetricCard empty={<a href="/importar">Importar</a>} title="Receita" />);
		expect(container.querySelector('.ads-empty-state')).toBeNull();
	});

	it('accepts a node as the empty content, like the panel', () => {
		render(<AdsMetricCard empty={<a href="/importar">Importar dados</a>} title="Receita" />);
		expect(screen.getByRole('link', { name: 'Importar dados' })).toBeTruthy();
		expect(screen.getByText('Receita')).toBeTruthy();
	});
});

describe('AdsDashboardPanel', () => {
	it('treats zero as empty and an empty string as children', () => {
		const { container, rerender } = render(
			<AdsDashboardPanel empty={0} title="Painel">
				<p>Conteúdo</p>
			</AdsDashboardPanel>,
		);
		expect(container.querySelector('.ads-empty-state')).toHaveAttribute('data-size', 'compact');
		expect(screen.getByText('0')).toBeTruthy();
		expect(screen.queryByText('Conteúdo')).toBeNull();

		rerender(
			<AdsDashboardPanel empty="" title="Painel">
				<p>Conteúdo</p>
			</AdsDashboardPanel>,
		);
		expect(container.querySelector('.ads-empty-state')).toBeNull();
		expect(screen.getByText('Conteúdo')).toBeTruthy();
	});

	it('renders textual empty content as a compact empty state', () => {
		const { container } = render(<AdsDashboardPanel empty="Nada por aqui" title="Vazio" />);
		expect(container.querySelector('.ads-empty-state')).toHaveAttribute('data-size', 'compact');
		expect(screen.getByText('Nada por aqui')).toBeTruthy();
	});

	it('renders a named region with the configured heading level and span', () => {
		render(
			<AdsDashboardPanel headingLevel={3} span={2} title="Pedidos recentes">
				<p>Conteúdo</p>
			</AdsDashboardPanel>,
		);
		const region = screen.getByRole('region', { name: 'Pedidos recentes' });
		expect(region.getAttribute('data-span')).toBe('2');
		expect(
			within(region).getByRole('heading', { level: 3, name: 'Pedidos recentes' }),
		).toBeTruthy();
		expect(screen.getByText('Conteúdo')).toBeTruthy();
	});

	it('renders loading with busy state and hides children', () => {
		render(
			<AdsDashboardPanel loading title="Painel">
				<p>Conteúdo</p>
			</AdsDashboardPanel>,
		);
		expect(screen.getByRole('region', { name: 'Painel' }).getAttribute('aria-busy')).toBe('true');
		expect(screen.getByRole('status', { name: 'Carregando painel' })).toBeTruthy();
		expect(screen.queryByText('Conteúdo')).toBeNull();
	});

	it('prioritizes loading, then error, then empty, then content', () => {
		const empty = <AdsEmptyState title="Nada por aqui" />;
		const { rerender } = render(
			<AdsDashboardPanel
				empty={empty}
				error="Falhou"
				errorActions={<button type="button">Tentar de novo</button>}
				title="Painel"
			>
				<p>Conteúdo</p>
			</AdsDashboardPanel>,
		);
		expect(screen.getByRole('alert').textContent).toContain('Falhou');
		expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeTruthy();
		expect(screen.queryByText('Nada por aqui')).toBeNull();
		rerender(
			<AdsDashboardPanel
				empty={<AdsEmptyState description="Tente outro período" title="Nada por aqui" />}
				title="Painel"
			>
				<p>Conteúdo</p>
			</AdsDashboardPanel>,
		);
		expect(screen.getByText('Nada por aqui')).toBeTruthy();
		expect(screen.getByText('Tente outro período')).toBeTruthy();
		expect(screen.queryByText('Conteúdo')).toBeNull();
	});

	it('keeps DOM order and accepts actions and className', () => {
		const { container } = render(
			<AdsDashboardGrid className="custom">
				<AdsDashboardPanel actions={<button type="button">Exportar</button>} title="Primeiro" />
				<AdsDashboardPanel title="Segundo" />
			</AdsDashboardGrid>,
		);
		const headings = screen.getAllByRole('heading').map((h) => h.textContent);
		expect(headings).toEqual(['Primeiro', 'Segundo']);
		expect(container.firstElementChild?.className).toContain('ads-dashboard-grid custom');
		const items = container.querySelector('.ads-dashboard-grid > .ads-dashboard-grid-items');
		expect(items?.children).toHaveLength(2);
		expect(screen.getByRole('button', { name: 'Exportar' })).toBeTruthy();
	});

	it('has no accessibility violations across states', async () => {
		const { container } = render(
			<AdsDashboardGrid>
				<AdsMetricCard change="+12%" title="Receita" trend="up" value="R$ 1" />
				<AdsMetricCard
					change="-8%"
					sentiment="positive"
					sparkline={{ label: 'Cancelamentos por dia', values: [9, 8, 7] }}
					title="Cancelamentos"
					trend="down"
					value="38"
				/>
				<AdsMetricCard loading sparkline={{ values: [1, 2] }} title="Clientes" />
				<AdsDashboardPanel description="Últimos 7 dias" span={2} title="Vendas">
					<p>Conteúdo</p>
				</AdsDashboardPanel>
				<AdsDashboardPanel loading title="Carregando" />
				<AdsDashboardPanel error="Falhou" title="Erro" />
				<AdsDashboardPanel empty={<AdsEmptyState title="Nada por aqui" />} title="Vazio" />
				<AdsMetricCard empty="Sem dados" title="Pedidos" />
			</AdsDashboardGrid>,
		);
		const results = await axe.run(container);
		expect(results.violations).toEqual([]);
	});
});
