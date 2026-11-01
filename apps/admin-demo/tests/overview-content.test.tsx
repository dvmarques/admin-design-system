import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { OverviewContent } from '../app/(admin)/overview-content';
import { overviewActivity, overviewIndicators, overviewProgress } from '../lib/data/overview';

function renderOverview() {
	return renderToString(
		<OverviewContent
			activity={overviewActivity}
			indicators={overviewIndicators}
			progress={overviewProgress}
		/>,
	);
}

describe('OverviewContent', () => {
	it('renders the same markup on repeated renders', () => {
		expect(renderOverview()).toBe(renderOverview());
	});

	it('renders every indicator, progress item and activity from its props', () => {
		const html = renderOverview();

		for (const indicator of overviewIndicators) {
			expect(html).toContain(indicator.label);
			expect(html).toContain(indicator.value);
		}
		for (const item of overviewProgress) {
			expect(html).toContain(`aria-valuenow="${item.value}"`);
			expect(html).toContain(`aria-label="${item.label}"`);
		}
		for (const item of overviewActivity) {
			expect(html).toContain(item.text);
		}
	});

	it('renders the indicators as metric cards with an accessible trend and the panels in a grid', () => {
		const html = renderOverview();

		expect(html).toContain('ads-metric-card');
		expect(html).toContain('Em alta');
		expect(html).toContain('Em queda');
		expect(html).toContain('ads-dashboard-grid');
		expect((html.match(/ads-dashboard-panel"/g) ?? []).length).toBe(2);
		expect(html).toMatch(/<h2[^>]*>Progresso<\/h2>/);
		expect(html).toMatch(/<h2[^>]*>Atividade recente<\/h2>/);
	});

	it('renders a sparkline with a textual alternative and a positive drop for cancellations', () => {
		const html = renderOverview();

		expect((html.match(/class="ads-sparkline /g) ?? []).length).toBe(overviewIndicators.length);
		expect(html).toContain('Evolução de Cancelamentos, últimos 12 meses: 12 pontos');
		const cancellations = overviewIndicators.find((item) => item.id === 'cancellations');
		expect(cancellations).toMatchObject({ trend: 'down', sentiment: 'positive' });
		expect(html).toMatch(/data-sentiment="positive" data-trend="down"/);
	});

	it('exposes a single main heading', () => {
		expect(renderOverview().match(/<h1[\s>]/g)).toHaveLength(1);
	});
});
