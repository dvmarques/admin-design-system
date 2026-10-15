# Tasks

## 1. Layout compartilhado e navegação

- [ ] 1.1 Criar o grupo de rotas `app/(admin)` com `layout.tsx` (Server Component) contendo `AdsAdminShell`, cabeçalho e `ThemeControl`; verificar que `/` renderiza o shell uma única vez (teste Vitest de SSR da rota).
- [ ] 1.2 Criar `demo-navigation.tsx` (Client Component) com `next/link` e `usePathname` dentro de `AdsAdminShell.Sidebar`, marcando `aria-current="page"` apenas na rota atual; verificar com teste de componente que somente um item é marcado.
- [ ] 1.3 Mover o conteúdo atual de `app/page.tsx` para `app/(admin)/componentes/page.tsx` e fazer `/data-display` usar o layout compartilhado, mantendo URL e headings; verificar que `e2e/data-display.spec.ts` continua passando sem alterações de seletores.
- [ ] 1.4 Cobrir em Playwright: navegar entre rotas mantém tema e sidebar recolhida, e a navegação por teclado mostra foco visível e ativa com Enter.

## 2. Visão geral

- [ ] 2.1 Criar dados estáticos determinísticos em `lib/data/` e a rota `/` com indicadores (`AdsCard`), `AdsProgress` e `AdsList` de atividade; verificar que duas renderizações SSR produzem marcação idêntica.
- [ ] 2.2 Adicionar teste `axe-core` e teste Playwright por papéis ARIA para a rota, nos temas claro e escuro; verificar zero violações.

## 3. Listagem de clientes

- [ ] 3.1 Criar `/clientes` com `AdsTable`, nome acessível e paginação via `?pagina=N` usando `AdsPagination` com `renderPage` e `next/link`; verificar que a mudança de página altera os registros e informa a página atual.
- [ ] 3.2 Implementar os estados `?estado=vazio|carregando|erro` com `AdsEmptyState`, `AdsSkeleton` e erro anunciado com ação de tentar novamente; verificar um teste por estado, incluindo o anúncio do erro.
- [ ] 3.3 Verificar rolagem horizontal contida na tabela em 375 px, ausência de rolagem horizontal da página e `axe-core` nos dois temas.

## 4. Formulário de cadastro

- [ ] 4.1 Criar `/clientes/novo` com `AdsField` e controles, validação de obrigatórios, erro associado ao campo e foco no primeiro campo inválido; verificar com testes de componente (envio inválido e válido).
- [ ] 4.2 Exibir `AdsToast` de sucesso sem persistir dados; verificar em Playwright o fluxo completo por papéis e nomes acessíveis.
- [ ] 4.3 Verificar o formulário em estado de erro ao alternar o tema (`axe-core` e e2e).

## 5. Preferências

- [ ] 5.1 Criar `/preferencias` com `ThemeControl` e controle do estado da sidebar; verificar em e2e que o tema escolhido é restaurado na renderização inicial seguinte, sem alternância visível.

## 6. Contrato público, documentação e snapshots

- [ ] 6.1 Estender `tests/public-consumption.test.ts` para varrer `app/**` e falhar em qualquer import interno de pacote; verificar introduzindo temporariamente um import interno e confirmando a falha (revertido em seguida).
- [ ] 6.2 Adicionar teste de SSR/hidratação por rota sem divergências atribuíveis ao design system.
- [ ] 6.3 Atualizar `docs/integration.md` (layout compartilhado, `next/link` na sidebar, `renderPage`), registrar em `docs/limitations.md` que `AdsNav`/`AdsBreadcrumb` não aceitam elemento de link customizado, e atualizar o item 8 de `docs/roadmap.md`; verificar que os exemplos documentados correspondem ao código do demo.
- [ ] 6.4 Regenerar snapshots visuais somente das telas alteradas, revisando cada diff antes de aceitar.

## 7. Validação final

- [ ] 7.1 Executar `npx prettier --write` nos arquivos alterados e `npm run format`; verificar saída sem falhas.
- [ ] 7.2 Executar `npm run lint`, `npm run typecheck`, `npm run test:quiet` e `npm run build`; verificar que todos passam.
- [ ] 7.3 Executar `npm run test:e2e` e confirmar que nenhum teste falha antes do commit (usar `npm run test:e2e:verbose` para diagnóstico).
- [ ] 7.4 Executar `openspec validate --all --strict`; verificar que passa.

## Workflow follow-up

- Abrir PR a partir de `develop` com squash, vinculando a issue #16 manualmente em Development, sem palavras-chave de fechamento.
- Arquivar a change após a validação, com sincronização das specs `admin-demo-application` e `nextjs-consumption`.
