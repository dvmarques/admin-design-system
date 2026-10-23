import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';

const directory = resolve(process.cwd(), 'apps/admin-demo/app/catalogo');
/** Snippets vêm das mesmas funções TSX compiladas e executadas pelo catálogo. */
export function catalogSnippets() {
	const source = readFileSync(resolve(directory, 'catalog-demos.tsx'), 'utf8');
	const file = ts.createSourceFile(
		'catalog-demos.tsx',
		source,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TSX,
	);
	const imports = file.statements.filter(ts.isImportDeclaration);
	return Object.fromEntries(
		file.statements.filter(ts.isFunctionDeclaration).map((node) => {
			const body = node.getText(file);
			const required = imports.flatMap((declaration) => {
				const bindings = declaration.importClause?.namedBindings;
				if (!bindings || !ts.isNamedImports(bindings)) return [];
				const names = bindings.elements
					.filter((element) => new RegExp(`\\b${element.name.text}\\b`).test(body))
					.map((element) => element.getText(file));
				return names.length
					? [`import { ${names.join(', ')} } from ${declaration.moduleSpecifier.getText(file)};`]
					: [];
			});
			return [
				node.name.text.replace(/Demo$/, ''),
				["'use client';", ...required, '', body].join('\n'),
			];
		}),
	);
}
if (process.argv[1]?.replaceAll('\\', '/').endsWith('/scripts/catalog-snippets.mjs')) {
	writeFileSync(
		resolve(directory, 'catalog-snippets.json'),
		JSON.stringify(catalogSnippets(), null, '\t') + '\n',
	);
}
