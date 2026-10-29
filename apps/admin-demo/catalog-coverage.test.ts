import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { catalogEntries } from './app/catalogo/catalog-data';
import { catalogDemos } from './app/catalogo/catalog-demos';
import snippets from './app/catalogo/catalog-snippets.json';
import { catalogSnippets } from '../../scripts/catalog-snippets.mjs';

const root = resolve(process.cwd()) + '/';
const exclusions = [
	'fixtureVariants',
	'getAdsPaginationItems',
	'getAdsSmartTableCsv',
	'useAdsAdminShell',
];
function runtimeExports(path: string) {
	const source = ts.createSourceFile(
		path,
		readFileSync(root + path, 'utf8'),
		ts.ScriptTarget.Latest,
		true,
	);
	return source.statements
		.filter(ts.isExportDeclaration)
		.filter((node) => !node.isTypeOnly)
		.flatMap((node) =>
			node.exportClause && ts.isNamedExports(node.exportClause)
				? node.exportClause.elements
						.filter((element) => !element.isTypeOnly)
						.map((element) => element.name.text)
				: [],
		);
}

describe('rastreabilidade do catálogo', () => {
	it('cobre todo export público de UI com rota própria, sem duplicatas', () => {
		const exports = [
			...['packages/components/src/index.ts', 'packages/admin/src/index.ts'].flatMap(runtimeExports),
			// O pacote opcional possui também utilitários sem UI, que não pertencem ao catálogo visual.
			...runtimeExports('packages/highlighted-code/src/index.ts').filter((name) => name === 'AdsHighlightedCodeSnippet'),
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
