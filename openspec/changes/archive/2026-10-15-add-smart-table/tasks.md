## 1. AdsTable e API

- [x] 1.1 Adicionar `containerProps` opcional a `AdsTable` (`@admin-ds/components`), com teste de que a marcação sem ele não muda. Concluída quando passa em testes e `typecheck`.
- [x] 1.2 Definir tipos públicos (`AdsSmartTableProps`, `AdsSmartTableColumn`, `AdsSmartTableLabels`, `AdsSmartTableSort`, `AdsSmartTableSortDirection`, `AdsSmartTableSelectionMode`) sem `any` e exportá-los por `@admin-ds/admin`.

## 2. Componente

- [x] 2.1 Renderizar legenda, cabeçalho, linhas, região rolável focável e slots `filters`/`pagination`.
- [x] 2.2 Implementar ordenação (`aria-sort`, botão, ciclo, anúncio).
- [x] 2.3 Implementar seleção múltipla e única, selecionar todas na página com estado indeterminado, `isRowSelectable` e anúncio da contagem.
- [x] 2.4 Implementar o seletor de colunas (`aria-expanded`, `Escape`, última coluna visível, `hideable`).
- [x] 2.5 Implementar estados `loading`, `error` e vazio.
- [x] 2.6 Adicionar estilos `ads-smart-table*` em `packages/admin/src/styles.css` com tokens, temas claro e escuro, sem Tailwind.

## 3. Testes e documentação

- [x] 3.1 Testes de comportamento: ordenação, seleção, colunas, estados, rolagem, paginação por links, controle estrito, SSR, `axe` e ausência de `next/*`; ajustar `package.test.mjs` e `verify-package.mjs` para o CSS novo.
- [x] 3.2 Story no Storybook (padrão, ordenação, seleção, colunas, carregando, vazio, erro, estreita, com filtros e paginação por links, tema escuro).
- [x] 3.3 Atualizar `docs/integration.md` (exemplo em Next.js com `searchParams`, integração com `AdsFilterBar` e `AdsPagination`), `docs/architecture.md`, `docs/limitations.md` e `CHANGELOG.md`.

## 4. Validação

- [x] 4.1 Executar `npm run format`, `lint`, `build`, `typecheck`, `test:quiet`, `inspect:packages`, `openspec validate --all --strict` e `npm run test:e2e`, confirmando que nenhum teste E2E falha.
- [x] 4.2 Registrar que os snapshots visuais têm baseline só `win32` (pulados na CI Linux, falham localmente fora do Windows) e que a change não adiciona nem altera baseline.
- [x] 4.3 Confirmar que nenhuma dependência de runtime foi adicionada e que `apps/admin-demo` não foi alterado.
- [x] 4.4 Validar o consumo do CSS compilado em Next.js (build de produção do `admin-demo` com página temporária não commitada, temas claro e escuro, sem erro de hidratação), restaurando `next-env.d.ts`.
- [x] 4.5 Atualizar `docs/bundle-baseline.json` e `docs/bundle-baseline.md` somente se `inspect:packages` exigir.

Notas de validação (Linux cloud, Node 22): `npm run format`, `lint`, `build`, `typecheck` e `test:quiet` (344 testes) passaram; `inspect:packages` excedeu o baseline de `@admin-ds/admin` (120751 > 89246) e o baseline foi atualizado e justificado em `docs/bundle-baseline.md`. No E2E (Chromium do Playwright em `/opt/pw-browsers`, via configuração temporária fora do repositório), 85 testes passaram e 7 falharam, todos snapshots visuais sem baseline `linux` (os baselines só existem para `win32`); nenhum baseline foi criado ou alterado, e `npm run test:e2e` completo (com os snapshots `win32`) não pôde ser executado aqui. `openspec validate --all --strict` só reporta o warning pré-existente em `spec/date-picker`. A 4.4 foi feita numa página temporária, não commitada, no build de produção do `admin-demo`, a 375 px, nos temas claro e escuro: rolagem horizontal só na região da tabela, linha selecionada com o token do tema e nenhum erro ou aviso de hidratação no console (apenas um 404 de recurso estático no tema claro, não relacionado). Sem novas dependências de runtime; `apps/admin-demo` não foi alterado. Não foram feitas revisão manual com leitor de tela nem testes em outros navegadores.

Notas de validação (Windows, Node 24): após o merge da `origin/develop` (`07da9ac`, sem mudanças), `npm ci` e `npm run validate` passaram: Vitest com 36 arquivos e 343 testes, `test:quality` 28/28 e E2E 92/92 com os snapshots `win32` existentes, sem baseline criado ou alterado. `openspec validate --all --strict` passou 38/38 no repositório e num clone descartável (só o INFO pré-existente em `spec/date-picker`). `inspect:packages` passou no worktree e num clone descartável em LF (`core.autocrlf=false`): tokens 27039, components 272873 e admin 120462 bytes. A 4.4 foi repetida no build de produção do `admin-demo`, numa rota temporária já apagada, com o exemplo de `docs/integration.md` sem alterações e uma tabela larga: o build compilou e, a 375 e 1100 px, nos temas claro e escuro, ordenação, `aria-sort`, selecionar todas, seletor de colunas com `Escape` e paginação por links funcionaram, a rolagem horizontal ficou só na região da tabela, a linha selecionada usou o token do tema e o console ficou sem erros ou avisos de hidratação.
