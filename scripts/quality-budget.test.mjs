import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';
import { checkBudget } from './quality-budget.mjs';

test('aceita um valor igual ao limite', () => {
	assert.doesNotThrow(() => checkBudget('components', 'gzip', 100, 100));
});

test('identifica pacote, métrica e valores ao ultrapassar limite', () => {
	assert.throws(
		() => checkBudget('admin', 'cenário gzip', 101, 100),
		/admin \/ cenário gzip excedeu o orçamento: 101 > 100/,
	);
});

test('rejeita orçamentos inválidos', () => {
	assert.throws(() => checkBudget('tokens', 'distribuição', 1, -1), /Orçamento inválido/);
});

const readJson = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));
const packages = ['@admin-ds/tokens', '@admin-ds/components', '@admin-ds/admin'];

test('todo pacote tem orçamento de distribuição e de navegador válidos', () => {
	const baseline = readJson('docs/bundle-baseline.json');
	const browser = readJson('docs/browser-budget.json');
	for (const name of packages) {
		assert.ok(Number.isInteger(baseline[name]), `baseline de distribuição: ${name}`);
		assert.ok(Number.isInteger(browser[name]?.bytes), `bytes de navegador: ${name}`);
		assert.ok(Number.isInteger(browser[name]?.gzipBytes), `gzip de navegador: ${name}`);
		assert.ok(browser[name].gzipBytes < browser[name].bytes, `gzip menor que bytes: ${name}`);
		assert.ok(browser[name].bytes < baseline[name], `navegador exclui maps e d.ts: ${name}`);
	}
});

test('cenários públicos usam somente exports públicos e têm limites coerentes', () => {
	const scenarios = readJson('docs/scenario-budget.json');
	assert.deepEqual(Object.keys(scenarios).sort(), [
		'admin-public',
		'components-public',
		'tokens-public',
	]);
	for (const [name, scenario] of Object.entries(scenarios)) {
		assert.ok(Number.isInteger(scenario.bytes) && Number.isInteger(scenario.gzipBytes), name);
		assert.ok(scenario.gzipBytes < scenario.bytes, `gzip menor que bytes: ${name}`);
		const source = readFileSync(new URL(`../${scenario.entry}`, import.meta.url), 'utf8');
		for (const [, specifier] of source.matchAll(/from '([^']+)'/g)) {
			assert.match(specifier, /^@admin-ds\/(tokens|components|admin)$/, `${name}: ${specifier}`);
		}
	}
});

test('a CI publica cobertura Node e Vitest como artefatos', () => {
	const workflow = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
	for (const artifact of ['cobertura-node-ci', 'cobertura-vitest']) {
		assert.match(workflow, new RegExp(`name: ${artifact}`));
	}
	assert.match(workflow, /npm run test:coverage/);
});
