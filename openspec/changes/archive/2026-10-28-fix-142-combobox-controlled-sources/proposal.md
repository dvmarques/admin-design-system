# Proposta — Correções da revisão da #142

## Why

A revisão da PR #238 encontrou dois riscos em cenários controlados e dinâmicos: texto controlado alterado externamente mantendo o `value` antigo no formulário, e troca da origem de dados do `AdsAutocomplete` mantendo resultados da origem anterior.

## What Changes

- `AdsCombobox`: quando `inputValue` controlado diverge do rótulo da opção selecionada, o texto é tratado como livre: o `value` não é enviado por `name` e o visual da seleção é ocultado.
- `AdsAutocomplete`: nova prop opcional `requestKey` identifica a origem dos dados; ao mudar, a consulta pendente é abortada e a busca é refeita. A identidade de `loadOptions` continua sem efeito.
- Testes de `rerender` com `FormData` e de troca de origem; documentação e CHANGELOG.

## Perfil e compatibilidade

Standard. API aditiva (`requestKey` opcional); o comportamento anterior é preservado quando `inputValue` coincide com o rótulo ou quando não há `requestKey`.

## Capabilities

### Modified Capabilities

- `combobox-autocomplete`: semântica de texto controlado e origem de dados.
