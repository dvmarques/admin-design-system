import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
for (const path of [
	manifest.exports['.'].import,
	manifest.exports['.'].types,
	manifest.exports['./styles.css'],
	manifest.exports['./masked-input'].import,
	manifest.exports['./masked-input'].types,
]) {
	await access(new URL(`../${path.replace('./', '')}`, import.meta.url));
}

// Modules with state or effects must keep the directive; the server ones must stay usable from a
// Server Component, so a stray directive would force every consumer page to become a client one.
const clientModules = ['theme-toggle', 'tabs', 'accordion', 'breadcrumb-collapse', 'masked-input'];
const serverModules = ['navigation'];
for (const name of clientModules) {
	const source = await readFile(new URL(`../dist/${name}.js`, import.meta.url), 'utf8');
	if (!source.startsWith("'use client'"))
		throw new Error(`Client directive was not preserved in the distributed module ${name}`);
	if (source.includes('react.development'))
		throw new Error('React must not be bundled into the package artifact');
}
for (const name of serverModules) {
	const source = await readFile(new URL(`../dist/${name}.js`, import.meta.url), 'utf8');
	if (/^['"]use client['"]/.test(source))
		throw new Error(`Server module ${name} must not declare the client directive`);
	// Client-only React APIs would fail when a Server Component imports the module (react-server condition).
	const clientApi = source.match(
		/\b(createContext|useContext|useState|useReducer|useEffect|useLayoutEffect|useRef|useId|useMemo|useCallback)\b/,
	);
	if (clientApi) throw new Error(`Server module ${name} uses the client-only API ${clientApi[1]}`);
}

// `react-imask` é peer opcional: só o subpath `./masked-input` pode alcançá-lo. Percorre o grafo de
// imports estáticos do entrypoint raiz para provar que nenhum caminho o carrega, direta ou indiretamente.
const optionalPeers = Object.entries(manifest.peerDependenciesMeta ?? {})
	.filter(([, meta]) => meta.optional)
	.map(([name]) => name);
if (!optionalPeers.includes('react-imask') || !manifest.peerDependencies['react-imask'])
	throw new Error('react-imask must be declared as an optional peer dependency');
if (manifest.dependencies && 'react-imask' in manifest.dependencies)
	throw new Error('react-imask must not be a runtime dependency of the package');
const importPattern =
	/(?:^|\n)\s*(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|(?:^|\n)\s*import\s*['"]([^'"]+)['"]/g;
const seen = new Set();
const pending = [new URL(`../${manifest.exports['.'].import.replace('./', '')}`, import.meta.url)];
while (pending.length > 0) {
	const url = pending.pop();
	const key = fileURLToPath(url);
	if (seen.has(key)) continue;
	seen.add(key);
	const source = await readFile(url, 'utf8');
	for (const match of source.matchAll(importPattern)) {
		const specifier = match[1] ?? match[2];
		if (optionalPeers.some((peer) => specifier === peer || specifier.startsWith(`${peer}/`)))
			throw new Error(`The root entry point reaches the optional peer ${specifier} through ${key}`);
		if (/(^|\/)masked-input(\.js)?$/.test(specifier))
			throw new Error(`The root entry point reaches the masked-input subpath through ${key}`);
		if (specifier.startsWith('.')) pending.push(new URL(specifier, url));
	}
}
