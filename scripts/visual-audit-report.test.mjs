import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { buildVisualAuditReport } from './visual-audit-report.mjs';

test('relatório distingue captura real, sinais e execução ausente', () => {
	const root = mkdtempSync(join(tmpdir(), 'ads-visual-audit-'));
	try {
		mkdirSync(join(root, 'docs'));
		mkdirSync(join(root, 'visual-audit-results', 'screenshots', 'light-390'), { recursive: true });
		const tick = String.fromCharCode(96);
		writeFileSync(
			join(root, 'docs/visual-audit-inventory.md'),
			'| Export | Grupo | Rota | Storybook | Inspeção | Evidência |\n' +
				'| ' +
				tick +
				'AdsButton' +
				tick +
				' | Básicos | ' +
				tick +
				'/catalogo/button' +
				tick +
				' | x | Pendente | — |\n',
		);
		writeFileSync(
			join(root, 'visual-audit-results', 'screenshots', 'light-390', 'button.png'),
			'imagem simulada',
		);
		writeFileSync(
			join(root, 'visual-audit-results', 'light-390.json'),
			JSON.stringify({
				theme: 'light',
				width: 390,
				samples: [
					{
						name: 'AdsButton',
						theme: 'light',
						width: 390,
						screenshot: 'screenshots/light-390/button.png',
						error: null,
						signals: [{ code: 'preview-overflow', detail: '5px' }],
					},
				],
			}),
		);
		const report = buildVisualAuditReport({ root, themes: ['light', 'dark'], widths: [390] });
		assert.deepEqual(report.summary, {
			expected: 2,
			captured: 1,
			noSignals: 0,
			review: 1,
			failed: 0,
			missing: 1,
			iframeAudited: 0,
			iframeNotAudited: 0,
		});
		const markdown = readFileSync(join(root, 'visual-audit-results', 'report.md'), 'utf8');
		assert.match(markdown, /Não executadas: \*\*1\*\*/);
		assert.match(markdown, /screenshots\/light-390\/button.png/);
		assert.match(markdown, /Sinais automáticos são suspeitas|triagem automatizada/);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('relatório declara a cobertura interna de amostras com iframe', () => {
	const root = mkdtempSync(join(tmpdir(), 'ads-visual-audit-'));
	try {
		mkdirSync(join(root, 'docs'));
		mkdirSync(join(root, 'visual-audit-results', 'screenshots', 'light-390'), { recursive: true });
		const tick = String.fromCharCode(96);
		const row = (name) =>
			'| ' + tick + name + tick + ' | G | ' + tick + '/x' + tick + ' | x | Pendente | — |\n';
		writeFileSync(
			join(root, 'docs/visual-audit-inventory.md'),
			'| Export | Grupo | Rota | Storybook | Inspeção | Evidência |\n' +
				row('AdsAdminShell') +
				row('AdsAdminShellLento'),
		);
		for (const file of ['shell', 'lento']) {
			writeFileSync(
				join(root, 'visual-audit-results', 'screenshots', 'light-390', file + '.png'),
				'x',
			);
		}
		const sample = (name, file, metrics, signals) => ({
			name,
			theme: 'light',
			width: 390,
			screenshot: 'screenshots/light-390/' + file + '.png',
			error: null,
			metrics,
			signals,
		});
		writeFileSync(
			join(root, 'visual-audit-results', 'light-390.json'),
			JSON.stringify({
				theme: 'light',
				width: 390,
				samples: [
					sample('AdsAdminShell', 'shell', { hasIframe: 1, frameAudited: 1 }, []),
					sample('AdsAdminShellLento', 'lento', { hasIframe: 1, frameAudited: 0 }, [
						{ code: 'iframe-not-audited', detail: 'iframe não carregou' },
					]),
				],
			}),
		);
		const report = buildVisualAuditReport({ root, themes: ['light'], widths: [390] });
		assert.equal(report.summary.iframeAudited, 1);
		assert.equal(report.summary.iframeNotAudited, 1);
		const lento = report.results.find((entry) => entry.name === 'AdsAdminShellLento');
		assert.equal(lento.status, 'revisão necessária');
		const markdown = readFileSync(join(root, 'visual-audit-results', 'report.md'), 'utf8');
		assert.match(markdown, /coletadas em \*\*1\*\*, ausentes em \*\*1\*\*/);
		assert.match(markdown, /iframe-not-audited/);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
