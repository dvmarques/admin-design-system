import { mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

export default async function prepareVisualAudit() {
	const output = resolve(process.cwd(), 'visual-audit-results');
	// Uma execução nova não pode misturar amostras com evidências antigas.
	rmSync(output, { recursive: true, force: true });
	mkdirSync(output, { recursive: true });
}
