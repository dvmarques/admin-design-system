## ADDED Requirements

### Requirement: Contraste não textual verificado automaticamente

O projeto MUST verificar, a partir de uma lista central de pares de tokens, o contraste mínimo WCAG 2.2 AA nos temas claro e escuro e com `prefers-contrast: more`: 4,5:1 para texto e 3:1 para limites de controles, indicadores de foco e estados selecionados.

#### Scenario: Par de tokens abaixo do mínimo

- **WHEN** a validação executa e um par de tokens listado fica abaixo do mínimo aplicável em qualquer tema ou modo
- **THEN** a validação falha e identifica o par, o tema e a razão de contraste

#### Scenario: Novo par crítico

- **WHEN** um novo papel de cor de conteúdo ou controle é adicionado
- **THEN** a lista central de pares permite incluí-lo na mesma verificação

### Requirement: Preferências de acessibilidade do usuário validadas no navegador

O projeto MUST validar em navegador, por estilo computado e papéis ARIA, que movimento reduzido elimina transições e que, com cores forçadas, foco e seleção permanecem visíveis nos componentes cobertos.

#### Scenario: Movimento reduzido emulado

- **WHEN** a suíte E2E emula `prefers-reduced-motion: reduce`
- **THEN** controles cobertos têm duração de transição zero e não há animações contínuas ativas

#### Scenario: Cores forçadas emuladas

- **WHEN** a suíte E2E emula `forced-colors: active`
- **THEN** controles cobertos exibem foco e limites com cores de sistema
