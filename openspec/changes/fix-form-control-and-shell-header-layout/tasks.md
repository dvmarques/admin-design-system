# Tasks

## 1. Controles de texto contidos na largura do campo

- [ ] 1.1 Em `packages/components/src/form-control-classes.ts`, adicionar `box-border` à classe base de `formControlClasses`; verificar em `packages/components/tests/form-controls.test.tsx` que `AdsInput`, `AdsTextarea` e `AdsSelect` têm `box-border` em todos os tamanhos e estados de validação.
- [ ] 1.2 Estender `packages/components/tests/form-controls-styles.test.ts` para verificar que `dist/styles.css` contém `.box-border{box-sizing:border-box}`; verificar com `npm run test --workspace @admin-ds/components`, que compila o CSS antes.
- [ ] 1.3 Criar `e2e/form-control-layout.spec.ts`, que monta com `page.setContent` e o CSS distribuído de `@admin-ds/components` e `@admin-ds/tokens`, sem reset de `box-sizing`, um campo de largura total e um `input` ao lado de um `select` em uma grade de duas colunas, e verifica que a borda direita do `input` e do `textarea` não excede a do contêiner e que `input` e `select` não se sobrepõem, em 1280px e 390px; verificar que o teste falha ao remover temporariamente `box-border` e passa com ele.
- [ ] 1.4 Verificar no Storybook (`layout-filterbar--default`, `forms-form-controls--text-controls`, `layout-adminflows--step-form`, `layout-smarttable--with-filters-and-page-links`), nos temas claro e escuro e em 1280px e 390px, que nenhum `input` ou `textarea` excede o `.ads-field` e que o "Busca" não invade o "Status"; reavaliar o alinhamento vertical de "Criado em" e registrar se ainda há diferença.

## 2. Cabeçalho do Admin Shell sem rolagem horizontal

- [ ] 2.1 Em `packages/components/src/theme-toggle.tsx`, adicionar `font-sans` e `whitespace-nowrap` às classes de `ThemeToggle`; verificar em `packages/components/tests/theme-toggle.test.tsx` que o botão tem essas classes e que `aria-pressed`, o rótulo e o `onThemeChange` continuam como antes.
- [ ] 2.2 Em `packages/admin/src/styles.css`, fazer `.ads-admin-shell-header` quebrar linha (`flex-wrap`, `row-gap`, `padding-block`) e permitir que os filhos diretos encolham (`min-width: 0`); verificar que, em 1280px, a altura e a disposição do cabeçalho não mudam em relação ao estado anterior.
- [ ] 2.3 Estender os testes de estilos de `packages/admin` (ou criar `packages/admin/tests/admin-shell-styles.test.ts`) para verificar que o CSS distribuído de `@admin-ds/admin` contém `flex-wrap` e `min-width` na regra de `.ads-admin-shell-header`; verificar com `npm run test --workspace @admin-ds/admin`.
- [ ] 2.4 Atualizar `HeaderContent` em `apps/docs/src/admin-shell.stories.tsx` para uma composição responsiva (por exemplo, selo de ambiente oculto em larguras estreitas); verificar no Storybook, em `layout-admin-shell--default` e nas outras 5 stories do shell, em 390px, que a página não rola na horizontal, "Conta" aparece inteiro e nenhum rótulo quebra no meio de uma palavra.
- [ ] 2.5 Adicionar em `e2e/admin-demo.spec.ts` (ou arquivo novo) uma verificação, em 390px, de que o cabeçalho do admin demo não provoca rolagem horizontal e de que seus botões ficam dentro da viewport, usando papéis e nomes acessíveis; verificar que passa na CI.

## 3. Integração e documentação

- [ ] 3.1 Adicionar a entrada `fix-form-control-and-shell-header-layout` ao `CHANGELOG.md`, em `[0.1.1] - Em andamento`, seção Changed (mudança visual intencional de campos de texto e do cabeçalho do shell); verificar que o texto descreve o que mudou.
- [ ] 3.2 Rodar a varredura de geometria (sobreposição, transbordo e rolagem horizontal) em todas as stories, nos dois temas e em 1280px e 390px, e relatar o resultado; verificar que os achados de `child-overflows-parent` em controles, de `overlap` no FilterBar e de `page-overflow-x` nas stories de `layout-admin-shell` foram eliminados, e listar o que permanece (itens fora do escopo).
- [ ] 3.3 Verificar no admin demo (`npm run dev --workspace @admin-ds/admin-demo`, `/componentes` e `/clientes`), em claro e escuro, em 1280px e 390px, que a aparência dos campos e do cabeçalho não regride e que não há erros no console.

## 4. Validação final

- [ ] 4.1 Executar `npx.cmd prettier --write` nos arquivos alterados (`npx prettier --write` fora do Windows), antes da validação final; verificar que o comando conclui sem erros.
- [ ] 4.2 Executar `npm run lint`, `npm run typecheck`, `npm run test:quiet` (usar `npm run test:verbose` para diagnóstico) e `npm run build`; verificar que todos passam.
- [ ] 4.3 Executar `npm run test:e2e` e confirmar que nenhum teste falha antes do commit (usar `npm run test:e2e:verbose` para diagnóstico). Fora do Windows, executar com `CI=1` para pular os snapshots visuais sem baseline e relatar que a validação visual não foi feita; atualizar snapshots do Admin Shell móvel e do admin demo apenas se a mudança visual for intencional e o diff tiver sido revisado.
- [ ] 4.4 Executar `openspec.cmd validate --all --strict` (`npx @fission-ai/openspec@1.10.0 validate --all --strict --no-interactive` fora do Windows, a versão fixada na CI); verificar que passa.
- [ ] 4.5 Tarefa final: executar `npm run format`; verificar saída sem falhas.

## Workflow follow-up

- Revisar e regenerar no Windows os snapshots visuais afetados (admin demo e Storybook) antes de aceitar.
- Arquivar esta change com sincronização das specs `form-controls` e `admin-shell-layout`.
