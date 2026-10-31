import assert from 'node:assert/strict';
import test from 'node:test';
import {
	approveChangelog,
	changelogSection,
	editorialReport,
	editorialWarnings,
	validateChangelogReview,
} from './release-changelog.mjs';
import {
	extractReleaseNotes,
	prepareChangelog,
	stripReleaseReviewMarker,
} from './release-utils.mjs';

const ongoing = [
	'# Changelog',
	'',
	'### [1.0.1] - Em andamento',
	'',
	'#### Added',
	'',
	'- Ícones atualizados (#257).',
	'- Documentação dos ícones revisada (#257).',
	'- Novo campo de senha (#147).',
	'',
	'### [1.0.0] - 01-out-2026',
	'',
	'- Versão inicial imutável.',
	'',
].join('\n');

const revised = ongoing.replace(
	'- Ícones atualizados (#257).\n- Documentação dos ícones revisada (#257).',
	'- Ícones: fontes MIT/ISC, licenças e documentação consolidadas (#257).',
);

test('prévia identifica referências repetidas e não modifica o conteúdo', () => {
	const source = ongoing;
	const report = editorialReport(source, '1.0.1');
	assert.match(report, /AGRUPAR 2 entradas/);
	assert.match(report, /duplicado com item 1/);
	assert.equal(source, ongoing);
	assert.equal(changelogSection(source, '1.0.1').heading, '### [1.0.1] - Em andamento');
});

test('aprovação recusa a mesma issue em tópicos duplicados', () => {
	assert.throws(() => approveChangelog(ongoing, '1.0.1'), /duplicado com item 1/);
});

test('aprovação recusa entradas longas ou sem itens', () => {
	const long = revised.replace(
		'- Novo campo de senha (#147).',
		'- ' + 'Um detalhe de implementação longo '.repeat(12) + '(#147).',
	);
	assert.ok(editorialWarnings(changelogSection(long, '1.0.1').body).length);
	assert.throws(() => approveChangelog(long, '1.0.1'), /excede 300 caracteres/);
	const empty = revised.replace(/^- .*$/gm, '');
	assert.throws(() => approveChangelog(empty, '1.0.1'), /Nenhuma alteração/);
});

test('aprovação vincula o texto exato, preserva versões fechadas e permite preparo', () => {
	const approved = approveChangelog(revised, '1.0.1');
	const check = validateChangelogReview(approved, '1.0.1');
	assert.equal(check.entries, 2);
	assert.match(approved, /release-changelog-approved sha256:[a-f0-9]{64}/);
	assert.equal(approveChangelog(approved, '1.0.1'), approved, 'aprovação repetida é idempotente');
	assert.equal(
		changelogSection(approved, '1.0.0', 'closed').body,
		changelogSection(revised, '1.0.0', 'closed').body,
		'histórico fechado deve permanecer intacto',
	);
	const closed = prepareChangelog(approved, '1.0.1', new Date('2026-10-31T17:00:00Z'));
	validateChangelogReview(closed, '1.0.1', 'closed');
	const notes = extractReleaseNotes(closed, '1.0.1');
	assert.match(notes, /Ícones: fontes MIT\/ISC/);
	assert.doesNotMatch(notes, /release-changelog-approved/);
	assert.match(closed, /### \[1\.0\.2\] - Em andamento/);
});

test('edição depois da aprovação invalida a revisão e impede preparar', () => {
	const approved = approveChangelog(revised, '1.0.1');
	const changed = approved.replace('Novo campo de senha', 'Novo campo de senhas');
	assert.throws(
		() => validateChangelogReview(changed, '1.0.1'),
		/Changelog alterado após aprovação/,
	);
});

test('marcadores ausentes, múltiplos ou malformados são recusados', () => {
	assert.throws(() => validateChangelogReview(revised, '1.0.1'), /sem aprovação editorial/);
	const approved = approveChangelog(revised, '1.0.1');
	const marker = approved.match(/<!-- release-changelog-approved sha256:[a-f0-9]{64} -->/)[0];
	assert.throws(
		() => validateChangelogReview(approved.replace(marker, marker + '\n' + marker), '1.0.1'),
		/Marcadores de aprovação duplicados/,
	);
	assert.throws(
		() =>
			validateChangelogReview(
				approved.replace(marker, '<!-- release-changelog-approved nope -->'),
				'1.0.1',
			),
		/sem aprovação editorial/,
	);
	assert.equal(stripReleaseReviewMarker('Antes\n' + marker + '\nDepois'), 'Antes\nDepois');
});

test('mudanças de versão não contaminam seções fechadas e notas excluem apenas marcador', () => {
	const approved = approveChangelog(revised, '1.0.1');
	const closed = prepareChangelog(approved, '1.0.1', new Date('2026-10-31T17:00:00Z'));
	const notes = extractReleaseNotes(closed, '1.0.1');
	assert.match(notes, /Novo campo de senha/);
	assert.match(notes, /#### Added/);
	assert.doesNotMatch(notes, /Versão inicial imutável/);
	assert.equal(
		changelogSection(closed, '1.0.0', 'closed').body.trim(),
		'- Versão inicial imutável.',
	);
});
