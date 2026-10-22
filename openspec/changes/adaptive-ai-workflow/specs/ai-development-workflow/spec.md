## ADDED Requirements

### Requirement: Classificação adaptativa por risco
O fluxo MUST classificar alterações em Fast, Standard ou Critical com base no escopo, nos contratos afetados e no risco, promovendo automaticamente o nível quando surgir um gatilho mais grave.

#### Scenario: Alteração localizada de documentação
- **WHEN** uma issue modifica somente documentação interna sem impacto em contratos
- **THEN** o fluxo seleciona Fast e registra uma justificativa objetiva, preservando validações obrigatórias.

#### Scenario: Alteração de API pública
- **WHEN** uma issue afeta exports públicos, tokens, CSS distribuído ou compatibilidade
- **THEN** o fluxo seleciona Critical, mesmo que o diff seja pequeno.

### Requirement: Rastreabilidade da issue à revisão
O fluxo MUST registrar issue, change, tarefas, testes, PR e resultado de CI sem declarar conclusão quando houver gates pendentes.

#### Scenario: Falha em CI
- **WHEN** uma verificação obrigatória falha ou não executa
- **THEN** o fluxo mantém a PR sem aprovação técnica e orienta diagnóstico, correção e reexecução.

### Requirement: Aprovação humana preservada
O fluxo MUST respeitar regras de branch, release, merge, archive e aprovação humana.

#### Scenario: PR pronta para revisão
- **WHEN** todos os testes obrigatórios possuem evidência de sucesso
- **THEN** o agente apresenta o diff, riscos residuais e evidências para code review, sem executar merge não autorizado.
