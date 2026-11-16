import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
	isApprovedHumanReview,
	isStaticInspectionStatus,
	isValidCalendarDate,
	isValidCoverageReviewStatus,
	isValidInspectionStatus,
	parseApprovedHumanReview,
} from './visual-audit-human-review.mjs';

test('aprovação válida aceita revisor e data brasileira', () => {
	assert.deepEqual(parseApprovedHumanReview('Aprovado (Daniel, 15/11/2026)'), {
		reviewer: 'Daniel',
		date: '15/11/2026',
		day: 15,
		month: 11,
		year: 2026,
	});
	assert.ok(isApprovedHumanReview('Aprovado (Maria Silva, 01/12/2026)'));
	assert.ok(isValidCoverageReviewStatus('Aprovado (Daniel, 15/11/2026)'));
	assert.ok(isValidInspectionStatus('Aprovado (Outra pessoa, 29/02/2024)'));
});

test('datas inválidas ou formato incompleto são rejeitadas', () => {
	const invalid = [
		'Aprovado (',
		'Aprovado (Daniel)',
		'Aprovado (Daniel, )',
		'Aprovado (, 15/11/2026)',
		'Aprovado (Daniel, 31/02/2026)',
		'Aprovado (Daniel, 32/01/2026)',
		'Aprovado (Daniel, 15/11/26)',
		'Aprovado (Daniel, 15-11-2026)',
		'Pendente',
		'Sem divergência',
	];
	for (const value of invalid) {
		assert.equal(isApprovedHumanReview(value), false, value);
	}
	assert.equal(isValidCoverageReviewStatus('Aprovado (x, 31/02/2026)'), false);
	assert.ok(isValidCoverageReviewStatus('Pendente'));
});

test('calendário rejeita 31/02 e aceita bissexto', () => {
	assert.equal(isValidCalendarDate(31, 2, 2026), false);
	assert.equal(isValidCalendarDate(29, 2, 2024), true);
	assert.equal(isValidCalendarDate(29, 2, 2023), false);
});

test('status estáticos do inventário permanecem válidos sem data', () => {
	for (const status of [
		'Pendente',
		'Em análise',
		'Sem divergência',
		'Divergência confirmada',
		'Não aplicável',
	]) {
		assert.ok(isStaticInspectionStatus(status));
		assert.ok(isValidInspectionStatus(status));
	}
});
