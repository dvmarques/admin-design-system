#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const policyFile = new URL('../.github/security/audit-exceptions.json', import.meta.url);
const blockingLevels = new Set(['high', 'critical']);

export function validateExceptions(policy) {
  if (policy?.schemaVersion !== 1 || !Array.isArray(policy.exceptions)) {
    throw new Error('Política inválida: schemaVersion 1 e exceptions[] obrigatórios');
  }
  for (const [index, entry] of policy.exceptions.entries()) {
    if (!entry ||
      typeof entry.package !== 'string' || !entry.package.trim() ||
      typeof entry.advisoryUrl !== 'string' ||
      !/^https:\/\/(github\.com\/advisories\/GHSA-|www\.npmjs\.com\/advisories\/)/.test(entry.advisoryUrl) ||
      typeof entry.owner !== 'string' || !entry.owner.trim() ||
      typeof entry.justification !== 'string' || entry.justification.trim().length < 20 ||
      typeof entry.reviewBy !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(entry.reviewBy) ||
      Number.isNaN(Date.parse(entry.reviewBy + 'T00:00:00Z')) ||
      new Date(entry.reviewBy + 'T00:00:00Z').toISOString().slice(0, 10) !== entry.reviewBy) {
      throw new Error('Exceção inválida no índice ' + index + ': exige package, advisoryUrl, owner, justification >=20 e reviewBy YYYY-MM-DD');
    }
  }
  return policy.exceptions;
}

function advisoriesFor(name, vulnerabilities, visited = new Set()) {
  if (visited.has(name)) return [];
  visited.add(name);
  const result = [];
  for (const entry of vulnerabilities[name]?.via ?? []) {
    if (typeof entry === 'string') {
      result.push(...advisoriesFor(entry, vulnerabilities, visited));
    } else if (entry && typeof entry.url === 'string') {
      result.push(entry.url);
    }
  }
  return [...new Set(result)].sort();
}

export function evaluateAudit(report, policy, today = new Date().toISOString().slice(0, 10)) {
  const exceptions = validateExceptions(policy);
  if (!report || report.error || !report.vulnerabilities || !report.metadata?.vulnerabilities) {
    throw new Error('npm audit indisponível ou resposta JSON incompleta');
  }
  const counts = Object.fromEntries(['info', 'low', 'moderate', 'high', 'critical', 'total'].map((level) => {
    const amount = report.metadata.vulnerabilities[level];
    if (!Number.isInteger(amount) || amount < 0) throw new Error('Contagem npm audit inválida: ' + level);
    return [level, amount];
  }));
  const findings = [];
  for (const [name, vulnerability] of Object.entries(report.vulnerabilities)) {
    if (!blockingLevels.has(vulnerability.severity)) continue;
    const advisoryUrls = advisoriesFor(name, report.vulnerabilities);
    const accepted = advisoryUrls.length > 0 && advisoryUrls.every((url) =>
      exceptions.some((exception) =>
        exception.package === name && exception.advisoryUrl === url && exception.reviewBy >= today));
    findings.push({
      package: name,
      severity: vulnerability.severity,
      isDirect: vulnerability.isDirect === true,
      advisoryUrls,
      accepted,
    });
  }
  findings.sort((a, b) => a.package.localeCompare(b.package));
  if (counts.high + counts.critical > 0 && findings.length === 0) {
    throw new Error('npm audit relata riscos altos sem detalhes das vulnerabilidades');
  }
  return { counts, findings, blockers: findings.filter((finding) => !finding.accepted) };
}

export function summarizeAudits(all, production, policy, today) {
  const full = evaluateAudit(all, policy, today);
  const prod = evaluateAudit(production, policy, today);
  const prodNames = new Set(prod.findings.map((finding) => finding.package));
  return {
    policy: 'high/critical não aceitos bloqueiam',
    node: process.version,
    full: { counts: full.counts },
    production: { counts: prod.counts },
    findings: full.findings.map((finding) => ({
      ...finding,
      exposure: prodNames.has(finding.package) ? 'production' : 'development-or-unknown',
    })),
    blockers: [...new Set([...full.blockers, ...prod.blockers].map((entry) => entry.package))],
  };
}

function runNpmAudit(args) {
  const result = spawnSync('npm', ['audit', '--audit-level=high', '--json', ...args], {
    encoding: 'utf8', maxBuffer: 40 * 1024 * 1024, timeout: 180000,
  });
  if (result.error || typeof result.stdout !== 'string') {
    throw new Error('Erro operacional ao executar npm audit');
  }
  let report;
  try {
    report = JSON.parse(result.stdout);
  } catch {
    throw new Error('npm audit retornou JSON inválido');
  }
  if (result.status !== 0 && result.status !== 1) {
    throw new Error('Erro operacional no npm audit (exit ' + result.status + ')');
  }
  if (report.error) throw new Error('npm audit retornou erro operacional');
  return report;
}

function markdown(summary) {
  const lines = [
    '### npm audit — issue #267', '',
    '| Severidade | Completo | Produção |',
    '| --- | ---: | ---: |',
  ];
  for (const level of ['critical', 'high', 'moderate', 'low', 'info', 'total']) {
    lines.push('| ' + level + ' | ' + summary.full.counts[level] +
      ' | ' + summary.production.counts[level] + ' |');
  }
  lines.push('', 'Bloqueios não aceitos: ' + summary.blockers.length + '.', '');
  return lines.join('\n');
}

function main() {
  const options = process.argv.slice(2);
  if (options.length !== 2 || options[0] !== '--output' || !options[1]) {
    throw new Error('Uso: node scripts/security-audit.mjs --output ARQUIVO');
  }
  const config = JSON.parse(readFileSync(policyFile, 'utf8'));
  const all = runNpmAudit([]);
  const production = runNpmAudit(['--omit=dev']);
  const summary = summarizeAudits(all, production, config);
  const output = options[1];
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, JSON.stringify(summary, null, 2) + '\n');
  const message = markdown(summary);
  process.stdout.write(message + '\n');
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, message + '\n');
  if (summary.blockers.length > 0) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error('Falha na auditoria:', error.message);
    process.exitCode = 1;
  }
}
