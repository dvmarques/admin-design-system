import { expect, test } from '@playwright/test';

const base = '/admin-design-system/storybook';

test('referência de API de Button é publicada e navegável no subcaminho Pages', async ({
	page,
	request,
}) => {
	const response = await request.get(`${base}/index.json`);
	expect(response.ok()).toBe(true);
	const index = await response.json();
	const entries = Object.values(index.entries ?? {}) as Array<{
		id: string;
		type: string;
		title: string;
	}>;
	const docs = entries.find((entry) => entry.type === 'docs' && entry.title === 'API/AdsButton');
	expect(docs, 'Autodocs deve gerar referência de Button').toBeDefined();

	const browserErrors: string[] = [];
	page.on('pageerror', (error) => browserErrors.push(error.message));
	page.on('response', (res) => {
		if (res.status() >= 400) browserErrors.push(`${res.status()} ${res.url()}`);
	});

	await page.goto(`${base}/iframe.html?id=${docs!.id}&viewMode=docs`);
	await expect(page.getByRole('heading', { name: 'AdsButton', exact: true })).toBeVisible();
	await expect(page.getByRole('table').first()).toBeVisible();
	expect(browserErrors).toEqual([]);
});

for (const theme of ['light', 'dark'] as const) {
	test(`Storybook publicado: documentação e exemplo respeitam tema ${theme}`, async ({
		page,
		request,
	}) => {
		const index = await (await request.get(`${base}/index.json`)).json();
		const docs = Object.values(index.entries) as Array<{ id: string; type: string; title: string }>;
		const button = docs.find((entry) => entry.type === 'docs' && entry.title === 'API/AdsButton');
		expect(button).toBeDefined();
		await page.goto(
			`${base}/iframe.html?id=${button!.id}&viewMode=docs&globals=theme:${theme}`,
		);
		await expect(page.locator(`[data-theme="${theme}"]`).first()).toBeVisible();
	});
}

for (const name of ['AdsSmartTable', 'AdsAdminShell', 'AdsInputGroup'] as const) {
	test(`Storybook publicado: a referência ${name} carrega com exemplos reais`, async ({ page, request }) => {
		const response = await request.get(`${base}/index.json`);
		expect(response.ok()).toBe(true);
		const entries = Object.values((await response.json()).entries) as Array<{
			id: string;
			type: string;
			title: string;
		}>;
		const entry = entries.find((item) => item.type === 'docs' && item.title === `API/${name}`);
		expect(entry, `Referência ausente para ${name}`).toBeDefined();
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.goto(`${base}/iframe.html?id=${entry!.id}&viewMode=docs`);
		await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Exemplo executável' })).toBeVisible();
		expect(errors).toEqual([]);
	});
}
