import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
const normalized = css.replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');

test('sidebar and header colors use dynamic global fallbacks', () => {
	const pairs = [
		['--ads-sidebar-background', '--ads-color-surface-raised'],
		['--ads-sidebar-text', '--ads-color-text'],
		['--ads-sidebar-text-muted', '--ads-color-text-muted'],
		['--ads-sidebar-hover-background', '--ads-color-surface-hover'],
		['--ads-sidebar-active-background', '--ads-color-surface-selected'],
		['--ads-sidebar-active-text', '--ads-color-on-surface-selected'],
		['--ads-sidebar-active-indicator', '--ads-color-primary'],
		['--ads-sidebar-border', '--ads-color-border'],
		['--ads-header-background', '--ads-color-surface'],
		['--ads-header-text', '--ads-color-text'],
		['--ads-header-border', '--ads-color-border'],
	];
	for (const [token, fallback] of pairs) {
		const expression = `var(${token}, var(${fallback}))`;
		assert.ok(normalized.includes(expression), `missing fallback for ${token}`);
		assert.ok(!css.includes(`${token}:`), `unexpected fixed default for ${token}`);
	}
});

test('sidebar branding can inherit the sidebar background', () => {
	const token = '--ads-sidebar-header-background';
	assert.ok(css.includes(token));
	assert.ok(css.includes('--ads-sidebar-background'));
	assert.ok(!css.includes(`${token}:`));
});

test('mobile Drawer has an optional sidebar color but transparent navigation', () => {
	const panels = [...css.matchAll(/\.ads-admin-shell-mobile-drawer\s*\{([^}]*)\}/g)];
	assert.ok(panels.some(([, rules]) => rules.includes('--ads-sidebar-background')));
	const navigation = css.match(
		/\.ads-admin-shell-mobile-drawer \.ads-admin-shell-sidebar\s*\{([^}]*)\}/,
	)?.[1];
	assert.ok(navigation, 'missing mobile navigation styles');
	assert.match(navigation, /background-color:\s*transparent;/);
});
