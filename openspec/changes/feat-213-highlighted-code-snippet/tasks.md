# Tasks

## 1. Planejamento e especificação

- [x] 1.1 Revisar arquitetura de build, exports, catálogo e scripts; registrar decisões no design.
- [x] 1.2 Validar a change com `npx @fission-ai/openspec@1.10.0 validate feat-213-highlighted-code-snippet --strict`.

## 2. Pacote `@admin-ds/highlighted-code`

- [x] 2.1 Criar workspace, build, CSS público e verificação de pacote.
- [x] 2.2 Implementar `AdsHighlightedCodeSnippet` com Shiki sob demanda, fallback plain e API pública.
- [x] 2.3 Testes Vitest (idiomas, tema, cópia, linhas, wrap, falhas).

## 3. Demo e catálogo

- [x] 3.1 Substituir `<pre><code>` em `catalog-preview.tsx` preservando snippets e cópia.
- [x] 3.2 Rota `/exemplos/codigo-destacado`, navegação e estilos.
- [x] 3.3 Documentar em `docs/highlighted-code-snippet.md` e link no `README.md`.

## 4. Bundle, CI e testes E2E

- [x] 4.1 Atualizar `build-all`, `inspect:packages`, baselines e cenário do pacote novo; comprovar `@admin-ds/components` sem Shiki.
- [x] 4.2 Testes Playwright do catálogo e da demonstração de código.
- [x] 4.3 Atualizar `CHANGELOG.md` e checkboxes da issue #213.

## 5. Validação final

- [x] 5.1 `npm run format`, `lint`, `typecheck`, `build`, `test:quiet`, `test:release`, `test:ci`.
- [x] 5.2 `CI=1 npm run test:e2e` (Chromium local; demais projetos na CI do GitHub).
- [x] 5.3 `npx @fission-ai/openspec@1.10.0 validate --all --strict --no-interactive` (change ativa; simulação pós-archive com Purpose na spec nova).
