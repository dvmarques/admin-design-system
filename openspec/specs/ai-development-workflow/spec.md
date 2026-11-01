# ai-development-workflow Specification

## Purpose

Definir um fluxo de desenvolvimento com IA proporcional ao risco, preservando rastreabilidade OpenSpec, validações obrigatórias e aprovação humana.

## Requirements

### Requirement: Classificação adaptativa por risco

O fluxo MUST classificar alterações em Fast, Standard ou Critical com base no escopo, nos contratos afetados e no risco, promovendo automaticamente o nível quando surgir um gatilho mais grave.

#### Scenario: Alteração localizada de documentação

- **WHEN** uma issue modifica somente documentação interna sem impacto em contratos
- **THEN** o fluxo seleciona Fast e registra uma justificativa objetiva, preservando validações obrigatórias.

#### Scenario: Alteração de API pública

- **WHEN** uma issue afeta exports públicos, tokens, CSS distribuído ou compatibilidade
- **THEN** o fluxo seleciona Critical, mesmo que o diff seja pequeno.

#### Scenario: Comportamento interno

- **WHEN** uma correção altera comportamento interno sem impacto em contrato público
- **THEN** o fluxo seleciona Standard e define cenários observáveis e testes proporcionais.

#### Scenario: Falhas recorrentes

- **WHEN** duas tentativas não produzem progresso ou surge ambiguidade
- **THEN** o fluxo reavalia risco, registra a hipótese e amplia contexto antes de continuar, preservando gates.

### Requirement: Rastreabilidade da issue à revisão

O fluxo MUST registrar issue, change, tarefas, testes, PR e resultado de CI sem declarar conclusão quando houver gates pendentes.

#### Scenario: Falha em CI

- **WHEN** uma verificação obrigatória falha ou não executa
- **THEN** o fluxo mantém a PR sem aprovação técnica e orienta diagnóstico, correção e reexecução.

#### Scenario: Disparo de CI em PR pronta

- **WHEN** implementação e validações locais terminam em uma PR Draft
- **THEN** o fluxo marca Ready for review para executar a CI, verifica os resultados no SHA atual e não interpreta essa transição como aprovação de merge.

### Requirement: Aprovação humana preservada

O fluxo MUST respeitar regras de branch, release, merge, archive e aprovação humana.

#### Scenario: PR pronta para revisão

- **WHEN** todos os testes obrigatórios possuem evidência de sucesso
- **THEN** o agente apresenta o diff, riscos residuais e evidências para code review, sem executar merge não autorizado.
