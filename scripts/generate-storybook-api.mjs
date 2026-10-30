// Geração determinística da referência de API; usa a matriz #151 e os tipos fonte.
import {
	readFileSync,
	existsSync,
	mkdirSync,
	readdirSync,
	unlinkSync,
	writeFileSync,
} from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'apps/docs/src/api-reference');
const bt = String.fromCharCode(96);
const read = (p) => readFileSync(join(root, p), 'utf8');
const parse = (p) =>
	ts.createSourceFile(p, read(p), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const excluded = new Set([
	'fixtureVariants',
	'getAdsPaginationItems',
	'getAdsSmartTableCsv',
	'useAdsAdminShell',
]);
const optionalExcluded = new Set([
	'ADS_HIGHLIGHTED_CODE_LANGUAGES',
	'languageLabel',
	'normalizeHighlightedLanguage',
	'registerHighlightedLanguageLoader',
]);
function exportsOf(path) {
	const file = parse(path),
		result = [];
	for (const node of file.statements) {
		if (
			ts.isExportDeclaration(node) &&
			!node.isTypeOnly &&
			node.exportClause &&
			ts.isNamedExports(node.exportClause)
		)
			for (const e of node.exportClause.elements) if (!e.isTypeOnly) result.push(e.name.text);
		if (
			ts.isVariableStatement(node) &&
			node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
		)
			for (const e of node.declarationList.declarations)
				if (ts.isIdentifier(e.name)) result.push(e.name.text);
	}
	return result;
}
const expected = [
	...exportsOf('packages/components/src/index.ts'),
	...exportsOf('packages/admin/src/index.ts'),
	...exportsOf('packages/highlighted-code/src/index.ts').filter((n) => !optionalExcluded.has(n)),
	...exportsOf('packages/components/src/masked-input.tsx'),
].filter((n) => !excluded.has(n));
const matrix = read('docs/admin-demo-catalog.md');
const notes = JSON.parse(read('apps/docs/api-reference-notes.json'));

const entries = matrix
	.split('\n')
	.filter(
		(l) =>
			l.startsWith('| ' + bt + 'Ads') ||
			l.startsWith('| ' + bt + 'ThemeToggle') ||
			l.startsWith('| ' + bt + 'StyleFixture'),
	)
	.map((l) => {
		const p = l.split('|').slice(1);
		return {
			name: p[0].trim().replaceAll(bt, ''),
			group: p[1].trim(),
			route: p[2].trim().replaceAll(bt, ''),
			stories: [...p[3].matchAll(/([\w-]+\.stories\.tsx)/g)].map((m) => m[1]),
		};
	});
const names = entries.map((e) => e.name);
if (new Set(names).size !== names.length) throw Error('Export duplicado na matriz');
const missing = expected.filter((n) => !names.includes(n)),
	extra = names.filter((n) => !expected.includes(n));
if (missing.length || extra.length)
	throw Error(
		'Matriz #151 divergente: ausentes=' + missing.join(',') + '; extras=' + extra.join(','),
	);
const catalog = parse('apps/admin-demo/app/catalogo/catalog-data.ts');
const descriptions = new Map();
for (const node of catalog.statements) {
	if (!ts.isVariableStatement(node)) continue;
	for (const d of node.declarationList.declarations) {
		if (!ts.isIdentifier(d.name) || d.name.text !== 'catalogEntries' || !d.initializer) continue;
		const initial = ts.isAsExpression(d.initializer) ? d.initializer.expression : d.initializer;
		if (!ts.isArrayLiteralExpression(initial))
			throw Error('catalogEntries deve ser array estático');
		for (const item of initial.elements) {
			if (!ts.isObjectLiteralExpression(item)) continue;
			const value = (name) => {
				const p = item.properties.find(
					(x) => ts.isPropertyAssignment(x) && x.name.getText(catalog) === name,
				);
				return p && ts.isStringLiteral(p.initializer) ? p.initializer.text : '';
			};
			if (value('name')) descriptions.set(value('name'), value('description'));
		}
	}
}
if (descriptions.size !== entries.length)
	throw Error(
		'Descrição ausente no catálogo: ' +
			entries
				.filter((e) => !descriptions.has(e.name))
				.map((e) => e.name)
				.join(','),
	);
const modules = new Map();
for (const index of [
	'packages/components/src/index.ts',
	'packages/admin/src/index.ts',
	'packages/highlighted-code/src/index.ts',
]) {
	const file = parse(index);
	for (const node of file.statements) {
		if (
			!ts.isExportDeclaration(node) ||
			node.isTypeOnly ||
			!node.moduleSpecifier ||
			!node.exportClause ||
			!ts.isNamedExports(node.exportClause)
		)
			continue;
		const base = resolve(
			dirname(join(root, index)),
			node.moduleSpecifier.text.replace(/\.js$/, ''),
		);
		const path = [base + '.tsx', base + '.ts'].find(existsSync);
		if (path)
			for (const e of node.exportClause.elements) if (!e.isTypeOnly) modules.set(e.name.text, path);
	}
}
modules.set('AdsMaskedInput', join(root, 'packages/components/src/masked-input.tsx'));
const typeOverrides = {
	AdsIcon: {
		path: 'packages/components/src/icons/types.ts',
		types: ['AdsIconProps'],
		defaults: 'packages/components/src/icons/icon.tsx',
	},
	AdsCombobox: {
		path: 'packages/components/src/combobox-types.ts',
		types: ['AdsComboboxProps', 'AdsComboboxPopoverProps'],
		defaults: 'packages/components/src/combobox.tsx',
	},
	AdsCard: {
		types: ['AdsSurfaceProps'],
		typeSources: { AdsSurfaceProps: 'packages/components/src/surface.tsx' },
	},
	AdsDatePicker: {
		types: ['AdsDatePickerBaseProps', 'AdsDatePickerSingleProps', 'AdsDatePickerRangeProps'],
	},
	AdsCheckbox: { types: ['AdsSelectionControlProps'] },
	AdsRadio: { types: ['AdsSelectionControlProps'] },
	AdsSwitch: { types: ['AdsSelectionControlProps'] },
	AdsDropdown: {
		types: [
			'AdsDropdownProps',
			'AdsDropdownTriggerProps',
			'AdsDropdownContentProps',
			'AdsDropdownItemProps',
		],
	},
	AdsAccordion: {
		types: [
			'AdsAccordionProps',
			'AdsAccordionSingleProps',
			'AdsAccordionMultipleProps',
			'AdsAccordionItemProps',
			'AdsAccordionHeaderProps',
			'AdsAccordionTriggerProps',
			'AdsAccordionPanelProps',
		],
	},
	AdsSmartTable: {
		types: [
			'AdsSmartTableProps',
			'AdsSmartTableColumn',
			'AdsSmartTableSort',
			'AdsSmartTableLabels',
		],
	},
	AdsAdminShell: {
		types: [
			'AdsAdminShellProps',
			'AdsAdminShellHeaderProps',
			'AdsAdminShellBodyProps',
			'AdsAdminShellMainProps',
			'AdsAdminShellSidebarProps',
			'AdsAdminShellNavigationTriggerProps',
			'AdsAdminShellSidebarToggleProps',
			'AdsAdminShellNavigationProps',
			'AdsAdminShellNavigationSectionProps',
			'AdsAdminShellNavigationGroupProps',
			'AdsAdminShellNavigationItemProps',
		],
		typeSources: {
			AdsAdminShellSidebarProps: 'packages/admin/src/admin-shell-navigation.tsx',
			AdsAdminShellNavigationTriggerProps: 'packages/admin/src/admin-shell-navigation.tsx',
			AdsAdminShellSidebarToggleProps: 'packages/admin/src/admin-shell-navigation.tsx',
			AdsAdminShellNavigationProps: 'packages/admin/src/sidebar-navigation.tsx',
			AdsAdminShellNavigationSectionProps: 'packages/admin/src/sidebar-navigation.tsx',
			AdsAdminShellNavigationGroupProps: 'packages/admin/src/sidebar-navigation.tsx',
			AdsAdminShellNavigationItemProps: 'packages/admin/src/sidebar-navigation.tsx',
		},
	},
};

// Props declaradas e herdadas de interfaces do projeto; `Omit<Base, 'a' | 'b'>` descarta as chaves omitidas.
function membersOf(decl, sf, seen = new Set(), omitted = new Set(), visiting = new Set()) {
	if (visiting.has(decl)) return [];
	visiting.add(decl);
	const out = [];
	for (const p of decl.members.filter(ts.isPropertySignature)) {
		const key = p.name.getText(sf).replaceAll("'", '').replaceAll('"', '');
		if (omitted.has(key) || seen.has(key)) continue;
		seen.add(key);
		out.push({ p, sf, key, owner: decl.name.text });
	}
	for (const clause of decl.heritageClauses || []) {
		for (const ref of clause.types) {
			let target = ref.expression.getText(sf);
			let skip = new Set(omitted);
			if (
				target === 'Omit' &&
				ref.typeArguments?.length === 2 &&
				ts.isTypeReferenceNode(ref.typeArguments[0])
			) {
				target = ref.typeArguments[0].typeName.getText(sf);
				for (const m of ref.typeArguments[1].getText(sf).matchAll(/'([^']+)'/g)) skip.add(m[1]);
			}
			const local = sf.statements.find(
				(n) => ts.isInterfaceDeclaration(n) && n.name.text === target,
			);
			const base = local ? { sf, decl: local } : interfaceIndex.get(target);
			if (base) out.push(...membersOf(base.decl, base.sf, seen, skip, visiting));
		}
	}
	return out;
}

function typeInfo(name) {
	const override = typeOverrides[name];
	const path = override?.path ? join(root, override.path) : modules.get(name);
	if (!path) throw Error('Sem módulo público para ' + name);
	const code = readFileSync(path, 'utf8');
	const file = ts.createSourceFile(path, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
	const typeNames = override?.types || [name + 'Props'];
	const props = [],
		heritage = [];
	for (const typeName of typeNames) {
		const source = override?.typeSources?.[typeName];
		const typePath = source ? join(root, source) : path;
		const typeFile = source
			? ts.createSourceFile(
					typePath,
					readFileSync(typePath, 'utf8'),
					ts.ScriptTarget.Latest,
					true,
					ts.ScriptKind.TSX,
				)
			: file;
		const decl = typeFile.statements.find(
			(n) =>
				(ts.isInterfaceDeclaration(n) || ts.isTypeAliasDeclaration(n)) && n.name.text === typeName,
		);
		if (!decl) throw Error('Contrato de props ausente: ' + typeName + ' em ' + typePath);
		if (ts.isInterfaceDeclaration(decl)) {
			const inherited = (decl.heritageClauses || []).map((n) => n.getText(typeFile)).join('; ');
			if (inherited) heritage.push(typeName + ': ' + inherited);
			for (const { p, sf, key, owner } of membersOf(decl, typeFile)) {
				// Base já listada como contrato próprio: não repete suas props em cada filho.
				if (owner !== typeName && typeNames.includes(owner)) continue;
				const own = ts
					.getJSDocCommentsAndTags(p)
					.map((j) => (typeof j.comment === 'string' ? j.comment : ''))
					.filter(Boolean)
					.join(' ');
				props.push({
					name: typeNames.length > 1 ? typeName + '.' + key : key,
					sourceName: key,
					owner: typeName,
					type: p.type?.getText(sf).replace(/\s+/g, ' ') || 'desconhecido',
					required: !p.questionToken,
					desc: owner === typeName ? own : (own + ' (herdada de ' + owner + ')').trim(),
				});
			}
		} else heritage.push(typeName + ': ' + decl.type.getText(typeFile));
	}
	function defaultsIn(sourcePath, acceptedTypes) {
		const found = new Map();
		const sf = ts.createSourceFile(
			sourcePath,
			readFileSync(sourcePath, 'utf8'),
			ts.ScriptTarget.Latest,
			true,
			ts.ScriptKind.TSX,
		);
		function visit(n) {
			if (
				ts.isParameter(n) &&
				ts.isObjectBindingPattern(n.name) &&
				acceptedTypes.some((t) => n.type?.getText(sf).includes(t))
			)
				for (const e of n.name.elements) {
					if (!e.initializer || !ts.isIdentifier(e.name)) continue;
					const key = e.name.text;
					if (!found.has(key)) found.set(key, new Set());
					found.get(key).add(e.initializer.getText(sf));
				}
			ts.forEachChild(n, visit);
		}
		visit(sf);
		return found;
	}
	const implementationPath = override?.defaults ? join(root, override.defaults) : path;
	const defaults = defaultsIn(implementationPath, typeNames);
	const popoverDefaults =
		name === 'AdsCombobox'
			? defaultsIn(join(root, 'packages/components/src/combobox-popover.tsx'), [
					'AdsComboboxPopoverProps',
				])
			: null;
	for (const p of props) {
		const source = p.owner === 'AdsComboboxPopoverProps' ? popoverDefaults : defaults;
		const values = source?.get(p.sourceName);
		p.def = values?.size === 1 ? [...values][0] : '—';
	}
	return {
		props,
		heritage: heritage.join(' ; '),
		typeNames,
		path: path.slice(root.length + 1).replaceAll('\\', '/'),
	};
}

// Aliases de união de literais (variantes, tamanhos, estados) dos pacotes de UI, indexados uma vez.
const literalUnions = new Map();
// `keyof typeof objeto`: as chaves do literal são os valores aceitos (padrão de variantes e tamanhos).
function keyofObject(sf, type) {
	if (
		!ts.isTypeOperatorNode(type) ||
		type.operator !== ts.SyntaxKind.KeyOfKeyword ||
		!ts.isTypeQueryNode(type.type) ||
		!ts.isIdentifier(type.type.exprName)
	)
		return null;
	const name = type.type.exprName.text;
	for (const n of sf.statements) {
		if (!ts.isVariableStatement(n)) continue;
		for (const d of n.declarationList.declarations) {
			if (!ts.isIdentifier(d.name) || d.name.text !== name || !d.initializer) continue;
			const init = ts.isAsExpression(d.initializer) ? d.initializer.expression : d.initializer;
			if (!ts.isObjectLiteralExpression(init)) return null;
			const keys = init.properties
				.filter((x) => ts.isPropertyAssignment(x) || ts.isShorthandPropertyAssignment(x))
				.map((x) => (ts.isIdentifier(x.name) || ts.isStringLiteral(x.name) ? x.name.text : null));
			return keys.length && keys.every(Boolean) ? keys : null;
		}
	}
	return null;
}
// Interfaces do próprio projeto, para resolver props herdadas (as de HTML/React ficam de fora).
const interfaceIndex = new Map();
function collectUnions(dir) {
	for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
		const rel = dir + '/' + entry.name;
		if (entry.isDirectory()) collectUnions(rel);
		else if (/\.tsx?$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
			const sf = parse(rel);
			for (const n of sf.statements) {
				if (ts.isInterfaceDeclaration(n) && !interfaceIndex.has(n.name.text))
					interfaceIndex.set(n.name.text, { sf, decl: n });
				if (ts.isTypeAliasDeclaration(n) && keyofObject(sf, n.type)) {
					literalUnions.set(n.name.text, keyofObject(sf, n.type));
					continue;
				}
				if (!ts.isTypeAliasDeclaration(n) || !ts.isUnionTypeNode(n.type)) continue;
				const values = n.type.types.map((t) =>
					ts.isLiteralTypeNode(t) && ts.isStringLiteral(t.literal) ? t.literal.text : null,
				);
				if (values.length && values.every((v) => v !== null))
					literalUnions.set(n.name.text, values);
			}
		}
	}
}
for (const dir of [
	'packages/components/src',
	'packages/admin/src',
	'packages/highlighted-code/src',
])
	collectUnions(dir);
const stateProp =
	/^(disabled|isLoading|loading|invalid|readOnly|required|selected|checked|expanded|open|collapsed|pressed|isDisabled|isPending|hasError|error|indeterminate|busy|dismissible|multiple)$/i;
const a11yProp = /^(aria-[\w-]+|role|tabIndex|labels?|[a-z]+Label|[a-z]+Labels|ariaLabel|hidden)$/;

function variantsAndStates(props) {
	const unions = new Map();
	for (const p of props) {
		const literals = [...p.type.matchAll(/'([^']*)'/g)].map((m) => m[1]);
		if (literals.length && /^('[^']*'\s*\|\s*)*'[^']*'$/.test(p.type.trim())) {
			unions.set(p.sourceName, literals);
			continue;
		}
		for (const word of p.type.match(/[A-Z]\w+/g) || [])
			if (literalUnions.has(word) && !unions.has(p.sourceName))
				unions.set(p.sourceName, literalUnions.get(word));
	}
	const states = props.filter((p) => stateProp.test(p.sourceName)).map((p) => p.sourceName);
	const a11y = props.filter((p) => a11yProp.test(p.sourceName)).map((p) => p.sourceName);
	return { unions, states: [...new Set(states)], a11y: [...new Set(a11y)] };
}

// Padrões de uso comprovado: `<AdsTabsList`, `<AdsTabs.List` (sintaxe Componente.Parte) ou `component: AdsX` no meta.
function usagePatterns(name) {
	const words = name.match(/[A-Z][a-z0-9]*/g) || [name];
	const names = [name];
	for (let i = words.length - 1; i >= 2; i--)
		names.push(words.slice(0, i).join('') + '.' + words.slice(i).join(''));
	return names.map((n) => new RegExp('<' + n.replaceAll('.', '\\.') + '(?![A-Za-z0-9_])'));
}
function storyFor(entry) {
	const conventional = entry.route.split('/').pop() + '.stories.tsx';
	const patterns = usagePatterns(entry.name);
	const asMeta = new RegExp('component:\\s*' + entry.name + '\\b');
	const candidates = [...new Set([...entry.stories, conventional])]
		.filter((n) => existsSync(join(root, 'apps/docs/src', n)))
		.map((n) => {
			const content = read('apps/docs/src/' + n);
			return {
				name: n,
				content,
				score: (n === conventional ? 10 : 0) + (patterns.some((r) => r.test(content)) ? 4 : 0),
			};
		})
		.sort((a, b) => b.score - a.score);
	for (const c of candidates) {
		const file = ts.createSourceFile(
			c.name,
			c.content,
			ts.ScriptTarget.Latest,
			true,
			ts.ScriptKind.TSX,
		);
		const vars = file.statements
			.filter(ts.isVariableStatement)
			.filter((n) => n.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword))
			.flatMap((n) => n.declarationList.declarations)
			.filter((n) => ts.isIdentifier(n.name));
		// Componentes auxiliares locais (ex.: AccordionItem) contam quando a story os renderiza.
		const helpers = new Map();
		for (const n of file.statements) {
			if (ts.isFunctionDeclaration(n) && n.name) helpers.set(n.name.text, n.getText(file));
			if (
				ts.isVariableStatement(n) &&
				!n.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
			)
				for (const d of n.declarationList.declarations)
					if (ts.isIdentifier(d.name) && d.initializer)
						helpers.set(d.name.text, d.initializer.getText(file));
		}
		const exercises = (text, seen = new Set()) =>
			patterns.some((r) => r.test(text)) ||
			[...helpers].some(
				([helper, body]) =>
					!seen.has(helper) &&
					new RegExp('<' + helper + '(?![A-Za-z0-9_])').test(text) &&
					exercises(body, new Set([...seen, helper])),
			);
		const used = vars.find((d) => exercises(d.initializer?.getText(file) || ''));
		// Story só com `args` é válida quando o meta aponta para o componente (component: AdsX).
		const picked = used || (asMeta.test(c.content) ? vars[0] : undefined);
		if (picked) return { file: c.name, name: picked.name.text };
	}
	throw Error(
		'Nenhuma story comprova o uso de ' +
			entry.name +
			'; adicione uma story que o exercite ou ajuste a matriz (candidatas: ' +
			candidates.map((c) => c.name).join(', ') +
			')',
	);
}
const esc = (x) =>
	String(x || '—')
		.replaceAll('&', '&amp;')
		.replaceAll('|', '&#124;')
		.replaceAll('\n', ' ')
		.replaceAll('{', '&#123;')
		.replaceAll('}', '&#125;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll(bt, '&#96;');

function derivedSections(props) {
	const { unions, states, a11y } = variantsAndStates(props);
	const code = (v) => '<code>' + esc(v) + '</code>';
	const out = [];
	if (unions.size) {
		out.push('**Variantes e valores aceitos** (extraídos dos tipos públicos):', '', '<ul>');
		for (const [name, values] of unions)
			out.push(
				'<li><code>' +
					esc(name) +
					'</code>: ' +
					values.map((v) => code("'" + v + "'")).join(', ') +
					'</li>',
			);
		out.push('</ul>', '');
	}
	out.push(
		states.length
			? '**Estados controlados por props:** ' + states.map(code).join(', ') + '.'
			: '**Estados:** nenhuma prop de estado dedicada neste contrato; confira os exemplos.',
		'',
		a11y.length
			? '**Acessibilidade — props e rótulos expostos:** ' + a11y.map(code).join(', ') + '.'
			: '**Acessibilidade:** sem props de rótulo dedicadas; atributos ARIA padrão podem ser repassados ao elemento raiz quando o contrato herda atributos HTML.',
		'',
		'Preserve semântica, nome acessível, navegação por teclado e foco visível; ' +
			'os tipos e a implementação são a fonte do comportamento.',
		'',
	);
	return out;
}

function render(entry) {
	const api = typeInfo(entry.name),
		story = storyFor(entry);
	const pkg =
		entry.name === 'AdsMaskedInput'
			? '@admin-ds/components/masked-input'
			: entry.name === 'AdsHighlightedCodeSnippet'
				? '@admin-ds/highlighted-code'
				: api.path.startsWith('packages/admin/')
					? '@admin-ds/admin'
					: '@admin-ds/components';
	const a = [
		"import { Meta, Canvas } from '@storybook/addon-docs/blocks';",
		"import * as ExampleStories from '../" + story.file.replace('.tsx', '') + "';",
		'',
		'<Meta title="API/' + entry.name + '" />',
		'',
		'# ' + entry.name,
		'',
		esc(descriptions.get(entry.name) || 'Componente público do design system.'),
		'',
		'**Importação pública:** ' + bt + pkg + bt + '. **Grupo:** ' + esc(entry.group) + '.',
		'',
		'## Exemplo executável',
		'',
		'<Canvas of={ExampleStories.' + story.name + '} />',
		'',
		'Outros exemplos: ' +
			bt +
			story.file +
			bt +
			'. Partes compostas podem compartilhar exemplos do componente pai.',
		'',
		'## Propriedades e tipos',
		'',
		'**Contrato:** ' + api.typeNames.map((n) => bt + n + bt).join(', ') + '.',
		'',
		'**Composição/herança:** ' +
			bt +
			api.heritage.replace(/\s+/g, ' ').replaceAll(bt, "'") +
			bt +
			'.',
		'',
	];
	if (api.props.length) {
		a.push(
			'<table>',
			'<thead><tr><th>Propriedade</th><th>Tipo</th><th>Obrigatória</th><th>Padrão verificado</th><th>Descrição</th></tr></thead>',
			'<tbody>',
		);
		for (const p of api.props)
			a.push(
				'<tr><td><code>' +
					esc(p.name) +
					'</code></td><td><code>' +
					esc(p.type) +
					'</code></td><td>' +
					(p.required ? 'Sim' : 'Não') +
					'</td><td><code>' +
					esc(p.def) +
					'</code></td><td>' +
					esc(p.desc) +
					'</td></tr>',
			);
		a.push('</tbody></table>');
	} else a.push('API composta ou genérica: confira os tipos públicos e o exemplo acima.');
	if (notes[entry.name]) a.push('', '## Observações específicas', '', esc(notes[entry.name]));
	a.push(
		'',
		'**Origem TypeScript:** ' + bt + api.path + bt + '.',
		'',
		'Padrões são mostrados apenas quando encontrados de forma inequívoca na desestruturação da implementação. ' +
			'O travessão não prova a existência de um padrão. Props HTML/React herdadas podem não aparecer nesta tabela.',
		'',
		'## Variantes, estados e acessibilidade',
		'',
		...derivedSections(api.props),
	);
	return a.join('\n');
}
mkdirSync(out, { recursive: true });
const desired = new Set(entries.map((e) => e.name + '.mdx'));
for (const file of readdirSync(out))
	if (file.endsWith('.mdx') && !desired.has(file)) unlinkSync(join(out, file));
for (const entry of entries) {
	const file = join(out, entry.name + '.mdx'),
		content = render(entry);
	if (!existsSync(file) || readFileSync(file, 'utf8') !== content) writeFileSync(file, content);
}
console.log('Referências Storybook geradas: ' + entries.length + ' exports.');
