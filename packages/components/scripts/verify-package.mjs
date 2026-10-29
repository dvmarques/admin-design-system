import { access, readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
for (const path of [
	manifest.exports['.'].import,
	manifest.exports['.'].types,
	manifest.exports['./styles.css'],
]) {
	await access(new URL(`../${path.replace('./', '')}`, import.meta.url));
}

for (const name of ['LICENSE.md', 'THIRD_PARTY_NOTICES.md']) {
	const [source, distributed] = await Promise.all([
		readFile(new URL(`../../../${name}`, import.meta.url), 'utf8'),
		readFile(new URL(`../dist/${name}`, import.meta.url), 'utf8'),
	]);
	if (distributed !== source) {
		throw new Error(`Distributed ${name} is missing or differs from the repository notice`);
	}
}

// Modules with state or effects must keep the directive; the server ones must stay usable from a
// Server Component, so a stray directive would force every consumer page to become a client one.
const clientModules = [
	'theme-toggle',
	'tabs',
	'accordion',
	'breadcrumb-collapse',
	'select-placeholder',
];
const serverModules = ['navigation', 'select'];
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
