#!/usr/bin/env node
import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { classifyImpact, decideScope, listPullRequestFiles, loadWorkspaces } from './ci-impact.mjs';

/**
 * Decide, na CI, quais etapas pesadas (build de apps e E2E) podem ser dispensadas em PRs para
 * `develop`. Qualquer falha de detecção resulta em execução completa; os jobs usam
 * `!= 'false'` para que uma saída ausente também execute tudo.
 */
export function computeScope({ event, baseRef, detect }) {
	let impact = null;
	let reason;
	if (event === 'pull_request' && baseRef === 'develop') {
		try {
			const { files, workspaces } = detect();
			impact = classifyImpact(files, workspaces);
		} catch (error) {
			reason = `detecção indisponível: ${String(error.message).split('\n')[0]}`;
		}
	} else {
		reason = 'validação completa por política (push, release ou evento sem PR para develop)';
	}
	const scope = decideScope({ event, baseRef, impact });
	return { impact, scope, reason: reason ?? impact?.reason };
}

export function renderSummary({ impact, scope, reason }) {
	const flag = (value) => (value ? 'executa' : 'dispensado');
	return [
		'### Escopo da validação',
		'',
		`- Modo: \`${impact?.mode ?? 'full'}\` (${reason ?? 'sem detalhe'})`,
		`- Workspaces afetados: ${impact?.affected?.length ? impact.affected.join(', ') : 'nenhum informado'}`,
		`- Build do Storybook: ${flag(scope.buildDocs)}`,
		`- Build do admin demo: ${flag(scope.buildDemo)}`,
		`- E2E (Chromium, Firefox, WebKit): ${flag(scope.e2e)}`,
		'- Qualidade rápida e política de develop: sempre executam por completo.',
		'',
	].join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const event = process.env.GITHUB_EVENT_NAME;
	const baseRef = process.env.GITHUB_BASE_REF;
	const result = computeScope({
		event,
		baseRef,
		detect: () => ({ files: listPullRequestFiles(), workspaces: loadWorkspaces() }),
	});
	const { scope } = result;
	const lines = [
		`docs_only=${scope.docsOnly}`,
		`build_docs=${scope.buildDocs}`,
		`build_demo=${scope.buildDemo}`,
		`e2e=${scope.e2e}`,
	];
	console.log(
		`${lines.join('\n')}\n${JSON.stringify(result.impact ?? { mode: 'full', reason: result.reason })}`,
	);
	if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${lines.join('\n')}\n`);
	if (process.argv.includes('--summary') && process.env.GITHUB_STEP_SUMMARY) {
		appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${renderSummary(result)}\n`);
	}
}
