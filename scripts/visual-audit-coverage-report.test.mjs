import { Buffer } from 'node:buffer';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import {
	analyzeStateCoverage,
	buildStateCoverageSection,
	STATE_COVERAGE_SECTION_HEADING,
	upsertStateCoverageSection,
} from './visual-audit-coverage-report.mjs';

test('teardown idempotente mantém uma única seção de cobertura em report.md', () => {
	const first = buildStateCoverageSection({
		planned: 22,
		executed: 22,
		automaticPass: 20,
		failed: 2,
		pending: 0,
	});
	const updated = buildStateCoverageSection({
		planned: 22,
		executed: 22,
		automaticPass: 22,
		failed: 0,
		pending: 0,
	});
	const base = '# Relatório\n\nCorpo inicial.\n';
	const once = upsertStateCoverageSection(base, first);
	const twice = upsertStateCoverageSection(once, updated);
	assert.equal((twice.match(new RegExp(STATE_COVERAGE_SECTION_HEADING, 'g')) ?? []).length, 1);
	assert.match(twice, /aprovação objetiva: 22/);
	assert.doesNotMatch(twice, /aprovação objetiva: 20/);
});

test('estados pendentes, falhas reais e aprovação objetiva não viram revisão humana', () => {
	const root = mkdtempSync(join(tmpdir(), 'ads-state-coverage-'));
	try {
		mkdirSync(join(root, 'states'));
		mkdirSync(join(root, 'screenshots/states'), { recursive: true });
		const png = Buffer.from(
			'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2VOFkAAAAASUVORK5CYII=',
			'base64',
		);
		const plan = (id) => ({
			id,
			name: 'AdsButton',
			state: 'hover',
			action: 'button-hover',
			theme: 'light',
			width: 390,
		});
		const matrix = {
			profiles: {
				button: {
					states: ['default', 'hover'],
					notApplicable: { open: 'Não abre overlay' },
					viewports: [390],
					checks: ['aria', 'human-visual'],
				},
			},
			components: { AdsButton: { profile: 'button', review: 'Pendente' } },
			scenarios: [
				plan('ok'),
				plan('missing'),
				plan('broken'),
				plan('wrong-action'),
				plan('invalid-png'),
			],
		};
		writeFileSync(
			join(root, 'states/ok.json'),
			JSON.stringify({
				...plan('ok'),
				route: '/catalogo/button',
				checks: ['hover-target-visible'],
				screenshot: 'screenshots/states/ok-light-390.png',
				error: null,
			}),
		);
		writeFileSync(join(root, 'screenshots/states/ok-light-390.png'), png);
		writeFileSync(
			join(root, 'states/broken.json'),
			JSON.stringify({
				...plan('broken'),
				route: '/catalogo/button',
				checks: ['hover-target-visible'],
				screenshot: 'screenshots/states/broken-light-390.png',
				error: null,
			}),
		);
		writeFileSync(
			join(root, 'states/wrong-action.json'),
			JSON.stringify({
				...plan('wrong-action'),
				action: 'button-focus',
				route: '/catalogo/button',
				checks: ['hover-background-changed'],
				screenshot: 'screenshots/states/wrong-action-light-390.png',
				error: null,
			}),
		);
		writeFileSync(join(root, 'screenshots/states/wrong-action-light-390.png'), png);
		writeFileSync(
			join(root, 'states/invalid-png.json'),
			JSON.stringify({
				...plan('invalid-png'),
				route: '/catalogo/button',
				checks: ['hover-background-changed'],
				screenshot: 'screenshots/states/invalid-png-light-390.png',
				error: null,
			}),
		);
		writeFileSync(
			join(root, 'screenshots/states/invalid-png-light-390.png'),
			'texto não é uma imagem',
		);
		const result = analyzeStateCoverage({
			matrix,
			entries: [{ name: 'AdsButton', group: 'Básicos', route: '/catalogo/button' }],
			folder: root,
		});
		assert.equal(result.summary.inventoried, 1);
		assert.equal(result.summary.applicableStates, 2);
		assert.equal(result.summary.notApplicableStates, 1);
		assert.equal(result.summary.automaticPass, 1);
		assert.equal(result.summary.pending, 1);
		assert.equal(result.summary.failed, 3);
		assert.equal(result.summary.humanReviewPending, 1);
		assert.deepEqual(
			result.results.map((row) => row.status),
			[
				'verificação objetiva aprovada',
				'pendente',
				'falha de execução',
				'falha de execução',
				'falha de execução',
			],
		);
		assert.equal(result.components[0].humanReview, 'Pendente');
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
