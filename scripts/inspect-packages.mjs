import { Buffer } from 'node:buffer';
import { readdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname } from 'node:path';
import { build } from 'esbuild';
import { checkBudget } from './quality-budget.mjs';
import { gzipSync } from 'node:zlib';

const root = fileURLToPath(new URL('..', import.meta.url));
const packageNames = [
	'@admin-ds/tokens',
	'@admin-ds/components',
	'@admin-ds/highlighted-code',
	'@admin-ds/admin',
];
// INSPECT_BUDGET_DIR permite aos testes de integração usar orçamentos reduzidos em fixtures.
const budgetDirectory = process.env.INSPECT_BUDGET_DIR
	? resolve(process.env.INSPECT_BUDGET_DIR)
	: resolve(root, 'docs');
const readBudget = async (name) =>
	JSON.parse(await readFile(resolve(budgetDirectory, name), 'utf8'));
const baseline = await readBudget('bundle-baseline.json');
const browserBudget = await readBudget('browser-budget.json');
const scenarioBudget = await readBudget('scenario-budget.json');

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

for (const packageName of packageNames) {
	const directory = resolve(root, 'packages', packageName.split('/').at(-1));
	const manifest = JSON.parse(await readFile(resolve(directory, 'package.json'), 'utf8'));
	if (!manifest.files?.includes('dist')) throw new Error(`${packageName} must publish dist`);

	for (const target of exportTargets(manifest.exports)) {
		if (!target.startsWith('./dist/'))
			throw new Error(`${packageName} exposes an internal export: ${target}`);
		await stat(resolve(directory, target));
	}

	if (packageName !== '@admin-ds/tokens') {
		for (const dependency of ['react', 'react-dom']) {
			if (!manifest.peerDependencies?.[dependency])
				throw new Error(`${packageName} must declare ${dependency} as a peer dependency`);
		}
	}

	const files = await filesIn(resolve(directory, 'dist'));
	const sizes = await Promise.all(
		files.map(async (file) => ({ file, size: (await stat(file)).size })),
	);
	const distributionBytes = sizes.reduce((sum, item) => sum + item.size, 0);
	const baselineBytes = baseline[packageName];
	if (!Number.isInteger(baselineBytes))
		throw new Error(`Baseline de distribuição ausente: ${packageName}`);
	checkBudget(
		packageName,
		'distribuição (dist completo)',
		distributionBytes,
		Math.floor(baselineBytes * 1.1),
	);

	const browserFiles = files.filter((file) => ['.js', '.mjs', '.css'].includes(extname(file)));
	const browserContents = await Promise.all(browserFiles.map((file) => readFile(file)));
	const browserBytes = browserContents.reduce((sum, data) => sum + data.length, 0);
	// gzip de cada artefato publicado; não representa a transferência de um cenário de consumo.
	const gzipBytes = browserContents.reduce(
		(sum, data) => sum + gzipSync(data, { level: 9 }).length,
		0,
	);
	const budget = browserBudget[packageName];
	if (!budget) throw new Error(`Orçamento de navegador ausente: ${packageName}`);
	checkBudget(packageName, 'JS/CSS publicados (sem maps e d.ts)', browserBytes, budget.bytes);
	checkBudget(packageName, 'JS/CSS gzip por arquivo', gzipBytes, budget.gzipBytes);
	console.log(
		`${packageName}: ${files.length} arquivos de distribuição, ${browserFiles.length} JS/CSS`,
	);
}

// Cenários de entrada pública: a medição é de um bundle minificado, não do dist inteiro.
for (const [name, scenario] of Object.entries(scenarioBudget)) {
	const entry = resolve(root, scenario.entry);
	const result = await build({
		entryPoints: [entry],
		bundle: true,
		minify: true,
		write: false,
		platform: 'browser',
		format: 'esm',
		external: ['react', 'react-dom', 'react/*', 'react-dom/*'],
		logLevel: 'silent',
	});
	const bytes = result.outputFiles.reduce((sum, file) => sum + file.contents.length, 0);
	const gzipBytes = result.outputFiles.reduce(
		(sum, file) => sum + gzipSync(file.contents, { level: 9 }).length,
		0,
	);
	checkBudget(name, 'cenário minificado', bytes, scenario.bytes);
	checkBudget(name, 'cenário gzip', gzipBytes, scenario.gzipBytes);

	// CSS compilado do cenário: arquivos públicos de estilo, minificados e medidos em conjunto.
	const css = await Promise.all(
		scenario.cssFiles.map(async (file) => {
			const result = await build({
				entryPoints: [resolve(root, file)],
				minify: true,
				write: false,
				outdir: 'out',
				logLevel: 'silent',
			});
			return Buffer.concat(result.outputFiles.map((output) => output.contents));
		}),
	);
	const cssBytes = css.reduce((sum, data) => sum + data.length, 0);
	const cssGzipBytes = gzipSync(Buffer.concat(css), { level: 9 }).length;
	checkBudget(name, 'cenário CSS minificado', cssBytes, scenario.cssBytes);
	checkBudget(name, 'cenário CSS gzip', cssGzipBytes, scenario.cssGzipBytes);
}
