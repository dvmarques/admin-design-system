import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(workspace) {
	return new Promise((resolve, reject) => {
		const child = spawn(npm, ['run', 'build', '--workspace', workspace], {
			cwd: root,
			stdio: 'inherit',
			shell: process.platform === 'win32',
		});
		child.on('error', reject);
		child.on('exit', (code) =>
			code === 0 ? resolve() : reject(new Error(`build de ${workspace} falhou (código ${code})`)),
		);
	});
}

try {
	// Os pacotes dependem do `dist` uns dos outros, então seguem em série.
	for (const workspace of ['@admin-ds/tokens', '@admin-ds/components', '@admin-ds/admin']) {
		await run(workspace);
	}
	// As aplicações só consomem os pacotes já construídos e são independentes entre si.
	await Promise.all(['@admin-ds/docs', '@admin-ds/admin-demo'].map(run));
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
}
