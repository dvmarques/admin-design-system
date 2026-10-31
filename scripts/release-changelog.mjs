#!/usr/bin/env node
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	assertStableSemver,
	parseChangelog,
	stripReleaseReviewMarker,
} from './release-utils.mjs';

export const MAX_CHANGELOG_ENTRY = 300;
const MARKER = /^<!-- release-changelog-approved sha256:([a-f0-9]{64}) -->$/gm;
const MARKER_PREFIX = /<!--\s*release-changelog-approved\b/;

export function changelogSection(text, version, status = 'ongoing') {
	assertStableSemver(version);
	const parsed = parseChangelog(text);
	const section =
		status === 'ongoing'
			? parsed.ongoing.length === 1
				? parsed.ongoing[0]
				: null
			: parsed.closed.find((candidate) => candidate.version === version);
	if (!section) throw new Error('Seção de changelog não encontrada: ' + status + ' ' + version);
	if (status === 'closed' && section.version !== version) {
		throw new Error('Versão fechada diverge do alvo.');
	}
	const start = section.index + section.heading.length;
	const next = parsed.sections.find((candidate) => candidate.index > section.index);
	const end = next?.index ?? text.length;
	return { body: text.slice(start, end), start, end, heading: section.heading };
}

const issueNumbers = (item) => [...new Set([...item.matchAll(/#(\d+)\b/g)].map((x) => x[1]))];
const issuePrimary = (item) => {
	const prefix = item.split(' - ', 1)[0];
	return /#(\d+)\b/.exec(prefix)?.[1] ?? issueNumbers(item)[0] ?? null;
};

export function editorialEntries(body) {
	const lines = stripReleaseReviewMarker(body).split(/\r?\n/);
	const items = [];
	let category = 'Other';
	for (const line of lines) {
		const heading = /^####\s+(.+?)\s*$/.exec(line);
		if (heading) category = heading[1];
		const item = /^- (.+)$/.exec(line);
		if (item) {
			items.push({
				text: item[1].trim(),
				category,
				primary: issuePrimary(item[1]),
				issues: issueNumbers(item[1]),
			});
		}
	}
	return items;
}

export function editorialWarnings(body) {
	const items = editorialEntries(body);
	const warnings = [];
	const seen = new Map();
	for (const [index, item] of items.entries()) {
		const key = item.primary ? 'issue:' + item.primary : 'text:' + item.text.toLowerCase();
		if (seen.has(key)) {
			warnings.push(
				'Item ' + (index + 1) + ': duplicado com item ' + seen.get(key) + ' (' + key + ')',
			);
		} else {
			seen.set(key, index + 1);
		}
		if ([...item.text].length > MAX_CHANGELOG_ENTRY) {
			warnings.push(
				'Item ' + (index + 1) + ': excede ' + MAX_CHANGELOG_ENTRY + ' caracteres',
			);
		}
	}
	if (!items.length) warnings.push('Nenhuma alteração listada no changelog da versão.');
	return warnings;
}

export function reviewDigest(body) {
	const cleaned = stripReleaseReviewMarker(body).trim().replace(/\r\n/g, '\n');
	return createHash('sha256').update(cleaned, 'utf8').digest('hex');
}

export function validateChangelogReview(text, version, status = 'ongoing') {
	const { body } = changelogSection(text, version, status);
	const markers = [...body.matchAll(MARKER)];
	if (markers.length !== 1 || !MARKER_PREFIX.test(body)) {
		throw new Error('Changelog sem aprovação editorial válida para ' + version + '.');
	}
	const rest = body.replace(MARKER, '');
	if (MARKER_PREFIX.test(rest)) throw new Error('Marcadores de aprovação duplicados ou inválidos.');
	assert.equal(markers[0][1], reviewDigest(body), 'Changelog alterado após aprovação.');
	const warnings = editorialWarnings(body);
	if (warnings.length) throw new Error('Revisão editorial incompleta:\n' + warnings.join('\n'));
	return { digest: markers[0][1], entries: editorialEntries(body).length };
}

export function approveChangelog(text, version) {
	const { body, start, end } = changelogSection(text, version);
	const warnings = editorialWarnings(body);
	if (warnings.length) throw new Error('Corrija o changelog antes de aprovar:\n' + warnings.join('\n'));
	const cleaned = stripReleaseReviewMarker(body).trim();
	if (MARKER_PREFIX.test(cleaned)) throw new Error('Marcador de aprovação malformado.');
	const newBody =
		'\n\n' +
		cleaned +
		'\n\n<!-- release-changelog-approved sha256:' +
		reviewDigest(cleaned) +
		' -->\n\n';
	const result = text.slice(0, start) + newBody + text.slice(end);
	validateChangelogReview(result, version);
	return result;
}

export function editorialReport(text, version) {
	const { body } = changelogSection(text, version);
	const items = editorialEntries(body);
	const grouped = new Map();
	for (const [i, item] of items.entries()) {
		const key = item.primary ? 'issue:' + item.primary : 'item:' + i;
		if (!grouped.has(key)) grouped.set(key, []);
		grouped.get(key).push(item);
	}
	const output = [
		'# Proposta editorial para ' + version,
		'',
		'PRÉVIA: não modifica CHANGELOG.md. Revise todas as fontes antes de condensar.',
		'Não omita breaking changes, migrações obrigatórias ou efeitos relevantes.',
		'',
		'Itens originais: ' + items.length + '; grupos sugeridos: ' + grouped.size,
	];
	for (const [, group] of grouped) {
		const category = group[0].category;
		const issues = [...new Set(group.flatMap((entry) => entry.issues))];
		const first = group[0].text.replace(/^\`[^\`]+\`\s*(?:\([^)]*\))?\s*-\s*/, '');
		const summary = first.split(/[.;](?:\s|$)/)[0].slice(0, 180).trim();
		output.push(
			'',
			'[' + category + '] ' + (group.length > 1 ? 'AGRUPAR ' + group.length + ' entradas: ' : ''),
			'- ' + summary + (first.length > 180 ? '…' : '') + (issues.length ? ' (#' + issues.join(', #') + ')' : ''),
		);
	}
	const warnings = editorialWarnings(body);
	output.push('', '## Pontos de atenção (' + warnings.length + ')', ...warnings.map((w) => '- ' + w));
	output.push(
		'',
		'Edite manualmente apenas a seção em andamento; depois execute',
		'npm run release:changelog -- ' + version + ' --approve na branch release/' + version + '.',
		'Comite o CHANGELOG.md aprovado antes de npm run release:prepare -- ' + version + '.',
	);
	return output.join('\n') + '\n';
}

async function main() {
	const [version, mode, ...extra] = process.argv.slice(2);
	if (!version || extra.length || (mode && !['--approve', '--check'].includes(mode))) {
		throw new Error('Uso: npm run release:changelog -- X.Y.Z [--approve | --check]');
	}
	assertStableSemver(version);
	const file = 'CHANGELOG.md';
	const text = await fs.readFile(file, 'utf8');
	if (mode === '--approve') {
		const branch = execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).trim();
		if (branch !== 'release/' + version) {
			throw new Error('A aprovação exige a branch release/' + version + '.');
		}
		const next = approveChangelog(text, version);
		if (next !== text) await fs.writeFile(file, next);
		console.log('Changelog aprovado para ' + version + '; revise o diff e faça commit.');
	} else if (mode === '--check') {
		const check = validateChangelogReview(text, version);
		console.log('Revisão editorial válida: ' + check.entries + ' entradas, sha256 ' + check.digest);
	} else {
		process.stdout.write(editorialReport(text, version));
	}
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	main().catch((error) => {
		console.error(error.message);
		process.exitCode = 1;
	});
}
