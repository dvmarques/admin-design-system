import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

/**
 * Caminho do `npm-cli.js`, para executar o npm pelo próprio Node, sem shell (`shell: true`
 * com argumentos gera o DEP0190 no Node 24). `npm_execpath` existe quando o script roda via
 * `npm run`; fora disso, procura o `npm-cli.js` instalado junto do Node.
 */
export function npmCli() {
	const nodeDir = dirname(process.execPath);
	const candidates = [
		process.env.npm_execpath,
		join(nodeDir, 'node_modules', 'npm', 'bin', 'npm-cli.js'),
		join(nodeDir, '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js'),
	];
	const cli = candidates.find((file) => file && /\.[cm]?js$/.test(file) && existsSync(file));
	if (!cli) throw new Error('npm não encontrado; execute por `npm run`.');
	return cli;
}
