#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const knownStates = new Set([
	'default',
	'hover',
	'focus',
	'active',
	'disabled',
	'loading',
	'error',
	'success',
	'open',
	'closed',
	'selected',
	'unselected',
	'empty',
	'data',
	'overflow',
	'expanded',
	'collapsed',
	'mobile',
]);
const actionStates = new Map([
	['button-hover', 'hover'],
	['button-focus', 'focus'],
	['button-keyboard-focus', 'focus'],
	['button-disabled', 'disabled'],
	['button-loading', 'loading'],
	['input-error', 'error'],
	['input-success', 'success'],
	['checkbox-selected', 'selected'],
	['tabs-selected', 'selected'],
	['accordion-open', 'open'],
	['dropdown-open', 'open'],
	['dialog-open', 'open'],
	['drawer-open', 'open'],
	['popover-open', 'open'],
	['tooltip-open', 'open'],
	['table-compact', 'data'],
	['smart-table-empty', 'empty'],
	['smart-table-error', 'error'],
	['smart-table-loading', 'loading'],
	['shell-collapsed', 'collapsed'],
	['shell-mobile', 'mobile'],
]);
const themes = new Set(['light', 'dark']);
const widths = new Set([320, 390, 768, 1440]);

export function readCatalog(source) {
	const entries = [
		...source.matchAll(
			/\{\s*name:\s*'([^']+)',\s*group:\s*'([^']+)',[\s\S]*?href:\s*'([^']+)',\s*\}/g,
		),
	].map((m) => ({ name: m[1], group: m[2], route: m[3] }));
	if (!entries.length || entries.length !== [...source.matchAll(/^\s*name:\s*'/gm)].length) {
		throw new Error(
			'Estrutura do catálogo alterada: revisar o extrator antes de atualizar a matriz',
		);
	}
	return entries;
}

export function validateCoverage(matrix, entries) {
	const errors = [];
	if (matrix.version !== 1) errors.push('versão desconhecida da matriz');
	const catalogNames = entries.map((entry) => entry.name);
	const fromCatalog = new Set(catalogNames);
	const configured = Object.keys(matrix.components ?? {});
	if (fromCatalog.size !== catalogNames.length) errors.push('exports duplicados no catálogo');
	for (const name of catalogNames) {
		if (!(name in (matrix.components ?? {}))) errors.push('export novo sem perfil: ' + name);
	}
	for (const name of configured) {
		if (!fromCatalog.has(name)) errors.push('export removido do catálogo: ' + name);
		const component = matrix.components[name];
		if (!Object.hasOwn(matrix.profiles ?? {}, component?.profile)) {
			errors.push('perfil inválido de ' + name);
		}
		const review = component?.review;
		if (review !== 'Pendente' && !/^Aprovado \(/.test(String(review ?? ''))) {
			errors.push('status humano não comprovado no plano: ' + name);
		}
		const base = matrix.profiles?.[component?.profile];
		const applicable = component?.states ?? base?.states ?? [];
		if (
			!Array.isArray(applicable) ||
			!applicable.includes('default') ||
			new Set(applicable).size !== applicable.length
		) {
			errors.push('estados do export inválidos: ' + name);
		}
		for (const state of applicable) {
			if (!knownStates.has(state))
				errors.push('estado do export desconhecido: ' + name + '/' + state);
		}
		const notApplicable = { ...(base?.notApplicable ?? {}), ...(component?.notApplicable ?? {}) };
		for (const state of applicable) delete notApplicable[state];
		for (const [state, reason] of Object.entries(notApplicable)) {
			if (!knownStates.has(state) || !String(reason).trim()) {
				errors.push('N/A inválido: ' + name + '/' + state);
			}
		}
		for (const [state, reason] of Object.entries(component?.notApplicable ?? {})) {
			if (applicable.includes(state) || !String(reason).trim()) {
				errors.push('N/A conflitante com estado aplicável: ' + name + '/' + state);
			}
		}
	}
	for (const [name, profile] of Object.entries(matrix.profiles ?? {})) {
		const applicable = profile.states ?? [];
		if (
			!Array.isArray(applicable) ||
			!applicable.includes('default') ||
			new Set(applicable).size !== applicable.length
		) {
			errors.push('estados inválidos no perfil ' + name);
		}
		for (const state of applicable)
			if (!knownStates.has(state)) errors.push('estado desconhecido: ' + name + '/' + state);
		for (const [state, reason] of Object.entries(profile.notApplicable ?? {})) {
			if (!knownStates.has(state) || applicable.includes(state) || !String(reason).trim()) {
				errors.push('não aplicável sem justificativa ou conflitante: ' + name + '/' + state);
			}
		}
		if (
			!Array.isArray(profile.viewports) ||
			profile.viewports.some((width) => !widths.has(width))
		) {
			errors.push('viewports inválidas: ' + name);
		}
		if (!profile.checks?.includes('human-visual')) errors.push('revisão humana omitida: ' + name);
	}
	const ids = new Set();
	for (const scenario of matrix.scenarios ?? []) {
		if (!/^[a-z0-9-]+$/.test(scenario.id ?? '') || ids.has(scenario.id)) {
			errors.push('id inválido/duplicado: ' + scenario.id);
		}
		ids.add(scenario.id);
		const component = matrix.components?.[scenario.name];
		const profile = matrix.profiles?.[component?.profile];
		if (
			!fromCatalog.has(scenario.name) ||
			!(component?.states ?? profile?.states ?? []).includes(scenario.state)
		) {
			errors.push('cenário sem export/estado aplicável: ' + scenario.id);
		}
		if (
			!themes.has(scenario.theme) ||
			!widths.has(scenario.width) ||
			!profile?.viewports?.includes(scenario.width)
		) {
			errors.push('tema ou largura fora do perfil: ' + scenario.id);
		}
		if (scenario.media && !['reduced-motion', 'forced-colors'].includes(scenario.media)) {
			errors.push('mídia desconhecida: ' + scenario.id);
		}
		if (actionStates.get(scenario.action) !== scenario.state) {
			errors.push('ação desconhecida ou incompatível com estado: ' + scenario.id);
		}
	}
	return errors;
}

export function loadCoverage(project = root) {
	const entries = readCatalog(
		readFileSync(join(project, 'apps/admin-demo/app/catalogo/catalog-data.ts'), 'utf8'),
	);
	const matrix = JSON.parse(
		readFileSync(join(project, 'visual-audit/coverage-matrix.json'), 'utf8'),
	);
	const errors = validateCoverage(matrix, entries);
	if (errors.length) throw new Error('Matriz de cobertura divergente:\n- ' + errors.join('\n- '));
	return { entries, matrix };
}

export function formatCoverageTable({ entries, matrix }) {
	const lines = [
		'| Export | Rota canônica | Estados aplicáveis | Estados não aplicáveis (motivo) | Viewports | Temas | Verificações | Revisão humana |',
		'| --- | --- | --- | --- | --- | --- | --- | --- |',
	];
	for (const entry of entries) {
		const component = matrix.components[entry.name];
		const profile = matrix.profiles[component.profile];
		const applicable = component.states ?? profile.states;
		const na = { ...profile.notApplicable, ...component.notApplicable };
		for (const state of applicable) delete na[state];
		const notApplicable = Object.entries(na)
			.map(([state, reason]) => state + ': ' + reason)
			.join('; ');
		lines.push(
			'| ' +
				entry.name +
				' | ' +
				entry.route +
				' | ' +
				applicable.join(', ') +
				' | ' +
				notApplicable +
				' | ' +
				profile.viewports.join(', ') +
				' | light, dark | ' +
				profile.checks.join(', ') +
				' | ' +
				component.review +
				' |',
		);
	}
	return lines.join('\n') + '\n';
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	try {
		if (!['--check', '--print'].includes(process.argv[2]) || process.argv.length !== 3) {
			throw new Error('Uso: node scripts/visual-audit-coverage.mjs --check|--print');
		}
		const coverage = loadCoverage();
		if (process.argv[2] === '--print') process.stdout.write(formatCoverageTable(coverage));
		else
			console.log(
				'Matriz de cobertura sincronizada: ' +
					coverage.entries.length +
					' exports e ' +
					coverage.matrix.scenarios.length +
					' cenários seletivos.',
			);
	} catch (error) {
		console.error(error instanceof Error ? error.message : String(error));
		process.exitCode = 1;
	}
}
