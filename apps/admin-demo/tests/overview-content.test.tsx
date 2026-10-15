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

	it('exposes a single main heading', () => {
		expect(renderOverview().match(/<h1[\s>]/g)).toHaveLength(1);
	});
});
