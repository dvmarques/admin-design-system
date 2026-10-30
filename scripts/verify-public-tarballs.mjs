import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const packageOrder = ['tokens', 'components', 'highlighted-code', 'admin'];
const nameFor = (name) => '@dvmarques/admin-ds-' + name;

async function command(exe, args, cwd, extraEnv = {}) {
  return new Promise((resolveResult, reject) => {
    const child = spawn(exe, args, {
      cwd,
      env: { ...process.env, CI: '1', ...extraEnv },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8').on('data', (chunk) => { stdout += chunk; });
    child.stderr.setEncoding('utf8').on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolveResult({ stdout, stderr });
      else reject(new Error(exe + ' ' + args.join(' ') + ' failed (' + code + '):\n' + stdout.slice(-3000) + '\n' + stderr.slice(-3000)));
    });
  });
}

async function write(cwd, filename, content) {
  const target = join(cwd, filename);
  await mkdir(join(target, '..'), { recursive: true });
  await writeFile(target, content, 'utf8');
}

async function getPort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      server.close(() => resolvePort(address.port));
    });
  });
}

async function ready(url, server) {
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw new Error('Next.js stopped before becoming ready');
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch { /* next start is still booting */ }
    await new Promise((res) => setTimeout(res, 500));
  }
  throw new Error('Next.js did not become ready for the external smoke test');
}

async function main() {
  const temp = await mkdtemp(join(tmpdir(), 'admin-ds-public-pack-'));
  const packDir = join(temp, 'tarballs');
  const consumer = join(temp, 'next-consumer');
  await mkdir(packDir);
  await mkdir(consumer);
  let server;
  let browser;
  try {
    const dependencies = {};
    for (const item of packageOrder) {
      const name = nameFor(item);
      const manifest = JSON.parse(await readFile(join(root, 'packages', item, 'package.json'), 'utf8'));
      assert.equal(manifest.name, name);
      assert.equal(manifest.private, false, name + ' must be public');
      assert.equal(manifest.publishConfig?.access, 'public', name + ' must use public access');
      assert.equal(manifest.license, 'MIT');
      await command(npm, ['run', 'build', '--workspace', name], root);
      const packed = await command(npm, ['pack', '--workspace', name, '--json', '--pack-destination', packDir, '--ignore-scripts'], root);
      const result = JSON.parse(packed.stdout);
      assert.equal(result.length, 1, 'one tarball per workspace');
      assert.equal(result[0].name, name);
      const entries = result[0].files.map((file) => file.path);
      for (const required of ['package.json', 'LICENSE.md', 'README.md', 'dist/index.js', 'dist/index.d.ts']) {
        assert.ok(entries.includes(required), name + ' lacks ' + required);
      }
      const css = item === 'tokens' ? 'dist/tokens.css' : 'dist/styles.css';
      assert.ok(entries.includes(css), name + ' lacks ' + css);
      if (item === 'components') {
        assert.ok(entries.includes('dist/THIRD_PARTY_NOTICES.md'), 'component third-party notices absent');
      }
      assert.ok(entries.every((path) =>
        !path.startsWith('src/') && !path.startsWith('tests/') &&
        !path.includes('node_modules/') && !path.includes('.env') &&
        !path.includes('.git/') && !path.includes('secret')),
        name + ' tarball contains private/source files');
      const license = await readFile(join(root, 'packages', item, 'LICENSE.md'), 'utf8');
      assert.match(license, /MIT License/);
      assert.match(license, /Daniel Marques/);
      dependencies[name] = 'file:' + join(packDir, result[0].filename);
      console.log('PACK OK', name, result[0].filename, entries.length, 'files');
    }
    const privatePackages = [join(root, 'package.json'), join(root, 'apps/admin-demo/package.json'), join(root, 'apps/docs/package.json')];
    for (const path of privatePackages) {
      const manifest = JSON.parse(await readFile(path, 'utf8'));
      assert.equal(manifest.private, true, path + ' must stay private');
    }
    const fixture = {
      name: 'admin-ds-external-smoke',
      version: '1.0.0',
      private: true,
      type: 'module',
      scripts: { build: 'next build', typecheck: 'tsc --noEmit', start: 'next start' },
      dependencies: {
        ...dependencies,
        next: '16.2.12',
        react: '19.2.8',
        'react-dom': '19.2.8',
      },
      devDependencies: {
        typescript: '^5.9.3',
        '@types/node': '^24.19.2',
        '@types/react': '^19.2.17',
        '@types/react-dom': '^19.2.3',
      },
    };
    await write(consumer, 'package.json', JSON.stringify(fixture, null, 2) + '\n');
    await write(consumer, 'next.config.mjs', 'export default { reactStrictMode: true };\n');
    await write(consumer, 'tsconfig.json', JSON.stringify({
      compilerOptions: {
        target: 'ES2018', lib: ['dom', 'dom.iterable', 'esnext'], skipLibCheck: true,
        strict: true, noEmit: true, esModuleInterop: true, module: 'esnext',
        moduleResolution: 'bundler', resolveJsonModule: true, isolatedModules: true,
        jsx: 'preserve', incremental: true, plugins: [{ name: 'next' }],
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    }, null, 2) + '\n');
    await write(consumer, 'app/layout.tsx', [
      "import '@dvmarques/admin-ds-tokens/styles.css';",
      "import '@dvmarques/admin-ds-components/styles.css';",
      "import '@dvmarques/admin-ds-admin/styles.css';",
      "import '@dvmarques/admin-ds-highlighted-code/styles.css';",
      "import type { ReactNode } from 'react';",
      'export default function Layout({ children }: { children: ReactNode }) {',
      "  return <html lang=\"pt-BR\" data-theme=\"light\"><body>{children}</body></html>;",
      '}',
      '',
    ].join('\n'));
    await write(consumer, 'app/client-probe.tsx', [
      "'use client';",
      "import { useState } from 'react';",
      "import { AdsButton } from '@dvmarques/admin-ds-components';",
      "import { AdsHighlightedCodeSnippet } from '@dvmarques/admin-ds-highlighted-code';",
      'export function ClientProbe() {',
      '  const [count, setCount] = useState(0);',
      '  return <section><AdsButton onClick={() => setCount((n) => n + 1)}>Incrementar</AdsButton>',
      '    <output data-testid="counter">{count}</output>',
      '    <AdsHighlightedCodeSnippet code="SELECT 1;" language="sql" theme="auto" />',
      '  </section>;',
      '}',
      '',
    ].join('\n'));
    await write(consumer, 'app/page.tsx', [
      "import { AdsTypography } from '@dvmarques/admin-ds-components';",
      "import { AdsMetricCard } from '@dvmarques/admin-ds-admin';",
      "import { tokenValues } from '@dvmarques/admin-ds-tokens';",
      "import { ClientProbe } from './client-probe';",
      'export default function Page() {',
      '  return <main><AdsTypography variant="heading1">Teste externo</AdsTypography>',
      '    <AdsMetricCard title="Métrica" value="42" />',
      '    <span data-testid="tokens">{Object.keys(tokenValues).length}</span>',
      '    <ClientProbe /></main>;',
      '}',
      '',
    ].join('\n'));
    await command(npm, ['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumer);
    await command(npm, ['run', 'build'], consumer, { NEXT_TELEMETRY_DISABLED: '1' });
    await command(npm, ['run', 'typecheck'], consumer);
    const port = await getPort();
    server = spawn(npm, ['run', 'start', '--', '-p', String(port)], {
      cwd: consumer, env: { ...process.env, CI: '1', NEXT_TELEMETRY_DISABLED: '1' },
      stdio: 'ignore',
    });
    const url = 'http://127.0.0.1:' + port;
    await ready(url, server);
    const { chromium } = await import('@playwright/test');
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const hydrationErrors = [];
    page.on('pageerror', (error) => hydrationErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error' && /hydrat|server rendered html|did not match/i.test(message.text())) {
        hydrationErrors.push(message.text());
      }
    });
    await page.goto(url, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').innerText(), 'Teste externo');
    assert.equal(await page.locator('[data-testid="counter"]').innerText(), '0');
    await page.getByRole('button', { name: 'Incrementar' }).click();
    assert.equal(await page.locator('[data-testid="counter"]').innerText(), '1');
    const styles = await page.getByRole('button', { name: 'Incrementar' }).evaluate((element) => {
      const computed = getComputedStyle(element);
      return { height: computed.minHeight, tokens: getComputedStyle(document.documentElement).getPropertyValue('--ads-color-primary') };
    });
    assert.ok(styles.height && styles.height !== '0px', 'compiled CSS not applied');
    assert.ok(styles.tokens.trim(), 'token CSS not applied');
    assert.deepEqual(hydrationErrors, [], 'hydration or runtime errors');
    console.log('EXTERNAL NEXT.JS OK: types, build, CSS, Server/Client, Shiki opt-in, browser hydration');
  } finally {
    await browser?.close();
    if (server && server.exitCode === null) server.kill();
    await rm(temp, { recursive: true, force: true, maxRetries: 3 });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
