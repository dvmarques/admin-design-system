import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export const auditThemes = ['light', 'dark'];
export const auditWidths = [390, 1440];

function inventoryNames(root) {
	const source = readFileSync(join(root, 'docs/visual-audit-152-inventory.md'), 'utf8');
	const tick = String.fromCharCode(96);
	const names = source.split(/\r?\n/)
		.filter((line) => line.startsWith('| ' + tick))
		.map((line) => line.split('|')[1].trim().replaceAll(tick, ''));
	if (names.length === 0 || new Set(names).size !== names.length) {
		throw new Error('Matriz de inspeção vazia ou com exports duplicados');
	}
	return names;
}

function escapeCell(value) {
	return String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
}

export function buildVisualAuditReport({
	root = process.cwd(),
	themes = auditThemes,
	widths = auditWidths,
} = {}) {
	const project = resolve(root);
	const folder = join(project, 'visual-audit-results');
	mkdirSync(folder, { recursive: true });
	const names = inventoryNames(project);
	const expected = names.length * themes.length * widths.length;
	const captured = new Map();
	const runProblems = [];
	for (const theme of themes) {
		for (const width of widths) {
			const file = join(folder, theme + '-' + width + '.json');
			if (!existsSync(file)) {
				runProblems.push('Execução ausente: ' + theme + ', ' + width + 'px');
				continue;
			}
			let run;
			try {
				run = JSON.parse(readFileSync(file, 'utf8'));
			} catch (error) {
				runProblems.push('Manifesto ilegível: ' + file + ' (' + String(error) + ')');
				continue;
			}
			if (run.theme !== theme || run.width !== width || !Array.isArray(run.samples)) {
				runProblems.push('Formato inválido: ' + file);
				continue;
			}
			for (const sample of run.samples) {
				const key = sample.name + '/' + theme + '/' + width;
				if (!names.includes(sample.name) || captured.has(key) ||
					sample.theme !== theme || sample.width !== width) {
					runProblems.push('Amostra inesperada/duplicada: ' + key);
					continue;
				}
				captured.set(key, sample);
			}
		}
	}
	const results = [];
	for (const name of names) {
		for (const theme of themes) {
			for (const width of widths) {
				const key = name + '/' + theme + '/' + width;
				const sample = captured.get(key);
				const hasScreenshot = sample?.screenshot &&
					existsSync(join(folder, sample.screenshot));
				const signals = Array.isArray(sample?.signals) ? sample.signals : [];
				const status = !sample ? 'não executado'
					: sample.error || !hasScreenshot ? 'falha na captura'
					: signals.length ? 'revisão necessária'
					: 'sem sinais automatizados';
				results.push({
					name,
					theme,
					width,
					status,
					screenshot: hasScreenshot ? sample.screenshot : null,
					signals,
					error: sample?.error ?? null,
					metrics: sample?.metrics ?? null,
				});
			}
		}
	}
	const count = (status) => results.filter((entry) => entry.status === status).length;
	const summary = {
		expected,
		captured: results.filter((entry) => entry.screenshot).length,
		noSignals: count('sem sinais automatizados'),
		review: count('revisão necessária'),
		failed: count('falha na captura'),
		missing: count('não executado'),
	};
	const report = {
		issue: 152,
		generatedAt: new Date().toISOString(),
		commit: process.env.GITHUB_SHA ?? null,
		scope: 'Estado inicial visível; Chromium; temas claro/escuro; viewports 390/1440px',
		note: 'Sinais automáticos são suspeitas, não bugs confirmados; sem sinais não prova consistência visual.',
		summary,
		runProblems,
		results,
	};
	writeFileSync(join(folder, 'report.json'), JSON.stringify(report, null, 2) + '\n');

	const markdown = [
		'# Auditoria visual #152 — relatório de execução',
		'',
		'Execução: ' + report.generatedAt + (report.commit ? ' · commit ' + report.commit : ''),
		'',
		'> Este relatório é uma triagem automatizada. “Sem sinais” não comprova consistência visual. ' +
			'Revise as capturas antes de confirmar defeitos, aprovar componentes ou atualizar a matriz.',
		'',
		'## Resumo',
		'',
		'- Amostras esperadas: **' + summary.expected + '**',
		'- Capturas produzidas: **' + summary.captured + '**',
		'- Com sinais para revisão: **' + summary.review + '**',
		'- Falhas de captura: **' + summary.failed + '**',
		'- Não executadas: **' + summary.missing + '**',
		'- Sem sinais automatizados: **' + summary.noSignals + '**',
		'',
		'## Pendências de execução',
		'',
		...(runProblems.length ? runProblems.map((message) => '- ' + message) : ['Nenhum manifesto ausente ou inválido.']),
		'',
		'## Sinais e falhas para investigar',
		'',
		'| Export | Tema | Largura | Resultado | Sinais/erro | Captura |',
		'| --- | --- | --- | --- | --- | --- |',
	];
	const suspicious = results.filter((r) => r.status !== 'sem sinais automatizados');
	for (const entry of suspicious) {
		const details = [entry.error, ...entry.signals.map((signal) => signal.code + ': ' + signal.detail)]
			.filter(Boolean).join('; ') || 'Sem dados';
		markdown.push('| ' + escapeCell(entry.name) + ' | ' + entry.theme + ' | ' + entry.width +
			'px | ' + entry.status + ' | ' + escapeCell(details) + ' | ' +
			(entry.screenshot ? '[PNG](' + entry.screenshot + ')' : '—') + ' |');
	}
	if (suspicious.length === 0) markdown.push('| — | — | — | — | Nenhuma suspeita automática | — |');
	markdown.push(
		'',
		'## Índice completo das capturas',
		'',
		'| Export | Tema | Largura | Triagem | Captura |',
		'| --- | --- | --- | --- | --- |',
	);
	for (const entry of results) {
		markdown.push('| ' + escapeCell(entry.name) + ' | ' + entry.theme + ' | ' +
			entry.width + 'px | ' + entry.status + ' | ' +
			(entry.screenshot ? '[PNG](' + entry.screenshot + ')' : '—') + ' |');
	}
	markdown.push('', 'Os estados hover, focus, erro, disabled, loading, zoom 200% e revisão manual ' +
		'continuam pendentes quando não houver inspeção específica. Consulte docs/visual-audit-152.md.', '');
	writeFileSync(join(folder, 'report.md'), markdown.join('\n'));
	console.log('Auditoria #152: ' + summary.captured + '/' + expected +
		' capturas; ' + summary.review + ' para revisão, ' +
		summary.failed + ' falhas, ' + summary.missing + ' não executadas.');
	return report;
}

export default async function summarizeVisualAudit() {
	buildVisualAuditReport();
}
