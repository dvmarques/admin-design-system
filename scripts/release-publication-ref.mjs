#!/usr/bin/env node
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function assertPublicationRef(ref, executionSha, releaseSha) {
	assert.equal(ref, 'refs/heads/master', 'Publicação permitida somente em refs/heads/master.');
	assert.match(executionSha ?? '', /^[a-f0-9]{40}$/, 'SHA da execução inválido.');
	assert.match(releaseSha ?? '', /^[a-f0-9]{40}$/, 'SHA de merge da release inválido.');
	assert.equal(
		executionSha,
		releaseSha,
		'SHA da execução em master diverge do merge SHA aprovado para a release.',
	);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	try {
		assertPublicationRef(...process.argv.slice(2));
		console.log('Ref e merge SHA da publicação aprovados.');
	} catch (error) {
		console.error(error.message);
		process.exitCode = 1;
	}
}
