import { AdsEmptyState } from '@admin-ds/components';
import { act } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AdsDashboardGrid, AdsDashboardPanel, AdsMetricCard } from '../src/index.js';

function Dashboard() {
	return (
		<AdsDashboardGrid>
			<AdsMetricCard
				change="+12,4%"
				progress={{ label: 'Meta mensal', value: 40 }}
				title="Receita"
				trend="up"
				value="R$ 48.200"
			/>
			<AdsMetricCard loading title="Clientes" />
			<AdsMetricCard empty="Sem dados no período." title="Pedidos" />
			<AdsDashboardPanel description="Últimos 7 dias" span={2} title="Vendas">
				<p>Conteúdo</p>
			</AdsDashboardPanel>
			<AdsDashboardPanel loading title="Carregando" />
			<AdsDashboardPanel error="Falhou" title="Erro" />
			<AdsDashboardPanel empty={<AdsEmptyState title="Nada por aqui" />} title="Sem dados" />
		</AdsDashboardGrid>
	);
}

describe('dashboard patterns SSR and hydration', () => {
	it('renders on the server with named regions and the accessible trend', () => {
		const html = renderToString(<Dashboard />);
		expect(html).toContain('ads-dashboard-grid-items');
		expect(html).toContain('aria-labelledby');
		expect(html).toContain('Em alta');
		expect(html).toContain('Nada por aqui');
	});

	it('hydrates without warnings, recoverable errors or markup changes', async () => {
		const html = renderToString(<Dashboard />);
		const container = document.createElement('div');
		container.innerHTML = html;
		document.body.appendChild(container);
		const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const onRecoverableError = vi.fn();

		let root!: ReturnType<typeof hydrateRoot>;
		await act(async () => {
			root = hydrateRoot(container, <Dashboard />, { onRecoverableError });
		});

		expect(error).not.toHaveBeenCalled();
		expect(warn).not.toHaveBeenCalled();
		expect(onRecoverableError).not.toHaveBeenCalled();
		expect(container.innerHTML).toBe(html);
		error.mockRestore();
		warn.mockRestore();
		act(() => root.unmount());
		container.remove();
	});

	it('accepts block content in error without invalid markup or hydration warnings', async () => {
		const failure = (
			<ul>
				<li>Serviço indisponível</li>
				<li>Tente novamente em instantes</li>
			</ul>
		);
		const Errors = () => (
			<AdsDashboardGrid>
				<AdsMetricCard error={failure} title="Receita" />
				<AdsDashboardPanel error={failure} title="Vendas" />
			</AdsDashboardGrid>
		);
		const html = renderToString(<Errors />);
		const container = document.createElement('div');
		container.innerHTML = html;
		document.body.appendChild(container);
		expect(container.innerHTML).toBe(html);
		for (const list of container.querySelectorAll('ul')) {
			expect(list.closest('p')).toBeNull();
			expect(list.closest('[role="alert"]')).not.toBeNull();
		}
		const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const onRecoverableError = vi.fn();

		let root!: ReturnType<typeof hydrateRoot>;
		await act(async () => {
			root = hydrateRoot(container, <Errors />, { onRecoverableError });
		});

		expect(error).not.toHaveBeenCalled();
		expect(warn).not.toHaveBeenCalled();
		expect(onRecoverableError).not.toHaveBeenCalled();
		expect(container.querySelectorAll('[role="alert"] li')).toHaveLength(4);
		error.mockRestore();
		warn.mockRestore();
		act(() => root.unmount());
		container.remove();
	});
});
