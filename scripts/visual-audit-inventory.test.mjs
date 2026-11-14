import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const script = join(root, 'scripts/visual-audit-inventory.mjs');
const run = (mode) => execFileSync(process.execPath, [script, mode], { cwd: root, encoding: 'utf8' });

test('inventário confere com o catálogo e o Storybook', () => {
  assert.match(run('--check'), /^Inventário sincronizado: \d+ exports visuais\./);
});
test('modelo novo não afirma inspeção aprovada', () => {
  const template = run('--print');
  assert.ok(template.includes('| ' + String.fromCharCode(96) + 'AdsButton' + String.fromCharCode(96) + ' |'));
  assert.match(template, /\| Pendente \| — \|/);
  assert.doesNotMatch(template, /\| Sem divergência \|/);
});
