import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadCoverage, validateCoverage, formatCoverageTable } from './visual-audit-coverage.mjs';
import { isApprovedHumanReview } from './visual-audit-human-review.mjs';

const { entries, matrix } = loadCoverage();
const copy = () => structuredClone(matrix);

test('matriz sincronizada ao catálogo e documentável sem inventário duplicado', () => {
	assert.ok(entries.length > 0);
	assert.equal(Object.keys(matrix.components).length, entries.length);
	assert.ok(matrix.scenarios.length >= 15);
	assert.deepEqual(validateCoverage(matrix, entries), []);
	assert.match(formatCoverageTable({ entries, matrix }), /AdsAdminShell/);
	assert.match(formatCoverageTable({ entries, matrix }), /Revisão humana/);
});
test('aprovação humana exige revisor e data válida', () => {
	assert.equal(isApprovedHumanReview('Aprovado (Daniel, 15/11/2026)'), true);
	assert.equal(isApprovedHumanReview('Aprovado ('), false);
	assert.equal(isApprovedHumanReview('Aprovado (Daniel, 31/02/2026)'), false);
	const altered = copy();
	altered.components.AdsButton.review = 'Aprovado (Daniel, 31/02/2026)';
	assert.match(validateCoverage(altered, entries).join(' '), /status humano/);
});
test('novo export ou export removido exige decisão explícita', () => {
	assert.match(
		validateCoverage(matrix, [
			...entries,
			{ name: 'AdsNovo', group: 'Teste', route: '/catalogo/novo' },
		]).join(' '),
		/export novo/,
	);
	const altered = copy();
	delete altered.components.AdsButton;
	assert.match(validateCoverage(altered, entries).join(' '), /export novo sem perfil: AdsButton/);
	altered.components.AdsRemovido = { profile: 'static', review: 'Pendente' };
	assert.match(validateCoverage(altered, entries).join(' '), /export removido/);
});
test('estados N/A, duplicidade e contexto inválido falham antes da auditoria', () => {
	const altered = copy();
	altered.profiles.button.notApplicable.focus = 'errado';
	altered.scenarios.push({ ...altered.scenarios[0] });
	altered.scenarios[1].width = 999;
	assert.match(validateCoverage(altered, entries).join(' '), /não aplicável/);
	assert.match(validateCoverage(altered, entries).join(' '), /duplicado/);
	assert.match(validateCoverage(altered, entries).join(' '), /largura fora/);
	const invalidAction = copy();
	invalidAction.scenarios[0].action = 'acao-nao-implementada';
	assert.match(validateCoverage(invalidAction, entries).join(' '), /ação desconhecida/);
});
