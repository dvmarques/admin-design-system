import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const ci = read('.github/workflows/ci.yml');
const metrics = read('.github/workflows/ci-metrics.yml');
const section = (name) => {
	const start = ci.indexOf(`\n${' '.repeat(2)}${name}:`);
	assert.notEqual(start, -1, name);
	const next = ci.slice(start + 1).search(/\n {2}[a-z-]+:\n/);
	return next === -1 ? ci.slice(start) : ci.slice(start, start + 1 + next);
};

test('required check names are unchanged', () => {
	for (const name of [
		'name: Qualidade rápida',
		'name: Artefatos de distribuição',
		'name: ${{ matrix.check }}',
		'name: Fluxos no navegador\n',
		'check: Fluxos no navegador (Chromium 1/2)',
		'check: Fluxos no navegador (Chromium 2/2)',
		'check: Fluxos no navegador (Firefox)',
		'check: Fluxos no navegador (WebKit)',
		'name: Política de develop',
		'name: Validação de release',
	]) {
		assert.ok(ci.includes(name), name);
	}
});

test('quality, develop policy and release validation never depend on the scope decision', () => {
	for (const job of ['quality', 'develop-policy', 'release-check']) {
		assert.doesNotMatch(section(job), /steps\.scope\.outputs/, job);
	}
	assert.match(section('quality'), /ci-scope\.mjs --summary/);
	assert.match(
		section('quality'),
		/npm run format[\s\S]*npm run lint[\s\S]*npm run typecheck[\s\S]*npm run test:node:quiet[\s\S]*npm run test:release[\s\S]*npm run test:ci[\s\S]*npm run test:coverage/,
	);
});

test('required E2E check aggregates all Chromium shards and browsers', () => {
	const e2e = section('e2e');
	const gate = section('chromium-gate');
	assert.match(e2e, /shard: '1\/2'/);
	assert.match(e2e, /shard: '2\/2'/);
	assert.match(e2e, /--shard=\{0\}/);
	assert.match(e2e, /matrix\.shard == '1\/2'/);
	assert.match(e2e, /check: Fluxos no navegador \(Firefox\)/);
	assert.match(e2e, /check: Fluxos no navegador \(WebKit\)/);
	assert.match(gate, /name: Fluxos no navegador\n/);
	assert.match(gate, /needs: e2e/);
	assert.match(gate, /if: always\(\)/);
	assert.match(gate, /MATRIX_RESULT: \$\{\{ needs\.e2e\.result \}\}/);
	assert.match(gate, /\[\[ "\$MATRIX_RESULT" != "success" \]\]/);
	assert.match(gate, /exit 1/);
});

test('quality executes each suite once while publishing both coverage artifacts', () => {
	const quality = section('quality');
	const lines = [
		'npm run test:node:quiet',
		'npm run test:release',
		'npm run test:ci',
		'npm run test:coverage',
		'npm run check:agent-skills',
		'npm run check:generated',
	];
	for (const cmd of lines) assert.equal(quality.split(cmd).length - 1, 1, cmd);
	assert.doesNotMatch(quality, /- run: npm run test:quality\n/);
	assert.match(quality, /NODE_V8_COVERAGE: coverage\/node-ci/);
	for (const name of ['cobertura-vitest', 'cobertura-node-ci'])
		assert.match(quality, new RegExp('name: ' + name));
	assert.match(JSON.parse(read('package.json')).scripts['test:quality'], /test:quiet/);
});

test('scope outputs fail open: only `!= false` conditions reduce work', () => {
	assert.doesNotMatch(ci, /outputs\.(e2e|build_docs|build_demo)\s*==/);
	assert.doesNotMatch(ci, /outputs\.docs_only\s*==\s*'false'/);
	for (const match of ci.matchAll(/outputs\.(e2e|build_docs|build_demo)\s*(\S+)\s*'(\w+)'/g)) {
		assert.deepEqual([match[2], match[3]], ['!=', 'false'], match[0]);
	}
});

test('jobs that read the scope fetch full history and use the shared script', () => {
	for (const job of ['build', 'e2e']) {
		const text = section(job);
		assert.match(text, /fetch-depth: 0/, job);
		assert.match(text, /id: scope\n\s+run: node \.\/scripts\/ci-scope\.mjs/, job);
	}
	assert.doesNotMatch(ci, /ci-changed-paths\.mjs/);
	assert.match(section('quality'), /fetch-depth: 0/);
});

test('every E2E step after the scope step honors both the docs and the E2E decision', () => {
	const text = section('e2e');
	const afterScope = text.slice(text.indexOf('id: scope'));
	const steps = afterScope.split('\n      - ').slice(1);
	assert.ok(steps.length >= 8);
	for (const step of steps) {
		assert.match(
			step,
			/if: steps\.scope\.outputs\.docs_only != 'true' && steps\.scope\.outputs\.e2e != 'false'/,
			step.split('\n')[0],
		);
	}
});

test('package builds and inspection always run in the build job; only app builds are conditional', () => {
	const text = section('build');
	for (const step of [
		'generate --workspace @dvmarques/admin-ds-tokens',
		'check:generated',
		'build --workspace @dvmarques/admin-ds-tokens',
		'build --workspace @dvmarques/admin-ds-components',
		'build --workspace @dvmarques/admin-ds-highlighted-code',
		'build --workspace @dvmarques/admin-ds-admin',
		'inspect:packages',
	]) {
		const line = text.split('\n').findIndex((entry) => entry.includes(step));
		assert.notEqual(line, -1, step);
		assert.equal(
			text.split('\n')[line + 1].trim(),
			"if: steps.scope.outputs.docs_only != 'true'",
			step,
		);
	}
	assert.match(
		text,
		/build --workspace @admin-ds\/docs\n\s+if: steps\.scope\.outputs\.docs_only != 'true' && steps\.scope\.outputs\.build_docs != 'false'/,
	);
	assert.match(
		text,
		/build --workspace @admin-ds\/admin-demo\n\s+if: steps\.scope\.outputs\.docs_only != 'true' && steps\.scope\.outputs\.build_demo != 'false'/,
	);
});

test('skipping E2E is equivalent when the demo is unaffected: Playwright targets only the demo', () => {
	const config = read('playwright.config.ts');
	assert.match(config, /--workspace @admin-ds\/admin-demo/);
	assert.doesNotMatch(config, /@admin-ds\/docs|storybook|6006/i);
	assert.match(config, /127\.0\.0\.1:3000/);
	for (const file of readdirSync(new URL('../e2e/', import.meta.url)).filter((name) =>
		/\.(ts|mjs)$/.test(name),
	)) {
		const text = read(`e2e/${file}`);
		assert.doesNotMatch(text, /apps\/docs|@admin-ds\/docs|storybook|6006/i, file);
		assert.doesNotMatch(text, /https?:\/\/(?!127\.0\.0\.1:3000|localhost:3000)/, file);
	}
});

test('the metrics workflow is manual and read-only', () => {
	assert.match(metrics, /on:\n\s+workflow_dispatch:/);
	assert.doesNotMatch(metrics, /pull_request|push:|schedule:/);
	assert.match(metrics, /permissions:\n\s+actions: read\n\s+contents: read/);
	assert.doesNotMatch(metrics, /secrets\.|contents: write|pull-requests: write/);
	assert.match(metrics, /GITHUB_TOKEN: \$\{\{ github\.token \}\}/);
	assert.match(metrics, /BEFORE_RUNS: \$\{\{ inputs\.before_runs \}\}/);
	assert.doesNotMatch(
		metrics.replace(/env:[\s\S]*?run:/, ''),
		/\$\{\{ inputs\./,
		'inputs must reach the shell only through env',
	);
});

test('no workflow uses pull_request_target', () => {
	for (const file of readdirSync(new URL('../.github/workflows/', import.meta.url))) {
		assert.doesNotMatch(read(`.github/workflows/${file}`), /pull_request_target/, file);
	}
});

test('Pages verifies pull requests in Linux and publishes only develop outside pull requests', () => {
	const pages = read('.github/workflows/pages.yml');
	assert.match(pages, /pull_request:\n\s+branches:\n\s+- develop/);
	assert.match(pages, /types: \[opened, synchronize, reopened, ready_for_review\]/);
	assert.match(
		pages,
		/if: github.event_name != 'pull_request' \|\| github.event.pull_request.draft == false/,
	);
	assert.match(pages, /runs-on: ubuntu-latest/);
	assert.match(pages, /run: npm run test:e2e:pages/);
	assert.match(pages, /fetch-depth: 0/);
	assert.match(pages, /id: scope\n\s+run: node \.\/scripts\/ci-scope\.mjs/);
	assert.match(pages, /cancel-in-progress: \$\{\{ github\.event_name == 'pull_request' \}\}/);
	for (const script of [
		'npm ci --ignore-scripts',
		'npm run build:pages',
		'npm run test:e2e:pages',
	]) {
		const position = pages.indexOf('run: ' + script);
		assert.notEqual(position, -1, script);
		assert.match(pages.slice(position, position + 210), /if: steps\.scope\.outputs\.docs_only != 'true'/);
	}

	const gate = "if: github.ref == 'refs/heads/develop' && github.event_name != 'pull_request'";
	for (const action of ['configure-pages', 'upload-pages-artifact']) {
		const step = pages.split('\n      - ').find((step) => step.includes(`actions/${action}@`));
		assert.ok(step?.includes(gate), `${action} must never run in a PR`);
	}
	const deploy = pages.slice(pages.indexOf('\n  deploy:'));
	assert.ok(deploy.includes(gate));
	assert.match(deploy, /needs: build/);
	assert.match(pages, /group: pages-.*github.event.pull_request.number/);
});

test('workflows usam SHAs, digest Playwright e mínimo privilégio', async () => {
	const { verifyWorkflowSupplyChain } = await import('./verify-workflow-supply-chain.mjs');
	assert.ok(verifyWorkflowSupplyChain() >= 6);
});
