import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import {
	classifyImpact,
	decideScope,
	detectLocalImpact,
	findUndeclaredReferences,
	gitArguments,
	implicitDependencies,
	listChangedFiles,
	listPullRequestFiles,
	loadWorkspaces,
	resolveLocalBase,
} from './ci-impact.mjs';

const workspace = (dir, name, extra = {}) => ({ dir, manifest: { name, ...extra } });
const fixture = () => [
	workspace('apps/admin-demo', '@admin-ds/admin-demo', {
		dependencies: { '@admin-ds/admin': '*', '@admin-ds/components': '*', '@admin-ds/tokens': '*' },
	}),
	workspace('apps/docs', '@admin-ds/docs', {
		dependencies: { '@admin-ds/admin': '*', '@admin-ds/components': '*', '@admin-ds/tokens': '*' },
	}),
	workspace('packages/admin', '@admin-ds/admin', { dependencies: { '@admin-ds/components': '*' } }),
	workspace('packages/components', '@admin-ds/components', { peerDependencies: { react: '*' } }),
	workspace('packages/tokens', '@admin-ds/tokens'),
];
const impact = (files, workspaces = fixture()) => classifyImpact(files, workspaces);
const everything = [
	'packages/tokens',
	'packages/components',
	'packages/admin',
	'apps/admin-demo',
	'apps/docs',
];

test('documentation-only changes do not affect workspaces', () => {
	const result = impact(['docs/quality.md', 'CHANGELOG.md', 'openspec/changes/x/proposal.md']);
	assert.deepEqual([result.mode, result.affected], ['docs', []]);
});

test('token changes reach every consumer, including the implicit components dependency', () => {
	const result = impact(['packages/tokens/src/index.ts']);
	assert.equal(result.mode, 'scoped');
	assert.deepEqual(result.affected.toSorted(), everything.toSorted());
	assert.ok(implicitDependencies['@admin-ds/components'].includes('@admin-ds/tokens'));
});

test('affected workspaces are listed with dependencies first', () => {
	assert.deepEqual(impact(['packages/tokens/src/index.ts']).affected, [
		'packages/tokens',
		'packages/components',
		'packages/admin',
		'apps/admin-demo',
		'apps/docs',
	]);
});

test('component changes include admin and both applications', () => {
	assert.deepEqual(impact(['packages/components/src/button.tsx']).affected, [
		'packages/components',
		'packages/admin',
		'apps/admin-demo',
		'apps/docs',
	]);
});

test('admin changes include the applications but not components or tokens', () => {
	assert.deepEqual(impact(['packages/admin/src/shell.tsx']).affected, [
		'packages/admin',
		'apps/admin-demo',
		'apps/docs',
	]);
});

test('application changes remain isolated', () => {
	assert.deepEqual(impact(['apps/docs/src/button.stories.tsx']).affected, ['apps/docs']);
	assert.deepEqual(impact(['apps/admin-demo/src/page.tsx']).affected, ['apps/admin-demo']);
});

test('every dependency field and transitive chains are followed', () => {
	for (const field of [
		'dependencies',
		'devDependencies',
		'peerDependencies',
		'optionalDependencies',
	]) {
		const workspaces = [
			workspace('packages/a', 'a'),
			workspace('packages/b', 'b', { [field]: { a: '*' } }),
			workspace('packages/c', 'c', { dependencies: { b: '*' } }),
		];
		assert.deepEqual(
			impact(['packages/a/x.ts'], workspaces).affected,
			['packages/a', 'packages/b', 'packages/c'],
			field,
		);
	}
});

test('documentation mixed with workspace code is ignored for impact', () => {
	const result = impact(['CHANGELOG.md', 'docs/quality.md', 'apps/docs/src/a.ts']);
	assert.deepEqual([result.mode, result.affected], ['scoped', ['apps/docs']]);
});

test('global configuration, scripts, workflows, e2e and lockfile fail closed', () => {
	for (const file of [
		'package.json',
		'package-lock.json',
		'tsconfig.base.json',
		'eslint.config.mjs',
		'vitest.config.ts',
		'vitest.setup.ts',
		'playwright.config.ts',
		'scripts/build-all.mjs',
		'.github/workflows/ci.yml',
		'e2e/smoke.spec.ts',
		'.husky/pre-commit',
		'.prettierrc',
		'.claude/settings.json',
		'.agents/skills/x/SKILL.md',
		'skills-lock.json',
	]) {
		assert.equal(impact([file]).mode, 'full', file);
	}
});

test('documentation consumed by tests or builds fails closed', () => {
	for (const file of [
		'docs/integration.md',
		'docs/bundle-baseline.json',
		'docs/bundle-baseline.md',
		'docs/sub/page.md',
	]) {
		assert.equal(impact([file]).mode, 'full', file);
	}
});

test('unknown paths, new workspaces and workspace manifests fail closed', () => {
	for (const file of [
		'mystery.txt',
		'packages/new/src/a.ts',
		'apps/docs/package.json',
		'packages/tokens/package.json',
	]) {
		assert.equal(impact([file]).mode, 'full', file);
	}
	assert.match(impact(['packages/new/src/a.ts']).reason, /packages\/new/);
});

test('unsafe or malformed paths fail closed', () => {
	for (const file of [
		'../escape',
		'/etc/passwd',
		'a//b',
		'./a',
		'a/./b',
		'a\\b',
		'C:/x',
		'a\nb',
		'a\0b',
		'',
		'docs/../package.json',
		null,
		42,
	]) {
		assert.equal(impact(['docs/quality.md', file]).mode, 'full', JSON.stringify(file));
	}
});

test('missing or malformed input fails closed with every workspace listed', () => {
	for (const files of [[], undefined, null, 'docs/a.md', {}]) {
		const result = impact(files);
		assert.equal(result.mode, 'full');
		assert.deepEqual(result.affected.toSorted(), everything.toSorted());
	}
	assert.equal(classifyImpact(['docs/a.md'], []).mode, 'full');
	assert.equal(classifyImpact(['docs/a.md'], undefined).mode, 'full');
});

test('invalid manifests fail closed', () => {
	const base = fixture();
	const invalid = [
		[{ dir: 'packages/x', manifest: null }, ...base],
		[workspace('packages/x', ''), ...base],
		[workspace('packages/x', 7), ...base],
		[workspace('packages/x', '@admin-ds/tokens'), ...base],
		[workspace('packages/tokens', 'other'), ...base],
		[workspace('packages/x', 'x', { dependencies: 'invalid' }), ...base],
	];
	for (const workspaces of invalid) {
		const result = impact(['docs/quality.md'], workspaces);
		assert.equal(result.mode, 'full', JSON.stringify(workspaces[0]));
	}
});

test('dependency cycles fail closed', () => {
	const workspaces = [
		workspace('packages/a', 'a', { dependencies: { b: '*' } }),
		workspace('packages/b', 'b', { dependencies: { a: '*' } }),
	];
	assert.deepEqual(
		[impact(['packages/a/x.ts'], workspaces).mode, impact(['packages/a/x.ts'], workspaces).reason],
		['full', 'dependências cíclicas'],
	);
});

test('the real workspaces keep the expected dependency closure', () => {
	const real = loadWorkspaces();
	assert.deepEqual(real.map((item) => item.dir).toSorted(), everything.toSorted());
	assert.deepEqual(
		impact(['packages/tokens/src/index.ts'], real).affected.toSorted(),
		everything.toSorted(),
	);
	assert.deepEqual(impact(['apps/docs/src/a.ts'], real).affected, ['apps/docs']);
	assert.deepEqual(impact(['apps/admin-demo/src/a.ts'], real).affected, ['apps/admin-demo']);
});

test('no workspace references another one outside the dependency graph', () => {
	assert.deepEqual(findUndeclaredReferences(loadWorkspaces()), []);
});

test('undeclared references are detected', () => {
	const root = mkdtempSync(join(tmpdir(), 'ads-refs-'));
	try {
		for (const dir of ['packages/a', 'packages/b'])
			mkdirSync(join(root, dir, 'src'), { recursive: true });
		writeFileSync(
			join(root, 'packages/a/src/index.ts'),
			"import x from '@admin-ds/b';\nimport y from '../../b/src/y';\n",
		);
		writeFileSync(join(root, 'packages/b/src/y.ts'), 'export const y = 1;\n');
		const workspaces = [
			workspace('packages/a', '@admin-ds/a'),
			workspace('packages/b', '@admin-ds/b'),
		];
		const references = findUndeclaredReferences(workspaces, root);
		assert.deepEqual(references.map((item) => item.reference).toSorted(), [
			'@admin-ds/b',
			'packages/b',
		]);
		const declared = [
			workspace('packages/a', '@admin-ds/a', { dependencies: { '@admin-ds/b': '*' } }),
			workspaces[1],
		];
		assert.deepEqual(findUndeclaredReferences(declared, root), []);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('workspace patterns other than dir/* are rejected', () => {
	const root = mkdtempSync(join(tmpdir(), 'ads-patterns-'));
	try {
		writeFileSync(join(root, 'package.json'), JSON.stringify({ workspaces: ['apps/**'] }));
		assert.throws(() => loadWorkspaces(root), /não suportado/);
		writeFileSync(join(root, 'package.json'), JSON.stringify({ workspaces: [] }));
		assert.throws(() => loadWorkspaces(root), /ausentes/);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('scope decisions only reduce work for PRs to develop with known impact', () => {
	const scoped = (...affected) => ({ mode: 'scoped', affected });
	const pr = (value) => decideScope({ event: 'pull_request', baseRef: 'develop', impact: value });
	assert.deepEqual(pr({ mode: 'docs', affected: [] }), {
		reduced: true,
		docsOnly: true,
		buildDocs: false,
		buildDemo: false,
		e2e: false,
	});
	assert.deepEqual(pr(scoped('apps/docs')), {
		reduced: true,
		docsOnly: false,
		buildDocs: true,
		buildDemo: false,
		e2e: false,
	});
	assert.deepEqual(pr(scoped('apps/admin-demo')), {
		reduced: true,
		docsOnly: false,
		buildDocs: false,
		buildDemo: true,
		e2e: true,
	});
	assert.deepEqual(pr(scoped('packages/components', 'apps/docs', 'apps/admin-demo')), {
		reduced: true,
		docsOnly: false,
		buildDocs: true,
		buildDemo: true,
		e2e: true,
	});
	const all = { reduced: false, docsOnly: false, buildDocs: true, buildDemo: true, e2e: true };
	for (const input of [
		{ event: 'pull_request', baseRef: 'develop', impact: { mode: 'full', affected: [] } },
		{ event: 'pull_request', baseRef: 'develop', impact: null },
		{ event: 'pull_request', baseRef: 'develop', impact: { mode: 'unknown' } },
		{ event: 'pull_request', baseRef: 'develop', impact: { mode: 'scoped' } },
		{ event: 'pull_request', baseRef: 'master', impact: { mode: 'docs', affected: [] } },
		{ event: 'push', baseRef: '', impact: { mode: 'docs', affected: [] } },
		{ event: undefined, baseRef: undefined, impact: scoped('apps/docs') },
	]) {
		assert.deepEqual(decideScope(input), all, JSON.stringify(input));
	}
});

const git = (cwd, ...args) =>
	execFileSync(
		'git',
		[
			'-c',
			'user.name=Teste',
			'-c',
			'user.email=teste@example.com',
			'-c',
			'commit.gpgsign=false',
			...args,
		],
		{
			cwd,
			encoding: 'utf8',
		},
	);
const withRepository = (callback) => {
	const root = mkdtempSync(join(tmpdir(), 'ads-git-'));
	try {
		git(root, 'init', '-q', '-b', 'develop');
		const write = (file, text = 'x\n') => {
			mkdirSync(join(root, file, '..'), { recursive: true });
			writeFileSync(join(root, file), text);
		};
		callback({
			root,
			write,
			commit: (message) => (
				git(root, 'add', '-A'),
				git(root, 'commit', '-q', '-m', message),
				git(root, 'rev-parse', 'HEAD').trim()
			),
		});
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
};

test('git detection reports renames, deletions and unusual names on both sides', () => {
	withRepository(({ root, write, commit }) => {
		write(
			'packages/components/src/a.ts',
			'conteúdo suficientemente longo para a detecção de renomeação\n'.repeat(5),
		);
		write('docs/old name.md', 'texto\n'.repeat(20));
		write('docs/ação.md', 'texto\n'.repeat(20));
		const base = commit('base');
		mkdirSync(join(root, 'apps/docs'), { recursive: true });
		git(root, 'mv', 'packages/components/src/a.ts', 'apps/docs/a.ts');
		git(root, 'rm', '-q', 'docs/old name.md');
		git(root, 'rm', '-q', 'docs/ação.md');
		write('docs/new name.md', 'novo\n');
		commit('mudança');
		const files = listChangedFiles({ cwd: root, base });
		assert.deepEqual(
			files.toSorted(),
			[
				'apps/docs/a.ts',
				'docs/new name.md',
				'docs/old name.md',
				'docs/ação.md',
				'packages/components/src/a.ts',
			].toSorted(),
		);
	});
});

test('git detection includes uncommitted and untracked files for local use', () => {
	withRepository(({ root, write, commit }) => {
		write('apps/docs/a.ts');
		const base = commit('base');
		write('apps/docs/a.ts', 'alterado\n');
		write('packages/tokens/novo.ts');
		assert.deepEqual(listChangedFiles({ cwd: root, base, worktree: true }).toSorted(), [
			'apps/docs/a.ts',
			'packages/tokens/novo.ts',
		]);
		assert.deepEqual(listChangedFiles({ cwd: root, base }), []);
	});
});

test('git detection fails when the base revision does not exist', () => {
	withRepository(({ root, write, commit }) => {
		write('a.txt');
		commit('base');
		assert.throws(() => listChangedFiles({ cwd: root, base: 'inexistente' }));
		assert.throws(() => listChangedFiles({ cwd: root, base: '0'.repeat(40) }));
	});
});

test('pull request detection reads the merge commit and rejects anything else', () => {
	withRepository(({ root, write, commit }) => {
		write('docs/a.md');
		const base = commit('base');
		git(root, 'switch', '-q', '-c', 'feature');
		write('apps/docs/b.ts');
		commit('feature');
		git(root, 'switch', '-q', 'develop');
		write('docs/other.md');
		commit('develop avança');
		assert.throws(() => listPullRequestFiles({ cwd: root }), /merge/);
		git(root, 'merge', '-q', '--no-ff', '-m', 'merge da PR', 'feature');
		assert.deepEqual(listPullRequestFiles({ cwd: root }), ['apps/docs/b.ts']);
		assert.ok(base);
	});
});

test('a shallow checkout without parents fails closed instead of guessing', () => {
	withRepository(({ root, write, commit }) => {
		write('docs/a.md');
		commit('base');
		git(root, 'switch', '-q', '-c', 'feature');
		write('apps/docs/b.ts');
		commit('feature');
		git(root, 'switch', '-q', 'develop');
		write('docs/other.md');
		commit('develop avança');
		git(root, 'merge', '-q', '--no-ff', '-m', 'merge da PR', 'feature');
		const shallow = mkdtempSync(join(tmpdir(), 'ads-shallow-'));
		try {
			git(shallow, 'clone', '-q', '--depth=1', `file://${root}`, 'clone');
			assert.throws(() => listPullRequestFiles({ cwd: join(shallow, 'clone') }));
		} finally {
			rmSync(shallow, { recursive: true, force: true });
		}
	});
});

test('local detection falls back to full when no comparison base exists', () => {
	withRepository(({ root, write, commit }) => {
		write('package.json', JSON.stringify({ workspaces: ['apps/*'] }));
		write('apps/docs/package.json', JSON.stringify({ name: 'docs' }));
		commit('base');
		git(root, 'branch', '-m', 'other');
		const result = detectLocalImpact({ cwd: root });
		assert.equal(result.impact.mode, 'full');
		assert.match(result.impact.reason, /detecção indisponível/);
		assert.throws(() => resolveLocalBase({ cwd: root }), /base de comparação/);
		assert.equal(resolveLocalBase({ cwd: root, base: 'abc' }), 'abc');
	});
});

test('local detection classifies the working tree against the merge base with develop', () => {
	withRepository(({ root, write, commit }) => {
		write('package.json', JSON.stringify({ workspaces: ['apps/*'] }));
		write('apps/docs/package.json', JSON.stringify({ name: 'docs' }));
		write('apps/docs/src/a.ts');
		commit('base');
		git(root, 'switch', '-q', '-c', 'feature');
		write('apps/docs/src/a.ts', 'alterado\n');
		const result = detectLocalImpact({ cwd: root });
		assert.deepEqual([result.impact.mode, result.impact.affected], ['scoped', ['apps/docs']]);
		git(root, 'checkout', '-q', '--', '.');
		assert.equal(detectLocalImpact({ cwd: root }).impact, null);
	});
});

test('git trusts only the checkout directory, and only on GitHub Actions', () => {
	const expectedSafeDirectory = `safe.directory=${resolve('/work')}`;
	assert.deepEqual(gitArguments(['diff'], '/work', { GITHUB_ACTIONS: 'true' }), [
		'-c',
		expectedSafeDirectory,
		'diff',
	]);
	assert.deepEqual(
		gitArguments(['diff'], '/work/', { GITHUB_ACTIONS: 'true' }),
		['-c', expectedSafeDirectory, 'diff'],
		'sem barra final, como o git compara',
	);
	assert.deepEqual(gitArguments(['diff'], '/work', {}), ['diff']);
	assert.deepEqual(gitArguments(['diff'], '/work', { GITHUB_ACTIONS: 'false' }), ['diff']);
});

test('detection errors carry git stderr for diagnosis', () => {
	withRepository(({ root }) => {
		assert.throws(
			() => listChangedFiles({ cwd: root, base: 'inexistente' }),
			/git rev-parse falhou/,
		);
		assert.throws(() => listPullRequestFiles({ cwd: join(root, 'nao-existe') }));
	});
});

// Reproduz o container da CI: checkout de outro usuário lido como root.
test(
	'a checkout owned by another user is readable on GitHub Actions only with the trusted directory',
	{ skip: process.getuid?.() !== 0 },
	() => {
		withRepository(({ root, write, commit }) => {
			write('docs/a.md');
			commit('base');
			git(root, 'switch', '-q', '-c', 'feature');
			write('apps/docs/b.ts');
			commit('feature');
			git(root, 'switch', '-q', 'develop');
			write('docs/other.md');
			commit('develop avança');
			git(root, 'merge', '-q', '--no-ff', '-m', 'merge da PR', 'feature');
			execFileSync('chown', ['-R', '1001:1001', root]);
			const previous = process.env.GITHUB_ACTIONS;
			try {
				delete process.env.GITHUB_ACTIONS;
				assert.throws(() => listPullRequestFiles({ cwd: root }), /dubious ownership/);
				process.env.GITHUB_ACTIONS = 'true';
				assert.deepEqual(listPullRequestFiles({ cwd: root }), ['apps/docs/b.ts']);
				// O diretório padrão dos scripts (`import.meta.url`) termina em barra; o git exige o caminho exato.
				assert.deepEqual(listPullRequestFiles({ cwd: `${root}/` }), ['apps/docs/b.ts']);
			} finally {
				if (previous === undefined) delete process.env.GITHUB_ACTIONS;
				else process.env.GITHUB_ACTIONS = previous;
			}
		});
	},
);
