## ADDED Requirements

### Requirement: Check composto de E2E com cobertura preservada

A CI MUST validar a suíte Chromium integralmente e os projetos Firefox/WebKit previstos. Se a suíte Chromium for repartida em shards, um check obrigatório agregado MUST concluir `success` somente quando todos os shards necessários tiverem aprovado; qualquer falha ou cancelamento inesperado MUST impedir aprovação do agregado.

#### Scenario: Um shard Chromium falha

- **WHEN** qualquer shard Chromium falha ou é cancelado na PR Ready
- **THEN** o check obrigatório `Fluxos no navegador` não fica verde

#### Scenario: Suíte Chromium é dividida

- **WHEN** a CI executa os shards em paralelo
- **THEN** o conjunto executado cobre cada teste original e snapshot aplicável, sem pular testes, e os checks Firefox/WebKit continuam presentes

#### Scenario: PR sem impacto E2E comprovado

- **WHEN** o escopo conservador identifica uma PR de documentação sem impacto e as etapas pesadas são dispensadas
- **THEN** os status obrigatórios permanecem resolvidos e registram a dispensa, sem marcar execução de testes inexistentes como cobertura efetiva

### Requirement: Qualidade CI sem duplicar testes

O workflow MUST executar todas as suítes de testes obrigatórias e publicar os artefatos de cobertura Node e Vitest. MUST NOT repetir a mesma suíte apenas para gerar cobertura se puder coletar cobertura na execução já obrigatória.

#### Scenario: Validação de qualidade em PR Ready

- **WHEN** a CI valida uma PR Ready
- **THEN** testes Node de workspace, release, CI e Vitest executam com as verificações existentes, suas coberturas são publicadas, e o comando local `test:quality` mantém seu contrato

### Requirement: Otimização com evidências e fallback seguro

As reduções de etapas MUST preservar os gates de segurança, releases, publicação Pages e required checks. Uma classificação incerta MUST executar a validação completa.

#### Scenario: Mudança global ou classificação não confiável

- **WHEN** arquivos do workflow, configuração, lockfile ou mudanças indeterminadas são detectados
- **THEN** a CI executa verificações completas em vez de dispensar trabalho

#### Scenario: Otimização candidata é avaliada

- **WHEN** uma mudança de paralelismo, cache ou instalação é considerada pronta
- **THEN** os resultados antes/depois distinguem duração da PR, minutos de runner e falhas, com links e limitações das amostras

#### Scenario: Release ou push em branch protegida

- **WHEN** ocorre uma PR para `master`, ou push em `develop`/`master`
- **THEN** a validação exigida pela política correspondente continua completa e não é cancelada por eventos de PR de outro grupo
