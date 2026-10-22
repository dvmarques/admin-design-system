# impact-aware-validation Specification

## Purpose

Selecionar trabalho de validação por impacto de forma conservadora, sem reduzir os gates obrigatórios da CI, com validação focal opcional e comparação auditável de desempenho.

## Requirements

### Requirement: Classificação conservadora de impacto

O sistema SHALL identificar os workspaces alterados e seus dependentes transitivos a partir dos manifestos e das dependências implícitas conhecidas. O sistema SHALL retornar validação completa para caminhos desconhecidos ou inseguros, configuração global, manifestos de workspace alterados, lista de arquivos ausente, manifestos inválidos, dependências cíclicas e falhas de detecção.

#### Scenario: Alteração em tokens propaga para os consumidores

- **WHEN** um arquivo de `packages/tokens` é alterado
- **THEN** tokens, components, admin, docs e admin-demo são afetados, em ordem de dependência

#### Scenario: Caminho desconhecido ou global

- **WHEN** o arquivo alterado está fora dos workspaces e da documentação, ou é configuração global, script, workflow ou `e2e/`
- **THEN** o resultado é validação completa

#### Scenario: Renomeação entre workspaces

- **WHEN** um arquivo é movido de um workspace para outro
- **THEN** origem e destino contam como alterados

### Requirement: Escopo da CI sem reduzir gates obrigatórios

A CI SHALL dispensar apenas etapas de build de aplicações e o E2E, e somente em pull requests para `develop` com impacto conhecido. A CI MUST executar por completo os jobs `Qualidade rápida` e `Política de develop`, os builds e a inspeção dos pacotes, e MUST executar tudo em pushes, em pull requests para `master` e quando a detecção falhar. A CI MUST manter os nomes dos checks obrigatórios.

#### Scenario: PR apenas de documentação

- **WHEN** uma pull request para `develop` altera somente documentação, inclusive em jobs com container
- **THEN** builds de aplicações e E2E são dispensados e a qualidade completa é executada

#### Scenario: PR que não afeta o demo

- **WHEN** a pull request altera somente arquivos de `apps/docs`
- **THEN** o E2E e o build do demo são dispensados e o build do Storybook é executado

#### Scenario: Falha de detecção

- **WHEN** o checkout não permite identificar a base da PR
- **THEN** todas as etapas são executadas

### Requirement: Validação focal opcional

O sistema SHALL oferecer comandos locais de lint, typecheck e testes para os workspaces afetados, com saída concisa por padrão e diagnóstico sob demanda, propagando falhas de processo. Os comandos MUST construir os pacotes em ordem de dependência antes de typecheck e testes e MUST usar os mesmos comandos da CI no fallback completo.

#### Scenario: Alteração restrita a uma aplicação

- **WHEN** somente arquivos de `apps/docs` mudaram em relação ao ancestral comum de `develop`
- **THEN** os comandos focais validam apenas esse workspace

#### Scenario: Configuração global alterada

- **WHEN** um arquivo de configuração global mudou
- **THEN** os comandos focais executam a validação completa da categoria

### Requirement: Comparação auditável de desempenho

O sistema SHALL medir duração por job, tempo total, falhas e reruns de execuções identificadas do GitHub Actions, comparar grupos e indicar amostra insuficiente. O sistema MUST NOT apresentar estimativas ou projeções como medição e MUST declarar tokens e custo como não disponíveis sem telemetria verificável.

#### Scenario: Telemetria ausente

- **WHEN** não há dados de tokens ou custo
- **THEN** o relatório declara a métrica como não disponível

#### Scenario: Poucas execuções

- **WHEN** algum grupo tem menos de três execuções
- **THEN** o relatório sinaliza amostra insuficiente
