import assert from 'node:assert/strict';
import test from 'node:test';
import { checkBudget } from './quality-budget.mjs';

test('aceita um valor igual ao limite', () => {
	assert.doesNotThrow(() => checkBudget('components', 'gzip', 100, 100));
});

test('identifica pacote, métrica e valores ao ultrapassar limite', () => {
	assert.throws(() => checkBudget('admin', 'cenário gzip', 101, 100), /admin \/ cenário gzip excedeu o orçamento: 101 > 100/);
});

test('rejeita orçamentos inválidos', () => {
	assert.throws(() => checkBudget('tokens', 'distribuição', 1, -1), /Orçamento inválido/);
});
