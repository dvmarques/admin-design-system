## ADDED Requirements

### Requirement: Elevação tem valor próprio por tema

Os tokens públicos de elevação (`--ads-elevation-sm`, `-md` e `-lg`) MUST manter seus nomes e MUST ter valores distintos nos temas claro e escuro, de modo que a profundidade permaneça perceptível em ambos. Os nomes e usos existentes MUST NOT ser removidos ou renomeados.

#### Scenario: Tema escuro usa sombra própria

- **WHEN** a aplicação importa `@admin-ds/tokens/styles.css` e o tema escuro está ativo, explícito ou pelo sistema
- **THEN** cada token de elevação assume o valor do tema escuro e, no tema claro, o valor anterior

#### Scenario: Aplicação personaliza a elevação

- **WHEN** a aplicação sobrescreve um token de elevação no escopo de seu tema
- **THEN** os componentes que usam esse nível refletem o valor sem recompilar a biblioteca

### Requirement: Tokens de densidade de tabela

O sistema MUST disponibilizar tokens públicos de densidade para o espaçamento interno de células (`--ads-density-cell-padding-x` e `--ads-density-cell-padding-y`) com valores "confortável" (padrão) e "compacto". O valor compacto MUST valer no elemento e em seus descendentes quando `data-density="compact"` estiver presente no elemento ou em um ancestral, e `data-density="comfortable"` aninhado MUST restaurar o padrão.

#### Scenario: Densidade padrão

- **WHEN** nenhum elemento define `data-density`
- **THEN** os tokens de densidade assumem os valores confortáveis, equivalentes ao espaçamento anterior

#### Scenario: Densidade compacta herdada

- **WHEN** um ancestral define `data-density="compact"`
- **THEN** as tabelas descendentes usam o espaçamento compacto nos dois temas

#### Scenario: Metadados tipados

- **WHEN** uma aplicação importa os metadados públicos de tokens
- **THEN** os valores confortáveis dos tokens de densidade estão disponíveis com nomes equivalentes às variáveis CSS

### Requirement: Tokens de skeleton

O sistema MUST disponibilizar tokens públicos de altura de skeleton para texto, valor e bloco (`--ads-skeleton-height-text`, `-value` e `-block`), usados pelos placeholders de tabela, card de métrica e painel.

#### Scenario: Aplicação personaliza a altura

- **WHEN** a aplicação sobrescreve um token de altura de skeleton
- **THEN** os placeholders correspondentes refletem a nova altura sem recompilar a biblioteca
