# Spec Delta

## ADDED Requirements

### Requirement: Testes de pacote são executados pelo script de teste

Todo arquivo de teste de um pacote MUST ser executado pelo script `test` do pacote, e a validação MUST falhar quando um teste existente deixar de ser executado.

#### Scenario: Teste de CSS distribuído

- **WHEN** `npm test` é executado em `@admin-ds/components`
- **THEN** o teste de que o CSS distribuído contém utilidades estáticas e não inclui preflight é executado e seu resultado conta para o status final

#### Scenario: Arquivo de teste fora do executor

- **WHEN** um arquivo `*.test.*` em `packages/components/tests` não casa com o padrão de inclusão do executor
- **THEN** um teste automatizado falha apontando o arquivo
