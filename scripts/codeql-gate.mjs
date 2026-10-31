#!/usr/bin/env node
import { appendFileSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const policyFile = new URL('../.github/security/codeql-exceptions.json', import.meta.url);

export function validateCodeqlPolicy(policy) {
	if (policy?.schemaVersion !== 1 || !Array.isArray(policy.exceptions)) {
		throw new Error('Política CodeQL inválida');
	}
	for (const entry of policy.exceptions) {
		if (
			typeof entry.ruleId !== 'string' ||
			!entry.ruleId.trim() ||
			typeof entry.file !== 'string' ||
			!entry.file.trim() ||
			typeof entry.owner !== 'string' ||
			!entry.owner.trim() ||
			typeof entry.justification !== 'string' ||
			entry.justification.trim().length < 20 ||
			typeof entry.reviewBy !== 'string' ||
			!/^\d{4}-\d{2}-\d{2}$/.test(entry.reviewBy) ||
			Number.isNaN(Date.parse(entry.reviewBy + 'T00:00:00Z')) ||
			new Date(entry.reviewBy + 'T00:00:00Z').toISOString().slice(0, 10) !== entry.reviewBy
		) {
			throw new Error('Exceção CodeQL exige ruleId, file, owner, justification e reviewBy válidos');
		}
	}
	return policy.exceptions;
}

export function evaluateSarif(sarif, policy, today = new Date().toISOString().slice(0, 10)) {
	const exceptions = validateCodeqlPolicy(policy);
	if (sarif?.version !== '2.1.0' || !Array.isArray(sarif.runs) || !sarif.runs.length) {
		throw new Error('SARIF CodeQL inválido ou vazio');
	}
	const findings = [];
	for (const run of sarif.runs) {
		const driver = run.tool?.driver;
		const extensions = run.tool?.extensions ?? [];
		if (
			!Array.isArray(run.results) ||
			!driver ||
			!Array.isArray(driver.rules) ||
			!Array.isArray(extensions)
		) {
			throw new Error('SARIF CodeQL sem regras ou resultados');
		}
		const components = [driver, ...extensions];
		if (!components.some((component) => Array.isArray(component?.rules))) {
			throw new Error('SARIF CodeQL sem regras ou resultados');
		}
		for (const result of run.results) {
			const reference = result.rule ?? {};
			const componentReference = reference.toolComponent;
			let component = driver;
			if (componentReference?.index !== undefined) {
				if (
					!Number.isInteger(componentReference.index) ||
					componentReference.index < 0 ||
					componentReference.index >= extensions.length
				) {
					throw new Error('Referência de componente SARIF inválida');
				}
				component = extensions[componentReference.index];
			} else if (componentReference?.guid !== undefined) {
				component = components.find((entry) => entry?.guid === componentReference.guid);
				if (!component) throw new Error('Componente SARIF não encontrado');
			}
			const rules = component?.rules;
			const ruleId = reference.id ?? result.ruleId;
			const ruleIndex = reference.index ?? result.ruleIndex;
			const ruleById =
				ruleId && Array.isArray(rules) ? rules.find((entry) => entry.id === ruleId) : null;
			const ruleByIndex =
				Number.isInteger(ruleIndex) && Array.isArray(rules) ? rules[ruleIndex] : null;
			const rule = ruleById ?? ruleByIndex;
			if (!rule || typeof rule.id !== 'string') {
				throw new Error('Regra SARIF de resultado não encontrada');
			}
			const resolvedRuleId = result.ruleId ?? reference.id ?? rule.id;
			const rawSeverity =
				result.properties?.['security-severity'] ?? rule?.properties?.['security-severity'];
			if (rawSeverity === undefined) continue;
			const score = Number(rawSeverity);
			if (!Number.isFinite(score) || score < 0 || score > 10) {
				throw new Error('Score de segurança inválido no SARIF');
			}
			if (score < 7) continue;
			const file = result.locations?.[0]?.physicalLocation?.artifactLocation?.uri ?? '';
			const accepted = exceptions.some(
				(exception) =>
					exception.ruleId === resolvedRuleId &&
					exception.file === file &&
					exception.reviewBy >= today,
			);
			findings.push({
				ruleId: resolvedRuleId,
				file,
				severity: score >= 9 ? 'critical' : 'high',
				accepted,
			});
		}
	}
	return { findings, blockers: findings.filter((finding) => !finding.accepted) };
}

function main() {
	const dir = process.env.CODEQL_SARIF_DIRECTORY;
	if (!dir) throw new Error('Diretório SARIF CodeQL ausente');
	const files = readdirSync(dir)
		.filter((file) => /\.sarif(\.json)?$/.test(file))
		.sort();
	if (!files.length) throw new Error('Nenhum arquivo SARIF CodeQL encontrado');
	const policy = JSON.parse(readFileSync(policyFile, 'utf8'));
	const results = files.map((file) =>
		evaluateSarif(JSON.parse(readFileSync(resolve(dir, file), 'utf8')), policy),
	);
	const blockers = results.flatMap((entry) => entry.blockers);
	const findings = results.flatMap((entry) => entry.findings);
	const summary = [
		'### CodeQL — issue #267',
		'',
		'Achados high/critical: ' + findings.length + '. Não aceitos: ' + blockers.length + '.',
		...blockers.map((entry) => '- ' + entry.severity + ': ' + entry.ruleId + ' — ' + entry.file),
		'',
	].join('\n');
	console.log(summary);
	if (process.env.GITHUB_STEP_SUMMARY)
		appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
	if (blockers.length) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	try {
		main();
	} catch (error) {
		console.error('Falha no gate CodeQL:', error.message);
		process.exitCode = 1;
	}
}
