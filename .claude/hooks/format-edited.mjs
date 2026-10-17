// PostToolUse (Edit|Write): formata o arquivo editado com o Prettier do projeto.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const input = JSON.parse(readFileSync(0, 'utf8'));
const file = input.tool_input?.file_path;
if (file) {
	// shell: true é necessário para resolver npx.cmd no Windows.
	spawnSync('npx', ['--no-install', 'prettier', '--write', '--ignore-unknown', file], {
		cwd: input.cwd,
		shell: true,
		stdio: 'ignore',
	});
}
