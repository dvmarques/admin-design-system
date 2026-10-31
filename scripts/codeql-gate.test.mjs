import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateSarif, validateCodeqlPolicy } from './codeql-gate.mjs';

const policy = { schemaVersion: 1, exceptions: [] };
const sarif = (score = 7.5) => ({
	version: '2.1.0',
	runs: [
		{
			tool: {
				driver: {
					rules: [{ id: 'js/unsafe-test', properties: { 'security-severity': String(score) } }],
				},
			},
			results: [
				{
					ruleId: 'js/unsafe-test',
					locations: [
						{
							physicalLocation: {
								artifactLocation: { uri: 'src/demo.ts' },
							},
						},
					],
				},
			],
		},
	],
});

test('high and critical CodeQL SARIF findings block, moderate does not', () => {
	assert.equal(evaluateSarif(sarif(7.5), policy).blockers.length, 1);
	assert.equal(evaluateSarif(sarif(9.4), policy).blockers[0].severity, 'critical');
	assert.deepEqual(evaluateSarif(sarif(6.9), policy).blockers, []);
});

test('CodeQL exceptions are limited to rule and file and expire', () => {
	const accepted = {
		schemaVersion: 1,
		exceptions: [
			{
				ruleId: 'js/unsafe-test',
				file: 'src/demo.ts',
				owner: 'repo maintainer',
				justification: 'Risco identificado e mitigado em contexto de teste sem exposição.',
				reviewBy: '2026-12-01',
			},
		],
	};
	assert.deepEqual(evaluateSarif(sarif(), accepted, '2026-11-01').blockers, []);
	assert.equal(evaluateSarif(sarif(), accepted, '2026-12-02').blockers.length, 1);
	accepted.exceptions[0].file = 'src/outro.ts';
	assert.equal(evaluateSarif(sarif(), accepted, '2026-11-01').blockers.length, 1);
});

test('invalid SARIF and invalid exceptions are rejected', () => {
	assert.throws(() => evaluateSarif({}, policy));
	assert.throws(() => evaluateSarif({ version: '2.1.0', runs: [] }, policy));
	assert.throws(() => evaluateSarif(sarif(), { schemaVersion: 1, exceptions: [{ ruleId: 'x' }] }));
	assert.throws(() => evaluateSarif(sarif('not-a-score'), policy));
	assert.throws(() => validateCodeqlPolicy(null));
});
