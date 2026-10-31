#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isDocsFile } from './ci-changed-paths.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));

/**
 * Dependências que não aparecem nos `package.json`: componentes e admin consomem os tokens
 * gerados (CSS e variáveis) sem declará-los. `findUndeclaredReferences` e os testes
 * garantem que nenhuma outra referência entre workspaces fique fora do grafo.
 */
export const implicitDependencies = {
	'@dvmarques/admin-ds-components': ['@dvmarques/admin-ds-tokens'],
	'@dvmarques/admin-ds-highlighted-code': ['@dvmarques/admin-ds-tokens'],
	'@dvmarques/admin-ds-admin': ['@dvmarques/admin-ds-tokens'],
};

const dependencyFields = [
	'dependencies',
	'devDependencies',
	'peerDependencies',
	'optionalDependencies',
];

const full = (reason, workspaces) => ({
	mode: 'full',
	reason,
	affected: (workspaces ?? []).map((workspace) => workspace.dir),
});

/** Workspaces a partir dos padrões `dir/*` da raiz; qualquer outro formato é rejeitado. */
export function loadWorkspaces(repoRoot = root) {
	const { workspaces: patterns } = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
	if (!Array.isArray(patterns) || patterns.length === 0) throw new Error('workspaces ausentes');
	const found = [];
	for (const pattern of patterns) {
		if (typeof pattern !== 'string' || !/^[\w.-]+\/\*$/.test(pattern)) {
			throw new Error(`padrão de workspace não suportado: ${pattern}`);
		}
		const parent = pattern.slice(0, -2);
		const parentDir = join(repoRoot, parent);
		if (!existsSync(parentDir)) continue;
		for (const entry of readdirSync(parentDir, { withFileTypes: true })) {
			const manifest = join(parentDir, entry.name, 'package.json');
			if (!entry.isDirectory() || !existsSync(manifest)) continue;
			found.push({
				dir: `${parent}/${entry.name}`,
				manifest: JSON.parse(readFileSync(manifest, 'utf8')),
			});
		}
	}
	return found.sort((a, b) => a.dir.localeCompare(b.dir));
}

function isSafePath(file) {
	return (
		typeof file === 'string' &&
		file.length > 0 &&
		!file.startsWith('/') &&
		!/^[A-Za-z]:/.test(file) &&
		!/[\\\0\r\n]/.test(file) &&
		!file.split('/').some((segment) => segment === '' || segment === '.' || segment === '..')
	);
}

/** Dependências diretas (declaradas e implícitas) de cada workspace, por nome. */
function buildGraph(workspaces) {
	const names = new Map(workspaces.map((workspace) => [workspace.manifest?.name, workspace]));
	if (
		workspaces.some(
			(workspace) => typeof workspace.manifest?.name !== 'string' || !workspace.manifest.name,
		) ||
		names.size !== workspaces.length ||
		new Set(workspaces.map((workspace) => workspace.dir)).size !== workspaces.length
	) {
		return null;
	}
	const dependencies = new Map();
	for (const workspace of workspaces) {
		const fields = dependencyFields.map((field) => workspace.manifest[field] ?? {});
		if (
			fields.some((value) => typeof value !== 'object' || value === null || Array.isArray(value))
		) {
			return null;
		}
		const declared = fields.flatMap((value) => Object.keys(value));
		const implicit = implicitDependencies[workspace.manifest.name] ?? [];
		if (implicit.some((name) => !names.has(name))) return null;
		dependencies.set(
			workspace.manifest.name,
			[...new Set([...declared, ...implicit])].filter((name) => names.has(name)),
		);
	}
	return { names, dependencies };
}

/** Ordem topológica (dependências primeiro); `null` se houver ciclo. */
function topologicalOrder(workspaces, dependencies) {
	const order = [];
	const state = new Map();
	const visit = (workspace) => {
		const name = workspace.manifest.name;
		if (state.get(name) === 'done') return true;
		if (state.get(name) === 'visiting') return false;
		state.set(name, 'visiting');
		for (const dependency of dependencies.get(name)) {
			const target = workspaces.find((candidate) => candidate.manifest.name === dependency);
			if (!visit(target)) return false;
		}
		state.set(name, 'done');
		order.push(workspace);
		return true;
	};
	return workspaces.every(visit) ? order : null;
}

/** Workspaces em ordem de dependência (dependências primeiro); lança se o grafo for inválido. */
export function orderedWorkspaces(workspaces) {
	const graph = buildGraph(workspaces);
	const order = graph && topologicalOrder(workspaces, graph.dependencies);
	if (!order) throw new Error('grafo de workspaces inválido');
	return order;
}

/**
 * Classifica os arquivos alterados. `docs` só contém documentação; `scoped` contém apenas
 * arquivos de workspaces (mais documentação); qualquer dúvida resulta em `full`.
 * Nunca dispensa por si só os gates obrigatórios; veja `decideScope`.
 */
export function classifyImpact(files, workspaces) {
	if (!Array.isArray(workspaces) || workspaces.length === 0) return full('workspaces ausentes');
	const graph = buildGraph(workspaces);
	if (!graph) return full('manifestos inválidos', workspaces);
	const order = topologicalOrder(workspaces, graph.dependencies);
	if (!order) return full('dependências cíclicas', workspaces);
	if (!Array.isArray(files) || files.length === 0)
		return full('lista de arquivos ausente', workspaces);

	const changed = new Set();
	for (const file of files) {
		if (!isSafePath(file)) return full('caminho inseguro', workspaces);
		const owner = workspaces.find((workspace) => file.startsWith(`${workspace.dir}/`));
		if (owner) {
			if (file === `${owner.dir}/package.json`)
				return full('manifesto de workspace alterado', workspaces);
			changed.add(owner.manifest.name);
		} else if (!isDocsFile(file)) {
			return full(`caminho fora dos workspaces e da documentação: ${file}`, workspaces);
		}
	}
	if (changed.size === 0) return { mode: 'docs', reason: 'somente documentação', affected: [] };

	let grew = true;
	while (grew) {
		grew = false;
		for (const workspace of workspaces) {
			const name = workspace.manifest.name;
			if (
				!changed.has(name) &&
				graph.dependencies.get(name).some((dependency) => changed.has(dependency))
			) {
				changed.add(name);
				grew = true;
			}
		}
	}
	return {
		mode: 'scoped',
		reason: 'fechamento das dependências dos workspaces alterados',
		affected: order
			.filter((workspace) => changed.has(workspace.manifest.name))
			.map((workspace) => workspace.dir),
	};
}

/**
 * Decide o que os jobs pesados da CI podem dispensar. Só PRs para `develop` com impacto
 * conhecido reduzem trabalho; push, PR para `master` (release) e qualquer dúvida executam tudo.
 * O job de qualidade e a política de develop nunca dependem desta decisão.
 */
export function decideScope({ event, baseRef, impact }) {
	const everything = {
		reduced: false,
		docsOnly: false,
		buildDocs: true,
		buildDemo: true,
		e2e: true,
	};
	if (event !== 'pull_request' || baseRef !== 'develop' || !impact) return everything;
	if (impact.mode === 'docs') {
		return { reduced: true, docsOnly: true, buildDocs: false, buildDemo: false, e2e: false };
	}
	if (impact.mode !== 'scoped' || !Array.isArray(impact.affected)) return everything;
	const affected = (dir) => impact.affected.includes(dir);
	return {
		reduced: true,
		docsOnly: false,
		buildDocs: affected('apps/docs'),
		buildDemo: affected('apps/admin-demo'),
		// O Playwright serve e testa somente `apps/admin-demo`; ver o teste de equivalência.
		e2e: affected('apps/admin-demo'),
	};
}

/**
 * Argumentos do git. Nos jobs em container o checkout pertence a outro usuário e o `HOME`
 * do job não tem o `safe.directory` que o `actions/checkout` grava em um `HOME` temporário;
 * sem isso, todo comando falha com "dubious ownership". Na CI, confia apenas no diretório
 * do próprio checkout, só para estes comandos de leitura.
 */
export function gitArguments(args, cwd, env = process.env) {
	return env.GITHUB_ACTIONS === 'true' ? ['-c', `safe.directory=${resolve(cwd)}`, ...args] : args;
}

function git(args, cwd) {
	try {
		return execFileSync('git', gitArguments(args, cwd), {
			cwd,
			encoding: 'utf8',
			maxBuffer: 256 * 1024 * 1024,
			stdio: ['ignore', 'pipe', 'pipe'],
		});
	} catch (error) {
		const detail = String(error.stderr ?? '')
			.trim()
			.split('\n')[0];
		throw new Error(`git ${args[0]} falhou${detail ? `: ${detail}` : ''}`, { cause: error });
	}
}

const splitNul = (output) => output.split('\0').filter(Boolean);

/**
 * Arquivos alterados entre `base` e `head` (ou a árvore de trabalho, com `worktree`), sem
 * detecção de renomeação para que origem e destino contem, e com `-z` para nomes arbitrários.
 * Lança se a revisão não existir; quem chama deve tratar como `full`.
 */
export function listChangedFiles({ cwd = root, base, head = 'HEAD', worktree = false }) {
	git(['rev-parse', '--verify', '--quiet', `${base}^{commit}`], cwd);
	const files = splitNul(
		git(['diff', '--name-only', '-z', '--no-renames', base, ...(worktree ? [] : [head])], cwd),
	);
	if (worktree)
		files.push(...splitNul(git(['ls-files', '--others', '--exclude-standard', '-z'], cwd)));
	return [...new Set(files)];
}

/** Em PRs, o checkout é o commit de merge: o primeiro pai é a base e o segundo, o topo da PR. */
export function listPullRequestFiles({ cwd = root } = {}) {
	const [, ...parents] = git(['rev-list', '--parents', '-n', '1', 'HEAD'], cwd).trim().split(' ');
	if (parents.length !== 2) throw new Error('HEAD não é um commit de merge de PR');
	return listChangedFiles({ cwd, base: parents[0], head: 'HEAD' });
}

/** Base local: `--base`, `IMPACT_BASE`/`GITHUB_BASE_SHA` ou o ancestral comum com `develop`. */
export function resolveLocalBase({
	cwd = root,
	base = process.env.IMPACT_BASE || process.env.GITHUB_BASE_SHA,
} = {}) {
	if (base) return base;
	for (const branch of ['origin/develop', 'develop']) {
		try {
			return git(['merge-base', 'HEAD', branch], cwd).trim();
		} catch {
			// tenta a próxima referência
		}
	}
	throw new Error('base de comparação indisponível (origin/develop e develop ausentes)');
}

/** Impacto da árvore de trabalho atual; falhas de detecção viram `full` com o motivo. */
export function detectLocalImpact({ cwd = root, base } = {}) {
	try {
		const workspaces = loadWorkspaces(cwd);
		const resolved = resolveLocalBase({ cwd, base });
		const files = listChangedFiles({ cwd, base: resolved, worktree: true });
		return {
			base: resolved,
			files,
			impact: files.length ? classifyImpact(files, workspaces) : null,
		};
	} catch (error) {
		return {
			base: null,
			files: [],
			impact: full(`detecção indisponível: ${error.message.split('\n')[0]}`),
		};
	}
}

/**
 * Referências entre workspaces que não estão no grafo: nomes de pacote e imports relativos
 * que saem do diretório do workspace. Usado nos testes para provar que o grafo é completo.
 */
export function findUndeclaredReferences(workspaces, repoRoot = root) {
	const graph = buildGraph(workspaces);
	if (!graph) throw new Error('manifestos inválidos');
	const skip = new Set(['node_modules', 'dist', '.next', 'storybook-static', 'test-results']);
	const sources = /\.(?:[cm]?[jt]sx?|json|css|mdx?|ya?ml)$/;
	const specifier = /['"`](\.{1,2}\/[^'"`\s]*)['"`]/g;
	const inside = (path, dir) => path === dir || path.startsWith(dir + sep);
	const results = [];
	const walk = (dir, visit) => {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			if (skip.has(entry.name)) continue;
			const path = join(dir, entry.name);
			if (entry.isDirectory()) walk(path, visit);
			else if (sources.test(entry.name) && !entry.name.startsWith('package')) visit(path);
		}
	};
	for (const workspace of workspaces) {
		const allowed = new Set([
			workspace.manifest.name,
			...graph.dependencies.get(workspace.manifest.name),
		]);
		walk(join(repoRoot, workspace.dir), (path) => {
			const text = readFileSync(path, 'utf8');
			const file = relative(repoRoot, path).split(sep).join('/');
			for (const name of graph.names.keys()) {
				if (!allowed.has(name) && text.includes(name)) results.push({ file, reference: name });
			}
			for (const [, relativeSpecifier] of text.matchAll(specifier)) {
				const target = resolve(dirname(path), relativeSpecifier);
				for (const other of workspaces) {
					if (allowed.has(other.manifest.name)) continue;
					if (inside(target, join(repoRoot, other.dir)))
						results.push({ file, reference: other.dir });
				}
			}
		});
	}
	return results;
}

function history(count, cwd, ref = 'HEAD') {
	const workspaces = loadWorkspaces(cwd);
	const tally = {};
	const commits = git(['rev-list', '--first-parent', '-n', String(count), ref], cwd)
		.trim()
		.split('\n');
	for (const commit of commits) {
		let result;
		try {
			result = classifyImpact(
				listChangedFiles({ cwd, base: `${commit}^1`, head: commit }),
				workspaces,
			);
		} catch {
			result = full('detecção indisponível');
		}
		const key = result.mode === 'scoped' ? `scoped (${result.affected.join(', ')})` : result.mode;
		tally[key] = (tally[key] ?? 0) + 1;
	}
	return { commits: commits.length, tally };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const argument = (name) => {
		const index = process.argv.indexOf(name);
		return index === -1 ? undefined : process.argv[index + 1];
	};
	try {
		if (argument('--history')) {
			console.log(
				JSON.stringify(
					history(Number(argument('--history')), root, argument('--ref') ?? 'HEAD'),
					null,
					2,
				),
			);
		} else {
			const { base, files, impact } = detectLocalImpact({ base: argument('--base') });
			console.log(
				JSON.stringify(
					impact ?? { mode: 'none', reason: 'nenhuma alteração em relação à base', affected: [] },
					null,
					2,
				),
			);
			if (process.argv.includes('--files')) console.error(`base=${base}\n${files.join('\n')}`);
		}
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
}
