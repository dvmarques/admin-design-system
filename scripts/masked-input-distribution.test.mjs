import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { build } from 'esbuild';

const root = fileURLToPath(new URL('..', import.meta.url));
const distReady = existsSync(resolve(root, 'packages/components/dist/masked-input.js'));

async function bundle(name) {
	const result = await build({
		entryPoints: [resolve(root, `scripts/scenarios/${name}.mjs`)],
		bundle: true,
		minify: true,
		write: false,
		platform: 'browser',
		format: 'esm',
		external: ['react', 'react-dom', 'react/*', 'react-dom/*'],
		logLevel: 'silent',
	});
	return Buffer.concat(result.outputFiles.map((file) => file.contents)).toString('utf8');
}

const manifest = JSON.parse(
	readFileSync(resolve(root, 'packages/components/package.json'), 'utf8'),
);

test('react-imask é peer opcional e não é dependência de runtime do pacote', () => {
	assert.ok(manifest.peerDependencies['react-imask']);
	assert.equal(manifest.peerDependenciesMeta['react-imask'].optional, true);
	assert.equal(manifest.dependencies?.['react-imask'], undefined);
	assert.equal(manifest.optionalDependencies?.['react-imask'], undefined);
});

test('o subpath ./masked-input é público e aponta para o dist', () => {
	assert.deepEqual(manifest.exports['./masked-input'], {
		types: './dist/masked-input.d.ts',
		import: './dist/masked-input.js',
	});
});

test(
	'o entrypoint raiz e o cenário components-public não incluem a máscara',
	{ skip: !distReady },
	async () => {
		const index = readFileSync(resolve(root, 'packages/components/dist/index.js'), 'utf8');
		assert.equal(index.includes('masked-input'), false);
		assert.equal(index.includes('imask'), false);
		const output = await bundle('components');
		assert.equal(output.includes('imask'), false);
		assert.equal(output.includes('IMask'), false);
		assert.equal(output.includes('AdsMaskedInput'), false);
	},
);

test(
	'o subpath inclui o motor de máscara apenas no cenário opcional',
	{ skip: !distReady },
	async () => {
		const output = await bundle('masked-input');
		assert.ok(output.includes('ads-masked-input'));
		assert.ok(output.length > 40_000);
	},
);

test(
	'o subpath preserva a diretiva de cliente e não importa caminhos internos',
	{ skip: !distReady },
	() => {
		const source = readFileSync(resolve(root, 'packages/components/dist/masked-input.js'), 'utf8');
		assert.match(source, /^'use client'/);
		for (const [, specifier] of source.matchAll(/from '([^']+)'/g)) {
			assert.match(specifier, /^(\.\/[a-z-]+\.js|react|react-imask)$/, specifier);
		}
		const types = readFileSync(resolve(root, 'packages/components/dist/masked-input.d.ts'), 'utf8');
		assert.doesNotMatch(
			types,
			/from ['"](react-)?imask/,
			'os tipos públicos não dependem do peer opcional',
		);
	},
);
