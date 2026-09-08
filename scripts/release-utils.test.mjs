import assert from 'node:assert/strict';
import test from 'node:test';
import {
	assertReleaseDate,
	assertStableSemver,
	compareSemver,
	extractReleaseNotes,
	formatReleaseDate,
	isAllowedReleaseFile,
	nextPatch,
	normalizeReleaseBody,
	parseChangelog,
	predecessorVersion,
	prepareChangelog,
	updateManifestVersions,
	validateCoordinatedManifests,
	validateTargetAgainstState,
} from './release-utils.mjs';

test('stable semver', () => {
	assert.equal(assertStableSemver('1.2.3'), '1.2.3');
	assert.throws(() => assertStableSemver('1.2.3-rc.1'));
	assert.throws(() => assertStableSemver('01.2.3'));
});

test('semver compare and patch', () => {
	assert.equal(compareSemver('1.10.0', '1.9.9'), 1);
	assert.equal(nextPatch('1.2.9'), '1.2.10');
});

test('release date uses Sao Paulo calendar and rejects invalid dates', () => {
	assert.equal(formatReleaseDate(new Date('2026-09-08T01:30:00Z')), '07-set-2026');
	assert.equal(assertReleaseDate('29-fev-2028'), '29-fev-2028');
	assert.throws(() => assertReleaseDate('29-fev-2027'));
	assert.throws(() => assertReleaseDate('31-abr-2026'));
	assert.throws(() => parseChangelog('### [1.0.0] - 31-fev-2026\n'));
	assert.throws(() => parseChangelog('### [1.0.0] - publicado\n'));
});

test('changelog parsing and preparation', () => {
	const source =
		'# Changelog\n\n### [0.0.2] - Em andamento\n\n#### Added\n\n- x\n\n### [0.0.1] - 01-set-2026\n\n#### Added\n\n- old\n';
	const parsed = parseChangelog(source);
	assert.equal(parsed.ongoing.length, 1);
	assert.equal(parsed.closed[0].version, '0.0.1');

	const output = prepareChangelog(source, '0.1.0', new Date('2026-09-07T15:00:00-03:00'));
	assert.match(output, /### \[0\.1\.1\] - Em andamento/);
	assert.match(output, /### \[0\.1\.0\] - 07-set-2026/);
	assert.match(output, /- x/);
	assert.equal(extractReleaseNotes(output, '0.1.0'), '#### Added\n\n- x');
});

test('invalid changelog order and duplicate fail', () => {
	assert.throws(() =>
		parseChangelog(
			'### [0.0.2] - Em andamento\n\n### [0.0.1] - 01-set-2026\n\n### [0.0.2] - 02-set-2026\n',
		),
	);
	assert.throws(() =>
		parseChangelog(
			'### [0.0.2] - Em andamento\n\n### [0.0.1] - 01-set-2026\n\n### [0.0.1] - 02-set-2026\n',
		),
	);
});

test('release notes and predecessor use only the closed matching section', () => {
	const source =
		'### [1.0.2] - Em andamento\n\n- future\n\n### [1.0.1] - 02-set-2026\n\n- current\r\n\n### [1.0.0] - 01-set-2026\n\n- previous\n';
	assert.equal(extractReleaseNotes(source, '1.0.1'), '- current');
	assert.equal(predecessorVersion(parseChangelog(source), '1.0.1'), '1.0.0');
	assert.equal(normalizeReleaseBody('- current\r\n'), '- current');
	assert.equal(normalizeReleaseBody('- current\n\n'), '- current');
});

test('bootstrap and subsequent target rules', () => {
	validateTargetAgainstState({
		target: '0.0.1',
		current: '0.0.1',
		parsed: parseChangelog('### [0.0.1] - Em andamento\n'),
	});
	assert.throws(() =>
		validateTargetAgainstState({
			target: '0.0.0',
			current: '0.0.1',
			parsed: parseChangelog('### [0.0.1] - Em andamento\n'),
		}),
	);

	const parsed = parseChangelog('### [0.0.2] - Em andamento\n\n### [0.0.1] - 01-set-2026\n');
	validateTargetAgainstState({ target: '0.1.0', current: '0.0.1', parsed });
	assert.throws(() => validateTargetAgainstState({ target: '0.0.1', current: '0.0.1', parsed }));
});

test('coordinated manifests and internal deps', () => {
	const manifests = [
		{ rel: 'package.json', json: { name: 'root', version: '1.0.0' } },
		{
			rel: 'apps/a/package.json',
			json: {
				name: 'a',
				version: '1.0.0',
				dependencies: { root: '1.0.0', react: '^19' },
			},
		},
	];
	assert.equal(validateCoordinatedManifests(manifests), '1.0.0');

	const updated = updateManifestVersions(manifests, '2.0.0');
	assert.equal(updated[1].json.dependencies.root, '2.0.0');
	assert.equal(updated[1].json.dependencies.react, '^19');
});

test('release file allowlist', () => {
	assert.equal(isAllowedReleaseFile('CHANGELOG.md'), true);
	assert.equal(isAllowedReleaseFile('apps/x/package.json'), true);
	assert.equal(isAllowedReleaseFile('src/index.ts'), false);
});
