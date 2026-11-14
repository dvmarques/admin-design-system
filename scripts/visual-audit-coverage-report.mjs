import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { loadCoverage } from './visual-audit-coverage.mjs';

const escapeCell = (value) =>
	String(value ?? '')
		.replaceAll('|', '\\|')
		.replaceAll('\n', ' ');
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const pngSignature = Buffer.from('89504e470d0a1a0a', 'hex');
const hasValidPngHeader = (path) => {
	try {
		const data = readFileSync(path);
		return data.length > 32 && data.subarray(0, 8).equals(pngSignature);
	} catch {
		return false;
	}
};

export function analyzeStateCoverage({ matrix, entries, folder }) {
	const routes = new Map(entries.map((entry) => [entry.name, entry.route]));
	const results = matrix.scenarios.map((scenario) => {
		const manifest = join(folder, 'states', scenario.id + '.json');
		let record = null;
		let problem = null;
		if (existsSync(manifest)) {
			try {
				record = readJson(manifest);
			} catch (error) {
				problem = 'Manifesto ilegível: ' + String(error);
			}
		}
		const screenshot =
			'screenshots/states/' + scenario.id + '-' + scenario.theme + '-' + scenario.width + '.png';
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
		) {
			problem = 'Manifesto não corresponde ao cenário planejado';
		}
		if (record && !problem && record.error) problem = String(record.error);
		if (
			record &&
			!problem &&
			(record.screenshot !== screenshot ||
				!hasValidPngHeader(join(folder, screenshot)) ||
				!Array.isArray(record.checks) ||
				!record.checks.length ||
				record.checks.some((check) => typeof check !== 'string' || !check.trim()))
		) {
			problem = 'Captura PNG válida ou verificações objetivas ausentes';
		}
		const status =
			!record && !problem
				? 'pendente'
				: problem
					? 'falha de execução'
					: 'verificação objetiva aprovada';
		return {
			...scenario,
			route: routes.get(scenario.name),
			status,
			checks: record && !problem ? record.checks : [],
			screenshot: status === 'verificação objetiva aprovada' ? screenshot : null,
			error: problem,
			humanReview: 'Pendente',
		};
	});
	const components = entries.map((entry) => {
		const configured = matrix.components[entry.name];
		const profile = matrix.profiles[configured.profile];
		const statesApplicable = configured.states ?? profile.states;
		const statesNotApplicable = { ...profile.notApplicable, ...configured.notApplicable };
		for (const state of statesApplicable) delete statesNotApplicable[state];
		const planned = results.filter((result) => result.name === entry.name);
		return {
			name: entry.name,
			route: entry.route,
			group: entry.group,
			profile: configured.profile,
			statesApplicable,
			statesNotApplicable,
			viewports: profile.viewports,
			themes: ['light', 'dark'],
			inspections: profile.checks,
			plannedScenarioIds: planned.map((result) => result.id),
			executed: planned.filter((result) => result.status !== 'pendente').length,
			pending: planned.filter((result) => result.status === 'pendente').length,
			automaticPass: planned.filter((result) => result.status === 'verificação objetiva aprovada')
				.length,
			failed: planned.filter((result) => result.status === 'falha de execução').length,
			humanReview: 'Pendente',
		};
	});
	const count = (status) => results.filter((result) => result.status === status).length;
	const summary = {
		inventoried: components.length,
		applicableStates: components.reduce((sum, row) => sum + row.statesApplicable.length, 0),
		notApplicableStates: components.reduce(
			(sum, row) => sum + Object.keys(row.statesNotApplicable).length,
			0,
		),
		planned: results.length,
		executed: results.length - count('pendente'),
		automaticPass: count('verificação objetiva aprovada'),
		failed: count('falha de execução'),
		pending: count('pendente'),
		humanReviewPending: components.length,
	};
	return { summary, components, results };
}

export function buildStateCoverageReport(project = process.cwd()) {
	const root = resolve(project);
	const { entries, matrix } = loadCoverage(root);
	const folder = join(root, 'visual-audit-results');
	const coverage = analyzeStateCoverage({ matrix, entries, folder });
	const report = {
		issue: 152,
		generatedAt: new Date().toISOString(),
		commit: process.env.GITHUB_SHA ?? null,
		note: 'Aprovação objetiva não equivale à revisão visual humana, WCAG completa ou zoom nativo 200%.',
		...coverage,
	};
	writeFileSync(join(folder, 'coverage-report.json'), JSON.stringify(report, null, 2) + '\n');
	const s = report.summary;
	const lines = [
		'# Matriz de cobertura visual — relatório de execução',
		'',
		'> Verificação objetiva aprovada não significa inspeção visual humana aprovada. Zoom real de navegador a 200% e contraste perceptual permanecem revisão humana até evidência própria.',
		'',
		'## Resumo',
		'',
		'- Exports inventariados: **' + s.inventoried + '**',
		'- Estados aplicáveis por export (sem produto cartesiano): **' + s.applicableStates + '**',
		'- Estados explicitamente não aplicáveis: **' + s.notApplicableStates + '**',
		'- Cenários automatizados selecionados: **' + s.planned + '**',
		'- Executados: **' + s.executed + '**',
		'- Verificações objetivas aprovadas: **' + s.automaticPass + '**',
		'- Falhas reais: **' + s.failed + '**',
		'- Pendentes: **' + s.pending + '**',
		'- Exports ainda dependentes de revisão visual humana: **' + s.humanReviewPending + '**',
		'',
		'## Evidências de estados',
		'',
		'| Export | Estado | Tema | Largura | Mídia | Status | Verificações / erro | Evidência |',
		'| --- | --- | --- | --- | --- | --- | --- | --- |',
	];
	for (const result of report.results) {
		lines.push(
			'| ' +
				result.name +
				' | ' +
				result.state +
				' | ' +
				result.theme +
				' | ' +
				result.width +
				'px | ' +
				(result.media ?? 'padrão') +
				' | ' +
				result.status +
				' | ' +
				escapeCell(result.error ?? (result.checks.join(', ') || '—')) +
				' | ' +
				(result.screenshot ? '[PNG](' + result.screenshot + ')' : '—') +
				' |',
		);
	}
	lines.push(
		'',
		'## Matriz completa por export',
		'',
		'| Export | Rota | Estados aplicáveis | N/A justificado | Viewports relevantes | Inspeção | Cenários e execução | Revisão visual |',
		'| --- | --- | --- | --- | --- | --- | --- | --- |',
	);
	for (const component of report.components) {
		const nA = Object.entries(component.statesNotApplicable)
			.map(([state, reason]) => state + ': ' + reason)
			.join('; ');
		lines.push(
			'| ' +
				component.name +
				' | ' +
				component.route +
				' | ' +
				component.statesApplicable.join(', ') +
				' | ' +
				escapeCell(nA || '—') +
				' | ' +
				component.viewports.join(', ') +
				' (light/dark)' +
				' | ' +
				component.inspections.join(', ') +
				' | ' +
				component.automaticPass +
				'/' +
				component.plannedScenarioIds.length +
				' objetivas; ' +
				component.failed +
				' falhas' +
				' | ' +
				component.humanReview +
				' |',
		);
	}
	lines.push(
		'',
		'Capturas do estado inicial: report.md e report.json. Zoom nativo 200% e avaliação humana não executados por esta suíte.',
		'',
	);
	writeFileSync(join(folder, 'coverage-report.md'), lines.join('\n'));
	const initialJson = join(folder, 'report.json');
	if (existsSync(initialJson)) {
		const initial = readJson(initialJson);
		initial.stateCoverage = summaryForInitial(report);
		writeFileSync(initialJson, JSON.stringify(initial, null, 2) + '\n');
	}
	const initialMd = join(folder, 'report.md');
	if (existsSync(initialMd)) {
		const before = readFileSync(initialMd, 'utf8');
		writeFileSync(
			initialMd,
			before +
				'\n## Cobertura seletiva de estados\n\n' +
				'- Planejados: ' +
				s.planned +
				'; executados: ' +
				s.executed +
				'; aprovação objetiva: ' +
				s.automaticPass +
				'; falhas: ' +
				s.failed +
				'; pendentes: ' +
				s.pending +
				'.\n' +
				'- [Matriz detalhada por export, estado e evidência](coverage-report.md).\n' +
				'- Nenhum estado foi aprovado por revisão humana automaticamente.\n',
		);
	}
	console.log(
		'Cobertura de estados: ' +
			s.automaticPass +
			'/' +
			s.planned +
			' objetivas; ' +
			s.failed +
			' falhas; ' +
			s.pending +
			' pendentes.',
	);
	return report;
}
function summaryForInitial(report) {
	return { ...report.summary, report: 'coverage-report.md', json: 'coverage-report.json' };
}
