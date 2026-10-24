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

describe('readServerPreference', () => {
	it.each(['dark', 'light', 'system'])(
		'reads the saved %s preference from the cookie',
		async (value) => {
			get.mockReturnValue({ value });
			const { readServerPreference, isStaticExport } = await load();

			expect(isStaticExport).toBe(false);
			await expect(readServerPreference()).resolves.toBe(value);
			expect(get).toHaveBeenCalledWith('ads-theme');
		},
	);

	it('falls back to system when there is no cookie', async () => {
		get.mockReturnValue(undefined);
		const { readServerPreference } = await load();

		await expect(readServerPreference()).resolves.toBe('system');
	});

	it('returns system without touching cookies in the static export', async () => {
		vi.stubEnv('GITHUB_PAGES', 'true');
		const { readServerPreference, isStaticExport } = await load();

		expect(isStaticExport).toBe(true);
		await expect(readServerPreference()).resolves.toBe('system');
		expect(cookies).not.toHaveBeenCalled();
	});
});
