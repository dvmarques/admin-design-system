import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const indexUrl = new URL('../storybook-static/index.json', import.meta.url);

function generatedEntries() {
	let index;
	try {
		index = JSON.parse(readFileSync(indexUrl, 'utf8'));
	} catch (error) {
		throw new Error(
			'Build do Storybook ausente ou inválido. Execute npm run build --workspace @admin-ds/docs antes deste teste.',
			{ cause: error },
		);
	}
	assert.ok(index.entries && typeof index.entries === 'object', 'index.json deve listar as entradas publicadas');
	return Object.values(index.entries);
}

test('Storybook publica páginas Docs e histórias executáveis no build gerado', () => {
	const entries = generatedEntries();
	const docs = entries.filter((entry) => entry.type === 'docs');
	const stories = entries.filter((entry) => entry.type === 'story');
	assert.ok(docs.length >= 20, `Esperadas páginas Docs; encontradas ${docs.length}`);
	assert.ok(stories.length >= 40, `Esperadas histórias executáveis; encontradas ${stories.length}`);
	for (const title of ['Primitives/Button', 'Forms/Form controls', 'Layout/SmartTable']) {
		assert.ok(
			docs.some((entry) => entry.title === title),
			`A referência ${title} não foi gerada pelo Storybook`,
		);
		assert.ok(
			stories.some((entry) => entry.title === title),
			`Exemplos executáveis ausentes para ${title}`,
		);
	}
});

test('Docs e stories compartilham a navegação publicada sem identificadores duplicados', () => {
	const entries = generatedEntries();
	assert.equal(
		new Set(entries.map((entry) => entry.id)).size,
		entries.length,
		'IDs de navegação publicados não podem se repetir',
	);
	for (const entry of entries.filter((entry) => entry.type === 'docs')) {
		assert.ok(entry.id && entry.title && entry.importPath, 'Página Docs sem navegação/importPath');
		assert.ok(
			entries.some((story) => story.type === 'story' && story.title === entry.title),
			`Referência sem história funcional: ${entry.title}`,
		);
	}
});
