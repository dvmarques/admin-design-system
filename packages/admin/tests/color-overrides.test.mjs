import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
const compactCss = css.replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');

const publicRoles = new Map([
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
]);

test('scoped color roles have dynamic global fallbacks and no baked-in defaults', () => {
	for (const [role, fallback] of publicRoles) {
		const expected = `var(${role}, var(${fallback}))`;
		assert.ok(compactCss.includes(expected), `missing fallback for ${role}`);
		assert.ok(!css.includes(`${role}:`), `fixed default would break inheritance: ${role}`);
	}
	const brandFallback =
		'var(--ads-sidebar-header-background, var(--ads-sidebar-background, var(--ads-color-surface-raised)))';
	assert.ok(compactCss.includes(brandFallback), 'sidebar brand must follow sidebar and global');
	assert.ok(!css.includes('--ads-sidebar-header-background:'), 'no baked-in brand default');
});

test('navigation and header use only region-scoped color roles', () => {
	const rules = [
		'.ads-sidebar-section-title',
		'.ads-sidebar-group-toggle',
		'.ads-sidebar-icon',
		".ads-sidebar-item > a[aria-current='page']",
		'.ads-admin-shell-header',
		'.ads-admin-shell-sidebar-desktop',
		'.ads-admin-shell-sidebar',
		'.ads-admin-shell-sidebar-header',
	];
	for (const rule of rules) assert.ok(css.includes(rule), `missing rule: ${rule}`);
	const activeIndicator =
		'box-shadow: inset 3px 0 0 var(--ads-sidebar-active-indicator, var(--ads-color-primary))';
	const headerBackground = 'background-color: var(--ads-header-background, var(--ads-color-surface))';
	const sidebarBackground =
		'background-color: var(--ads-sidebar-background, var(--ads-color-surface-raised))';
	const activeBackground =
		'background: var(--ads-sidebar-active-background, var(--ads-color-surface-selected))';
	for (const expression of [
		activeIndicator,
		headerBackground,
		sidebarBackground,
		activeBackground,
	]) {
		assert.ok(compactCss.includes(expression), `missing region-scoped expression: ${expression}`);
	}
});

test('mobile drawer retains transparent nav while adopting optional sidebar color', () => {
	const mobileNav = css.match(
		/\.ads-admin-shell-mobile-drawer \.ads-admin-shell-sidebar\s*\{([^}]*)\}/,
	)?.[1];
	assert.ok(mobileNav, 'missing mobile navigation rule');
	assert.match(mobileNav, /background-color:\s*transparent;/);

	const mobilePanel = css.match(/\.ads-admin-shell-mobile-drawer\s*\{([^}]*)\}/)?.[1];
	assert.ok(mobilePanel, 'missing mobile panel rule');
	const panelBackground =
		'background-color: var(--ads-sidebar-background, var(--ads-color-surface-raised))';
	assert.ok(mobilePanel.includes(panelBackground));
});
