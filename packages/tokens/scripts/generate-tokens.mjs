import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { requiredCategories, tokenSource } from '../source/tokens.mjs';

function getByPath(source, path) {
	return path.split('.').reduce((current, segment) => current?.[segment], source);
}
function resolveValue(value, source, stack = []) {
	if (typeof value !== 'string' || !value.startsWith('{')) return value;
	const path = value.slice(1, -1);
	if (stack.includes(path))
		throw new Error(`Circular token reference: ${[...stack, path].join(' -> ')}`);
	const target = getByPath(source, path);
	if (target === undefined) throw new Error(`Unknown token reference: ${path}`);
	return resolveValue(target, source, [...stack, path]);
}
function flatten(source, prefix = []) {
	return Object.entries(source).flatMap(([key, value]) =>
		value && typeof value === 'object' && !Array.isArray(value)
			? flatten(value, [...prefix, key])
			: [[[...prefix, key].join('.'), value]],
	);
}
function toCssVariable(name) {
	return `--ads-${name.replaceAll('.', '-').replaceAll(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
}

export function validateTokenSource(source) {
	for (const category of requiredCategories)
		if (!source[category]) throw new Error(`Missing required token category: ${category}`);
	if (!source.color?.semantic?.light || !source.color?.semantic?.dark)
		throw new Error('Both light and dark semantic color themes are required');
	const names = flatten(source).map(([name]) => name);
	if (new Set(names).size !== names.length) throw new Error('Duplicate token name detected');
	for (const [, value] of flatten(source)) resolveValue(value, source);
}

export function createArtifacts(source) {
	validateTokenSource(source);
	const sharedEntries = flatten({
		typography: source.typography,
		spacing: source.spacing,
		dimension: source.dimension,
		border: source.border,
		radius: source.radius,
		elevation: source.elevation,
		opacity: source.opacity,
		motion: source.motion,
	});
	const themeEntries = (theme) =>
		flatten(source.color.semantic[theme]).map(([name, value]) => [
			`color.${name}`,
			resolveValue(value, source),
		]);
	const cssBlock = (selector, entries) =>
		`${selector} {\n${entries.map(([name, value]) => `  ${toCssVariable(name)}: ${value};`).join('\n')}\n}\n`;
	const lightEntries = [...sharedEntries, ...themeEntries('light')];
	const darkEntries = [...sharedEntries, ...themeEntries('dark')];
	const css = [
		cssBlock(':root, [data-theme="light"]', lightEntries),
		cssBlock('[data-theme="dark"]', darkEntries),
		`@media (prefers-color-scheme: dark) {\n${cssBlock(':root:not([data-theme])', darkEntries)}}\n`,
	].join('\n');
	const metadata = Object.fromEntries(lightEntries);
	const module = [
		'/** Generated from source/tokens.mjs. Do not edit manually. */',
		`export const tokenValues = ${JSON.stringify(metadata, null, 2)} as const`,
		'export type TokenName = keyof typeof tokenValues',
		'export const tokenCssVariable = (name: TokenName) => `--ads-${name.replaceAll(".", "-").replaceAll(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`',
		'',
	].join('\n');
	return { css, module };
}

export async function writeArtifacts(source = tokenSource) {
	const artifacts = createArtifacts(source);
	const distDir = new URL('../dist/', import.meta.url);
	await mkdir(distDir, { recursive: true });
	await writeFile(new URL('./tokens.css', distDir), artifacts.css, 'utf8');
	await writeFile(new URL('../src/generated.ts', import.meta.url), artifacts.module, 'utf8');
	await writeFile(
		new URL('./tokens.meta.json', distDir),
		`${JSON.stringify(source, null, 2)}\n`,
		'utf8',
	);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await writeArtifacts();
