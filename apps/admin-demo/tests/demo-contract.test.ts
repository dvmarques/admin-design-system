import { describe, expect, it } from 'vitest';
import {
	findAdsSelectors,
	findForbiddenClassTokens,
	findInternalPackageImports,
	findTailwindDirectives,
	findUndeclaredDependencies,
	importSpecifiers,
} from './support/demo-contract';

describe('importSpecifiers', () => {
	it('finds static, side-effect, re-export and dynamic imports', () => {
		const source = `
			import a from 'one';
			import { b } from "two/path";
			import 'three.css';
			export { c } from '@scope/four';
			const lazy = import('five');
			const text = "not an import";
		`;
		expect(importSpecifiers(source)).toEqual([
			'one',
			'two/path',
			'three.css',
			'@scope/four',
			'five',
		]);
	});
});

describe('findInternalPackageImports', () => {
	it.each([
		'@admin-ds/components/src/button',
		'@admin-ds/admin/dist/styles.css',
		'../../packages/components/src/index',
		'../packages/admin',
	])('flags %s', (specifier) => {
		expect(findInternalPackageImports([specifier])).toEqual([specifier]);
	});

	it.each([
		'@admin-ds/components',
		'@admin-ds/components/styles.css',
		'@admin-ds/tokens',
		'next/link',
		'./local',
	])('accepts %s', (specifier) => {
		expect(findInternalPackageImports([specifier])).toEqual([]);
	});
});

describe('findUndeclaredDependencies', () => {
	const declared = ['@admin-ds/components', '@admin-ds/admin'];

	it('flags packages that only resolve through workspace hoisting', () => {
		expect(
			findUndeclaredDependencies(['clsx', '@scope/other/sub', '@admin-ds/components'], declared),
		).toEqual(['clsx', '@scope/other/sub']);
	});

	it('ignores relative, node: and always-available specifiers', () => {
		expect(
			findUndeclaredDependencies(
				['./a', '../b', 'node:path', 'react', 'react/jsx-runtime', 'react-dom/server', 'next/link'],
				declared,
			),
		).toEqual([]);
	});
});

describe('findForbiddenClassTokens', () => {
	it('flags utility classes in literal className values', () => {
		expect(findForbiddenClassTokens('<div className="demo-a ml-auto grid ads-b" />')).toEqual([
			'ml-auto',
			'grid',
		]);
		expect(findForbiddenClassTokens("<div className={'h-3 w-24'} />")).toEqual(['h-3', 'w-24']);
		expect(findForbiddenClassTokens('<div className={`p-0`} />')).toEqual(['p-0']);
	});

	it('accepts demo and public classes only', () => {
		expect(findForbiddenClassTokens('<div className="demo-page ads-surface" />')).toEqual([]);
		expect(findForbiddenClassTokens('<div className={styles} />')).toEqual([]);
	});
});

describe('findAdsSelectors', () => {
	it('flags selectors that redefine public ads- classes', () => {
		expect(findAdsSelectors('.ads-button { color: red }')).toEqual(['.ads-button']);
		expect(findAdsSelectors('.demo-a .ads-card:hover, .x > .ads-table-row {}')).toEqual([
			'.ads-card',
			'.ads-table-row',
		]);
	});

	it('ignores demo selectors, comments and values', () => {
		expect(findAdsSelectors('.demo-a { color: var(--ads-color-text) }')).toEqual([]);
		expect(findAdsSelectors('/* .ads-button is public */ .demo-a {}')).toEqual([]);
	});
});

describe('findTailwindDirectives', () => {
	it('flags Tailwind directives', () => {
		expect(findTailwindDirectives("@import 'tailwindcss';")).toHaveLength(1);
		expect(findTailwindDirectives('@tailwind base; .a { @apply p-4; }')).toHaveLength(2);
	});

	it('accepts plain CSS', () => {
		expect(findTailwindDirectives('.demo-a { color: var(--ads-color-text) }')).toEqual([]);
	});
});
