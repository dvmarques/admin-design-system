import assert from 'node:assert/strict';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { ESLint } from 'eslint';

const root = path.resolve(import.meta.dirname, '..');

test('lint isolates nested worktrees while retaining checkout diagnostics', async () => {
	const fixture = await mkdtemp(path.join(root, 'lint-regression-'));
	try {
		await copyFile(path.join(root, 'eslint.config.mjs'), path.join(fixture, 'eslint.config.mjs'));
		const ownFile = path.join(fixture, 'own.ts');
		await writeFile(ownFile, 'export const value: number = 1;\n');
		const lint = () => new ESLint({ cwd: fixture }).lintFiles(['.']);
		assert.equal(
			(await lint()).reduce((sum, result) => sum + result.errorCount, 0),
			0,
		);

		const nested = path.join(fixture, '.claude', 'worktrees', 'example');
		await mkdir(nested, { recursive: true });
		const files = {
			'eslint.config.mjs': await readFile(path.join(root, 'eslint.config.mjs'), 'utf8'),
			'tsconfig.json': '{"compilerOptions":{"strict":true}}\n',
			'invalid.ts': 'const unused: any = 1;\n',
		};
		for (const [name, content] of Object.entries(files)) {
			await writeFile(path.join(nested, name), content);
		}
		const eslint = new ESLint({ cwd: fixture });
		const clean = await eslint.lintFiles(['.']);
		assert.ok(clean.some((result) => result.filePath === ownFile));
		assert.ok(clean.every((result) => !result.filePath.startsWith(nested + path.sep)));
		assert.equal(
			clean.reduce((sum, result) => sum + result.errorCount, 0),
			0,
		);

		await writeFile(ownFile, 'const unused: any = 1;\n');
		const invalid = await lint();
		assert.ok(invalid.some((result) => result.filePath === ownFile && result.errorCount > 0));
		assert.ok(
			invalid
				.flatMap((result) => result.messages)
				.some((message) => message.ruleId === '@typescript-eslint/no-explicit-any'),
		);
		const nestedResults = await new ESLint({ cwd: nested }).lintFiles(['.']);
		assert.ok(
			nestedResults.some(
				(result) =>
					result.filePath === path.join(nested, 'invalid.ts') &&
					result.messages.some(
						(message) => message.ruleId === '@typescript-eslint/no-explicit-any',
					),
			),
		);
		for (const [name, content] of Object.entries(files)) {
			assert.equal(await readFile(path.join(nested, name), 'utf8'), content);
		}

		const fromAnotherDirectory = new ESLint({
			cwd: root,
			overrideConfigFile: path.join(fixture, 'eslint.config.mjs'),
		});
		const config = await fromAnotherDirectory.calculateConfigForFile(ownFile);
		assert.equal(config.languageOptions.parserOptions.tsconfigRootDir, fixture);
	} finally {
		await rm(fixture, { recursive: true, force: true });
	}
});
