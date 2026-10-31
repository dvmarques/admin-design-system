import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { catalogEntries } from './app/catalogo/catalog-data';
import {
	canonicalCatalogPath,
	catalogFamilies,
	catalogMemberAnchor,
	catalogMemberHref,
	catalogFamilyMembers,
	catalogSearchEntries,
} from './app/catalogo/catalog-families';
import { catalogMemberReference } from './app/catalogo/catalog-member-reference';
import referenceData from './app/catalogo/catalog-member-reference.json';
import * as adminComponents from '@dvmarques/admin-ds-admin';
import * as uiComponents from '@dvmarques/admin-ds-components';
import { catalogDemos } from './app/catalogo/catalog-demos';
import snippets from './app/catalogo/catalog-snippets.json';
import { catalogSnippets } from '../../scripts/catalog-snippets.mjs';

const root = resolve(process.cwd()) + '/';
const referenceKeys = Object.keys(referenceData);
const publicComponents = { ...uiComponents, ...adminComponents };
const exclusions = [
	'fixtureVariants',
	'getAdsPaginationItems',
	'getAdsSmartTableCsv',
	'useAdsAdminShell',
];
// Pacotes opcionais incluídos no catálogo: todo export runtime é considerado UI e exige rota,
// exceto os utilitários sem interface listados explicitamente (um novo export visual falha o teste).
const optionalPackages = [
	{
		path: 'packages/highlighted-code/src/index.ts',
		nonUi: [
			'ADS_HIGHLIGHTED_CODE_LANGUAGES',
			'languageLabel',
			'normalizeHighlightedLanguage',
			'registerHighlightedLanguageLoader',
		],
	},
	{ path: 'packages/components/src/masked-input.tsx', nonUi: [] as string[] },
];
function runtimeExports(path: string) {
	const source = ts.createSourceFile(
		path,
		readFileSync(root + path, 'utf8'),
		ts.ScriptTarget.Latest,
		true,
	);
	const reexported = source.statements
		.filter(ts.isExportDeclaration)
		.filter((node) => !node.isTypeOnly)
		.flatMap((node) =>
			node.exportClause && ts.isNamedExports(node.exportClause)
				? node.exportClause.elements
						.filter((element) => !element.isTypeOnly)
						.map((element) => element.name.text)
				: [],
		);
	// Entradas opcionais como `masked-input.tsx` declaram o componente no próprio módulo.
	const declared = source.statements
		.filter(ts.isVariableStatement)
		.filter((node) =>
			node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword),
		)
		.flatMap((node) =>
			node.declarationList.declarations.flatMap((declaration) =>
				ts.isIdentifier(declaration.name) ? [declaration.name.text] : [],
			),
		);
	return [...reexported, ...declared];
}

describe('rastreabilidade do catálogo', () => {
	it('cobre todo export público de UI com rota própria, sem duplicatas', () => {
		const exports = [
			...['packages/components/src/index.ts', 'packages/admin/src/index.ts'].flatMap(
				runtimeExports,
			),
			...optionalPackages.flatMap(({ path, nonUi }) =>
				runtimeExports(path).filter((name) => !nonUi.includes(name)),
			),
		];
		expect(catalogEntries.map((entry) => entry.name).sort()).toEqual(
			exports.filter((name) => !exclusions.includes(name)).sort(),
		);
		expect(new Set(catalogEntries.map((entry) => entry.href)).size).toBe(catalogEntries.length);
		for (const entry of catalogEntries) {
			expect(entry.href).toBe(`/catalogo/${entry.slug}`);
			expect(catalogDemos[entry.demo]).toBeTypeOf('function');
			// A composição executável precisa renderizar o export; importação isolada não comprova cobertura.
			expect(snippets[entry.demo]).toMatch(new RegExp(`<${entry.name}(?:\\s|[.><])`));
		}
	});
	it('cobre todas as partes compostas com busca e âncoras canônicas', () => {
		for (const family of catalogFamilies) {
			const root = catalogEntries.find((entry) => entry.name === family.root);
			expect(root, family.title).toBeDefined();
			for (const member of family.members) {
				const found = catalogSearchEntries.find((entry) => entry.name === member);
				expect(found, member).toBeDefined();
				const destination = catalogMemberHref(member);
				expect(destination).toContain(root!.href);
				if (member !== family.root)
					expect(destination).toContain('#' + catalogMemberAnchor(member));
			}
			for (const alias of family.aliases) {
				expect(catalogSearchEntries.some((entry) => entry.name === alias)).toBe(true);
				const destination = catalogMemberHref(alias);
				expect(destination).toContain(root!.href);
				if (!alias.endsWith('.Root')) {
					const anchor = destination.split('#')[1];
					expect(anchor).toBeDefined();
					expect(family.members.some((member) => catalogMemberAnchor(member) === anchor)).toBe(
						true,
					);
				}
			}
		}
	});

	it('mantém cada nome público em uma única família, com referência própria e export real', () => {
		const seen = new Set<string>();
		for (const family of catalogFamilies) {
			for (const member of family.members) {
				expect(seen.has(member), `${member} duplicado`).toBe(false);
				seen.add(member);
				// A referência genérica de fallback não deve mascarar membro sem documentação.
				expect(referenceKeys, member).toContain(member);
				const [base, part] = member.split('.');
				if (!part) {
					expect(
						catalogEntries.some((entry) => entry.name === member),
						member,
					).toBe(true);
				} else {
					expect((publicComponents as Record<string, unknown>)[base!]).toHaveProperty(part);
				}
			}
		}
	});

	it('mantém rotas legadas por export e normaliza a barra final do Pages', () => {
		for (const entry of catalogEntries) {
			expect(canonicalCatalogPath(`${entry.href}/`)).toBe(
				catalogMemberHref(entry.name).split('#')[0],
			);
		}
	});

	it('documenta corretamente os elementos thead e th e o alias raiz de Dropdown', () => {
		const thead = catalogMemberReference('AdsTableHead');
		const th = catalogMemberReference('AdsTableHeader');
		expect(thead.description).toContain('<thead>');
		expect(thead.usage).toContain('<AdsTableHead>');
		expect(th.description).toContain('<th>');
		expect(th.usage).toContain('scope="col"');
		expect(catalogFamilyMembers('AdsDropdown')).toContain('AdsDropdown.Root');
	});

	it('mantém snippets idênticos às funções TSX executadas e tipadas', () => {
		expect(snippets).toEqual(catalogSnippets());
		expect(snippets.Breadcrumb).toContain("import Link from 'next/link';");
	});
	it('inclui cada composição em stories existentes', () => {
		const stories = readdirSync(root + 'apps/docs/src')
			.filter((name) => name.endsWith('.stories.tsx'))
			.map((name) => readFileSync(root + 'apps/docs/src/' + name, 'utf8'))
			.join('\n');
		const compoundFamilies = [
			'AdsTabs',
			'AdsAccordion',
			'AdsTable',
			'AdsCard',
			'AdsList',
			'AdsField',
		];
		for (const entry of catalogEntries) {
			const family = compoundFamilies.find((name) => entry.name.startsWith(name));
			const compound = family ? `${family}\\.${entry.name.slice(family.length)}` : entry.name;
			expect(stories, entry.name).toMatch(
				new RegExp(`<(?:${entry.name}|${compound})(?:\\s|[.><])`),
			);
		}
	});
});
