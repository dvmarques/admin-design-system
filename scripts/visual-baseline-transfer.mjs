// Produz um artefato de dados (PNGs + manifesto), nunca comandos para o job de escrita.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { Buffer } from 'node:buffer';
import {
	appendFileSync,
	closeSync,
	constants,
	fstatSync,
	mkdirSync,
	openSync,
	readFileSync,
	writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';

const allowed = /^e2e\/[a-zA-Z0-9._-]+\.spec\.ts-snapshots\/[a-zA-Z0-9._-]+\.png$/;
const stage = 'baseline-transfer';
const branch = process.env.GITHUB_REF_NAME;
const sha = process.env.GITHUB_SHA;

if (
	!branch ||
	!/^[a-zA-Z0-9._/-]+$/.test(branch) ||
	['develop', 'master'].includes(branch) ||
	branch.startsWith('release/')
) {
	throw new Error('Somente branches de feature do mesmo repositório podem atualizar baselines.');
}
if (!/^[0-9a-f]{40}$/.test(sha ?? '') || process.env.GITHUB_REF !== 'refs/heads/' + branch) {
	throw new Error('Ref/commit de origem inválidos.');
}
const output = execFileSync('git', [
	'status',
	'--porcelain=v1',
	'-z',
	'--untracked-files=all',
	'--',
	'e2e/',
]);
const records = output.toString('utf8').split('\0').filter(Boolean);
const changes = [];
for (const record of records) {
	const status = record.slice(0, 2);
	const path = record.slice(3);
	if (!allowed.test(path) || status.includes('R') || status.includes('C')) {
		throw new Error('Alteração inesperada ao gerar snapshots: ' + path + ' (' + status + ')');
	}
	if (changes.some((entry) => entry.path === path)) throw new Error('Caminho duplicado: ' + path);
	const deleted = status.includes('D');
	if (deleted) {
		changes.push({ path, type: 'delete' });
		continue;
	}
	// Abre uma única vez e impede seguir links simbólicos: evita TOCTOU.
	const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
	let content;
	try {
		if (!fstatSync(fd).isFile()) throw new Error('Snapshot não é arquivo: ' + path);
		content = readFileSync(fd);
	} finally {
		closeSync(fd);
	}
	if (!content.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) {
		throw new Error('Snapshot inválido (PNG): ' + path);
	}
	if (content.byteLength > 12 * 1024 * 1024) throw new Error('PNG acima do limite: ' + path);
	const dest = join(stage, path);
	mkdirSync(dirname(dest), { recursive: true });
	writeFileSync(dest, content);
	changes.push({ path, type: 'write', sha256: createHash('sha256').update(content).digest('hex') });
}
if (changes.length > 1000) throw new Error('Volume inesperado de snapshots: ' + changes.length);
mkdirSync(stage, { recursive: true });
writeFileSync(
	join(stage, 'manifest.json'),
	JSON.stringify({ sha, branch, changes }, null, 2) + '\n',
);
if (process.env.GITHUB_OUTPUT)
	appendFileSync(process.env.GITHUB_OUTPUT, 'changed=' + (changes.length > 0) + '\n');
console.log(
	changes.length +
		' snapshots preparados: ' +
		changes.filter((x) => x.type === 'write').length +
		' PNGs, ' +
		changes.filter((x) => x.type === 'delete').length +
		' deleções.',
);
