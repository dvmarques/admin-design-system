// PreToolUse (Edit|Write): impede a edição manual de arquivos gerados.
import { readFileSync } from 'node:fs';

const rules = [
	[/(^|\/)package-lock\.json$/, 'Use npm install para atualizar o lockfile.'],
	[/(^|\/)packages\/tokens\/src\/generated\.ts$/, 'Edite packages/tokens/source e rode npm run generate --workspace @admin-ds/tokens.'],
	[/(^|\/)packages\/tokens\/dist\//, 'Gerado pelo build de @admin-ds/tokens.'],
	[/(^|\/)e2e\/[^/]+-snapshots\//, 'Atualize baselines pelo workflow update-visual-baselines, após revisar o diff visual.'],
];

const input = JSON.parse(readFileSync(0, 'utf8'));
const file = String(input.tool_input?.file_path ?? '').replaceAll('\\', '/');
const hit = rules.find(([pattern]) => pattern.test(file));
if (hit) {
	console.error(`Arquivo gerado, não edite à mão: ${file}. ${hit[1]}`);
	process.exit(2);
}
