import assert from 'node:assert/strict';
import test from 'node:test';
import { assertPublicationRef } from './release-publication-ref.mjs';

const approved = 'a'.repeat(40);
const newer = 'b'.repeat(40);

test('autoriza somente master no merge SHA da release', () => {
	assert.doesNotThrow(() => assertPublicationRef('refs/heads/master', approved, approved));
});

test('recusa develop, feature e tag antes de publicar', () => {
	for (const ref of ['refs/heads/develop', 'refs/heads/feature/298', 'refs/tags/v0.1.3']) {
		assert.throws(() => assertPublicationRef(ref, approved, approved), /refs\/heads\/master/);
	}
});

test('recusa HEAD posterior em master e SHA inválido', () => {
	assert.throws(
		() => assertPublicationRef('refs/heads/master', newer, approved),
		/diverge do merge SHA/,
	);
	assert.throws(() => assertPublicationRef('refs/heads/master', 'abc', approved), /inválido/);
	assert.throws(() => assertPublicationRef('refs/heads/master', approved, ''), /inválido/);
});
