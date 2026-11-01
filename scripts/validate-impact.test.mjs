import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { classifyImpact, loadWorkspaces } from './ci-impact.mjs';
import { planValidation } from './validate-impact.mjs';

const workspaces = loadWorkspaces();
const plan = (command, files) =>
	planValidation(command, classifyImpact(files, workspaces), workspaces);
const buildLabels = [
	'build @dvmarques/admin-ds-admin',
	'build @dvmarques/admin-ds-components',
	'build @dvmarques/admin-ds-highlighted-code',
	'build @dvmarques/admin-ds-tokens',
];

test('lint is scoped to the affected directories', () => {
	assert.deepEqual(plan('lint', ['apps/docs/src/a.ts']).steps, [
		{ label: 'eslint apps/docs', args: ['exec', '--', 'eslint', 'apps/docs'] },
	]);
	assert.deepEqual(plan('lint', ['packages/admin/src/a.tsx']).steps[0].args, [
		'exec',
		'--',
		'eslint',
		'packages/admin',
		'apps/admin-demo',
		'apps/docs',
	]);
});

test('typecheck and tests build the packages first and then target the affected workspaces', () => {
	for (const command of ['typecheck', 'test']) {
		const { steps } = plan(command, ['packages/admin/src/a.tsx']);
		assert.deepEqual(
			steps
				.slice(0, 4)
				.map((step) => step.label)
				.toSorted(),
			buildLabels,
		);
		assert.deepEqual(
			steps.slice(0, 4).map((step) => step.args[3]),
			[
				'@dvmarques/admin-ds-tokens',
				'@dvmarques/admin-ds-components',
				'@dvmarques/admin-ds-admin',
				'@dvmarques/admin-ds-highlighted-code',
			],
			'packages build in dependency order',
		);
		const last = steps.at(-1).args;
		assert.deepEqual(
			last.filter(
				(arg) =>
					arg !== '--workspace' &&
					(arg.startsWith('@admin-ds/') || arg.startsWith('@dvmarques/admin-ds-')),
			),
			['@dvmarques/admin-ds-admin', '@admin-ds/admin-demo', '@admin-ds/docs'],
		);
	}
	assert.deepEqual(plan('typecheck', ['apps/docs/src/a.ts']).steps.at(-1).args, [
		'run',
		'typecheck',
		'--workspace',
		'@admin-ds/docs',
	]);
	assert.deepEqual(plan('test', ['apps/docs/src/a.ts']).steps.at(-1).args, [
		'run',
		'test:quiet',
		'--if-present',
		'--workspace',
		'@admin-ds/docs',
	]);
});

test('the fallback runs the same commands as the CI', () => {
	assert.deepEqual(plan('lint', ['scripts/a.mjs']).steps, [
		{ label: 'lint', args: ['run', 'lint'] },
	]);
	assert.deepEqual(
		plan('typecheck', ['scripts/a.mjs'])
			.steps.map((step) => step.args.join(' '))
			.slice(4),
		['run typecheck'],
	);
	assert.deepEqual(
		plan('test', ['scripts/a.mjs'])
			.steps.map((step) => step.args.join(' '))
			.slice(4),
		['run test:quality'],
	);
});

test('documentation-only changes need no focused validation', () => {
	for (const command of ['lint', 'typecheck', 'test']) {
		const result = plan(command, ['docs/quality.md']);
		assert.deepEqual(result.steps, []);
		assert.match(result.note, /documentação/);
	}
});

test('unknown commands are rejected', () => {
	assert.throws(() => plan('deploy', ['docs/quality.md']), /desconhecido/);
});

const run = (...args) => {
	try {
		return {
			status: 0,
			output: execFileSync(process.execPath, ['scripts/validate-impact.mjs', ...args], {
				encoding: 'utf8',
				env: { ...process.env, IMPACT_BASE: '', GITHUB_BASE_SHA: '' },
			}),
		};
	} catch (error) {
		return { status: error.status, output: `${error.stdout}${error.stderr}` };
	}
};

test('the command rejects unknown arguments with exit code 2', () => {
	assert.equal(run('deploy').status, 2);
	assert.equal(run().status, 2);
});

test('an unavailable comparison base falls back to full validation in the plan', () => {
	const result = run('lint', '--base', 'revisao-inexistente', '--dry-run');
	assert.equal(result.status, 0);
	assert.match(result.output, /Impacto: full \(detecção indisponível/);
	assert.match(result.output, /"args": \[\s*"run",\s*"lint"\s*\]/);
});

test('with no differences against the base the command validates nothing and says so', () => {
	const result = run('test', '--base', 'HEAD', '--dry-run');
	assert.equal(result.status, 0);
	assert.match(result.output, /Impacto:|Nenhuma alteração/);
});
