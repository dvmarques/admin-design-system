#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const workspaces = ['packages/tokens', 'packages/components', 'packages/admin', 'apps/docs', 'apps/admin-demo'];
const globalPaths = /^(package(-lock)?\.json|tsconfig[^/]*|eslint[^/]*|vitest[^/]*|playwright[^/]*|scripts\/|\.github\/|e2e\/|openspec\/config\.yaml)/;
const docsExceptions = [/^docs\/integration\.md$/, /^docs\/bundle-baseline\./, /^packages\/tokens\/README\.md$/];
const rootDocs = /^(AGENTS|CLAUDE|CHANGELOG|README)\.md$/;

export function classifyImpact(files, manifests) {
  if (!Array.isArray(files) || !files.length || !Array.isArray(manifests) || manifests.length !== workspaces.length)
    return { mode: 'full', reason: 'missing input', affected: workspaces };
  const owners = new Map(manifests.map((manifest, index) => [manifest.name, workspaces[index]]));
  if (owners.size !== workspaces.length || [...owners.keys()].some((name) => !name))
    return { mode: 'full', reason: 'invalid manifests', affected: workspaces };
  const changed = new Set();
  for (const file of files) {
    if (typeof file !== 'string' || !file || file.startsWith('/') || file.includes('..') || globalPaths.test(file))
      return { mode: 'full', reason: 'global or unsafe path', affected: workspaces };
    const workspace = workspaces.find((item) => file.startsWith(item + '/'));
    if (workspace) {
      if (docsExceptions.some((pattern) => pattern.test(file)) || file.endsWith('/package.json')) return { mode: 'full', reason: 'workspace metadata changed', affected: workspaces };
      changed.add(workspace);
    } else if (docsExceptions.some((pattern) => pattern.test(file)) || !(rootDocs.test(file) || /^docs\/[^/]+\.md$/.test(file) || /^openspec\/(?!config\.yaml$).+\.md$/.test(file))) {
      return { mode: 'full', reason: 'unrecognized path', affected: workspaces };
    }
  }
  if (!changed.size) return { mode: 'docs', reason: 'documentation only', affected: [] };
  let updated = true;
  while (updated) {
    updated = false;
    for (let index = 0; index < manifests.length; index++) {
      const manifest = manifests[index];
      const deps = { ...manifest.dependencies, ...manifest.devDependencies, ...manifest.peerDependencies, ...manifest.optionalDependencies };
      if (!changed.has(workspaces[index]) && Object.keys(deps).some((name) => changed.has(owners.get(name)))) {
        changed.add(workspaces[index]);
        updated = true;
      }
    }
  }
  return { mode: 'scoped', reason: 'workspace dependency closure', affected: workspaces.filter((name) => changed.has(name)) };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  let result;
  try {
    const base = process.env.GITHUB_BASE_SHA || 'HEAD^1';
    const files = execFileSync('git', ['diff', '--name-only', base, 'HEAD'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
    const manifests = workspaces.map((workspace) => JSON.parse(fs.readFileSync(path.join(workspace, 'package.json'), 'utf8')));
    result = classifyImpact(files, manifests);
  } catch {
    result = { mode: 'full', reason: 'unable to inspect changes', affected: workspaces };
  }
  console.log(JSON.stringify(result));
}
