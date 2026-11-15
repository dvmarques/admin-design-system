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
