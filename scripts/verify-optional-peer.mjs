/**
 * Verifica, com o pacote empacotado de verdade, o contrato do peer opcional `react-imask`:
 * (A) um consumidor do entrypoint raiz instala, tipa, empacota e executa sem a dependência;
 * (B) o subpath `./masked-input` resolve, tipa, empacota e renderiza com a dependência instalada.
 * Exige `npm run build`; usa a rede (registro npm) apenas para instalar o consumidor temporário.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { npmCli } from './npm-cli.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const components = resolve(root, 'packages/components');
if (!existsSync(resolve(components, 'dist/masked-input.js')))
	throw new Error('Execute `npm run build` antes de verificar o peer opcional.');

const rootManifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const lock = JSON.parse(readFileSync(resolve(root, 'package-lock.json'), 'utf8'));
const imaskVersion = lock.packages['node_modules/react-imask'].version;
const react = rootManifest.dependencies.react;
const reactDom = rootManifest.dependencies['react-dom'];
const typesReact = rootManifest.devDependencies['@types/react'];
const typesReactDom = rootManifest.devDependencies['@types/react-dom'];
const npm = npmCli();
const tsc = resolve(root, 'node_modules/typescript/bin/tsc');

const work = mkdtempSync(join(tmpdir(), 'ads-optional-peer-'));
const log = (message) => console.log(`[peer opcional] ${message}`);
const run = (command, args, cwd) =>
	execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const failure = (error) => `${error.stdout ?? ''}${error.stderr ?? ''}`.trim() || String(error);

try {
	// 1. Pacote publicado: somente `dist`, sem fontes nem o peer embutido.
	const packDir = join(work, 'pack');
	mkdirSync(packDir);
	const packed = JSON.parse(
		run(
			process.execPath,
			[npm, 'pack', '--workspace', '@admin-ds/components', '--pack-destination', packDir, '--json'],
			root,
		),
	)[0];
	const names = packed.files.map((file) => file.path);
	for (const expected of ['dist/index.js', 'dist/masked-input.js', 'dist/masked-input.d.ts'])
		if (!names.includes(expected)) throw new Error(`O pacote não publica ${expected}`);
	if (names.some((name) => name.startsWith('src/') || name.includes('node_modules')))
		throw new Error('O pacote publica fontes ou dependências embutidas');
	const tarball = join(packDir, packed.filename);

	// 2. Consumidor temporário SEM react-imask.
	const app = join(work, 'consumer');
	mkdirSync(app);
	writeFileSync(
		join(app, 'package.json'),
		JSON.stringify({
			name: 'ads-peer-consumer',
			private: true,
			type: 'module',
			dependencies: {
				'@admin-ds/components': `file:${tarball}`,
				react,
				'react-dom': reactDom,
				'@types/react': typesReact,
				'@types/react-dom': typesReactDom,
			},
		}),
	);
	writeFileSync(
		join(app, 'tsconfig.json'),
		JSON.stringify({
			compilerOptions: {
				target: 'ES2022',
				module: 'ESNext',
				moduleResolution: 'Bundler',
				jsx: 'react-jsx',
				strict: true,
				noEmit: true,
				types: [],
				lib: ['ES2022', 'DOM'],
			},
			include: ['src'],
		}),
	);
	mkdirSync(join(app, 'src'));
	const install = () =>
		run(process.execPath, [npm, 'install', '--ignore-scripts', '--no-audit', '--no-fund'], app);

	writeFileSync(
		join(app, 'src/root.tsx'),
		`import { AdsField, AdsInput } from '@admin-ds/components';
export const Page = () => (
	<AdsField label="Nome"><AdsInput /></AdsField>
);
`,
	);
	const outcome = install();
	if (/ERESOLVE|EBADPEER|Could not resolve/i.test(outcome))
		throw new Error(`A instalação sem react-imask emitiu conflito de peer:\n${outcome}`);
	if (
		existsSync(join(app, 'node_modules/react-imask')) ||
		existsSync(join(app, 'node_modules/imask'))
	)
		throw new Error('react-imask foi instalado sem ter sido solicitado (peer opcional)');
	log('A: instalação sem react-imask concluída, sem conflito de peer.');

	try {
		run(process.execPath, [tsc, '-p', 'tsconfig.json'], app);
	} catch (error) {
		throw new Error(`A: tipos do entrypoint raiz falharam sem react-imask:\n${failure(error)}`, {
			cause: error,
		});
	}
	log('A: tipos do entrypoint raiz resolvem sem react-imask.');

	const rootBundle = await build({
		entryPoints: [join(app, 'src/root.tsx')],
		bundle: true,
		write: false,
		minify: true,
		format: 'esm',
		platform: 'browser',
		external: ['react', 'react-dom', 'react/*', 'react-dom/*'],
		absWorkingDir: app,
		logLevel: 'silent',
	});
	const rootText = rootBundle.outputFiles.map((file) => file.text).join('');
	if (/imask/i.test(rootText)) throw new Error('A: o bundle do entrypoint raiz contém IMask');
	log(`A: bundle do entrypoint raiz sem IMask (${rootText.length} bytes minificados).`);

	writeFileSync(
		join(app, 'ssr-root.mjs'),
		`import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { AdsInput } from '@admin-ds/components';
const html = renderToString(createElement(AdsInput, { 'aria-label': 'Nome', defaultValue: 'Ana' }));
if (!html.includes('value="Ana"')) throw new Error('SSR do entrypoint raiz falhou');
`,
	);
	run(process.execPath, ['ssr-root.mjs'], app);
	log('A: execução (SSR) do entrypoint raiz sem react-imask.');

	let unresolved = '';
	try {
		await build({
			stdin: {
				contents:
					"import { AdsMaskedInput } from '@admin-ds/components/masked-input'; console.log(AdsMaskedInput);",
				resolveDir: app,
			},
			bundle: true,
			write: false,
			external: ['react', 'react-dom', 'react/*', 'react-dom/*'],
			logLevel: 'silent',
		});
	} catch (error) {
		unresolved = String(error.errors?.[0]?.text ?? error);
	}
	if (!/react-imask/.test(unresolved))
		throw new Error(
			`A: o subpath sem react-imask deveria falhar apontando a dependência: ${unresolved}`,
		);
	log('A: o subpath exige explicitamente react-imask (comportamento opt-in esperado).');

	// 3. Mesmo consumidor COM react-imask na versão do lockfile.
	run(
		process.execPath,
		[npm, 'install', '--ignore-scripts', '--no-audit', '--no-fund', `react-imask@${imaskVersion}`],
		app,
	);
	writeFileSync(
		join(app, 'src/masked.tsx'),
		`import { AdsField } from '@admin-ds/components';
import {
	AdsMaskedInput,
	type AdsMaskedInputProps,
	type AdsMaskedInputValues,
} from '@admin-ds/components/masked-input';
const onValueChange = (values: AdsMaskedInputValues) => values.maskedValue.concat(values.unmaskedValue);
const props: AdsMaskedInputProps = { mask: '000.000', onValueChange };
export const Page = () => (
	<AdsField label="Código"><AdsMaskedInput {...props} /></AdsField>
);
`,
	);
	try {
		run(process.execPath, [tsc, '-p', 'tsconfig.json'], app);
	} catch (error) {
		throw new Error(`B: tipos do subpath falharam com react-imask:\n${failure(error)}`, {
			cause: error,
		});
	}
	log('B: tipos do subpath resolvem com react-imask.');

	const maskedBundle = await build({
		entryPoints: [join(app, 'src/masked.tsx')],
		bundle: true,
		write: false,
		minify: true,
		format: 'esm',
		platform: 'browser',
		external: ['react', 'react-dom', 'react/*', 'react-dom/*'],
		absWorkingDir: app,
		logLevel: 'silent',
	});
	const maskedBytes = maskedBundle.outputFiles.reduce((sum, file) => sum + file.contents.length, 0);
	log(`B: bundle do subpath resolve (${maskedBytes} bytes minificados, React externo).`);

	writeFileSync(
		join(app, 'ssr-masked.mjs'),
		`import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { AdsMaskedInput } from '@admin-ds/components/masked-input';
const html = renderToString(createElement(AdsMaskedInput, { 'aria-label': 'Código', defaultValue: '123.456', mask: '000.000' }));
if (!html.includes('value="123.456"')) throw new Error('SSR do subpath falhou');
`,
	);
	run(process.execPath, ['ssr-masked.mjs'], app);
	log('B: execução (SSR em Node) do subpath com react-imask.');
	log('Concluído sem falhas.');
} finally {
	rmSync(work, { recursive: true, force: true });
}
