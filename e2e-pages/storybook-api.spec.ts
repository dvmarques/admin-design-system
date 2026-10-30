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
	await expect(page.getByRole('heading', { level: 1, name: /AdsButton$/ })).toBeVisible();
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
		await page.goto(`${base}/iframe.html?id=${button!.id}&viewMode=docs&globals=theme:${theme}`);
		const example = page.locator(`.docs-story [data-theme="${theme}"]`).first();
		await expect(example).toBeVisible();
		// O tema vale para os exemplos (Canvas); o corpo MDX segue o chrome do Storybook.
		const background = await example.evaluate((el) => getComputedStyle(el).backgroundColor);
		expect(background).toBe(theme === 'dark' ? 'rgb(15, 23, 42)' : 'rgb(248, 250, 252)');
	});
}

for (const name of ['AdsSmartTable', 'AdsAdminShell', 'AdsInputGroup'] as const) {
	test(`Storybook publicado: a referência ${name} carrega com exemplos reais`, async ({
		page,
		request,
	}) => {
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
		await expect(
			page.getByRole('heading', { level: 1, name: new RegExp(`${name}$`) }),
		).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Exemplo executável' })).toBeVisible();
		expect(errors).toEqual([]);
	});
}
