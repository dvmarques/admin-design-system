import { readdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const packageNames = ['@admin-ds/tokens', '@admin-ds/components', '@admin-ds/admin'];
const baseline = JSON.parse(await readFile(resolve(root, 'docs/bundle-baseline.json'), 'utf8'));

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
			if (!manifest.peerDependencies?.[dependency]) {
				throw new Error(`${packageName} must declare ${dependency} as a peer dependency`);
			}
		}
	}

	const files = await filesIn(resolve(directory, 'dist'));
	const bytes = (await Promise.all(files.map((file) => stat(file)))).reduce(
		(sum, entry) => sum + entry.size,
		0,
	);
	const baselineBytes = baseline[packageName];
	if (!Number.isInteger(baselineBytes) || bytes > baselineBytes * 1.1) {
		throw new Error(`${packageName} exceeds its bundle baseline (${bytes} > ${baselineBytes})`);
	}
	console.log(`${packageName}: ${bytes} bytes (${files.length} files)`);
}
