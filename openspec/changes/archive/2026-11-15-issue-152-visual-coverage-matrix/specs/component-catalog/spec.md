## ADDED Requirements

### Requirement: Matriz de estados sincronizada ao catálogo

A documentação MUST manter uma associação versionada de estados e verificações por export público visual presente no catálogo, sem duplicar a definição canônica de nome, grupo, rota ou Storybook.

#### Scenario: Export adicionado ou removido

- **WHEN** o conjunto de exports do catálogo difere das entradas configuradas na matriz
- **THEN** a validação automatizada falha e informa os nomes adicionados ou ausentes

#### Scenario: Estado é não aplicável

- **WHEN** um componente registra estado não aplicável
- **THEN** a matriz apresenta justificativa específica e não registra tal estado como cenário executado

#### Scenario: Cenário inadequado ou duplicado

- **WHEN** uma definição de cenário referencia export ausente, estado incompatível ou identificador duplicado
- **THEN** a validação rejeita a matriz antes de executar a auditoria
