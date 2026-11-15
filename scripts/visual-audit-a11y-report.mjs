import { auditRevision } from './visual-audit-revision.mjs';
import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { loadCoverage } from './visual-audit-coverage.mjs';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const writeTextAtomically = (file, content) => {
	const temporary = join(dirname(file), '.' + basename(file) + '.' + randomUUID() + '.tmp');
	try {
		writeFileSync(temporary, content, { flag: 'wx' });
		renameSync(temporary, file);
	} finally {
		rmSync(temporary, { force: true });
	}
};
const escapeCell = (value) =>
	String(value ?? '')
		.replaceAll('|', '\\|')
		.replaceAll('\n', ' ');

function hasPngSignature(path) {
	try {
		const file = readFileSync(path);
		return file.length > 32 && file.subarray(0, 8).toString('hex') === '89504e470d0a1a0a';
	} catch {
		return false;
	}
}

export function hasNativeZoomProof(zoom) {
	if (
		!zoom ||
		zoom.method !== 'chromium-settings-native-default-zoom' ||
		zoom.requestedPercent !== 200 ||
		zoom.configuredFactor !== 2 ||
		zoom.verified !== true ||
		!Number.isFinite(zoom.measuredPercent) ||
		Math.abs(zoom.measuredPercent - 200) > 2
	)
		return false;
	const { before, after, restored, captureMetrics } = zoom;
	for (const sample of [before, after, restored, captureMetrics]) {
		if (
			!sample ||
			!['innerWidth', 'innerHeight', 'outerWidth', 'devicePixelRatio', 'visualScale'].every(
				(key) => Number.isFinite(sample[key]) && sample[key] > 0,
			) ||
			!Number.isFinite(sample.documentOverflowPx) ||
			sample.documentOverflowPx < 0 ||
			!sample.geometry ||
			!['x', 'y', 'width', 'height'].every((key) => Number.isFinite(sample.geometry[key]))
		)
			return false;
	}
	return (
		zoom.screenshotEngine === 'cdp-compositor-no-metric-overrides' &&
		Math.abs(before.innerWidth / captureMetrics.innerWidth - 2) <= 0.02 &&
		Math.abs(captureMetrics.devicePixelRatio / before.devicePixelRatio - 2) <= 0.02 &&
		Math.abs(captureMetrics.visualScale - 1) <= 0.01 &&
		Math.abs(before.innerWidth / after.innerWidth - 2) <= 0.02 &&
		Math.abs(after.devicePixelRatio / before.devicePixelRatio - 2) <= 0.02 &&
		Math.abs(before.outerWidth - after.outerWidth) <= 2 &&
		Math.abs(before.visualScale - 1) <= 0.01 &&
		Math.abs(after.visualScale - 1) <= 0.01 &&
		Math.abs(restored.innerWidth - before.innerWidth) <= 2 &&
		Math.abs(restored.devicePixelRatio - before.devicePixelRatio) <= 0.01 &&
		Math.abs(restored.visualScale - before.visualScale) <= 0.01
	);
}

export function analyzeAccessibilityEvidence({ scenarios, entries, folder }) {
	const routes = new Map(entries.map((entry) => [entry.name, entry.route]));
	const ids = new Set();
	const results = scenarios.map((scenario) => {
		if (typeof scenario.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(scenario.id))
			throw new Error('ID de cenário a11y inseguro');
		if (ids.has(scenario.id)) throw new Error('ID de cenário a11y duplicado: ' + scenario.id);
		ids.add(scenario.id);
		const file = join(folder, 'a11y', scenario.id + '.json');
		let record;
		let problem = null;
		try {
			record = readJson(file);
		} catch (error) {
			if (error?.code !== 'ENOENT') problem = 'Manifesto inválido: ' + String(error);
		}
		const expectedScreenshot =
			'screenshots/a11y/' +
			scenario.id +
			(scenario.action === 'zoom-probe' ? '-native-200' : '') +
			'-' +
			scenario.theme +
			'-' +
			scenario.width +
			'.png';
		if (!routes.has(scenario.name)) problem = 'Export fora da matriz: ' + scenario.name;
		if (
			record &&
			(record.id !== scenario.id ||
				record.name !== scenario.name ||
				record.route !== routes.get(scenario.name) ||
				record.state !== scenario.state ||
				record.action !== scenario.action ||
				record.theme !== scenario.theme ||
				record.width !== scenario.width ||
				(record.media ?? null) !== (scenario.media ?? null))
		)
			problem = 'Manifesto não corresponde ao cenário declarado';
		if (record && !['approved', 'failed', 'pending'].includes(record.status))
			problem = 'Status inválido';
		if (record && record.humanReview !== 'pending')
			problem = 'Revisão humana não pode ser aprovada automaticamente';
		if (
			record &&
			(!Array.isArray(record.checks) ||
				record.checks.some((value) => typeof value !== 'string' || !value.trim()))
		)
			problem = 'Verificações ausentes ou inválidas';
		if (record && record.status === 'approved') {
			if (
				!record.checks?.length ||
				record.screenshot !== expectedScreenshot ||
				!hasPngSignature(join(folder, expectedScreenshot))
			)
				problem = 'PNG ou verificação objetiva ausente';
			if (record.error != null) problem = 'Aprovação com erro registrado';
			if (
				scenario.action === 'zoom-probe' &&
				(!hasNativeZoomProof(record.zoom) ||
					!record.checks.includes('zoom-restored-between-scenarios') ||
					!record.checks.includes('document-horizontal-overflow<=2px'))
			) {
				problem = 'Zoom nativo ou restauração não comprovados';
			}
		}
		if (record && record.status === 'pending' && scenario.action !== 'zoom-probe') {
			problem = 'Somente probe de zoom pode ficar pendente por capacidade do navegador';
		}
		if (
			record &&
			record.status === 'pending' &&
			(record.zoom?.verified !== false ||
				record.zoom?.requestedPercent !== 200 ||
				record.screenshot != null ||
				record.error != null)
		) {
			problem = 'Pendência de zoom inconsistente';
		}
		if (record && record.status === 'failed' && !record.error) problem = 'Falha sem descrição';
		const status =
			problem || record?.status === 'failed'
				? 'falha comprovada'
				: !record || record.status === 'pending'
					? 'pendente de execução/comprovação'
					: 'aprovado automaticamente';
		return {
			...scenario,
			route: routes.get(scenario.name) ?? null,
			status,
			zoom: record?.zoom ?? null,
			checks: Array.isArray(record?.checks) ? record.checks : [],
			screenshot:
				record?.screenshot === expectedScreenshot &&
				hasPngSignature(join(folder, expectedScreenshot))
					? expectedScreenshot
					: null,
			error: problem ?? record?.error ?? null,
			humanReview: 'pendente de revisão visual humana',
		};
	});
	const count = (status) => results.filter((row) => row.status === status).length;
	return {
		summary: {
			planned: results.length,
			automaticPass: count('aprovado automaticamente'),
			failed: count('falha comprovada'),
			pending: count('pendente de execução/comprovação'),
			nativeZoomProven: results.filter(
				(row) => row.action === 'zoom-probe' && row.status === 'aprovado automaticamente',
			).length,
			nativeZoomPlanned: results.filter((row) => row.action === 'zoom-probe').length,
			humanReviewPending: results.length,
		},
		results,
	};
}

export function buildAccessibilityCoverageReport(project = process.cwd()) {
	const root = resolve(project);
	const folder = join(root, 'visual-audit-results');
	mkdirSync(folder, { recursive: true });
	const { entries, matrix } = loadCoverage(root);
	const plan = readJson(join(root, 'visual-audit/a11y-scenarios.json'));
	const analysis = analyzeAccessibilityEvidence({ scenarios: plan.scenarios, entries, folder });
	const result = {
		issue: 152,
		...auditRevision(root),
		generatedAt: new Date().toISOString(),
		note: 'Aprovação automática não equivale a WCAG completa ou revisão perceptual; reflow não comprova zoom nativo.',
		notApplicableStates: entries.reduce((sum, entry) => {
			const configured = matrix.components[entry.name];
			const profile = matrix.profiles[configured.profile];
			const applicable = configured.states ?? profile.states;
			const nA = { ...profile.notApplicable, ...configured.notApplicable };
			return sum + Object.keys(nA).filter((state) => !applicable.includes(state)).length;
		}, 0),
		...analysis,
	};
	writeFileSync(join(folder, 'a11y-report.json'), JSON.stringify(result, null, 2) + '\n');
	const s = result.summary;
	const lines = [
		'# Auditoria visual — fase 4 (teclado, foco, zoom e reflow)',
		'',
		'> Zoom nativo é aprovado somente com prova observável de viewport CSS e DPR; reflow não é zoom nativo. O status da revisão visual humana permanece pendente.',
		'',
		'Execução: ' +
			result.generatedAt +
			' · commit ' +
			(result.commit ?? 'desconhecido') +
			' · working tree ' +
			(result.workingTreeDirty === false
				? 'limpa'
				: result.workingTreeDirty === true
					? 'com alterações locais'
					: 'desconhecida'),
		'',
		'- Planejados: **' + s.planned + '**',
		'- Aprovados automaticamente: **' + s.automaticPass + '**',
		'- Falhas comprovadas: **' + s.failed + '**',
		'- Pendentes: **' + s.pending + '**',
		'- Zoom nativo 200% comprovado: **' + s.nativeZoomProven + '/' + s.nativeZoomPlanned + '**',
		'- Estados N/A justificados na matriz preexistente: **' + result.notApplicableStates + '**',
		'- Pendentes de revisão visual humana: **' + s.humanReviewPending + '**',
		'',
		'| Componente | Cenário | Tema | Largura | Método de zoom | Estado | Verificações/erro | PNG | Revisão humana |',
		'| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
	];
	for (const item of result.results) {
		lines.push(
			'| ' +
				escapeCell(item.name) +
				' | ' +
				escapeCell(item.id) +
				' | ' +
				item.theme +
				' | ' +
				item.width +
				'px | ' +
				escapeCell(item.zoom?.method ?? '100%-sem-zoom') +
				' | ' +
				item.status +
				' | ' +
				escapeCell(item.error ?? item.checks.join(', ')) +
				' | ' +
				(item.screenshot ? '[PNG](' + item.screenshot + ')' : '—') +
				' | Pendente |',
		);
	}
	lines.push(
		'',
		'## Prova de zoom nativo',
		'',
		'| Cenário | Modo | Viewport CSS antes → 200% → restaurada | DPR antes → 200% → restaurado | Escala visual | PNG |',
		'| --- | --- | --- | --- | --- | --- |',
	);
	for (const item of result.results.filter((row) => row.action === 'zoom-probe')) {
		const z = item.zoom;
		lines.push(
			'| ' +
				escapeCell(item.id) +
				' | ' +
				(z?.headed ? 'headed' : 'headless/indisponível') +
				' | ' +
				[z?.before?.innerWidth, z?.after?.innerWidth, z?.restored?.innerWidth]
					.map((n) => n ?? '—')
					.join(' → ') +
				' | ' +
				[z?.before?.devicePixelRatio, z?.after?.devicePixelRatio, z?.restored?.devicePixelRatio]
					.map((n) => n ?? '—')
					.join(' → ') +
				' | ' +
				(z?.captureMetrics?.visualScale ?? '—') +
				' | ' +
				(item.screenshot ? '[PNG](' + item.screenshot + ')' : '—') +
				' |',
		);
	}
	writeFileSync(join(folder, 'a11y-report.md'), lines.join('\n') + '\n');
	const summary =
		'\n## Fase 4 — teclado, foco e reflow\n\n' +
		'- Cenários: ' +
		s.planned +
		' planejados; ' +
		s.automaticPass +
		' aprovados automaticamente; ' +
		s.failed +
		' falhas; ' +
		s.pending +
		' pendentes.\n' +
		'- Zoom nativo comprovado: ' +
		s.nativeZoomProven +
		'/' +
		s.nativeZoomPlanned +
		'; reflow separado; revisão visual humana pendente.\n' +
		'- [Relatório e capturas da fase 4](a11y-report.md).\n';
	const initialPath = join(folder, 'report.json');
	if (existsSync(initialPath)) {
		const previous = readJson(initialPath);
		previous.accessibilityPhase4 = { ...s, report: 'a11y-report.md', json: 'a11y-report.json' };
		writeTextAtomically(initialPath, JSON.stringify(previous, null, 2) + '\n');
	}
	const markdownPath = join(folder, 'report.md');
	if (existsSync(markdownPath)) {
		const previous = readFileSync(markdownPath, 'utf8');
		const head = '## Fase 4 — teclado, foco e reflow';
		const index = previous.indexOf(head);
		writeTextAtomically(
			markdownPath,
			(index === -1 ? previous.trimEnd() : previous.slice(0, index).trimEnd()) + '\n' + summary,
		);
	}
	console.log(
		'Fase 4: ' +
			s.automaticPass +
			'/' +
			s.planned +
			' aprovações, ' +
			s.pending +
			' pendentes, ' +
			s.failed +
			' falhas; zoom nativo ' +
			s.nativeZoomProven +
			'/' +
			s.nativeZoomPlanned +
			' comprovado.',
	);
	return result;
}
