import { afterEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();
const cookies = vi.fn(async () => ({ get }));

vi.mock('next/headers', () => ({ cookies }));

afterEach(() => {
	vi.unstubAllEnvs();
	vi.resetModules();
	get.mockReset();
	cookies.mockClear();
});

async function load() {
	return import('../lib/server-theme');
}

describe('readServerTheme', () => {
	it('reads the saved theme from the cookie in the regular build', async () => {
		get.mockReturnValue({ value: 'dark' });
		const { readServerTheme, isStaticExport } = await load();

		expect(isStaticExport).toBe(false);
		await expect(readServerTheme()).resolves.toBe('dark');
		expect(get).toHaveBeenCalledWith('ads-theme');
	});

	it('falls back to light when there is no cookie', async () => {
		get.mockReturnValue(undefined);
		const { readServerTheme } = await load();

		await expect(readServerTheme()).resolves.toBe('light');
	});

	it('returns light without touching cookies in the static export', async () => {
		vi.stubEnv('GITHUB_PAGES', 'true');
		const { readServerTheme, isStaticExport } = await load();

		expect(isStaticExport).toBe(true);
		await expect(readServerTheme()).resolves.toBe('light');
		expect(cookies).not.toHaveBeenCalled();
	});
});
