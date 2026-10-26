import { execFileSync } from 'node:child_process';
import { lstatSync, readlinkSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

function inside(root, file) {
	const path = relative(root, file);
	return path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}

// Resolve também os ancestrais de arquivos novos, para não seguir symlinks para fora.
function canonicalPath(file, visited = new Set()) {
	if (visited.has(file)) throw new Error(`Symlink circular: ${file}`);
	visited.add(file);
	const entry = lstatSync(file, { throwIfNoEntry: false });
	if (entry?.isSymbolicLink())
		return canonicalPath(resolve(dirname(file), readlinkSync(file)), visited);
	if (entry) return realpathSync(file);
	const parent = dirname(file);
	if (parent === file) throw new Error(`Caminho sem ancestral existente: ${file}`);
	return join(canonicalPath(parent, visited), relative(parent, file));
}

export function readPatch(input) {
	if (typeof input.cwd !== 'string') throw new Error('Payload sem cwd.');
	const command =
		typeof input.tool_input === 'string' ? input.tool_input : input.tool_input?.command;
	if (typeof command !== 'string') throw new Error('Payload apply_patch sem tool_input.command.');
	const lines = command.replaceAll('\r\n', '\n').trim().split('\n');
	if (lines[0] !== '*** Begin Patch' || lines.at(-1) !== '*** End Patch') {
		throw new Error('Envelope apply_patch inválido.');
	}
	const root = realpathSync(
		execFileSync('git', ['rev-parse', '--show-toplevel'], {
			cwd: input.cwd,
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'pipe'],
		}).trim(),
	);
	const entries = [];
	let current;
	for (const line of lines) {
		const header = /^\*\*\* (Add File|Update File|Delete File|Move to): (.+)$/.exec(line);
		if (!header) continue;
		const [, action, path] = header;
		if (action === 'Move to') {
			if (!current || current.action !== 'Update File') throw new Error('Move sem Update File.');
			current.removed = true;
		}
		const absolute = resolve(input.cwd, path.replaceAll('\\', '/'));
		const canonical = canonicalPath(absolute);
		if (!inside(root, absolute) || !inside(root, canonical)) {
			throw new Error(`Caminho fora da worktree: ${path}`);
		}
		current = { action, absolute, canonical, removed: action === 'Delete File' };
		entries.push(current);
	}
	if (entries.length === 0) throw new Error('Patch sem arquivos reconhecidos.');
	return { root, entries };
}

export function generatedReason(root, file) {
	const path = relative(root, file).replaceAll('\\', '/');
	const rules = [
		[/^package-lock\.json$/, 'Use npm install para atualizar o lockfile.'],
		[
			/^packages\/tokens\/src\/generated\.ts$/,
			'Edite packages/tokens/source e execute npm run generate --workspace @admin-ds/tokens.',
		],
		[/^packages\/tokens\/dist\//, 'Execute o build de @admin-ds/tokens.'],
		[
			/^e2e\/[^/]+-snapshots\//,
			'Atualize baselines pelo workflow update-visual-baselines após revisar o diff visual.',
		],
	];
	return rules.find(([pattern]) => pattern.test(path))?.[1];
}
