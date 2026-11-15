import { Buffer } from 'node:buffer';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, test } from 'node:test';
import { analyzeAccessibilityEvidence } from './visual-audit-a11y-report.mjs';

const folders = [];
afterEach(() => {
	for (const folder of folders.splice(0)) rmSync(folder, { recursive: true, force: true });
});
const entries = [{ name: 'AdsButton', route: '/catalogo/button' }];
function fixture() {
	const folder = mkdtempSync(join(tmpdir(), 'visual-a11y-'));
	folders.push(folder);
	mkdirSync(join(folder, 'a11y'));
	mkdirSync(join(folder, 'screenshots/a11y'), { recursive: true });
	return folder;
}
const scenario = {
	id: 'button-tab',
	name: 'AdsButton',
	state: 'keyboard',
	theme: 'light',
	width: 390,
	action: 'tab-order',
};
function evidence(folder, s, override = {}) {
	writeFileSync(
		join(folder, 'a11y', s.id + '.json'),
		JSON.stringify({
			...s,
			route: '/catalogo/button',
			status: 'approved',
			humanReview: 'pending',
			screenshot: 'screenshots/a11y/' + s.id + '-' + s.theme + '-' + s.width + '.png',
			checks: ['focus-visible-paint-change'],
			error: null,
			zoom: null,
			...override,
		}),
	);
}
function screenshot(folder, name) {
	writeFileSync(
		join(folder, 'screenshots/a11y', name),
		Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), Buffer.alloc(40)]),
	);
}
test('cenário não executado permanece pendente sem screenshot implícita', () => {
	const folder = fixture();
	const report = analyzeAccessibilityEvidence({ scenarios: [scenario], entries, folder });
	assert.equal(report.summary.pending, 1);
	assert.equal(report.summary.automaticPass, 0);
	assert.equal(report.results[0].humanReview, 'pendente de revisão visual humana');
});
test('aprovação exige manifesto coerente e PNG verificável, sem revisão humana automática', () => {
	const folder = fixture();
	evidence(folder, scenario);
	let report = analyzeAccessibilityEvidence({ scenarios: [scenario], entries, folder });
	assert.equal(report.summary.failed, 1);
	screenshot(folder, 'button-tab-light-390.png');
	report = analyzeAccessibilityEvidence({ scenarios: [scenario], entries, folder });
	assert.equal(report.summary.automaticPass, 1);
	assert.equal(report.summary.humanReviewPending, 1);
});
test('status pending aceito somente para probe nativo sem comprovação', () => {
	const folder = fixture();
	const native = { ...scenario, id: 'zoom-native', action: 'zoom-probe', state: 'zoom-native' };
	evidence(folder, native, {
		status: 'pending',
		screenshot: null,
		checks: ['browser-accelerator-unverified'],
		zoom: {
			method: 'chromium-browser-keyboard-accelerator-probe',
			requestedPercent: 200,
			verified: false,
			measuredPercent: 100,
		},
	});
	let report = analyzeAccessibilityEvidence({ scenarios: [native], entries, folder });
	assert.equal(report.summary.pending, 1);
	assert.equal(report.summary.nativeZoomProven, 0);
	evidence(folder, scenario, { status: 'pending', screenshot: null });
	report = analyzeAccessibilityEvidence({ scenarios: [scenario], entries, folder });
	assert.equal(report.summary.failed, 1);
});
test('zoom nativo não pode aprovar apenas por screenshot ou fator declarado', () => {
	const folder = fixture();
	const native = { ...scenario, id: 'zoom-native', action: 'zoom-probe', state: 'zoom-native' };
	evidence(folder, native, {
		screenshot: 'screenshots/a11y/zoom-native-native-200-light-390.png',
		zoom: {
			method: 'viewport-reflow-alternative-not-native-zoom',
			requestedPercent: 200,
			verified: true,
			measuredPercent: 200,
		},
	});
	screenshot(folder, 'zoom-native-native-200-light-390.png');
	const report = analyzeAccessibilityEvidence({ scenarios: [native], entries, folder });
	assert.equal(report.summary.failed, 1);
	assert.equal(report.summary.nativeZoomProven, 0);
});
test('manifestos incoerentes e identificadores repetidos nunca aprovam', () => {
	const folder = fixture();
	evidence(folder, scenario, { route: '/outro' });
	screenshot(folder, 'button-tab-light-390.png');
	assert.equal(
		analyzeAccessibilityEvidence({ scenarios: [scenario], entries, folder }).summary.failed,
		1,
	);
	assert.throws(
		() => analyzeAccessibilityEvidence({ scenarios: [scenario, scenario], entries, folder }),
		/duplicado/,
	);
});

test('falha após captura conserva screenshot como evidência sem aprovar cenário', () => {
	const folder = fixture();
	evidence(folder, scenario, { status: 'failed', error: 'Escape não devolveu o foco' });
	screenshot(folder, 'button-tab-light-390.png');
	const report = analyzeAccessibilityEvidence({ scenarios: [scenario], entries, folder });
	assert.equal(report.summary.failed, 1);
	assert.equal(report.summary.automaticPass, 0);
	assert.equal(report.results[0].screenshot, 'screenshots/a11y/button-tab-light-390.png');
});

function nativeFixture(folder) {
	const s = { ...scenario, id: 'zoom-native', action: 'zoom-probe', state: 'zoom-native' };
	const before = {
		innerWidth: 1440,
		innerHeight: 900,
		outerWidth: 1448,
		devicePixelRatio: 1,
		visualScale: 1,
		geometry: { x: 12, y: 30, width: 1200, height: 400 },
		documentOverflowPx: 0,
	};
	const zoom = {
		method: 'chromium-settings-native-default-zoom',
		requestedPercent: 200,
		configuredFactor: 2,
		verified: true,
		measuredPercent: 200,
		before,
		after: {
			...before,
			innerWidth: 720,
			innerHeight: 450,
			devicePixelRatio: 2,
			geometry: { ...before.geometry, width: 650 },
		},
		restored: { ...before },
	};
	zoom.captureMetrics = structuredClone(zoom.after);
	zoom.screenshotEngine = 'cdp-compositor-no-metric-overrides';
	const record = {
		screenshot: 'screenshots/a11y/zoom-native-native-200-light-390.png',
		checks: [
			'native-zoom-200-layout-viewport-and-DPR-confirmed',
			'zoom-restored-between-scenarios',
			'document-horizontal-overflow<=2px',
		],
		zoom,
	};
	screenshot(folder, 'zoom-native-native-200-light-390.png');
	return { s, record };
}

test('zoom nativo exige medições independentes coerentes e restauração verificável', () => {
	const folder = fixture();
	const { s, record } = nativeFixture(folder);
	evidence(folder, s, record);
	assert.equal(
		analyzeAccessibilityEvidence({ scenarios: [s], entries, folder }).summary.nativeZoomProven,
		1,
	);
	for (const corrupt of [
		(z) => {
			z.after.innerWidth = 1440;
		}, // DPR sozinho não é zoom.
		(z) => {
			z.after.devicePixelRatio = 1;
		}, // Viewport sozinha não é zoom.
		(z) => {
			z.after.visualScale = 2;
		}, // Pinch não é zoom de layout.
		(z) => {
			z.after.outerWidth = 720;
		}, // Redimensionamento da janela.
		(z) => {
			z.restored.devicePixelRatio = 2;
		},
		(z) => {
			delete z.restored;
		},
		(z) => {
			z.measuredPercent = null;
		},
		(z) => {
			delete z.after.geometry;
		},
		(z) => {
			z.captureMetrics.innerWidth = 1440;
		},
	]) {
		const changed = structuredClone(record);
		corrupt(changed.zoom);
		evidence(folder, s, changed);
		const report = analyzeAccessibilityEvidence({ scenarios: [s], entries, folder });
		assert.equal(report.summary.nativeZoomProven, 0);
		assert.equal(report.summary.failed, 1);
	}
});

test('manifesto aprovado com erro e IDs com travessia de caminho são rejeitados', () => {
	const folder = fixture();
	evidence(folder, scenario, { error: 'falha ocultada' });
	screenshot(folder, 'button-tab-light-390.png');
	assert.equal(
		analyzeAccessibilityEvidence({ scenarios: [scenario], entries, folder }).summary.failed,
		1,
	);
	assert.throws(
		() =>
			analyzeAccessibilityEvidence({
				scenarios: [{ ...scenario, id: '../outside' }],
				entries,
				folder,
			}),
		/inseguro/,
	);
});
