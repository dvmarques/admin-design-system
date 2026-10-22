## ADDED Requirements

### Requirement: Ambiente Playwright reproduzível na CI

Os jobs E2E MUST usar uma imagem oficial Playwright fixada na mesma versão de
Playwright do lockfile, com browsers e dependências de sistema pré-instalados,
mantendo Node 24, npm 11.19.1 e instalação exata das dependências.

#### Scenario: Versões compatíveis

- **WHEN** o job E2E instala dependências via `npm ci --ignore-scripts`
- **THEN** o pipeline verifica que a versão de Playwright do projeto coincide
  - com a versão esperada da imagem antes de executar testes.

#### Scenario: Cache e dependências redundantes

- **WHEN** o job E2E inicia no container oficial
- **THEN** não executa instalação apt de bibliotecas de browser nem cacheia
  - binários que já vêm na imagem.

### Requirement: Gates E2E preservados

O pipeline MUST preservar os jobs Chromium, Firefox e WebKit, as condições
Draft/docs-only e os baselines visuais sem elevar tolerâncias.

#### Scenario: Execução em CI

- **WHEN** uma PR elegível inicia a matrix E2E
- **THEN** o Chromium executa a suíte completa, Firefox e WebKit executam os
  - testes configurados e falhas impedem o gate.

### Requirement: Ganho medido sem estimativas apresentadas como resultado

A documentação MUST registrar tempos reais comparáveis antes e depois, incluindo
preparação do container, builds e testes, e explicitar limitações de amostragem.

#### Scenario: Avaliação de desempenho

- **WHEN** os jobs migrados terminam
- **THEN** o relatório compara duração total e por etapa com a base anterior,
  - sem atribuir economia não medida.
