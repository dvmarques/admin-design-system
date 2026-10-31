import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
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
const packages = [
	'@dvmarques/admin-ds-tokens',
	'@dvmarques/admin-ds-components',
	'@dvmarques/admin-ds-highlighted-code',
	'@dvmarques/admin-ds-admin',
];

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
		'highlighted-code-public',
		'masked-input-public',
		'tokens-public',
	]);
	for (const [name, scenario] of Object.entries(scenarios)) {
		assert.ok(Number.isInteger(scenario.bytes) && Number.isInteger(scenario.gzipBytes), name);
		assert.ok(scenario.gzipBytes < scenario.bytes, `gzip menor que bytes: ${name}`);
		const source = readFileSync(new URL(`../${scenario.entry}`, import.meta.url), 'utf8');
		for (const [, specifier] of source.matchAll(/from '([^']+)'/g)) {
			assert.match(
				specifier,
				/^@dvmarques\/admin-ds-(tokens|components|components\/masked-input|admin|highlighted-code)$/,
				`${name}: ${specifier}`,
			);
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

const distributionReady = packages.every((name) =>
	existsSync(new URL(`../packages/${name.split('/').at(-1)}/dist`, import.meta.url)),
);

function inspectWith(change) {
	const directory = mkdtempSync(join(tmpdir(), 'budget-'));
	try {
		for (const file of ['bundle-baseline', 'browser-budget', 'scenario-budget']) {
			const content = readJson(`docs/${file}.json`);
			if (change.file === file) change.apply(content);
			writeFileSync(join(directory, `${file}.json`), JSON.stringify(content));
		}
		return spawnSync(process.execPath, ['./scripts/inspect-packages.mjs'], {
			cwd: fileURLToPath(new URL('..', import.meta.url)),
			env: { ...process.env, INSPECT_BUDGET_DIR: directory },
			encoding: 'utf8',
		});
	} finally {
		rmSync(directory, { recursive: true, force: true });
	}
}

const cases = [
	[
		'bundle-baseline',
		'@dvmarques/admin-ds-tokens',
		'distribuição',
		(c) => (c['@dvmarques/admin-ds-tokens'] = 1),
	],
	...['bytes', 'gzipBytes'].map((key) => [
		'browser-budget',
		'@dvmarques/admin-ds-components',
		key === 'bytes' ? 'JS/CSS publicados' : 'JS/CSS gzip',
		(c) => (c['@dvmarques/admin-ds-components'][key] = 1),
	]),
	...['tokens-public', 'components-public', 'admin-public'].flatMap((scenario) =>
		[
			['bytes', 'cenário minificado'],
			['gzipBytes', 'cenário gzip'],
			['cssBytes', 'cenário CSS minificado'],
			['cssGzipBytes', 'cenário CSS gzip'],
		].map(([key, metric]) => ['scenario-budget', scenario, metric, (c) => (c[scenario][key] = 1)]),
	),
];

for (const [file, subject, metric, apply] of cases) {
	test(
		`inspect:packages falha quando ${subject} excede ${metric}`,
		{ skip: !distributionReady && 'execute npm run build antes' },
		() => {
			const result = inspectWith({ file, apply });
			assert.notEqual(result.status, 0);
			assert.match(result.stderr, new RegExp(`${subject} / ${metric}[^\\n]* excedeu o orçamento`));
		},
	);
}

test(
	'inspect:packages passa com os orçamentos versionados',
	{ skip: !distributionReady && 'execute npm run build antes' },
	() => {
		const result = inspectWith({ file: '', apply() {} });
		assert.equal(result.status, 0, result.stderr);
	},
);
