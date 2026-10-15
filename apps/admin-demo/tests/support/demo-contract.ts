import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const demoRoot = resolve(import.meta.dirname, '../..');

export interface DemoFile {
	path: string;
	content: string;
}

/** Reads the demo files under `dirs` whose names match `pattern`, skipping test files. */
export async function readDemoFiles(dirs: string[], pattern: RegExp): Promise<DemoFile[]> {
	const files: DemoFile[] = [];
	for (const dir of dirs) {
		for (const entry of await readdir(resolve(demoRoot, dir), { recursive: true })) {
			if (pattern.test(entry) && !/\.test\.tsx?$/.test(entry)) {
				const path = `${dir}/${entry}`;
				files.push({ path, content: await readFile(resolve(demoRoot, path), 'utf8') });
			}
		}
	}
	return files;
}

export async function readDemoPackageJson() {
	const raw = await readFile(resolve(demoRoot, 'package.json'), 'utf8');
	return JSON.parse(raw) as {
		dependencies?: Record<string, string>;
		devDependencies?: Record<string, string>;
	};
}

export async function listDemoRootFiles() {
	return readdir(demoRoot);
}

/** Every module specifier a source imports (`from`, bare `import` and dynamic `import()`). */
export function importSpecifiers(source: string): string[] {
	const pattern = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])([^'"\n]+)\1/g;
	return [...source.matchAll(pattern)].map((match) => match[2] ?? '');
}

/** Specifiers that reach into a package's sources or build output instead of its public exports. */
export function findInternalPackageImports(specifiers: string[]): string[] {
	return specifiers.filter(
		(specifier) =>
			/^@admin-ds\/[^/]+\/(src|dist)(\/|$)/.test(specifier) ||
			/(^|\/)packages\/[^/]+(\/|$)/.test(specifier),
	);
}

export function packageNameOf(specifier: string): string {
	const [first = '', second] = specifier.split('/');
	return first.startsWith('@') && second ? `${first}/${second}` : first;
}

const alwaysAvailable = new Set(['react', 'react-dom', 'next']);

/** Bare specifiers the demo's own package.json does not declare (implicit workspace deps). */
export function findUndeclaredDependencies(specifiers: string[], declared: string[]): string[] {
	return specifiers.filter((specifier) => {
		if (specifier.startsWith('.') || specifier.startsWith('/') || specifier.startsWith('node:')) {
			return false;
		}
		const name = packageNameOf(specifier);
		return !alwaysAvailable.has(name) && !declared.includes(name);
	});
}

/** Class tokens in literal `className` values that are neither the demo's (`demo-`) nor public (`ads-`). */
export function findForbiddenClassTokens(source: string): string[] {
	const pattern =
		/\bclassName\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*(?:"([^"]*)"|'([^']*)'|`([^`$]*)`)\s*\})/g;
	const tokens: string[] = [];
	for (const match of source.matchAll(pattern)) {
		const value = match.slice(1).find((group) => group !== undefined) ?? '';
		tokens.push(...value.split(/\s+/).filter(Boolean));
	}
	return tokens.filter((token) => !token.startsWith('demo-') && !token.startsWith('ads-'));
}

/** Class selectors that redefine a public `ads-` class. */
export function findAdsSelectors(css: string): string[] {
	const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
	return [...withoutComments.matchAll(/(?:^|[\s,{}>+~(])(\.ads-[\w-]+)/g)].map(
		(match) => match[1] ?? '',
	);
}

/** Tailwind directives that would make the demo depend on Tailwind itself. */
export function findTailwindDirectives(css: string): string[] {
	return [
		...css.matchAll(/@(?:import\s+['"]tailwindcss|tailwind\b|apply\b|theme\b|source\b)/g),
	].map((match) => match[0]);
}
