#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tick = String.fromCharCode(96);
const read = (path) => readFileSync(join(root, path), 'utf8');
const fail = (reason) => { throw new Error('Auditoria #152: ' + reason); };

function catalog() {
  const source = read('apps/admin-demo/app/catalogo/catalog-data.ts');
  const entries = [...source.matchAll(/\{\s*name:\s*'([^']+)',\s*group:\s*'([^']+)',[\s\S]*?href:\s*'([^']+)',\s*\}/g)]
    .map((m) => ({ name: m[1], group: m[2], href: m[3] }));
  if (!entries.length || entries.length !== [...source.matchAll(/^\s*name:\s*'/gm)].length) {
    fail('estrutura do catálogo alterada; revisar o extrator');
  }
  return entries;
}
function rows(text, heading) {
  const section = text.split(heading)[1];
  if (!section) fail('seção ausente: ' + heading);
  return section.split(/\r?\n## /)[0].split(/\r?\n/)
    .filter((line) => line.startsWith('| ' + tick))
    .map((line) => {
      const c = line.split('|').slice(1, -1).map((v) => v.trim());
      if (c.length < 4) fail('linha incompleta: ' + line);
      return {
        name: c[0].replaceAll(tick, ''),
        group: c[1],
        href: c[2].replaceAll(tick, ''),
        stories: c[3],
        status: c[4],
        evidence: c[5]
      };
    });
}
function matching(source, target, label) {
  const map = new Map();
  for (const row of target) {
    if (map.has(row.name)) fail(label + ': duplicado ' + row.name);
    map.set(row.name, row);
  }
  if (map.size !== source.length) fail(label + ': diferença na quantidade de exports');
  for (const entry of source) {
    const row = map.get(entry.name);
    if (!row || row.group !== entry.group || row.href !== entry.href) {
      fail(label + ': export, grupo ou rota divergente: ' + entry.name);
    }
  }
  return map;
}
function output(source, refs) {
  const lines = [
    '# Matriz de auditoria visual — issue #152',
    '',
    'Fonte: ' + tick + 'apps/admin-demo/app/catalogo/catalog-data.ts' + tick +
      ' e ' + tick + 'docs/admin-demo-catalog.md' + tick +
      '. A cobertura do catálogo não significa inspeção visual aprovada.',
    'Inspeções detalhadas e evidências seguem o protocolo em [Auditoria visual #152](visual-audit-152.md).',
    '',
    '## Matriz de inspeção',
    '',
    '| Export | Grupo | Rota | Storybook | Inspeção | Evidência |',
    '| --- | --- | --- | --- | --- | --- |'
  ];
  for (const entry of source) {
    lines.push('| ' + tick + entry.name + tick + ' | ' + entry.group +
      ' | ' + tick + entry.href + tick + ' | ' + refs.get(entry.name).stories +
      ' | Pendente | — |');
  }
  return lines.join('\n') + '\n';
}
try {
  if (process.argv.length !== 3 || !['--print', '--check'].includes(process.argv[2])) {
    fail('uso: node scripts/visual-audit-inventory.mjs --print|--check');
  }
  const source = catalog();
  const refs = matching(source,
    rows(read('docs/admin-demo-catalog.md'), '## Matriz export → demonstração'), 'Storybook');
  for (const ref of refs.values()) {
    const stories = ref.stories.match(/[a-z0-9-]+\.stories\.tsx/g) || [];
    if (!stories.length) fail('story ausente para ' + ref.name);
    for (const file of stories) {
      if (!existsSync(join(root, 'apps/docs/src', file))) fail('story não encontrada: ' + file);
    }
  }
  if (process.argv[2] === '--print') process.stdout.write(output(source, refs));
  else {
    const audit = matching(source,
      rows(read('docs/visual-audit-152-inventory.md'), '## Matriz de inspeção'), 'auditoria');
    const valid = new Set(['Pendente', 'Em análise', 'Sem divergência', 'Divergência confirmada', 'Não aplicável']);
    for (const entry of source) {
      const row = audit.get(entry.name);
      if (row.stories !== refs.get(entry.name).stories) fail('stories desatualizadas: ' + entry.name);
      if (!valid.has(row.status)) fail('status desconhecido: ' + entry.name);
      if (row.status !== 'Pendente' && (!row.evidence || row.evidence === '—')) {
        fail('evidência ausente: ' + entry.name);
      }
    }
    console.log('Inventário sincronizado: ' + source.length + ' exports visuais.');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
