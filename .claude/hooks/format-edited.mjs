// PostToolUse (Edit|Write): formata o arquivo editado com o Prettier do projeto.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8'));
const file = input.tool_input?.file_path;
const prettier = join(input.cwd ?? process.cwd(), 'node_modules', 'prettier', 'bin', 'prettier.cjs');

// Sem shell: o caminho do arquivo é argumento, nunca interpretado como comando.
if (file && existsSync(prettier)) {
	spawnSync(process.execPath, [prettier, '--write', '--ignore-unknown', file], {
		cwd: input.cwd,
		stdio: 'ignore',
	});
}
