import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const matrixUrl = new URL('../../../docs/admin-demo-catalog.md', import.meta.url);
const generatedUrl = new URL('../src/api-reference/', import.meta.url);
const generatorPath = fileURLToPath(
	new URL('../../../scripts/generate-storybook-api.mjs', import.meta.url),
);
const tick = String.fromCharCode(96);

// As páginas MDX são geradas e ignoradas pelo Git: gera-as aqui para o teste não depender de build prévio.
before(() => {
	execFileSync(process.execPath, [generatorPath], { stdio: 'pipe' });
});

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

test('gerador cria uma ficha de API completa para todo export da matriz #151', () => {
	const names = exportsFromMatrix();
	assert.ok(names.length >= 70, 'Matriz #151 parece incompleta');
	assert.equal(new Set(names).size, names.length, 'Matriz contém exports duplicados');
	for (const name of names) {
		const mdx = readFileSync(new URL(name + '.mdx', generatedUrl), 'utf8');
		assert.ok(mdx.includes('# ' + name), 'Documento sem título da API: ' + name);
		assert.ok(mdx.includes('## Propriedades e tipos'), 'Documento sem seção de tipos: ' + name);
		assert.ok(mdx.includes('<Canvas of={ExampleStories.'), 'Documento sem exemplo real: ' + name);
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

test('partes compostas usam a story que as exercita, não a primeira exportada', () => {
	const exampleOf = (name) =>
		readFileSync(new URL(name + '.mdx', generatedUrl), 'utf8').match(
			/Canvas of=\{ExampleStories\.(\w+)\}/,
		)?.[1];
	for (const name of ['AdsTabs', 'AdsTabsList', 'AdsTabsTrigger', 'AdsTabsPanel'])
		assert.equal(exampleOf(name), 'Tabs', name + ' deve usar a story Tabs');
	for (const name of [
		'AdsAccordion',
		'AdsAccordionItem',
		'AdsAccordionHeader',
		'AdsAccordionTrigger',
		'AdsAccordionPanel',
	])
		assert.equal(exampleOf(name), 'AccordionSingle', name + ' deve usar a story AccordionSingle');
});

test('props herdadas de interfaces do projeto entram na tabela', () => {
	const input = readFileSync(new URL('AdsInput.mdx', generatedUrl), 'utf8');
	assert.match(input, /<code>validationState<\/code>/, 'AdsInput herda AdsFormControlBase');
	assert.match(input, /herdada de AdsFormControlBase/);
	const accordion = readFileSync(new URL('AdsAccordion.mdx', generatedUrl), 'utf8');
	assert.match(accordion, /unmountOnCollapse/, 'raiz do Accordion herda AdsAccordionBaseProps');
	const datePicker = readFileSync(new URL('AdsDatePicker.mdx', generatedUrl), 'utf8');
	const baseRows = datePicker.match(/<code>AdsDatePickerBaseProps\.disabled<\/code>/g) || [];
	const inheritedCopies = datePicker.match(/herdada de AdsDatePickerBaseProps/g) || [];
	assert.equal(baseRows.length, 1, 'props da base listadas uma vez');
	assert.equal(inheritedCopies.length, 0, 'base listada como contrato não é repetida nos filhos');
});
