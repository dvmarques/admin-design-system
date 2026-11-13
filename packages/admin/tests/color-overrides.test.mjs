import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');

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
		assert.ok(css.includes(`var(${role}, var(${fallback}))`), `missing fallback for ${role}`);
		assert.ok(!css.includes(`${role}:`), `fixed default would break inheritance: ${role}`);
	}
	assert.ok(
		css.includes(
			'var(--ads-sidebar-header-background, var(--ads-sidebar-background, var(--ads-color-surface-raised)))',
		),
		'sidebar brand must follow the sidebar background, then the previous global token',
	);
	assert.ok(!css.includes('--ads-sidebar-header-background:'), 'no sidebar-header baked-in default');
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
	assert.ok(css.includes('box-shadow: inset 3px 0 0 var(--ads-sidebar-active-indicator, var(--ads-color-primary))'));
	assert.ok(css.includes('background-color: var(--ads-header-background, var(--ads-color-surface))'));
	assert.ok(css.includes('background-color: var(--ads-sidebar-background, var(--ads-color-surface-raised))'));
	assert.ok(css.includes('background: var(--ads-sidebar-active-background, var(--ads-color-surface-selected))'));
});

test('mobile drawer retains transparent nav while adopting optional sidebar color', () => {
	assert.match(
		css,
		/\.ads-admin-shell-mobile-drawer \.ads-admin-shell-sidebar\s*\{[^}]*background-color: transparent;/,
	);
	assert.match(
		css,
		/\.ads-admin-shell-mobile-drawer\s*\{[^}]*background-color: var\(--ads-sidebar-background, var\(--ads-color-surface-raised\)\)/,
	);
});
