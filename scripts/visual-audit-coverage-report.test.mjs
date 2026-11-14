import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { analyzeStateCoverage } from './visual-audit-coverage-report.mjs';

test('estados pendentes, falhas reais e aprovação objetiva não viram revisão humana', () => {
	const root = mkdtempSync(join(tmpdir(), 'ads-state-coverage-'));
	try {
		mkdirSync(join(root, 'states'));
		mkdirSync(join(root, 'screenshots/states'), { recursive: true });
		const plan = (id) => ({
			id, name: 'AdsButton', state: 'hover', action: 'button-hover',
			theme: 'light', width: 390,
		});
		const matrix = {
			profiles: { button: { states: ['default', 'hover'], notApplicable: { open: 'Não abre overlay' }, viewports: [390], checks: ['aria', 'human-visual'] } },
			components: { AdsButton: { profile: 'button', review: 'Pendente' } },
			scenarios: [plan('ok'), plan('missing'), plan('broken')],
		};
		writeFileSync(join(root, 'states/ok.json'), JSON.stringify({
			...plan('ok'), route: '/catalogo/button',
			checks: ['hover-target-visible'], screenshot: 'screenshots/states/ok.png', error: null,
		}));
		writeFileSync(join(root, 'screenshots/states/ok.png'), 'captura teste');
		writeFileSync(join(root, 'states/broken.json'), JSON.stringify({
			...plan('broken'), route: '/catalogo/button', checks: ['hover-target-visible'],
			screenshot: 'screenshots/states/broken.png', error: null,
		}));
		const result = analyzeStateCoverage({
			matrix, entries: [{ name: 'AdsButton', group: 'Básicos', route: '/catalogo/button' }], folder: root,
		});
		assert.equal(result.summary.inventoried, 1);
		assert.equal(result.summary.applicableStates, 2);
		assert.equal(result.summary.notApplicableStates, 1);
		assert.equal(result.summary.automaticPass, 1);
		assert.equal(result.summary.pending, 1);
		assert.equal(result.summary.failed, 1);
		assert.equal(result.summary.humanReviewPending, 1);
		assert.deepEqual(result.results.map((row) => row.status), [
			'verificação objetiva aprovada', 'pendente', 'falha de execução',
		]);
		assert.equal(result.components[0].humanReview, 'Pendente');
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
