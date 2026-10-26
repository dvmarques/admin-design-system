// PreToolUse de apply_patch: examina o patch completo antes de qualquer edição.
import { readFileSync } from 'node:fs';
import { generatedReason, readPatch } from './patch-files.mjs';

try {
	const { root, entries } = readPatch(JSON.parse(readFileSync(0, 'utf8')));
	for (const entry of entries) {
		const reason = generatedReason(root, entry.absolute) ?? generatedReason(root, entry.canonical);
		if (reason) throw new Error(`Arquivo gerado, não edite à mão: ${entry.absolute}. ${reason}`);
	}
} catch (error) {
	console.error(`Proteção de arquivos gerados: ${error.message}`);
	process.exitCode = 2;
}
