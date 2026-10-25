## MODIFIED Requirements

### Requirement: Snapshots visuais executam na CI com baselines Linux

O projeto MUST executar os testes de snapshot visual em toda execução de CI de Pull Request Ready cujo E2E não foi dispensado pela classificação conservadora de impacto, usando baselines Linux versionados no repositório como única fonte da verdade, sem pular os testes e sem tolerância de diferença de pixels. O projeto MUST disponibilizar um fluxo manual na CI que regenere os baselines e os registre na branch da PR, sem exigir execução local.

#### Scenario: Alteração muda a aparência de uma rota

- **WHEN** uma PR altera estilos ou tokens e a aparência de uma rota coberta difere do baseline
- **THEN** a verificação de snapshots falha na CI e indica a diferença

#### Scenario: Mudança visual intencional

- **WHEN** a mudança visual é intencional e revisada
- **THEN** a pessoa aciona o fluxo de atualização de baselines, revisa o diff dos PNGs na PR e a verificação passa

#### Scenario: Baselines de outra plataforma

- **WHEN** o repositório é inspecionado
- **THEN** ele não contém baselines `win32` e a documentação não prevê atualização local de snapshots

#### Scenario: PR somente de documentação

- **WHEN** uma PR Ready para develop altera apenas documentação classificada como docs
- **THEN** os checks de build e E2E podem concluir com suas etapas dispensadas, sem afirmar que snapshots executaram

