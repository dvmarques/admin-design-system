import { execFileSync } from 'node:child_process';

export function auditRevision(root) {
	try {
		const git = (args) =>
			execFileSync('git', args, {
				cwd: root,
				encoding: 'utf8',
				stdio: ['ignore', 'pipe', 'pipe'],
			}).trim();
		return {
			commit: git(['rev-parse', 'HEAD']),
			workingTreeDirty: git(['status', '--porcelain', '--untracked-files=no']).length > 0,
		};
	} catch {
		return { commit: process.env.GITHUB_SHA ?? null, workingTreeDirty: null };
	}
}
