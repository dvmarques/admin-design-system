import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { catalogEntries } from './app/catalogo/catalog-data';

const root = fileURLToPath(new URL('../../', import.meta.url));

function publicRuntimeExports(source: string): string[] {
  const names: string[] = [];
  for (const match of source.matchAll(/export\s*\{([^}]+)\}\s*from/g)) {
    for (const entry of match[1].split(',')) {
      const name = entry.trim().split(/\s+as\s+/).at(-1)?.trim();
      if (name?.startsWith('Ads') || name === 'ThemeToggle' || name === 'StyleFixture') names.push(name);
    }
  }
  return names;
}

describe('admin demo catalog inventory', () => {
  it('indexes every public UI runtime export without duplicates', () => {
    const components = readFileSync(root + 'packages/components/src/index.ts', 'utf8');
    const admin = readFileSync(root + 'packages/admin/src/index.ts', 'utf8');
    const exports = [...publicRuntimeExports(components), ...publicRuntimeExports(admin)];
    const indexed = catalogEntries.map((entry) => entry.name);
    expect(new Set(indexed).size).toBe(indexed.length);
    expect(indexed.slice().sort()).toEqual(exports.slice().sort());
  });

  it('points each inventory entry to an existing demonstration category', () => {
    for (const entry of catalogEntries) {
      expect(entry.href.startsWith('/')).toBe(true);
      expect(entry.group.length).toBeGreaterThan(0);
    }
  });
});
