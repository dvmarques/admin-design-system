# Spec Delta

## ADDED Requirements

### Requirement: Tabs e breadcrumb mantêm contraste e seleção visíveis nos dois temas

O texto de links de `AdsBreadcrumb` e o texto de gatilhos de `AdsTabs`, ativos ou inativos, MUST atingir contraste mínimo de `4.5:1` contra `canvas`, `surface`, `surface-raised`, `surface-muted` e `surface-hover` nos temas claro e escuro. Os links MUST usar tokens públicos de texto, sem depender da cor padrão do navegador. A tab ativa MUST ser distinguível das inativas por superfície, cor de texto e borda, independentemente da ordem das utilidades no CSS distribuído.

#### Scenario: Links do breadcrumb em superfície elevada no tema escuro

- **WHEN** um `AdsBreadcrumb` com links é renderizado sobre `surface-raised` no tema escuro
- **THEN** a cor do texto vem de um token público de texto e atinge contraste mínimo de `4.5:1`

#### Scenario: Tabs inativas em superfície elevada nos dois temas

- **WHEN** um `AdsTabs` é renderizado sobre `surface-raised` no tema claro ou escuro
- **THEN** o texto das tabs inativas, inclusive com hover, atinge contraste mínimo de `4.5:1`

#### Scenario: Tab ativa distinguível da inativa

- **WHEN** uma tab é a ativa
- **THEN** ela apresenta superfície de seleção, cor de texto de seleção e borda inferior de destaque diferentes das tabs inativas, nos dois temas

#### Scenario: Personalização por tokens

- **WHEN** o consumidor sobrescreve tokens públicos de texto ou de seleção em um escopo de tema
- **THEN** tabs e breadcrumb refletem os novos valores sem recompilar a biblioteca
