import assert from 'node:assert/strict';
import test from 'node:test';
import { parseNpmPackOutput } from './npm-pack-output.mjs';

const packed = { filename: 'package-1.0.0.tgz', files: [{ path: 'package.json' }] };

test('normaliza saída array de npm pack', () => {
	assert.deepEqual(parseNpmPackOutput(JSON.stringify([packed])), packed);
});

test('normaliza saída por nome do pacote de npm pack', () => {
	assert.deepEqual(parseNpmPackOutput(JSON.stringify({ '@scope/package': packed })), packed);
});

test('rejeita saída inválida ou ambígua de npm pack', () => {
	assert.throws(() => parseNpmPackOutput('not json'), /JSON válido/);
	assert.throws(() => parseNpmPackOutput('[]'), /recebi 0/);
	assert.throws(() => parseNpmPackOutput(JSON.stringify([packed, packed])), /recebi 2/);
	assert.throws(
		() => parseNpmPackOutput(JSON.stringify({ '@scope/package': { filename: 'x.tgz' } })),
		/arquivos e o nome/,
	);
});
