import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const indexUrl = new URL('../storybook-static/index.json', import.meta.url);
const matrixUrl = new URL('../../../docs/admin-demo-catalog.md', import.meta.url);
const generatedUrl = new URL('../src/api-reference/', import.meta.url);
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
	assert.equal(new Set(names).size, names.length, 'Matriz contém exports duplicados');
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
		const mdx = readFileSync(new URL(name + '.mdx', generatedUrl), 'utf8');
		assert.ok(mdx.includes('# ' + name), 'Documento sem título da API: ' + name);
		assert.ok(mdx.includes('## Propriedades e tipos'), 'Documento sem seção de tipos: ' + name);
		assert.ok(mdx.includes('<Canvas of={ExampleStories.'), 'Documento sem exemplo real: ' + name);
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

test('referência explícita informa defaults verificáveis e APIs genéricas/compostas', () => {
	const button = readFileSync(new URL('AdsButton.mdx', generatedUrl), 'utf8');
	assert.match(button, /isLoading/);
	assert.match(button, /variant/);
	assert.match(button, /primary/);
	assert.match(button, /<table>/, 'Tabela MDX deve gerar sem depender de plugin GFM');
	assert.match(
		button,
		/Ações com variantes, tamanhos, carregamento e bloqueio/,
		'Descrição real do catálogo deve estar presente',
	);
	assert.match(button, /<code>variant<\/code>/);
	assert.match(
		button,
		/<code>'primary'<\/code>/,
		'Default real de variant deve permanecer citado como string',
	);
	const smartTable = readFileSync(new URL('AdsSmartTable.mdx', generatedUrl), 'utf8');
	assert.match(smartTable, /AdsSmartTableProps/);
	const shell = readFileSync(new URL('AdsAdminShell.mdx', generatedUrl), 'utf8');
	assert.match(shell, /AdsAdminShellProps/);
	const icon = readFileSync(new URL('AdsIcon.mdx', generatedUrl), 'utf8');
	assert.match(icon, /AdsIconProps/);
	assert.match(icon, /AdsIconName/);
	const checkbox = readFileSync(new URL('AdsCheckbox.mdx', generatedUrl), 'utf8');
	assert.match(checkbox, /AdsSelectionControlProps/);
	const combobox = readFileSync(new URL('AdsCombobox.mdx', generatedUrl), 'utf8');
	assert.match(combobox, /AdsComboboxProps/);
	assert.match(combobox, /AdsComboboxPopoverProps/);
	assert.match(combobox, /closeOnSelect/);
});

test('fichas não escapam entidades em código inline e usam o exemplo do próprio componente', () => {
	const button = readFileSync(new URL('AdsButton.mdx', generatedUrl), 'utf8');
	assert.match(
		button,
		/ButtonHTMLAttributes<HTMLButtonElement>/,
		'Código inline do MDX é literal: não deve conter &lt;/&gt;',
	);
	assert.match(button, /from '\.\.\/button\.stories'/, 'Exemplo de Button vem de button.stories');
});

test('uniões de props e aliases expõem as propriedades reais', () => {
	const datePicker = readFileSync(new URL('AdsDatePicker.mdx', generatedUrl), 'utf8');
	assert.match(datePicker, /<code>AdsDatePickerRangeProps\.endName<\/code>/);
	assert.match(datePicker, /<code>AdsDatePickerSingleProps\.name<\/code>/);
	const card = readFileSync(new URL('AdsCard.mdx', generatedUrl), 'utf8');
	assert.match(card, /<code>variant<\/code>/, 'AdsCard herda AdsSurfaceProps');
});

test('variantes, estados e acessibilidade são derivados dos tipos públicos', () => {
	const button = readFileSync(new URL('AdsButton.mdx', generatedUrl), 'utf8');
	assert.match(button, /<code>variant<\/code>: <code>'primary'<\/code>, <code>'secondary'<\/code>/);
	assert.match(
		button,
		/<code>size<\/code>: <code>'sm'<\/code>, <code>'md'<\/code>, <code>'lg'<\/code>/,
	);
	assert.match(
		button,
		/Estados controlados por props:<\/strong>|Estados controlados por props:\*\*/,
	);
	assert.match(button, /<code>isLoading<\/code>/);
});
