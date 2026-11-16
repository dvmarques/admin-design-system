/** Normaliza as formas JSON de npm pack usadas pelo npm 11 e npm 12. */
export function parseNpmPackOutput(output) {
	let parsed;
	try {
		parsed = JSON.parse(output);
	} catch (error) {
		throw new Error('npm pack --json não retornou JSON válido.', { cause: error });
	}

	const results = Array.isArray(parsed) ? parsed : Object.values(parsed ?? {});
	if (results.length !== 1) {
		throw new Error('Esperava um pacote em npm pack --json; recebi ' + results.length + '.');
	}

	const [packed] = results;
	if (!packed || !Array.isArray(packed.files) || typeof packed.filename !== 'string') {
		throw new Error('npm pack --json não retornou os arquivos e o nome do tarball esperados.');
	}
	return packed;
}
