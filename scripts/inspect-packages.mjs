import { readdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = fileURLToPath(new URL('..', import.meta.url));
const packageNames = ['@admin-ds/tokens', '@admin-ds/components', '@admin-ds/admin'];
const baseline = JSON.parse(await readFile(resolve(root, 'docs/bundle-baseline.json'), 'utf8'));
const browserBudget = JSON.parse(await readFile(resolve(root, 'docs/browser-budget.json'), 'utf8'));

async function filesIn(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const path = resolve(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await filesIn(path)));
		else files.push(path);
	}
	return files;
}

function exportTargets(value) {
	if (typeof value === 'string') return [value];
	if (!value || typeof value !== 'object') return [];
	return Object.values(value).flatMap(exportTargets);
}

function checkBudget(packageName, metric, actual, limit) {
	if (!Number.isInteger(limit) || limit < 0) throw new Error(`Orçamento inválido: ${packageName} / ${metric}`);
	console.log(`${packageName} / ${metric}: ${actual} bytes (limite ${limit})`);
	if (actual > limit) throw new Error(`${packageName} / ${metric} excedeu o orçamento: ${actual} > ${limit} bytes`);
}

for (const packageName of packageNames) {
	const directory = resolve(root, 'packages', packageName.split('/').at(-1));
	const manifest = JSON.parse(await readFile(resolve(directory, 'package.json'), 'utf8'));
	if (!manifest.files?.includes('dist')) throw new Error(`${packageName} must publish dist`);

	for (const target of exportTargets(manifest.exports)) {
		if (!target.startsWith('./dist/')) throw new Error(`${packageName} exposes an internal export: ${target}`);
		await stat(resolve(directory, target));
	}

	if (packageName !== '@admin-ds/tokens') {
		for (const dependency of ['react', 'react-dom']) {
			if (!manifest.peerDependencies?.[dependency]) throw new Error(`${packageName} must declare ${dependency} as a peer dependency`);
		}
	}

	const files = await filesIn(resolve(directory, 'dist'));
	const sizes = await Promise.all(files.map(async (file) => ({ file, size: (await stat(file)).size })));
	const distributionBytes = sizes.reduce((sum, item) => sum + item.size, 0);
	const baselineBytes = baseline[packageName];
	if (!Number.isInteger(baselineBytes)) throw new Error(`Baseline de distribuição ausente: ${packageName}`);
	checkBudget(packageName, 'distribuição (dist completo)', distributionBytes, Math.floor(baselineBytes * 1.1));

	const browserFiles = files.filter((file) => ['.js', '.mjs', '.css'].includes(extname(file)));
	const browserContents = await Promise.all(browserFiles.map((file) => readFile(file)));
	const browserBytes = browserContents.reduce((sum, data) => sum + data.length, 0);
	const gzipBytes = browserContents.reduce((sum, data) => sum + gzipSync(data, { level: 9 }).length, 0);
	const budget = browserBudget[packageName];
	if (!budget) throw new Error(`Orçamento de navegador ausente: ${packageName}`);
	checkBudget(packageName, 'JS/CSS publicados (sem maps e d.ts)', browserBytes, budget.bytes);
	checkBudget(packageName, 'JS/CSS gzip por arquivo', gzipBytes, budget.gzipBytes);
	console.log(`${packageName}: ${files.length} arquivos de distribuição, ${browserFiles.length} JS/CSS`);
}
