#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/** Amostra mínima por grupo para uma comparação ser considerada indicativa. */
export const minimumSample = 3;

const seconds = (from, to) => {
	const start = Date.parse(from);
	const end = Date.parse(to);
	return Number.isFinite(start) && Number.isFinite(end) && end >= start
		? (end - start) / 1000
		: null;
};

export function median(values) {
	const sorted = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
	if (sorted.length === 0) return null;
	const middle = Math.floor(sorted.length / 2);
	return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

/**
 * Resume uma execução do GitHub Actions: duração por job (início a fim, sem fila), tempo
 * total de jobs, duração da execução, conclusão e reruns. Jobs pulados contam 0 s.
 */
export function summarizeRun(run, jobs) {
	const summarized = jobs.map((job) => ({
		name: job.name,
		conclusion: job.conclusion,
		seconds: job.conclusion === 'skipped' ? 0 : seconds(job.started_at, job.completed_at),
	}));
	// Jobs pulados têm carimbos de tempo sem significado e não entram na duração da execução.
	const ran = jobs.filter((job) => job.conclusion !== 'skipped');
	const starts = ran.map((job) => Date.parse(job.started_at)).filter(Number.isFinite);
	const ends = ran.map((job) => Date.parse(job.completed_at)).filter(Number.isFinite);
	const executed = summarized.filter((job) => job.conclusion !== 'skipped');
	return {
		id: run.id,
		sha: run.head_sha,
		event: run.event,
		conclusion: run.conclusion,
		reruns: Math.max(0, (run.run_attempt ?? 1) - 1),
		wallSeconds:
			starts.length && ends.length ? (Math.max(...ends) - Math.min(...starts)) / 1000 : null,
		jobSeconds: executed.reduce((sum, job) => sum + (job.seconds ?? 0), 0),
		jobs: summarized,
	};
}

function summarizeGroup(runs) {
	const jobNames = [...new Set(runs.flatMap((run) => run.jobs.map((job) => job.name)))].sort();
	return {
		runs: runs.length,
		failures: runs.filter((run) => run.conclusion !== 'success').length,
		reruns: runs.reduce((sum, run) => sum + run.reruns, 0),
		wallMedian: median(runs.map((run) => run.wallSeconds)),
		jobSecondsMedian: median(runs.map((run) => run.jobSeconds)),
		jobs: Object.fromEntries(
			jobNames.map((name) => [
				name,
				median(runs.map((run) => run.jobs.find((job) => job.name === name)?.seconds ?? null)),
			]),
		),
	};
}

const delta = (before, after) =>
	before === null || after === null
		? null
		: { seconds: after - before, percent: before === 0 ? null : ((after - before) / before) * 100 };

/** Compara dois grupos de execuções resumidas. Não infere economia: só mede diferenças. */
export function compareGroups(beforeRuns, afterRuns) {
	const before = summarizeGroup(beforeRuns);
	const after = summarizeGroup(afterRuns);
	const jobNames = [...new Set([...Object.keys(before.jobs), ...Object.keys(after.jobs)])].sort();
	return {
		before,
		after,
		sufficientSample: beforeRuns.length >= minimumSample && afterRuns.length >= minimumSample,
		wall: delta(before.wallMedian, after.wallMedian),
		jobSeconds: delta(before.jobSecondsMedian, after.jobSecondsMedian),
		jobs: Object.fromEntries(
			jobNames.map((name) => [
				name,
				{
					before: before.jobs[name] ?? null,
					after: after.jobs[name] ?? null,
					delta: delta(before.jobs[name] ?? null, after.jobs[name] ?? null),
				},
			]),
		),
	};
}

const fmt = (value) => (value === null ? 'n/d' : `${value.toFixed(0)}s`);
const fmtDelta = (value) =>
	value === null
		? 'n/d'
		: `${value.seconds >= 0 ? '+' : ''}${value.seconds.toFixed(0)}s${value.percent === null ? '' : ` (${value.percent >= 0 ? '+' : ''}${value.percent.toFixed(1)}%)`}`;

export function renderMarkdown(comparison, { beforeLabel = 'Antes', afterLabel = 'Depois' } = {}) {
	const { before, after } = comparison;
	const lines = [
		`### Comparação de CI: ${beforeLabel} × ${afterLabel}`,
		'',
		`| | ${beforeLabel} | ${afterLabel} |`,
		'| --- | ---: | ---: |',
		`| Execuções | ${before.runs} | ${after.runs} |`,
		`| Execuções sem sucesso | ${before.failures} | ${after.failures} |`,
		`| Reruns | ${before.reruns} | ${after.reruns} |`,
		`| Duração da execução (mediana) | ${fmt(before.wallMedian)} | ${fmt(after.wallMedian)} (${fmtDelta(comparison.wall)}) |`,
		`| Tempo total de jobs (mediana) | ${fmt(before.jobSecondsMedian)} | ${fmt(after.jobSecondsMedian)} (${fmtDelta(comparison.jobSeconds)}) |`,
		'',
		`| Job (mediana) | ${beforeLabel} | ${afterLabel} | Diferença |`,
		'| --- | ---: | ---: | ---: |',
		...Object.entries(comparison.jobs).map(
			([name, job]) =>
				`| ${name} | ${fmt(job.before)} | ${fmt(job.after)} | ${fmtDelta(job.delta)} |`,
		),
		'',
		comparison.sufficientSample
			? `Amostra de pelo menos ${minimumSample} execuções por grupo; ainda assim, execuções de commits e cargas diferentes não permitem atribuir causalidade.`
			: `**Amostra insuficiente** (menos de ${minimumSample} execuções em algum grupo): os números são indicativos, não conclusivos.`,
		'Tokens e custo: **não disponível** (o GitHub Actions não expõe telemetria de tokens; custo em minutos faturáveis depende do plano e não é estimado aqui).',
		'',
	];
	return lines.join('\n');
}

async function fetchRun(repo, id, token) {
	const headers = {
		accept: 'application/vnd.github+json',
		'x-github-api-version': '2022-11-28',
		...(token ? { authorization: `Bearer ${token}` } : {}),
	};
	const get = async (path) => {
		const response = await globalThis.fetch(`https://api.github.com/repos/${repo}/${path}`, {
			headers,
		});
		if (!response.ok) throw new Error(`GitHub API ${response.status} em ${path}`);
		return response.json();
	};
	const run = await get(`actions/runs/${id}`);
	const { jobs } = await get(`actions/runs/${id}/jobs?filter=latest&per_page=100`);
	return summarizeRun(run, jobs);
}

/** Lê execuções de um arquivo JSON (`[{ run, jobs }]`) ou da API pública do GitHub. */
export async function loadRuns({ repo, ids, file, token }) {
	if (file)
		return JSON.parse(readFileSync(file, 'utf8')).map(({ run, jobs }) => summarizeRun(run, jobs));
	return Promise.all(ids.map((id) => fetchRun(repo, id, token)));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const argument = (name) => {
		const index = process.argv.indexOf(name);
		return index === -1 ? undefined : process.argv[index + 1];
	};
	const ids = (value) => (value ?? '').split(/[\s,]+/).filter((id) => /^\d+$/.test(id));
	const repo = argument('--repo') ?? process.env.GITHUB_REPOSITORY;
	const token = process.env.GITHUB_TOKEN;
	try {
		const beforeFile = argument('--before-file');
		const afterFile = argument('--after-file');
		const beforeIds = ids(argument('--before'));
		const afterIds = ids(argument('--after'));
		if (
			(!beforeFile && beforeIds.length === 0) ||
			(!afterFile && afterIds.length === 0) ||
			(!repo && !(beforeFile && afterFile))
		) {
			throw new Error(
				'Uso: node scripts/ci-metrics.mjs --repo dono/nome --before id,id --after id,id\n' +
					'     ou --before-file runs.json --after-file runs.json ([{ "run": {...}, "jobs": [...] }])',
			);
		}
		const [before, after] = await Promise.all([
			loadRuns({ repo, ids: beforeIds, file: beforeFile, token }),
			loadRuns({ repo, ids: afterIds, file: afterFile, token }),
		]);
		const label = (name) => argument(name) ?? undefined;
		console.log(
			renderMarkdown(compareGroups(before, after), {
				beforeLabel: label('--before-label'),
				afterLabel: label('--after-label'),
			}),
		);
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
}
