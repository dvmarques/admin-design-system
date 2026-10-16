## ADDED Requirements

### Requirement: Verificações de CI independentes e canceláveis

A CI de Pull Request MUST executar as verificações de qualidade, de artefatos
de distribuição e de fluxos no navegador sem dependência de ordem entre elas, de modo que
cada uma seja iniciada sem esperar as demais. A CI MUST cancelar a execução
obsoleta de uma Pull Request quando um novo commit for enviado a ela, e MUST NOT
cancelar execuções de `push` em `develop` ou `master`. Os nomes dos checks
exigidos pelos rulesets MUST permanecer inalterados.

#### Scenario: Início das verificações

- **WHEN** uma PR Ready for review recebe um commit
- **THEN** as verificações de qualidade, de artefatos e de fluxos no navegador são iniciadas em paralelo

#### Scenario: Falha em uma verificação

- **WHEN** uma das verificações falha enquanto as outras ainda executam
- **THEN** as demais concluem e reportam seu resultado, e a PR permanece bloqueada pelo check com falha

#### Scenario: Novo commit na mesma PR

- **WHEN** um novo commit é enviado a uma PR com CI em execução
- **THEN** a execução anterior dessa PR é cancelada e uma nova começa sobre o commit corrente

#### Scenario: Push em branch integrada

- **WHEN** commits são enviados em sequência a `develop` ou `master`
- **THEN** cada execução de `push` conclui sem ser cancelada pela seguinte

#### Scenario: Required checks

- **WHEN** os rulesets de `develop` e `master` avaliam uma PR
- **THEN** os checks "Qualidade rápida", "Artefatos de distribuição" e "Fluxos no navegador" continuam sendo reportados com esses nomes
