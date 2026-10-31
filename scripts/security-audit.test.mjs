import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { evaluateAudit, summarizeAudits, validateExceptions } from './security-audit.mjs';

const advisoryUrl = 'https://github.com/advisories/GHSA-abcd-1234-efgh';
const policy = { schemaVersion: 1, exceptions: [] };
const report = (severity = 'moderate') => ({
  metadata: {
    vulnerabilities: {
      info: 0, low: 0, moderate: severity === 'moderate' ? 1 : 0,
      high: severity === 'high' ? 1 : 0, critical: 0, total: 1,
    },
  },
  vulnerabilities: {
    'dependency-a': {
      severity,
      isDirect: false,
      via: [{ url: advisoryUrl, severity }],
    },
  },
});

test('moderate is reported and does not block', () => {
  const result = evaluateAudit(report(), policy);
  assert.equal(result.counts.moderate, 1);
  assert.deepEqual(result.blockers, []);
});

test('high blocks, including transitive packages', () => {
  const high = report('high');
  high.vulnerabilities['dependency-b'] = { severity: 'high', via: ['dependency-a'] };
  const result = evaluateAudit(high, policy);
  assert.deepEqual(result.blockers.map((finding) => finding.package), ['dependency-a', 'dependency-b']);
});

test('only specific unexpired exceptions are accepted', () => {
  const accepted = {
    schemaVersion: 1,
    exceptions: [{
      package: 'dependency-a',
      advisoryUrl,
      owner: 'maintainer',
      justification: 'Risco revisado com mitigação específica, sem silenciar o restante.',
      reviewBy: '2026-12-01',
    }],
  };
  assert.deepEqual(evaluateAudit(report('high'), accepted, '2026-11-01').blockers, []);
  assert.equal(evaluateAudit(report('high'), accepted, '2026-12-02').blockers.length, 1);
  assert.equal(evaluateAudit(report('high'), policy, '2026-11-01').blockers.length, 1);
});

test('invalid exceptions and operational errors cannot pass', () => {
  assert.throws(() => validateExceptions({ schemaVersion: 1, exceptions: [{ package: 'x' }] }));
  assert.throws(() => evaluateAudit({ error: { code: 'ENOTFOUND' } }, policy));
  assert.throws(() => evaluateAudit({ vulnerabilities: {} }, policy));
});

test('production exposure is inferred from omit=dev audit', () => {
  const dev = summarizeAudits(report('high'), report('moderate'), policy, '2026-11-01');
  assert.equal(dev.findings[0].exposure, 'development-or-unknown');
  const prod = summarizeAudits(report('high'), report('high'), policy, '2026-11-01');
  assert.equal(prod.findings[0].exposure, 'production');
});

test('draft jobs skip; ready, push and weekly triggers remain', () => {
  const workflow = readFileSync(new URL('../.github/workflows/security.yml', import.meta.url), 'utf8');
  assert.match(workflow, /ready_for_review/);
  assert.match(workflow, /synchronize/);
  assert.match(workflow, /schedule:/);
  assert.match(workflow, /pull_request:/);
  assert.match(workflow, /push:/);
  assert.doesNotMatch(workflow, /pull_request_target/);
  assert.equal((workflow.match(/if: github\.event_name != 'pull_request' \|\| github\.event\.pull_request\.draft == false/g) ?? []).length, 3);
  assert.equal((workflow.match(/persist-credentials: false/g) ?? []).length, 3);
  assert.doesNotMatch(workflow, /continue-on-error: true/);
});
