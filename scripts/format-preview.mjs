// Temporary CI diagnostic: emit Prettier-formatted changes for a connector-only edit session.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const files = execFileSync('git', ['diff', '--name-only', '--diff-filter=ACM'], {
	encoding: 'utf8',
}).trim().split('\n').filter(Boolean);
for (const file of files) {
	const content = readFileSync(file, 'utf8');
	const total = Math.max(1, Math.ceil(content.length / 3000));
	for (let part = 0; part < total; part++) {
		console.log('__FMT__' + JSON.stringify({ file, part, total, value: content.slice(part * 3000, (part + 1) * 3000) }));
	}
}
