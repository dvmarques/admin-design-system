import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import {
	cpSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	symlinkSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repo = fileURLToPath(new URL('../', import.meta.url));
const config = JSON.parse(readFileSync(join(repo, '.codex/hooks.json'), 'utf8'));
const realPrettier = join(repo, 'node_modules/prettier/bin/prettier.cjs');

function fixture(run, { prettier = true } = {}) {
	const root = mkdtempSync(join(tmpdir(), 'admin-ds codex hooks '));
	try {
		execFileSync('git', ['init', '-q', root]);
		cpSync(join(repo, '.codex'), join(root, '.codex'), { recursive: true });
		mkdirSync(join(root, 'src/sub'), { recursive: true });
		if (prettier) {
			const proxy = join(root, 'node_modules/prettier/bin/prettier.cjs');
			mkdirSync(dirname(proxy), { recursive: true });
			writeFileSync(proxy, `require(${JSON.stringify(realPrettier)});\n`);
		}
		return run(root);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
}

const patch = (...lines) => ['*** Begin Patch', ...lines, '*** End Patch'].join('\n');
function hook(root, event, command, { cwd = root, response, toolInput } = {}) {
	// Executa o comando real de hooks.json, inclusive o bootstrap de raiz Git.
	return spawnSync(config.hooks[event][0].hooks[0].command, {
		cwd,
		shell: true,
		input: JSON.stringify({
			cwd,
			hook_event_name: event,
			tool_name: 'apply_patch',
			tool_input: toolInput ?? { command },
			tool_response: response,
		}),
		encoding: 'utf8',
		timeout: 30000,
	});
}

function denied(root, command, options) {
	const result = hook(root, 'PreToolUse', command, options);
	assert.equal(result.status, 2, result.stderr);
	assert.match(result.stderr, /Proteção de arquivos gerados/);
	return result;
}

test('pre-hook permits a mixed ordinary patch from a checkout with spaces', () =>
	fixture((root) => {
		const result = hook(
			root,
			'PreToolUse',
			patch(
				'*** Update File: src/a.ts',
				'@@',
				'-old',
				'+new',
				'*** Add File: src/b.ts',
				'+const b = 1;',
				'*** Delete File: src/c.ts',
			),
		);
		assert.equal(result.status, 0, result.stderr);
	}));

test('pre-hook blocks each generated family, including mixed patches and deletion', () =>
	fixture((root) => {
		for (const path of [
			'package-lock.json',
			'packages/tokens/src/generated.ts',
			'packages/tokens/dist/theme.css',
			'e2e/page.spec.ts-snapshots/page-chromium-linux.png',
		]) {
			denied(root, patch('*** Add File: src/a.ts', '+ok', `*** Delete File: ${path}`));
		}
	}));

test('pre-hook checks both paths of moves', () =>
	fixture((root) => {
		denied(
			root,
			patch('*** Update File: src/a.ts', '*** Move to: package-lock.json', '@@', '-old', '+new'),
		);
		denied(
			root,
			patch('*** Update File: package-lock.json', '*** Move to: src/a.ts', '@@', '-old', '+new'),
		);
	}));

test('pre-hook normalizes absolute paths, backslashes and subdirectory traversal', () =>
	fixture((root) => {
		denied(root, patch(`*** Update File: ${join(root, 'package-lock.json')}`));
		denied(root, patch('*** Update File: packages\\tokens\\src\\generated.ts'));
		denied(root, patch('*** Update File: ../../src/../package-lock.json'), {
			cwd: join(root, 'src/sub'),
		});
		const result = hook(root, 'PreToolUse', patch('*** Add File: new.ts', '+ok'), {
			cwd: join(root, 'src/sub'),
		});
		assert.equal(result.status, 0, result.stderr);
	}));

test('pre-hook denies outside paths and invalid payloads explicitly', () =>
	fixture((root) => {
		denied(root, patch('*** Add File: ../outside.ts', '+bad'));
		denied(root, patch(), { toolInput: { file_path: 'package-lock.json' } });
		denied(root, 'not a patch');
		denied(root, patch('*** Move to: src/file.ts'));
	}));

test('pre-hook detects protected and external paths behind symlinks', () =>
	fixture((root) => {
		mkdirSync(join(root, 'packages/tokens/src'), { recursive: true });
		writeFileSync(join(root, 'packages/tokens/src/generated.ts'), 'generated');
		// Junctions funcionam no Windows sem privilégios de symlink de arquivo.
		symlinkSync(
			join(root, 'packages/tokens/src'),
			join(root, 'alias'),
			process.platform === 'win32' ? 'junction' : 'dir',
		);
		denied(root, patch('*** Update File: alias/generated.ts'));
		symlinkSync(tmpdir(), join(root, 'outside'), process.platform === 'win32' ? 'junction' : 'dir');
		denied(root, patch('*** Add File: outside/file.ts', '+bad'));
		symlinkSync(
			join(tmpdir(), 'admin-ds missing external target'),
			join(root, 'dangling'),
			process.platform === 'win32' ? 'junction' : 'dir',
		);
		denied(root, patch('*** Add File: dangling/file.ts', '+bad'));
	}));

test('post-hook formats only final eligible paths and preserves unrelated files', () =>
	fixture((root) => {
		const changed = join(root, 'src/changed file.ts');
		const moved = join(root, 'src/moved.ts');
		const unrelated = join(root, 'src/unrelated.ts');
		const deleted = join(root, 'src/deleted.ts');
		const generated = join(root, 'package-lock.json');
		for (const file of [changed, moved, unrelated, deleted]) writeFileSync(file, 'const x={a:1}\n');
		writeFileSync(generated, '{"name":"unchanged"}\n');
		const result = hook(
			root,
			'PostToolUse',
			patch(
				'*** Update File: src/changed file.ts',
				'*** Update File: src/old.ts',
				'*** Move to: src/moved.ts',
				'*** Delete File: src/deleted.ts',
				'*** Update File: package-lock.json',
			),
		);
		assert.equal(result.status, 0, result.stderr);
		assert.equal(result.stdout, '', result.stdout);
		assert.equal(readFileSync(changed, 'utf8'), 'const x = { a: 1 };\n');
		assert.equal(readFileSync(moved, 'utf8'), 'const x = { a: 1 };\n');
		assert.equal(readFileSync(unrelated, 'utf8'), 'const x={a:1}\n');
		assert.equal(readFileSync(deleted, 'utf8'), 'const x={a:1}\n');
		assert.equal(readFileSync(generated, 'utf8'), '{"name":"unchanged"}\n');
	}));

test('post-hook uses filenames as arguments rather than shell code', () =>
	fixture((root) => {
		const path = 'src/file & echo injected.ts';
		writeFileSync(join(root, path), 'const x=1\n');
		const result = hook(root, 'PostToolUse', patch(`*** Add File: ${path}`, '+const x=1'));
		assert.equal(result.status, 0, result.stderr);
		assert.equal(result.stdout, '');
		assert.equal(readFileSync(join(root, path), 'utf8'), 'const x = 1;\n');
	}));

test('post-hook skips explicitly reported errors, deletions and files with no parser', () =>
	fixture((root) => {
		writeFileSync(join(root, 'src/a.ts'), 'const x=1\n');
		let result = hook(root, 'PostToolUse', patch('*** Update File: src/a.ts'), {
			response: { isError: true },
		});
		assert.equal(result.stdout, '');
		assert.equal(readFileSync(join(root, 'src/a.ts'), 'utf8'), 'const x=1\n');
		writeFileSync(join(root, 'README.unknown'), 'unchanged');
		result = hook(
			root,
			'PostToolUse',
			patch('*** Delete File: missing.ts', '*** Add File: README.unknown', '+unchanged'),
		);
		assert.equal(result.stdout, '');
		assert.equal(readFileSync(join(root, 'README.unknown'), 'utf8'), 'unchanged');
	}));

test('post-hook reports absent dependencies and parser errors without reverting edits', () => {
	fixture(
		(root) => {
			writeFileSync(join(root, 'src/a.ts'), 'const x=1\n');
			const result = hook(root, 'PostToolUse', patch('*** Update File: src/a.ts'));
			assert.equal(result.status, 0);
			assert.match(JSON.parse(result.stdout).systemMessage, /Prettier local ausente/);
			assert.equal(readFileSync(join(root, 'src/a.ts'), 'utf8'), 'const x=1\n');
		},
		{ prettier: false },
	);
	fixture((root) => {
		writeFileSync(join(root, 'src/a.ts'), 'const =');
		const result = hook(root, 'PostToolUse', patch('*** Update File: src/a.ts'));
		assert.equal(result.status, 0);
		assert.match(JSON.parse(result.stdout).systemMessage, /Formatação Codex/);
		assert.equal(readFileSync(join(root, 'src/a.ts'), 'utf8'), 'const =');
	});
});

test('shared configuration keeps local hooks and MCP versions aligned', () => {
	assert.ok(existsSync(realPrettier));
	for (const event of ['PreToolUse', 'PostToolUse'])
		assert.equal(config.hooks[event][0].matcher, '^apply_patch$');
	const mcp = JSON.parse(readFileSync(join(repo, '.mcp.json'), 'utf8')).mcpServers;
	const toml = readFileSync(join(repo, '.codex/config.toml'), 'utf8');
	for (const [name, server] of Object.entries(mcp)) {
		assert.ok(toml.includes(`[mcp_servers.${name}]`));
		for (const arg of server.args) assert.ok(toml.includes(JSON.stringify(arg)));
	}
	assert.ok(!toml.includes('C:\\'));
	for (const name of ['a11y-reviewer', 'public-api-reviewer']) {
		const agent = readFileSync(join(repo, `.codex/agents/${name}.toml`), 'utf8');
		assert.match(agent, /origin\/develop\.\.\.HEAD/);
		assert.match(agent, /não altere arquivos/);
		assert.doesNotMatch(agent, /^model\s*=/m);
	}
});

test('pre-hook bootstrap denies when Git root or the guard script is unavailable', () =>
	fixture((root) => {
		const outside = mkdtempSync(join(tmpdir(), 'admin-ds no git '));
		try {
			denied(root, patch('*** Update File: package-lock.json'), { cwd: outside });
		} finally {
			rmSync(outside, { recursive: true, force: true });
		}
		rmSync(join(root, '.codex/hooks/guard-generated.mjs'));
		denied(root, patch('*** Update File: package-lock.json'));
	}));

test('post-hook bootstrap reports failure without rejecting an already completed edit', () =>
	fixture((root) => {
		rmSync(join(root, '.codex/hooks/format-edited.mjs'));
		const result = hook(root, 'PostToolUse', patch('*** Update File: src/a.ts'));
		assert.equal(result.status, 0, result.stderr);
		assert.match(JSON.parse(result.stdout).systemMessage, /Formatação Codex/);
	}));

test('hooks support a checkout opened through a directory alias', () =>
	fixture((root) => {
		const links = mkdtempSync(join(tmpdir(), 'admin-ds alias '));
		const alias = join(links, 'worktree');
		try {
			symlinkSync(root, alias, process.platform === 'win32' ? 'junction' : 'dir');
			writeFileSync(join(root, 'src/a.ts'), 'const x=1\n');
			const command = patch('*** Update File: src/a.ts');
			let result = hook(root, 'PreToolUse', command, { cwd: alias });
			assert.equal(result.status, 0, result.stderr);
			result = hook(root, 'PostToolUse', command, { cwd: alias });
			assert.equal(result.stdout, '', result.stdout);
			assert.equal(readFileSync(join(root, 'src/a.ts'), 'utf8'), 'const x = 1;\n');
		} finally {
			rmSync(links, { recursive: true, force: true });
		}
	}));

test(
	'pre-hook protects alternate filename casing on Windows',
	{ skip: process.platform !== 'win32' },
	() =>
		fixture((root) => {
			writeFileSync(join(root, 'package-lock.json'), '{}');
			denied(root, patch('*** Update File: PACKAGE-LOCK.JSON'));
		}),
);

test(
	'pre-hook resolves relative file symlinks against the physical parent',
	{ skip: process.platform === 'win32' },
	() =>
		fixture((root) => {
			mkdirSync(join(root, 'packages/tokens/deep'), { recursive: true });
			mkdirSync(join(root, 'packages/tokens/src'), { recursive: true });
			writeFileSync(join(root, 'packages/tokens/src/generated.ts'), 'generated');
			symlinkSync('../src/generated.ts', join(root, 'packages/tokens/deep/link.ts'));
			symlinkSync(join(root, 'packages/tokens/deep'), join(root, 'deep-alias'), 'dir');
			denied(root, patch('*** Update File: deep-alias/link.ts'));
		}),
);

test('post-hook bootstrap converts nonzero child exits into a warning', () =>
	fixture((root) => {
		writeFileSync(join(root, '.codex/hooks/format-edited.mjs'), 'process.exit(2);\n');
		const result = hook(root, 'PostToolUse', patch('*** Update File: src/a.ts'));
		assert.equal(result.status, 0, result.stderr);
		assert.match(JSON.parse(result.stdout).systemMessage, /Formatação Codex/);
	}));
