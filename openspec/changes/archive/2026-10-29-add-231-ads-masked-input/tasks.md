## 1. API e distribuição opt-in

- [x] 1.1 Estabelecer tipos públicos de `AdsMaskedInput`: `mask`, `value`/`defaultValue` formatados, `onValueChange` com masked/unmasked/typed/complete, `onChange` DOM separado, `ref` e `inputRef`. Evidência: `packages/components/src/masked-input.tsx`; `npm run typecheck`; `packages/components/tests/masked-input.test.tsx`.
- [x] 1.2 Implementar adaptador IMask opcional isolado no subpath, mapeando `onAccept` para `onValueChange` sem sintetizar `onChange`, e modo nativo quando `mask` ausente `./masked-input`, sem export no root; declarar peer dependency e versões compatíveis, rever licenças e lockfile. Evidência: `masked-input.tsx` (`onAccept` → `onValueChange`), `peerDependenciesMeta`, lockfile e `docs/licensing.md`; testes de componente e `verify-package`.
- [x] 1.3 Garantir JS/d.ts publicados por build e exports; teste de instalação/consumo sem `react-imask` no root, e com `react-imask` no subpath. Medir tamanho e verificar ausência de import indesejado no bundle principal. Evidência: `npm run build` (`verify-package`), `npm run verify:optional-peer` (consumidor sem e com `react-imask`), `scripts/masked-input-distribution.test.mjs` e `npm run inspect:packages` (CI "Artefatos de distribuição").

## 2. Interação e acessibilidade

- [x] 2.1 Implementar máscaras estática/dinâmica e modo sem máscara; colagem, remoção, inserção intermediária, caret, seleção, valor externo e alteração de máscara. Evidência: testes de máscara estática, dinâmica, numérica, de data, sem máscara, colagem, edição no meio, valor externo e troca de máscara em `masked-input.test.tsx` e `e2e/masked-input.spec.ts`.
- [x] 2.2 Testar controlado/não controlado, emissão de `onValueChange` por aceite real de edição e comportamento não garantido de `onChange` nativo, `name`, `required`, `disabled`, `readOnly`, `inputMode`, `ref`/`inputRef`. Evidência: testes de controlado/não controlado, `onValueChange`, `onChange` não sintetizado, `name`, `required`, `disabled`, `readOnly`, `inputMode` e refs em `masked-input.test.tsx`.
- [x] 2.3 Testar IME/composição, foco/teclado, leitor de tela/axe, `AdsField` e mensagens ARIA; SSR/hidratação, StrictMode e desmontagem. Evidência: testes de IME (jsdom e CDP no Chromium), axe, `AdsField`, SSR/hidratação em StrictMode e desmontagem; `e2e/masked-input.spec.ts`.
- [x] 2.4 Cobrir mobile 390px, zoom 200%, CSS sem Tailwind, forced-colors e temas claro/escuro, incluindo máscara numérica com zeros à esquerda. Evidência: E2E a 390 px e 320 px, forced-colors, temas claro/escuro, CSS distribuído sem Tailwind e zeros à esquerda (unitário); CI "Fluxos no navegador".

## 3. Demo e documentação na mesma PR

- [x] 3.1 Publicar exemplo funcional no Admin Demo com dados fictícios (máscara fixa, dinâmica, sem máscara, controlado, não controlado, validação, colagem e envio). Evidência: `/catalogo/masked-input` (`catalog-demos.tsx`) e `e2e/masked-input.spec.ts`.
- [x] 3.2 Criar stories Storybook e atualizar catálogo/matriz de cobertura. Evidência: `apps/docs/src/masked-input.stories.tsx` e `docs/admin-demo-catalog.md`; `catalog-coverage.test.ts`.
- [x] 3.3 Documentar guia `campo mascarado existente` → `AdsMaskedInput`, diferença de eventos, valor bruto/formato enviado, validação externa e dependência opt-in; registrar CHANGELOG [0.1.1]. Evidência: `docs/integration.md`, `docs/limitations.md` e entrada em `CHANGELOG.md` `[0.1.1]`.

## 4. Gates

- [x] 4.1 Formatar os arquivos via `npx.cmd prettier --write` e aprovar `npm run format`. Evidência: `npm run format` e prettier nos arquivos alterados passam local e na CI (job "Qualidade rápida").
- [x] 4.2 Executar e aprovar `npm run validate`, `openspec.cmd validate add-231-ads-masked-input --strict` e `openspec.cmd validate --all --strict`; registrar logs, skips e evidências de testes/E2E.
      Evidência: CI run 40958737350 no SHA aa8516f com Qualidade rápida, Chromium, Firefox, WebKit, Artefatos de distribuição (inclui verify:optional-peer) e Política de develop em success (Publicar e Validação de release skipped, não contam como aprovação); local: format, lint, typecheck, test:quality, verify:optional-peer e `openspec validate --all --strict` (61). `npm run validate` encadeado local não rodou por falhas ambientais conhecidas (snapshots e Firefox/WebKit ausentes), cobertas pela CI.
- [x] 4.3 Revisar tipos, exports, bundle sem IMask no root, compatibilidade com consumidores e snapshots intencionais antes de Ready for review. Evidência: CI "Artefatos de distribuição" (`inspect:packages`, `verify:optional-peer`), `verify-package`, typecheck e builds dos apps; revisões somente leitura de a11y e API pública aprovadas sem bloqueantes.
