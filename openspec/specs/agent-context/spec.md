# agent-context Specification

## Purpose

Definir o contexto inicial mínimo dos agentes, a leitura de documentação sob demanda e o roteamento de modelos por risco e custo, sem perda das regras obrigatórias do repositório.

## Requirements

### Requirement: Contexto inicial mínimo e leitura direcionada

Os agentes MUST manter acesso às regras obrigatórias do repositório e SHOULD carregar documentação específica apenas quando o escopo exigir.

#### Scenario: Alteração localizada em componente

- **WHEN** um agente inicia uma mudança localizada em packages/components
- **THEN** ele consulta o mapa de contexto e lê somente as referências relevantes, além das políticas invariantes.

### Requirement: Roteamento de modelos por risco e custo

A documentação MUST descrever seleção por complexidade, critérios de escalonamento e como comparar custo efetivo sem depender de versões específicas.

#### Scenario: Tarefa mecânica

- **WHEN** a tarefa é determinística e de baixo risco
- **THEN** o agente prioriza a opção mais econômica que atende aos testes e eleva capacidade somente após falha ou aumento de risco.

### Requirement: Preservação de qualidade e contratos

A otimização MUST preservar as políticas de acessibilidade, API pública, OpenSpec, branches, validação e release.

#### Scenario: Mudança crítica

- **WHEN** uma mudança afeta APIs públicas ou contratos de acessibilidade
- **THEN** o agente consulta documentação aprofundada e executa validação proporcional sem dispensar gates obrigatórios.
