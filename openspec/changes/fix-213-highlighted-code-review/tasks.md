# Tasks

## 1. Especificação

- [x] 1.1 Registrar proposta, design e delta da spec `highlighted-code`.

## 2. Componente e carregamento

- [x] 2.1 Tema `auto` por `[data-theme]` ancestral com `MutationObserver`, sem flash claro e sem tokenização dupla (F-1, F-4).
- [x] 2.2 Linhas vazias, CRLF e quebra final iguais no plain e no destacado (F-2).
- [x] 2.3 Falhas sem cache permanente e carregamentos deduplicados (F-3, F-6).
- [x] 2.4 Contraste do número de linha por tema do snippet (F-5).
- [x] 2.5 Acessibilidade da cópia e nome do bloco rolável (F-7).
- [x] 2.6 Limite de código extenso com fallback plain e documentação (F-8).
- [x] 2.7 Dependências `@shikijs/*` declaradas e carregador tipado (F-9, F-10).

## 3. Testes e documentação

- [x] 3.1 Testes reais de tokenização, falhas, concorrência, SSR, tema por ancestral, cópia e troca dinâmica (F-11).
- [x] 3.2 Isolamento de bundle para `admin` e `tokens`; teste E2E da altura das linhas.
- [x] 3.3 Atualizar `docs/highlighted-code-snippet.md` e `CHANGELOG.md`.

## 4. Validação

- [x] 4.1 `npm run format`, `lint`, `typecheck`, `build`, `test:quiet`, `test:release`, `test:ci`.
- [x] 4.2 E2E Chromium do demo e do catálogo.
- [x] 4.3 `npx @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive` (change ativa e simulação pós-archive).
- [x] 4.4 `inspect:packages` com `@admin-ds/components`, `@admin-ds/admin` e `@admin-ds/tokens` idênticos e Shiki apenas no pacote opcional.
