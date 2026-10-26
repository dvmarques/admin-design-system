// PostToolUse de apply_patch: formata apenas os arquivos finais elegíveis.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { generatedReason, readPatch } from './patch-files.mjs';

try {
	const input = JSON.parse(readFileSync(0, 'utf8'));
	// isError é uma indicação defensiva; tool_response não tem status universal documentado.
	if (!input.tool_response?.isError) {
		const { root, entries } = readPatch(input);
		const files = [
			...new Set(
				entries
					.filter(
						(entry) =>
							!entry.removed &&
							existsSync(entry.absolute) &&
							statSync(entry.absolute).isFile() &&
							!generatedReason(root, entry.absolute) &&
							!generatedReason(root, entry.canonical),
					)
					.map((entry) => entry.absolute),
			),
		];
		if (files.length > 0) {
			const prettier = join(root, 'node_modules', 'prettier', 'bin', 'prettier.cjs');
			if (!existsSync(prettier))
				throw new Error('Prettier local ausente. Instale as dependências com npm ci.');
			const result = spawnSync(
				process.execPath,
				[prettier, '--write', '--ignore-unknown', '--', ...files],
				{
					cwd: root,
					encoding: 'utf8',
					timeout: 20000,
				},
			);
			if (result.error || result.status !== 0) {
				throw new Error(
					result.error?.message ??
						(result.stderr || result.stdout || 'Prettier falhou.').slice(0, 2000),
				);
			}
		}
	}
} catch (error) {
	// O hook informa a falha; o gate npm run format continua obrigatório.
	console.log(JSON.stringify({ systemMessage: `Formatação Codex: ${error.message}` }));
}
