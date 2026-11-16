import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

// Execute against a clean production build served by next start. Run once per checkout.
const [rootArg, originArg] = process.argv.slice(2);
if (!rootArg || !originArg)
	throw new Error('Uso: node scripts/measure-integrated-bundles.mjs <worktree> <origin>');
const root = resolve(rootArg);
const origin = new URL(originArg).origin;
const routes = [
	'/catalogo',
	'/exemplos/composicao-semantica/consulta',
	'/exemplos/composicao-semantica/formulario',
	'/exemplos/composicao-semantica/dashboard',
	'/exemplos/integracao',
];
const browser = await chromium.launch();
const all = new Set();
const byRoute = {};
const errors = [];
async function stats(paths) {
	let raw = 0,
		gzip = 0;
	for (const file of paths) {
		const data = await readFile(file);
		raw += data.length;
		gzip += gzipSync(data, { level: 9 }).length;
	}
	return { files: paths.length, raw, gzip };
}
async function filesUnder(dir) {
	const result = [];
	for (const ent of await readdir(dir, { withFileTypes: true })) {
		const path = join(dir, ent.name);
		if (ent.isDirectory()) result.push(...(await filesUnder(path)));
		else if (ent.isFile()) result.push(path);
	}
	return result;
}
for (const route of routes) {
	const context = await browser.newContext({
		viewport: { width: 1440, height: 900 },
		serviceWorkers: 'block',
	});
	const page = await context.newPage();
	const assets = new Set();
	page.on('request', (req) => {
		const u = new URL(req.url());
		if (
			u.origin === origin &&
			u.pathname.startsWith('/_next/static/') &&
			/\.(js|css)$/.test(u.pathname)
		)
			assets.add(u.pathname);
	});
	page.on('console', (msg) => {
		if (msg.type() === 'error' && /hydrat/i.test(msg.text()))
			errors.push(`${route}: ${msg.text()}`);
	});
	page.on('pageerror', (e) => errors.push(`${route}: ${e.message}`));
	const response = await page.goto(origin + route, { waitUntil: 'networkidle' });
	if (response.status() === 404) {
		byRoute[route] = null;
		await context.close();
		continue;
	}
	if (!response.ok()) throw new Error(`${route}: HTTP ${response.status()}`);
	// Exercise controls that exist on both revisions; optional new controls are included when present.
	for (const name of [
		'Mais ações',
		'Simular carregamento',
		'Simular erro',
		'Mostrar dados',
		'Validar cadastro',
		'Limpar dados',
	]) {
		const control = page.getByRole('button', { name, exact: true }).first();
		if (await control.isVisible()) {
			await control.click();
			await page.waitForTimeout(100);
		}
	}
	for (const name of ['Página 2', 'Detalhes do registro 103']) {
		const control = page.getByRole('button', { name, exact: true });
		if (await control.isVisible()) await control.click();
	}
	const input = page.getByRole('searchbox', { name: 'Filtrar clientes' });
	if (await input.count()) {
		await input.fill('Ana');
		await page.waitForTimeout(100);
	}
	await page.waitForLoadState('networkidle');
	const paths = [...assets]
		.sort()
		.map((url) => join(root, 'apps/admin-demo/.next', url.slice('/_next/'.length)));
	for (const path of paths) all.add(path);
	byRoute[route] = {
		js: await stats(paths.filter((p) => p.endsWith('.js'))),
		css: await stats(paths.filter((p) => p.endsWith('.css'))),
		assets: await Promise.all(
			[...assets].sort().map(async (url) => {
				const data = await readFile(
					join(root, 'apps/admin-demo/.next', url.slice('/_next/'.length)),
				);
				return { path: url, raw: data.length, gzip: gzipSync(data, { level: 9 }).length };
			}),
		),
	};
	await context.close();
}
await browser.close();
const story = await filesUnder(join(root, 'apps/docs/storybook-static'));
const css = story.filter((p) => p.endsWith('.css'));
const hashes = new Map();
for (const file of css) {
	const h = createHash('sha256')
		.update(await readFile(file))
		.digest('hex');
	hashes.set(h, [...(hashes.get(h) || []), file]);
}
console.log(
	JSON.stringify(
		{
			node: process.version,
			origin,
			byRoute,
			union: {
				js: await stats([...all].filter((p) => p.endsWith('.js'))),
				css: await stats([...all].filter((p) => p.endsWith('.css'))),
			},
			storybook: {
				js: await stats(story.filter((p) => p.endsWith('.js'))),
				css: await stats(css),
				duplicateCss: [...hashes.values()].filter((v) => v.length > 1),
			},
			errors,
		},
		null,
		2,
	),
);
