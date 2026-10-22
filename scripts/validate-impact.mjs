#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { detectLocalImpact, loadWorkspaces, orderedWorkspaces } from './ci-impact.mjs';
import { npmCli } from './npm-cli.mjs';

export const commands = ['lint', 'typecheck', 'test'];

/** Builds dos pacotes, em ordem de dependência: typecheck e testes consomem o `dist` deles. */
function packageBuilds(workspaces) {
	return orderedWorkspaces(workspaces)
		.filter((workspace) => workspace.dir.startsWith('packages/'))
		.map((workspace) => ({
			label: `build ${workspace.manifest.name}`,
			args: ['run', 'build', '--workspace', workspace.manifest.name],
		}));
}

/**
 * Monta os passos de uma validação focal. `full` usa os mesmos comandos da CI; `scoped` só
 * os workspaces afetados. É um apoio local: não substitui `npm run validate` nem os gates da CI.
 */
export function planValidation(command, impact, workspaces) {
	if (!commands.includes(command)) throw new Error(`comando desconhecido: ${command}`);
	if (impact.mode === 'docs')
		return { steps: [], note: 'Somente documentação: nenhum workspace afetado.' };
	const names = impact.affected.map(
		(dir) => workspaces.find((workspace) => workspace.dir === dir).manifest.name,
	);
	const perWorkspace = (script, extra = []) => [
		'run',
		script,
		...extra,
		...names.flatMap((name) => ['--workspace', name]),
	];
	const scoped = impact.mode === 'scoped';
	if (command === 'lint') {
		return {
			steps: [
				scoped
					? {
							label: `eslint ${impact.affected.join(' ')}`,
							args: ['exec', '--', 'eslint', ...impact.affected],
						}
					: { label: 'lint', args: ['run', 'lint'] },
			],
		};
	}
	const builds = packageBuilds(workspaces);
	if (command === 'typecheck') {
		return {
			steps: [
				...builds,
				scoped
					? { label: `typecheck ${names.join(', ')}`, args: perWorkspace('typecheck') }
					: { label: 'typecheck', args: ['run', 'typecheck'] },
			],
		};
	}
	return {
		steps: [
			...builds,
			scoped
				? {
						label: `testes ${names.join(', ')}`,
						args: perWorkspace('test:quiet', ['--if-present']),
					}
				: { label: 'test:quality', args: ['run', 'test:quality'] },
		],
	};
}

function execute(steps, { verbose, cwd }) {
	const cli = npmCli();
	for (const step of steps) {
		const started = Date.now();
		const result = spawnSync(process.execPath, [cli, ...step.args], {
			cwd,
			encoding: 'utf8',
			stdio: verbose ? 'inherit' : 'pipe',
			maxBuffer: 256 * 1024 * 1024,
		});
		const seconds = ((Date.now() - started) / 1000).toFixed(1);
		if (result.status === 0) {
			console.log(`✓ ${step.label} (${seconds}s)`);
			continue;
		}
		console.error(`✗ ${step.label} (${seconds}s, código ${result.status ?? result.signal})`);
		if (!verbose) {
			const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trimEnd().split('\n');
			console.error(output.slice(-60).join('\n'));
			console.error('Use --verbose para a saída completa.');
		}
		return result.status || 1;
	}
	return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const [command, ...flags] = process.argv.slice(2);
	if (!commands.includes(command)) {
		console.error(
			'Uso: node scripts/validate-impact.mjs lint|typecheck|test [--base REV] [--dry-run] [--verbose]',
		);
		process.exit(2);
	}
	const baseIndex = flags.indexOf('--base');
	const { base, files, impact } = detectLocalImpact({
		base: baseIndex === -1 ? undefined : flags[baseIndex + 1],
	});
	if (!impact) {
		console.log(`Nenhuma alteração em relação a ${base}; nada a validar. A CI continua completa.`);
		process.exit(0);
	}
	const workspaces = loadWorkspaces();
	console.log(
		`Impacto: ${impact.mode} (${impact.reason}); afetados: ${impact.affected.join(', ') || 'nenhum'}; ${files.length} arquivo(s).`,
	);
	const plan = planValidation(command, impact, workspaces);
	if (plan.note) console.log(plan.note);
	if (flags.includes('--dry-run')) {
		console.log(JSON.stringify(plan.steps, null, 2));
		process.exit(0);
	}
	const status = execute(plan.steps, { verbose: flags.includes('--verbose'), cwd: process.cwd() });
	if (status === 0) console.log('Validação focal concluída. Os gates da CI continuam completos.');
	process.exit(status);
}
