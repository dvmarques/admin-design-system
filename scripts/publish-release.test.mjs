import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { spawn } from 'node:child_process';
import test from 'node:test';

test('publication blocks before writes when the back-merge is absent', async () => {
	const requests = [];
	const server = createServer((request, response) => {
		requests.push({ method: request.method, url: request.url });
		response.setHeader('content-type', 'application/json');
		if (request.url?.includes('base=master')) {
			response.end(
				JSON.stringify([
					{
						merged_at: '2026-09-08T00:00:00Z',
						head: { repo: { full_name: 'org/repo' }, ref: 'release/1.0.0' },
						base: { ref: 'master' },
						merge_commit_sha: 'release-sha',
					},
				]),
			);
		} else {
			response.end(JSON.stringify([]));
		}
	});
	server.listen(0, '127.0.0.1');
	await once(server, 'listening');
	const { port } = server.address();
	const result = await new Promise((resolve) => {
		const child = spawn(process.execPath, ['.github/scripts/publish-release.mjs'], {
			cwd: process.cwd(),
			env: {
				...process.env,
				VERSION: '1.0.0',
				GITHUB_REPOSITORY: 'org/repo',
				GITHUB_TOKEN: 'test',
				GITHUB_API_URL: `http://127.0.0.1:${port}`,
				READONLY_RELEASE_SHA: 'release-sha',
				READONLY_BACKMERGE_SHA: 'backmerge-sha',
				READONLY_DEVELOP_SHA: 'develop-sha',
				READONLY_RELEASE_NOTES_SHA: 'notes',
			},
		});
		let stderr = '';
		child.stderr.on('data', (chunk) => {
			stderr += chunk;
		});
		child.on('close', (code) => resolve({ code, stderr }));
	});
	server.close();
	assert.notEqual(result.code, 0);
	assert.match(result.stderr, /release\/1\.0\.0 -> develop/);
	assert.equal(
		requests.some(({ method }) => method !== 'GET'),
		false,
	);
});
