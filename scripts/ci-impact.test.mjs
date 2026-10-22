import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyImpact } from './ci-impact.mjs';

const manifests = [
  { name: '@admin-ds/tokens' },
  { name: '@admin-ds/components', dependencies: { '@admin-ds/tokens': '*' } },
  { name: '@admin-ds/admin', dependencies: { '@admin-ds/components': '*' } },
  { name: '@admin-ds/docs', dependencies: { '@admin-ds/components': '*' } },
  { name: '@admin-ds/admin-demo', dependencies: { '@admin-ds/admin': '*' } },
];

test('docs-only changes do not affect workspaces', () => {
  assert.deepEqual(classifyImpact(['docs/quality.md'], manifests).affected, []);
  assert.equal(classifyImpact(['docs/quality.md'], manifests).mode, 'docs');
});

test('transitive dependents are included', () => {
  assert.deepEqual(classifyImpact(['packages/tokens/src/index.ts'], manifests).affected, [
    'packages/tokens', 'packages/components', 'packages/admin', 'apps/docs', 'apps/admin-demo',
  ]);
});

test('component changes include downstream apps', () => {
  assert.deepEqual(classifyImpact(['packages/components/src/Button.tsx'], manifests).affected, [
    'packages/components', 'packages/admin', 'apps/docs', 'apps/admin-demo',
  ]);
});

test('app-only changes remain scoped', () => {
  assert.deepEqual(classifyImpact(['apps/docs/src/index.ts'], manifests).affected, ['apps/docs']);
});

test('unknown, global, manifest and missing inputs fail closed', () => {
  for (const files of [[], ['scripts/build-all.mjs'], ['package-lock.json'], ['packages/admin/package.json'], ['mystery.txt'], ['../escape']]) {
    assert.equal(classifyImpact(files, manifests).mode, 'full');
  }
});

test('docs with runtime impact are not skipped', () => {
  for (const file of ['docs/integration.md', 'docs/bundle-baseline.md', 'packages/tokens/README.md', 'openspec/specs/a/schema.yaml']) {
    assert.equal(classifyImpact([file], manifests).mode, 'full', file);
  }
});
