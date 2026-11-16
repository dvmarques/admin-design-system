## ADDED Requirements

### Requirement: Atualização coordenada da imagem Playwright

A infraestrutura de automação MUST atualizar todas as referências à imagem
Playwright oficial e os checks de versão de forma coordenada com o manifesto
e o lockfile, usando um digest OCI obtido de fonte oficial.

#### Scenario: Atualização atômica dos consumidores de imagem

- **WHEN** a dependência Playwright é atualizada para uma nova versão
- **THEN** os workflows de CI principal, Pages, baselines visuais e auditoria
  visual usam a mesma tag e o mesmo digest de índice OCI verificado

#### Scenario: Uma referência fica na versão anterior

- **WHEN** qualquer workflow, check de execução, manifesto ou lockfile mantém
  versão ou digest divergente
- **THEN** o teste de consistência falha antes da aprovação da alteração
