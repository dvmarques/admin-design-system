// Monta `site/` para o GitHub Pages: o demo estático na raiz e o Storybook em `storybook/`.
// Com `--build`, gera antes o demo (GITHUB_PAGES=true) e o Storybook; sem a flag, usa os builds
// existentes (`apps/admin-demo/out` e `apps/docs/storybook-static`). Falha, sem montar nada, se um
// dos dois faltar. Os pacotes (`@admin-ds/*`) precisam estar construídos (`npm run build`).
import { spawnSync } from 'node:child_process';
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const demo = join(root, 'apps/admin-demo/out');
const storybook = join(root, 'apps/docs/storybook-static');
const site = join(root, 'site');

if (process.argv.includes('--build')) {
	const run = (workspace, env = {}) => {
		const result = spawnSync('npm', ['run', 'build', '--workspace', workspace], {
			cwd: root,
			env: { ...process.env, ...env },
			stdio: 'inherit',
			shell: process.platform === 'win32',
		});
		if (result.status !== 0) process.exit(result.status ?? 1);
	};
	run('@admin-ds/admin-demo', { GITHUB_PAGES: 'true' });
	run('@admin-ds/docs');
}

for (const [name, path] of [
	['demo (GITHUB_PAGES=true npm run build --workspace @admin-ds/admin-demo)', demo],
	['Storybook (npm run build --workspace @admin-ds/docs)', storybook],
]) {
	if (!existsSync(join(path, 'index.html'))) {
		console.error(`Build ausente: ${name}. Esperado em ${path}.`);
		process.exit(1);
	}
}

await rm(site, { recursive: true, force: true });
await mkdir(site, { recursive: true });
await cp(demo, site, { recursive: true });
await cp(storybook, join(site, 'storybook'), { recursive: true });
// Sem Jekyll: ele ignoraria os diretórios que começam com "_" (como `_next`).
await writeFile(join(site, '.nojekyll'), '');
console.log(`Site montado em ${site}`);
