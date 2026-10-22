#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { classifyImpact } from './ci-impact.mjs';

const workspaces = ['packages/tokens', 'packages/components', 'packages/admin', 'apps/docs', 'apps/admin-demo'];
const commands = new Set(['lint', 'typecheck', 'test']);
const command = process.argv[2];
if (!commands.has(command)) {
  console.error('Usage: node scripts/validate-impact.mjs lint|typecheck|test');
  process.exit(2);
}
const run = (program, args) => spawnSync(program, args, { stdio: 'inherit', shell: process.platform === 'win32' });
const changed = spawnSync('git', ['diff', '--name-only', process.env.GITHUB_BASE_SHA || 'HEAD^1', 'HEAD'], { encoding: 'utf8', shell: process.platform === 'win32' });
let impact = { mode: 'full', affected: workspaces, reason: 'git diff unavailable' };
if (changed.status === 0) {
  try {
    const manifests = workspaces.map((name) => JSON.parse(fs.readFileSync(name + '/package.json', 'utf8')));
    impact = classifyImpact(changed.stdout.trim().split('\n').filter(Boolean), manifests);
  } catch {
    // Fail closed when manifests are missing or invalid.
  }
}
console.log('Impact:', JSON.stringify(impact));
if (impact.mode === 'docs') {
  console.log('No affected workspaces; mandatory CI gates remain unchanged.');
  process.exit(0);
}
if (impact.mode === 'full') {
  const args = command === 'test' ? ['run', 'test:quiet'] : ['run', command];
  process.exit(run('npm', args).status ?? 1);
}
const names = impact.affected.map((workspace) => JSON.parse(fs.readFileSync(workspace + '/package.json', 'utf8')).name);
let args;
if (command === 'lint') {
  args = ['exec', '--', 'eslint', ...impact.affected];
} else if (command === 'typecheck') {
  args = ['run', 'typecheck', '--if-present', ...names.flatMap((name) => ['--workspace', name])];
} else {
  args = ['run', 'test:quiet', '--if-present', ...names.flatMap((name) => ['--workspace', name])];
}
process.exit(run('npm', args).status ?? 1);
