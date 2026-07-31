## ADDED Requirements

### Requirement: Regressão visual da fundação revisada

O projeto MUST manter histórias e snapshots visuais atualizados para os componentes existentes afetados por tokens globais, incluindo estados representativos nos temas claro e escuro.

#### Scenario: Token global altera a aparência compartilhada

- **WHEN** uma alteração modifica a fundação tipográfica ou de cores
- **THEN** a validação visual compara os componentes existentes afetados nos temas claro e escuro e sinaliza regressões não aprovadas

### Requirement: Evidência automatizada de contraste

O projeto MUST verificar automaticamente os pares críticos de cores da fundação visual contra os critérios aplicáveis do WCAG 2.2 nível AA.

#### Scenario: Um token reduz o contraste de conteúdo essencial

- **WHEN** a validação executa para os temas claro e escuro
- **THEN** ela falha se um par crítico de conteúdo, superfície, controle ou foco não atingir o contraste mínimo aplicável
