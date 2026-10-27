import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import test from 'node:test';

const root = fileURLToPath(new URL('../../../', import.meta.url));

test('components-public não inclui Shiki', async () => {
	const result = await build({
		entryPoints: [resolve(root, 'scripts/scenarios/components.mjs')],
		bundle: true,
		minify: true,
		write: false,
		platform: 'browser',
		format: 'esm',
		external: ['react', 'react-dom', 'react/*', 'react-dom/*'],
		logLevel: 'silent',
	});
	const bundle = Buffer.concat(result.outputFiles.map((file) => file.contents)).toString('utf8');
	assert.equal(bundle.includes('shiki'), false);
	assert.equal(bundle.includes('@shikijs'), false);
});

test('highlighted-code-public inclui Shiki apenas no cenário opcional', async () => {
	const result = await build({
		entryPoints: [resolve(root, 'scripts/scenarios/highlighted-code.mjs')],
		bundle: true,
		minify: true,
		write: false,
		platform: 'browser',
		format: 'esm',
		external: ['react', 'react-dom', 'react/*', 'react-dom/*'],
		logLevel: 'silent',
	});
	const bundle = Buffer.concat(result.outputFiles.map((file) => file.contents)).toString('utf8');
	assert.ok(bundle.length > 1_000_000);
	assert.ok(bundle.includes('shiki'));
});

test('dist de components não referencia highlighted-code', async () => {
	const index = await readFile(resolve(root, 'packages/components/dist/index.js'), 'utf8');
	assert.equal(index.includes('highlighted-code'), false);
	assert.equal(index.includes('shiki'), false);
});
