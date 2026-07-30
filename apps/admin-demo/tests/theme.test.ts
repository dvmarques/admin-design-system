import { describe, expect, it } from 'vitest';
import { resolveTheme } from '../lib/theme';

describe('resolveTheme', () => {
	it('uses light as the deterministic fallback', () => {
		expect(resolveTheme(undefined)).toBe('light');
	});

	it('preserves an explicit dark theme', () => {
		expect(resolveTheme('dark')).toBe('dark');
	});
});
