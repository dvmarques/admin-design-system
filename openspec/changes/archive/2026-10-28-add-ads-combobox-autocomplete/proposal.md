# Proposta — AdsCombobox e AdsAutocomplete (#142)

## Why

Substituir CampoAutocomplete e CampoAutocompleteAsync na migração do Back Admin, mantendo o design system independente de react-select, CoreUI e backend.

## What Changes

- packages/components: novos componentes AdsCombobox (seleção pesquisável com opções fornecidas) e AdsAutocomplete (busca local ou assíncrona), tipos públicos, estilo compilado e testes.
- Elementos visuais opcionais em opções e seleção, controláveis por prop, com exemplos ligados e desligados.
- Ordenar alfabeticamente itens dentro dos grupos da sidebar do demo, preservando a ordem dos grupos.
- packages/components: indicador do AdsSelect com recuo consistente e espaço para o texto (parte da #140; demais requisitos permanecem fora do escopo).
- apps/admin-demo: dois exemplos completos com estados e respostas remotas simuladas, navegáveis pelo catálogo.
- apps/docs: stories dos dois componentes.
- e2e: navegação por teclado, seleção, foco, overlay em diálogos, SSR, temas e responsividade.
- docs/integration.md, CHANGELOG.md e exports públicos: guia de uso/migração e histórico.

## Perfil e compatibilidade

Critical: altera API pública, acessibilidade e vários consumidores. Preservar os controles existentes; nenhuma alteração na issue #91. Valor e texto digitado independentes, com valor estável e rótulos configuráveis.

## Fora do escopo

Multisseleção (#143), virtualização, criação de novas opções, backend real, alterações no Back Admin e substituição de dependências dos consumidores nesta PR.

## Capabilities

### Modified Capabilities

- `form-controls`: recuo e semântica do indicador do AdsSelect.
- `component-catalog`: ordenação dos itens da sidebar dentro de cada grupo.

### New Capabilities

- `combobox-autocomplete`: seleção pesquisável local e assíncrona.
