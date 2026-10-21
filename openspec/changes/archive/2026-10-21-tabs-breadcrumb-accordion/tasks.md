# Tasks

## 1. Fronteira cliente/servidor

- [x] 1.1 Mover `AdsTabs` para `packages/components/src/tabs.tsx` com `"use client"`, manter `AdsBreadcrumb` e `AdsNav` em `navigation.tsx` e atualizar `index.ts` com os mesmos exports públicos; verificar com `npm run typecheck` e a suíte `navigation.test.tsx` sem alterações de comportamento
- [x] 1.2 Estender `packages/components/scripts/verify-package.mjs` com uma lista de módulos cliente (inicialmente `tabs.js`, além de `theme-toggle.js`) que exigem `'use client'` e uma lista de módulos de servidor (`navigation.js`) que não podem tê-la; as tasks 3.2 e 4.1 acrescentam `breadcrumb-collapse.js` e `accordion.js`. Verificar com `npm run build --workspace @admin-ds/components` (a verificação falha se a diretiva for removida de `tabs.tsx`)
- [x] 1.3 Cobrir em `apps/admin-demo/tests/public-consumption.test.ts` que `AdsTabs` e `AdsBreadcrumb` são exportados pelo caminho público e que um componente de função sem `"use client"` os renderiza com `renderToString` sem erro; verificar com o teste passando

## 2. Tabs

- [x] 2.1 Sanitizar os ids (chave injetiva do `value` e `baseId` sem `:`, `«`, `»`) e testar valores com espaços, `_` e colisões em `packages/components/tests/navigation.test.tsx`; verificar que os ids são válidos como seletor e distintos
- [x] 2.2 Garantir a parada de tabulação quando a tab ativa está desabilitada ou ausente (D4) e testar; verificar que exatamente uma tab tem `tabindex="0"` e que Tab alcança a primeira habilitada
- [x] 2.3 Implementar `activationMode` (`manual` padrão, `automatic`) e testar os dois modos por teclado; verificar que o padrão preserva os testes existentes
- [x] 2.4 Implementar `orientation` (`horizontal` padrão, `vertical`), `aria-orientation`, teclas por orientação e estilo vertical com indicador lateral por classes explícitas; testar setas, Home e End nas duas orientações e confirmar as classes em `navigation-styles.test.ts`
- [x] 2.5 Implementar `keepMounted` na raiz com sobrescrita no `Panel` (painel inativo com `hidden` e sem `tabIndex`); testar o padrão, a preservação do valor de um campo e a sobrescrita por painel
- [x] 2.6 Documentar as props novas e a diferença de montagem entre Tabs e Accordion em `docs/integration.md`; verificar que os exemplos de código compilam como escritos

## 3. Breadcrumb

- [x] 3.1 Implementar `separator` (`ReactNode`, padrão atual, sempre `aria-hidden`) e testar o padrão e o personalizado
- [x] 3.2 Implementar o colapso (`maxItems`, `itemsBeforeCollapse`, `itemsAfterCollapse`, `expandLabel`) com a ilha `breadcrumb-collapse.tsx` e as constantes de textos padrão (D2, D6); testar trilha longa, curta, sem limite, item atual sempre visível, foco no primeiro item revelado e `expandLabel` sobrescrito
- [x] 3.3 Testar o Breadcrumb colapsado com `renderLink` renderizado por uma função de Server Component (`renderToString` sem erro de serialização) e documentar as props e a regra de resolução de textos em `docs/integration.md`; verificar com os testes passando

## 4. Accordion

- [x] 4.1 Criar `packages/components/src/accordion.tsx` com `"use client"`: raiz com `type` `single`/`multiple`, estado controlado ou não, `collapsible`, `Item`, `Header` (`level` 2 a 6) e `Trigger`; exportar de `index.ts`; verificar com `typecheck` e testes de estrutura ARIA, modos e estado controlado em `packages/components/tests/accordion.test.tsx`
- [x] 4.2 Implementar `Panel` com região nomeada, `hidden` por padrão e `unmountOnCollapse` na raiz e no item, sem `aria-controls` para painel ausente; testar a preservação do valor de um campo, o desmonte e a sobrescrita pelo item
- [x] 4.3 Implementar o teclado (setas, Home, End, isolamento em accordions aninhados) e o item desabilitado; testar que desabilitados são pulados e que o clique e o teclado não os alteram
- [x] 4.4 Estilizar com tokens existentes: chevron `aria-hidden` com rotação por `data-state`, `motion-reduce`, foco visível, estado desabilitado e `[hidden]` sem `display` sobrescrito; verificar em `navigation-styles.test.ts` as classes no CSS distribuído e que só são usados pares de tokens já cobertos por `packages/tokens/tests/contrast-pairs.mjs` (`text`, `textSecondary` e `textMuted` sobre as superfícies), o que garante o contraste de `4.5:1` nos dois temas, e axe no E2E
- [x] 4.5 Documentar o Accordion em `docs/integration.md` (API, modos, montagem, uso com Next.js, `role` do painel com muitos itens); verificar que os exemplos compilam como escritos

## 5. Stories, demo e E2E

- [x] 5.1 Adicionar stories em `apps/docs/src/navigation.stories.tsx` (ou arquivo próprio do Accordion): single, multiple, desabilitado, `unmountOnCollapse`, Tabs vertical e automático, `keepMounted` e Breadcrumb colapsado com separador; verificar com o build do Storybook
- [x] 5.2 Adicionar seções ao `apps/admin-demo/app/navigation-showcase.tsx` para Accordion, Tabs novos e Breadcrumb colapsado (com `next/link` em `renderLink`) sem rolagem horizontal em 320px; verificar o build do demo e a hidratação sem aviso
- [x] 5.3 Criar `e2e/navigation-structure.spec.ts` por papéis e nomes acessíveis: teclado e estado do Accordion, Tabs vertical e automático, `keepMounted` e expansão do Breadcrumb, com axe nos dois temas e a 320px; verificar com `npm run test:e2e`
- [x] 5.4 Os snapshots visuais só têm baselines Linux (docs/quality.md), então a rota `/componentes` é regenerada pelo workflow "Atualizar baselines visuais" na branch da PR, e o diff das imagens é revisado antes da aprovação; verificar que nenhum snapshot fora da rota mudou e que não há PNG `win32` versionado

## 6. Integração e fechamento

- [x] 6.1 Atualizar `docs/bundle-baseline.json` e `docs/bundle-baseline.md` com o novo tamanho (medido em LF, como na CI) e a justificativa (sem dependências novas), e registrar a change no README e no placeholder em aberto do `CHANGELOG.md`; verificar com `npm run inspect:packages`
- [x] 6.2 Executar `npx.cmd prettier --write` nos arquivos alterados e depois `npm run format`, `npm run lint`, `npm run build`, `npm run typecheck`, `npm run test:quiet` e `npm run test:e2e`, confirmando que todos passam; registrar o que não puder ser executado
- [x] 6.3 Executar `openspec.cmd validate --all --strict`; verificar a saída sem erros
- [x] 6.4 Revisar acessibilidade e contratos públicos com os subagents `a11y-reviewer` e `public-api-reviewer` e aplicar os ajustes necessários; verificar que as observações restantes estão registradas como limitações
