import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';

const [ci, release] = await Promise.all([
	fs.readFile(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8'),
	fs.readFile(new URL('../.github/workflows/release.yml', import.meta.url), 'utf8'),
]);
const [developPolicy, releaseGithub] = await Promise.all([
	fs.readFile(new URL('./develop-policy.mjs', import.meta.url), 'utf8'),
	fs.readFile(new URL('./release-github.mjs', import.meta.url), 'utf8'),
]);
const publishRelease = await fs.readFile(
	new URL('../.github/scripts/publish-release.mjs', import.meta.url),
	'utf8',
);

test('publication workflow is manually dispatched only from develop and serialized', () => {
	assert.match(release, /workflow_dispatch:/);
	assert.match(release, /group: release-publication/);
	assert.match(release, /queue: max/);
	assert.doesNotMatch(release, /cancel-in-progress:\s*true/);
	assert.match(release, /GITHUB_REF_NAME" == "develop/);
});

test('publication separates read-only validation from privileged publication', () => {
	assert.match(release, /resolve-validate:[\s\S]*?permissions:[\s\S]*?contents: read/);
	assert.match(release, /publish:[\s\S]*?permissions:[\s\S]*?contents: write/);
	assert.match(release, /publish:[\s\S]*?publish-release\.mjs/);
	assert.doesNotMatch(release, /publish:[\s\S]*?npm run release:/);
});

test('CI keeps checks visible while draft PR jobs are skipped and Ready reruns them', () => {
	assert.match(ci, /ready_for_review/);
	assert.match(
		ci,
		/github\.event_name != 'pull_request' \|\| github\.event\.pull_request\.draft == false/,
	);
	assert.match(ci, /develop-policy:[\s\S]*?github\.base_ref == 'develop'[\s\S]*?draft == false/);
	assert.match(ci, /release-check:[\s\S]*?github\.base_ref == 'master'[\s\S]*?draft == false/);
	assert.match(ci, /push:[\s\S]*?develop[\s\S]*?master/);
});

test('release check rejects invalid PR origins and release deltas', () => {
	assert.match(ci, /GITHUB_HEAD_REF.*release/);
	assert.match(ci, /head\.repo\.full_name.*GITHUB_REPOSITORY/);
	assert.match(ci, /Validar delta exclusivo da release/);
	assert.match(ci, /CHANGELOG\\\.md\|package\\\.json\|package-lock\\\.json/);
});

test('develop policy distinguishes normal PRs from same-repository back-merges', () => {
	assert.match(developPolicy, /PR comum não pode alterar a versão coordenada/);
	assert.match(developPolicy, /PR comum não pode alterar o heading Em andamento/);
	assert.match(developPolicy, /Back-merge altera arquivos não permitidos/);
	assert.match(developPolicy, /pr\.head\?\.repo\?\.full_name === repo/);
	assert.match(developPolicy, /Bloco fechado .* diverge do commit exato liberado/);
});

test('develop policy preserves closed history and reconciles the exact release block', () => {
	assert.match(developPolicy, /Conjunto de versões fechadas divergente/);
	assert.match(developPolicy, /Bloco fechado \$\{closed\.version\} removido/);
	assert.match(developPolicy, /Bloco fechado \$\{closed\.version\} alterado/);
	assert.match(developPolicy, /allowAddedVersion: version/);
	assert.match(
		developPolicy,
		/contents\/CHANGELOG\.md\?ref=\$\{encodeURIComponent\(releaseSha\)\}/,
	);
	assert.match(developPolicy, /headVersion !== version/);
});

test('remote release validation resolves only one matching merged PR', () => {
	assert.match(releaseGithub, /candidates\.length !== 1/);
	assert.match(releaseGithub, /head\?\.repo\?\.full_name === repo/);
	assert.match(releaseGithub, /target-absent/);
	assert.match(releaseGithub, /bootstrap-remote/);
});

test('publication rejects incompatible tags and divergent existing releases before writes', () => {
	assert.match(
		publishRelease,
		/tag\.exists && \(!tag\.annotated \|\| tag\.commit !== releaseSha\)/,
	);
	assert.match(publishRelease, /Tag v\$\{target\} é lightweight ou aponta para outro commit/);
	assert.match(publishRelease, /GitHub Release v\$\{target\} existente está divergente/);
	assert.match(publishRelease, /if \(currentState\.release\)[\s\S]*?process\.exit\(0\)/);
	assert.match(publishRelease, /await api\('\/git\/tags'/);
	assert.match(publishRelease, /await api\('\/releases'/);
});

test('publication recovers a valid tag by creating only the missing release', () => {
	assert.match(publishRelease, /let tag = currentState\.tag/);
	assert.match(publishRelease, /if \(!tag\.exists\) \{/);
	assert.match(publishRelease, /await api\('\/git\/tags'/);
	assert.match(publishRelease, /await api\('\/releases'/);
	assert.match(publishRelease, /if \(!tag\.annotated \|\| tag\.commit !== releaseSha\)/);
});

test('publication revalidates read-only evidence and mutable state before writes', () => {
	assert.match(publishRelease, /Commit rederivado diverge do job read-only/);
	assert.match(publishRelease, /Back-merge rederivado diverge do job read-only/);
	assert.match(publishRelease, /Notas rederivadas divergem da evidência read-only/);
	assert.match(publishRelease, /develop mudou durante a publicação/);
	assert.match(publishRelease, /PR\/commit de release ou back-merge mudou durante a publicação/);
	assert.match(publishRelease, /const currentState = await validateTargetArtifacts/);
});

test('publication validates the resolved predecessor before and immediately before writes', () => {
	assert.match(publishRelease, /async function validatePublished/);
	assert.match(publishRelease, /Release anterior \$\{target\} inconsistente/);
	assert.match(publishRelease, /Metadados da release anterior \$\{target\} divergentes/);
	assert.match(
		publishRelease,
		/if \(predecessor\) await validatePublished\(predecessor\);[\s\S]*?await validateTargetArtifacts/,
	);
	assert.match(
		publishRelease,
		/if \(predecessor\) await validatePublished\(predecessor\);[\s\S]*?const currentState/,
	);
});

test('publication resolves merged commits and CI requires an up-to-date base', () => {
	assert.match(publishRelease, /merge_commit_sha/);
	assert.match(publishRelease, /assertAncestor\(releaseSha, initialMasterSha/);
	assert.match(publishRelease, /assertAncestor\(backmergeSha, initialDevelopSha/);
	assert.match(ci, /pull_request:/);
});

test('release validation rejects pre-existing target artifacts and incompatible bootstrap history', () => {
	assert.match(releaseGithub, /command === 'target-absent'/);
	assert.match(releaseGithub, /state\.tag\.exists \|\| state\.release/);
	assert.match(releaseGithub, /command === 'bootstrap-remote'/);
	assert.match(releaseGithub, /Bootstrap incompatível com histórico remoto/);
	assert.match(releaseGithub, /releaseTags\.length \|\| releaseNames\.length/);
});
