## MODIFIED Requirements

### Requirement: Snapshots visuais executam na CI com baselines Linux

Snapshots Chromium MUST usar apenas baselines Linux versionados e MUST executar quando o job E2E estiver habilitado pelo impacto conhecido e a PR estiver Ready. O workflow manual de atualização é a única via documentada para regenerar PNGs.

#### Scenario: PR somente de documentação
- **WHEN** uma PR Ready para develop altera apenas documentação classificada como docs
- **THEN** os checks de build e E2E podem concluir com suas etapas dispensadas, sem afirmar que snapshots executaram

#### Scenario: PR com impacto visual
- **WHEN** o job E2E está habilitado e a aparência difere do baseline
- **THEN** o teste de snapshot falha sem tolerância de pixels
