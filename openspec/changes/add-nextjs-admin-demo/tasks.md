# Tasks

## 1. Layout compartilhado e navegação

- [ ] 1.1 Criar o grupo `app/(admin)` com `layout.tsx` (Server Component) contendo `AdsAdminShell`, cabeçalho e `ThemeControl`; mover as seções de `app/page.tsx` para `app/(admin)/componentes/page.tsx`, descartando o `AdsAdminShell`, o `ThemeControl` e os links do hero, e dar a essa rota um único `h1` ("Catálogo de componentes"); criar um `app/(admin)/page.tsx` mínimo (somente `h1` "Visão geral", completado na 2.1) para que `/` continue existindo; atualizar `tests/public-consumption.test.ts` para varrer `app/**/*.tsx` em vez de exigir imports em `app/page.tsx`; verificar que `npm run build --workspace @admin-ds/admin-demo` conclui sem conflito de rotas e que `/` e `/componentes` têm um único shell, um único `main` e um único `h1`.
- [ ] 1.2 Criar `demo-navigation.tsx` (Client Component) com `next/link` e `usePathname` dentro de `AdsAdminShell.Sidebar` (mantendo `label` e `mobileTitle` "Navegação do demo"), com um item por rota: Visão geral, Clientes, Novo cliente, Preferências, Componentes e Exibição de dados; `aria-current="page"` somente no item cuja rota é exatamente a atual; verificar com teste de componente (com `next/navigation` mockado) que, para cada rota, exatamente um item é marcado.
- [ ] 1.3 Mover `/data-display` para `app/(admin)/data-display`, removendo `<main>`, link "Voltar" e `ThemeControl` duplicados e mantendo URL e headings; verificar que a rota tem um único `main`, um único toggle de tema e um único `h1`.
- [ ] 1.4 Atualizar os e2e: `overlay.spec.ts` e as asserções de conteúdo do catálogo em `admin-demo.spec.ts` (heading "Tokens públicos", link `/exibi/i` no `main`, que passa a ser verificado na sidebar) passam a usar `/componentes`; os testes do shell em `admin-demo.spec.ts` permanecem em `/`, trocando o link "Formulários" por "Clientes"; `data-display.spec.ts` perde o teste do link "Voltar" (substituído por navegação pela sidebar); manter seletores por papel e nome acessível; verificar que os três arquivos passam com `CI=1` (os testes de snapshot visual são regenerados na 6.4).
- [ ] 1.5 Fechar o drawer móvel ao mudar de rota com `useAdsAdminShell` em `demo-navigation.tsx`; verificar em Playwright (375 px) que o drawer fecha ao navegar e o foco fica em um elemento válido.
- [ ] 1.6 Cobrir em Playwright: navegar entre rotas mantém tema e sidebar recolhida no desktop, e a navegação por teclado mostra foco visível e ativa com Enter.

## 2. Visão geral

- [ ] 2.1 Criar dados estáticos determinísticos em `lib/data/` e a rota `/` com indicadores (`AdsCard`), `AdsProgress` e `AdsList` de atividade; verificar com teste Vitest do componente de apresentação (`renderToString` duas vezes) que a marcação é idêntica.
- [ ] 2.2 Adicionar teste `axe-core` e teste Playwright por papéis ARIA para a rota, nos temas claro e escuro; verificar zero violações.

## 3. Listagem de clientes

- [ ] 3.1 Criar `/clientes` com `AdsTable`, nome acessível e paginação via `?pagina=N` usando `AdsPagination` com `onPageChange` e `router.push` em um Client Component fino; verificar que a mudança de página altera os registros e informa a página atual, e que `?pagina=0`, `?pagina=abc` e `?pagina=999` exibem a página válida mais próxima.
- [ ] 3.2 Implementar os estados `?estado=vazio|carregando|erro` com `AdsEmptyState`, `AdsSkeleton` e o erro em `AdsEmptyState` com `role="alert"` e ação "Tentar novamente" (link para `/clientes` sem `?estado`); verificar um teste por estado, incluindo o anúncio do erro, e que `?estado=desconhecido` exibe os dados normais.
- [ ] 3.3 Verificar rolagem horizontal contida na tabela em 375 px, ausência de rolagem horizontal da página e `axe-core` nos dois temas.

## 4. Formulário de cadastro

- [ ] 4.1 Criar `/clientes/novo` com `AdsField` e controles, validação de obrigatórios, erro associado ao campo e foco no primeiro campo inválido (`[aria-invalid="true"]`); verificar com testes de componente (envio inválido e válido).
- [ ] 4.2 Exibir `AdsToast` de sucesso sem persistir dados; verificar em Playwright o fluxo completo por papéis e nomes acessíveis.
- [ ] 4.3 Verificar o formulário em estado de erro ao alternar o tema (`axe-core` e e2e).

## 5. Preferências

- [ ] 5.1 Extrair para `lib/theme.ts` a gravação de tema (cookie e `data-theme`) e um hook com `useSyncExternalStore` observando `data-theme`, e fazer o `ThemeControl` usá-lo; verificar com testes em `tests/theme.test.ts` e que a alternância de tema em `e2e/data-display.spec.ts` continua passando.
- [ ] 5.2 Criar `/preferencias` com o tema em `AdsSelectionGroup`/`AdsRadio` e controle do estado da sidebar via `useAdsAdminShell`; verificar em e2e que o tema escolhido é restaurado na renderização inicial seguinte, sem alternância visível, que alterar o grupo atualiza o toggle do header e vice-versa, e que não há nomes de botão duplicados.

## 6. Contrato público, documentação e snapshots

- [ ] 6.1 Estender `tests/public-consumption.test.ts` para varrer `app/**` e falhar em qualquer import interno de pacote; verificar introduzindo temporariamente um import interno e confirmando a falha (revertido em seguida).
- [ ] 6.2 Adicionar teste Playwright que carrega cada rota (incluindo `/componentes`, `/data-display` e `/preferencias`), nos dois temas, falhando em erros de hidratação no console e verificando `axe-core` sem violações, um único `h1` e ausência de rolagem horizontal da página em 375, 768 e 1280 px; verificar que passa para cada rota.
- [ ] 6.3 Atualizar `docs/integration.md` (layout compartilhado, `next/link` na sidebar, paginação por `onPageChange`), registrar em `docs/limitations.md` que `AdsNav`/`AdsBreadcrumb` não aceitam elemento de link customizado, atualizar o item 8 de `docs/roadmap.md` com as entregas principais, atualizar o passo de próximos passos do `README.md` que ainda manda planejar esta change e a árvore de `e2e/` em `docs/quality.md` se houver arquivos novos; verificar que os exemplos documentados correspondem ao código do demo.
- [ ] 6.4 Regenerar localmente (Windows, nomes `-win32`), revisando cada diff antes de aceitar, os snapshots de `admin-demo-*` (agora a visão geral), `admin-shell-*` (sobre `/`) e `data-display-*`, e criar os de `/componentes`, `/clientes`, `/clientes/novo` e `/preferencias`; registrar na entrega que a validação visual não roda em Linux nem na CI.

## 7. Validação final

- [ ] 7.1 Executar `npx prettier --write` nos arquivos alterados e `npm run format`; verificar saída sem falhas.
- [ ] 7.2 Executar `npm run lint`, `npm run typecheck`, `npm run test:quiet` e `npm run build`; verificar que todos passam.
- [ ] 7.3 Executar `npm run test:e2e` e confirmar que nenhum teste falha antes do commit (usar `npm run test:e2e:verbose` para diagnóstico). Fora do Windows, executar com `CI=1` para pular os snapshots visuais sem baseline e relatar que a validação visual não foi feita.
- [ ] 7.4 Executar `openspec validate --all --strict`; verificar que passa.

## Workflow follow-up

- Abrir PR com base em `develop` e integrar por squash, vinculando a issue #16 manualmente em Development, sem palavras-chave de fechamento.
- Arquivar a change após a validação, com sincronização das specs `admin-demo-application` e `nextjs-consumption`, e marcar o item 8 do roadmap como concluído com a data do arquivamento, no formato dos itens 1 a 7.
