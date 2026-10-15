import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

// Carimbo do build de produção do admin demo usado pelo E2E (`next start`). Guarda uma
// impressão digital do conteúdo que o build consome (código do demo e `dist` dos
// pacotes) para o Playwright recusar um build desatualizado, que daria verde falso.
// Usa conteúdo, não datas, porque `test:quality` regrava arquivos gerados idênticos.
// Sem `import.meta`: o Playwright transpila este módulo para CommonJS ao carregar a config.

const paths = (root) => {
	const demo = join(root, 'apps', 'admin-demo');
	return { demo, stampFile: join(demo, '.next', 'e2e-build-stamp.json') };
};
const ignored = new Set([
	'.next',
	'node_modules',
	'tests',
	'test-results',
	'next-env.d.ts',
	'AGENTS.md',
	'CLAUDE.md',
]);

function listFiles(dir) {
	if (!existsSync(dir)) return [];
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		if (ignored.has(entry.name) || entry.name.endsWith('.tsbuildinfo')) return [];
		const path = join(dir, entry.name);
		return entry.isDirectory() ? listFiles(path) : [path];
	});
}

export function buildFingerprint(root) {
	const { demo } = paths(root);
	const inputs = [
		...listFiles(demo),
		...['tokens', 'components', 'admin'].flatMap((name) =>
			listFiles(join(root, 'packages', name, 'dist')),
		),
	].sort();
	const hash = createHash('sha256');
	for (const file of inputs) {
		hash.update(relative(root, file).split(sep).join('/'));
		hash.update('\0');
		hash.update(readFileSync(file));
		hash.update('\0');
	}
	return hash.digest('hex');
}

/** Retorna `null` se o build pode ser usado pelo E2E, ou a explicação do problema. */
export function checkE2eBuild(root) {
	const { demo, stampFile } = paths(root);
	const hint = 'Rode `npm run build` antes do E2E (ou use E2E_DEV=1 para o `next dev`).';
	if (!existsSync(join(demo, '.next', 'BUILD_ID'))) {
		return `Não há build de produção do admin demo. ${hint}`;
	}
	if (!existsSync(stampFile)) return `O build do admin demo não tem o carimbo do E2E. ${hint}`;
	const { fingerprint } = JSON.parse(readFileSync(stampFile, 'utf8'));
	if (fingerprint !== buildFingerprint(root)) {
		return `O build do admin demo está desatualizado em relação ao código. ${hint}`;
	}
	return null;
}

// Executado pelo `build` do admin demo: `node ../../scripts/e2e-build-stamp.mjs`.
if (process.argv[1]?.endsWith('e2e-build-stamp.mjs')) {
	const root = resolve(dirname(process.argv[1]), '..');
	writeFileSync(
		paths(root).stampFile,
		`${JSON.stringify({ fingerprint: buildFingerprint(root) })}\n`,
	);
}
