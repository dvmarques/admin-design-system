import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
	compareGroups,
	loadRuns,
	median,
	minimumSample,
	renderMarkdown,
	summarizeRun,
} from './ci-metrics.mjs';

const job = (name, start, end, conclusion = 'success') => ({
	name,
	conclusion,
	started_at: `2026-10-22T10:${start}Z`,
	completed_at: `2026-10-22T10:${end}Z`,
});
const run = (id, jobs, extra = {}) =>
	summarizeRun(
		{
			id,
			head_sha: `sha${id}`,
			event: 'pull_request',
			conclusion: 'success',
			run_attempt: 1,
			...extra,
		},
		jobs,
	);

test('median handles empty, odd, even and non-finite values', () => {
	assert.equal(median([]), null);
	assert.equal(median([null, undefined, NaN]), null);
	assert.equal(median([3, 1, 2]), 2);
	assert.equal(median([4, 1, 2, 3]), 2.5);
});

test('a run summary measures jobs without queue time and ignores skipped jobs', () => {
	const summary = run(
		1,
		[
			job('Qualidade rápida', '00:00', '01:40'),
			job('Fluxos no navegador', '00:00', '02:19'),
			{
				name: 'Validação de release',
				conclusion: 'skipped',
				started_at: '2026-10-22T10:05:00Z',
				completed_at: '2026-10-22T09:00:00Z',
			},
		],
		{ run_attempt: 3 },
	);
	assert.equal(summary.wallSeconds, 139, 'skipped jobs do not stretch the run duration');
	assert.equal(summary.jobSeconds, 239);
	assert.equal(summary.reruns, 2);
	assert.deepEqual(
		summary.jobs.map((item) => item.seconds),
		[100, 139, 0],
	);
});

test('incomplete timestamps become unavailable instead of invented values', () => {
	const summary = run(1, [
		{ name: 'a', conclusion: 'success', started_at: null, completed_at: null },
	]);
	assert.equal(summary.wallSeconds, null);
	assert.equal(summary.jobs[0].seconds, null);
});

test('the comparison reports medians, failures, reruns and per-job differences', () => {
	const before = [10, 20, 30].map((end, index) =>
		run(index, [job('E2E', '00:00', `00:${end}`), job('Qualidade', '00:00', '01:00')]),
	);
	const after = [
		run(10, [job('E2E', '00:00', '00:10'), job('Qualidade', '00:00', '01:00')]),
		run(11, [job('E2E', '00:00', '00:10'), job('Qualidade', '00:00', '01:00')], {
			conclusion: 'failure',
			run_attempt: 2,
		}),
		run(12, [{ name: 'E2E', conclusion: 'skipped' }, job('Qualidade', '00:00', '01:00')]),
	];
	const comparison = compareGroups(before, after);
	assert.equal(comparison.sufficientSample, true);
	assert.equal(comparison.before.jobs.E2E, 20);
	assert.equal(comparison.after.jobs.E2E, 10);
	assert.equal(comparison.jobs.E2E.delta.seconds, -10);
	assert.equal(comparison.jobs.Qualidade.delta.seconds, 0);
	assert.deepEqual(
		[comparison.after.failures, comparison.after.reruns, comparison.before.failures],
		[1, 1, 0],
	);
});

test('small samples are flagged and telemetry gaps are explicit', () => {
	const small = compareGroups(
		[run(1, [job('a', '00:00', '00:10')])],
		[run(2, [job('a', '00:00', '00:05')])],
	);
	assert.equal(small.sufficientSample, false);
	const text = renderMarkdown(small, { beforeLabel: 'Base', afterLabel: 'PR' });
	assert.match(text, /Amostra insuficiente/);
	assert.match(text, /Tokens e custo: \*\*não disponível\*\*/);
	assert.match(text, /\| a \| 10s \| 5s \| -5s \(-50\.0%\) \|/);
	assert.ok(minimumSample >= 3);
});

test('a job missing on one side is reported as unavailable, not as zero', () => {
	const comparison = compareGroups(
		[run(1, [job('a', '00:00', '00:10')])],
		[run(2, [job('b', '00:00', '00:10')])],
	);
	assert.equal(comparison.jobs.a.after, null);
	assert.equal(comparison.jobs.a.delta, null);
	assert.match(renderMarkdown(comparison), /\| a \| 10s \| n\/d \| n\/d \|/);
});

test('runs can be loaded from a JSON file for offline comparison', async () => {
	const dir = mkdtempSync(join(tmpdir(), 'ads-metrics-'));
	try {
		const file = join(dir, 'runs.json');
		writeFileSync(
			file,
			JSON.stringify([
				{
					run: { id: 7, run_attempt: 1, conclusion: 'success' },
					jobs: [job('a', '00:00', '00:30')],
				},
			]),
		);
		const [loaded] = await loadRuns({ file });
		assert.equal(loaded.id, 7);
		assert.equal(loaded.jobSeconds, 30);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});
