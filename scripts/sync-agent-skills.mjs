#!/usr/bin/env node
// Espelha as skills próprias de `.agents/skills` (fonte canônica, lida por Codex
// e Cursor) em `.claude/skills` (lida pelo Claude Code). Usa cópia, não symlink,
// para funcionar no Windows sem privilégios. As skills do OpenSpec são geradas
// por `openspec update` e ficam fora desta sincronização.
import { cp, mkdir, readFile, readdir, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const root = new URL('../', import.meta.url);

async function listFiles(dir, prefix = '') {
	const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
	const nested = await Promise.all(
		entries.map((entry) =>
			entry.isDirectory()
				? listFiles(new URL(`${entry.name}/`, dir), `${prefix}${entry.name}/`)
				: [`${prefix}${entry.name}`],
		),
	);
	return nested.flat().sort();
}

export async function findDrift(names, source, target) {
	const drift = [];
	for (const name of names) {
		const from = new URL(`${name}/`, source);
		const to = new URL(`${name}/`, target);
		const [a, b] = await Promise.all([listFiles(from), listFiles(to)]);
		let same = a.length > 0 && a.join('\n') === b.join('\n');
		for (const file of same ? a : []) {
			const [x, y] = await Promise.all([
				readFile(new URL(file, from)),
				readFile(new URL(file, to)),
			]);
			if (!x.equals(y)) same = false;
		}
		if (!same) drift.push(name);
	}
	return drift;
}

async function main() {
	const lock = JSON.parse(await readFile(new URL('skills-lock.json', root), 'utf8'));
	const names = Object.keys(lock.skills);
	const source = new URL('.agents/skills/', root);
	const target = new URL('.claude/skills/', root);
	const drift = await findDrift(names, source, target);

	if (process.argv.includes('--check')) {
		if (drift.length > 0)
			throw new Error(
				`Skills fora de sincronia com .agents/skills: ${drift.join(', ')}. Execute npm run sync:agent-skills.`,
			);
		return;
	}
	for (const name of drift) {
		await rm(new URL(`${name}/`, target), { recursive: true, force: true });
		await mkdir(target, { recursive: true });
		await cp(new URL(`${name}/`, source), new URL(`${name}/`, target), { recursive: true });
		console.log(`sincronizada: ${name}`);
	}
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
