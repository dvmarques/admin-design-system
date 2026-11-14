import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Verifica o resultado publicado do build do Storybook (storybook-static/index.json).
// Não roda em `test:node`: exige `npm run build --workspace @admin-ds/docs` antes (job de build da CI e `npm run validate`).
const indexUrl = new URL('../storybook-static/index.json', import.meta.url);
const matrixUrl = new URL('../../../docs/admin-demo-catalog.md', import.meta.url);
const tick = String.fromCharCode(96);

function entries() {
	let index;
	try {
		index = JSON.parse(readFileSync(indexUrl, 'utf8'));
	} catch (cause) {
		throw new Error(
			'Build do Storybook ausente. Execute npm run build --workspace @admin-ds/docs antes deste teste.',
			{ cause },
		);
	}
	assert.ok(
		index.entries && typeof index.entries === 'object',
		'index.json precisa listar páginas publicadas',
	);
	return Object.values(index.entries);
}

function exportsFromMatrix() {
	return readFileSync(matrixUrl, 'utf8')
		.split('\n')
		.filter(
			(line) =>
				line.startsWith('| ' + tick + 'Ads') ||
				line.startsWith('| ' + tick + 'ThemeToggle') ||
				line.startsWith('| ' + tick + 'StyleFixture'),
		)
		.map((line) => line.split('|')[1].trim().replaceAll(tick, ''));
}

test('build publica uma referência navegável para todo export da matriz #151', () => {
	const published = entries();
	const names = exportsFromMatrix();
	assert.ok(names.length >= 70, 'Matriz #151 parece incompleta');
	const docs = published.filter((entry) => entry.type === 'docs');
	const stories = published.filter((entry) => entry.type === 'story');
	assert.ok(stories.length >= 40, 'Exemplos executáveis pré-existentes ausentes');
	const apiDocs = docs.filter((entry) => entry.title.startsWith('API/'));
	assert.equal(
		apiDocs.length,
		names.length,
		'Páginas geradas da API devem cobrir a matriz sem duplicações',
	);
	for (const name of names) {
		const page = apiDocs.find((entry) => entry.title === 'API/' + name);
		assert.ok(page, 'Falta referência pública para ' + name);
		assert.ok(page.id && page.importPath, 'Referência sem navegação: ' + name);
		assert.ok(
			page.importPath.includes(name + '.mdx'),
			'Referência não foi indexada do MDX de ' + name,
		);
	}
});

test('manager e iframe publicados incluem somente CSP meta suportada e política de referrer', () => {
	const expectedCsp = "object-src 'none'; base-uri 'self'; form-action 'self'";
	for (const file of ['index.html', 'iframe.html']) {
		const html = readFileSync(new URL('../storybook-static/' + file, import.meta.url), 'utf8');
		const cspTag = html.match(/<meta\b[^>]*http-equiv="Content-Security-Policy"[^>]*>/i)?.[0];
		assert.ok(cspTag, file + ': meta CSP ausente');
		assert.equal(
			cspTag.match(/content="([^"]*)"/)?.[1],
			expectedCsp,
			file + ': CSP parcial divergente',
		);
		assert.doesNotMatch(
			cspTag,
			/frame-ancestors|unsafe-inline|unsafe-eval|script-src/,
			file + ': não declarar controles não implementados',
		);
		assert.ok(
			html.includes('name="referrer" content="strict-origin-when-cross-origin"'),
			file + ': referrer ausente',
		);
		const cspIndex = html.indexOf(cspTag);
		// O Storybook injeta scripts próprios antes do head customizado do iframe; o meta só vale para o
		// que vem depois. No manager exigimos que preceda todo script; em ambos, que nenhum elemento
		// coberto pelas diretivas (base com href, object, embed, form) apareça antes dele.
		if (file === 'index.html') {
			const firstScript = html.search(/<script\b/i);
			assert.ok(
				firstScript === -1 || cspIndex < firstScript,
				file + ': meta CSP deve preceder o primeiro script',
			);
		}
		assert.doesNotMatch(
			html.slice(0, cspIndex),
			/<(base\b[^>]*\bhref=|object\b|embed\b|form\b)/i,
			file + ': elemento coberto pela CSP aparece antes do meta',
		);
	}
});

test('Autodocs original e novas páginas não possuem IDs duplicados', () => {
	const published = entries();
	assert.equal(new Set(published.map((item) => item.id)).size, published.length);
	for (const entry of published.filter(
		(item) => item.type === 'docs' && !item.title.startsWith('API/'),
	)) {
		assert.ok(
			published.some((s) => s.type === 'story' && s.title === entry.title),
			'Autodocs perdeu as stories da família ' + entry.title,
		);
	}
});
