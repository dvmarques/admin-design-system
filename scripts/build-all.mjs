import { spawn } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

// Os pacotes dependem do `dist` uns dos outros, então seguem em série, nesta ordem.
const packages = ['@admin-ds/tokens', '@admin-ds/components', '@admin-ds/admin'];
// As aplicações só consomem os pacotes já construídos e são independentes entre si.
const apps = ['@admin-ds/docs', '@admin-ds/admin-demo'];

/** Nomes dos workspaces com script `build`, a partir dos padrões `workspaces` da raiz. */
function workspacesWithBuild() {
	const { workspaces = [] } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
	const names = [];
	for (const pattern of workspaces) {
		const dirs = pattern.endsWith('/*')
			? readdirSync(join(root, pattern.slice(0, -2)), { withFileTypes: true })
					.filter((entry) => entry.isDirectory())
					.map((entry) => join(root, pattern.slice(0, -2), entry.name))
			: [join(root, pattern)];
		for (const dir of dirs) {
			const manifest = join(dir, 'package.json');
			if (!existsSync(manifest)) continue;
			const { name, scripts } = JSON.parse(readFileSync(manifest, 'utf8'));
			if (scripts?.build) names.push(name);
		}
	}
	return names;
}

/**
 * O npm é executado pelo próprio Node, sem shell (`shell: true` com argumentos gera o
 * DEP0190 no Node 24). `npm_execpath` existe quando o script roda via `npm run`; fora
 * disso, procura o `npm-cli.js` instalado junto do Node.
 */
function npmCli() {
	const nodeDir = dirname(process.execPath);
	const candidates = [
		process.env.npm_execpath,
		join(nodeDir, 'node_modules', 'npm', 'bin', 'npm-cli.js'),
		join(nodeDir, '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js'),
	];
	const cli = candidates.find((file) => file && /\.[cm]?js$/.test(file) && existsSync(file));
	if (!cli) throw new Error('npm não encontrado; execute por `npm run build`.');
	return cli;
}

function run(cli, workspace) {
	return new Promise((resolve, reject) => {
		const child = spawn(process.execPath, [cli, 'run', 'build', '--workspace', workspace], {
			cwd: root,
			stdio: 'inherit',
		});
		child.on('error', reject);
		child.on('exit', (code) =>
			code === 0 ? resolve() : reject(new Error(`build de ${workspace} falhou (código ${code})`)),
		);
	});
}

try {
	const listed = [...packages, ...apps];
	const found = workspacesWithBuild();
	const unlisted = found.filter((name) => !listed.includes(name));
	const missing = listed.filter((name) => !found.includes(name));
	if (unlisted.length > 0 || missing.length > 0) {
		throw new Error(
			`scripts/build-all.mjs está desatualizado. Workspaces com build fora da lista: ${unlisted.join(', ') || 'nenhum'}; listados sem build: ${missing.join(', ') || 'nenhum'}.`,
		);
	}
	const cli = npmCli();
	for (const workspace of packages) {
		await run(cli, workspace);
	}
	await Promise.all(apps.map((workspace) => run(cli, workspace)));
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
}
