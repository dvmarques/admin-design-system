# Tasks

## 1. Demo como site estático

- [x] 1.1 Criar `apps/admin-demo/lib/server-theme.ts` e usá-lo em `app/layout.tsx`, `app/(admin)/layout.tsx` e `app/(admin)/preferencias/page.tsx` no lugar de `cookies()`; verificar com testes unitários que o build normal continua lendo o cookie e que com `GITHUB_PAGES=true` o resultado é `'light'` sem chamar `cookies()`.
- [x] 1.2 Adicionar o script inline de tema no `<head>` (apenas no build estático) e `suppressHydrationWarning` restrito ao `<html>`; verificar com teste unitário e com `e2e/hydration.ts` que não há erro de hidratação nos dois temas.
- [x] 1.3 Configurar `next.config.ts` com `output: 'export'`, `basePath`, `trailingSlash` e `images.unoptimized` somente com `GITHUB_PAGES=true`; verificar que `GITHUB_PAGES=true npm run build --workspace @admin-ds/admin-demo` gera `apps/admin-demo/out` com todas as rotas de `e2e/routes.ts` e que o build sem a variável não muda.
- [x] 1.4 Revisar `href`/`src` raiz-relativos fora de `Link` e corrigir os que ignoram o `basePath`; verificar com `grep` e abrindo as rotas do `out/` sob o subcaminho.
- [x] 1.5 Tratar `/clientes` no build estático (`customers-view.ts`, `customers-static-view.tsx`, `Suspense`) e adicionar `app/icon.svg`; verificar que `/clientes?status=...` filtra no site estático (`npm run test:e2e:pages`) e que o build normal mantém o comportamento (`npm run test:e2e`).

## 2. Link para o Storybook no demo

- [x] 2.1 Renderizar no cabeçalho do demo o `<a>` "Storybook (abre em nova aba)" quando `NEXT_PUBLIC_STORYBOOK_URL` existir; verificar com teste unitário (presente com a variável, ausente sem ela) e com `a11y-reviewer` sobre foco visível e nome acessível.
- [x] 2.2 Cobrir o link em `e2e-pages` (build exportado, sob o subcaminho) por função ARIA e nome acessível, sem texto editorial; verificar com `npm run test:e2e:pages`.

## 3. Workflow de publicação

- [x] 3.1 Criar `.github/workflows/pages.yml` conforme a decisão D3/D4 (gatilhos `push` em `develop` e `workflow_dispatch`, permissões mínimas, `concurrency`, montagem de `site/` com `.nojekyll`); verificar a sintaxe com `actionlint` ou revisão e executando os mesmos comandos localmente.
- [x] 3.2 Servir `site/` localmente sob `/admin-design-system/` e verificar que o demo na raiz, uma rota interna recarregada e `/storybook/` abrem sem erro de rede (404) nos assets.
- [x] 3.3 Habilitar Settings → Pages → Source: GitHub Actions, permitir o ramo `develop` nas regras do ambiente `github-pages`, executar o workflow por `workflow_dispatch` e verificar os endereços publicados.

## 4. Documentação

- [x] 4.1 Adicionar a seção "Demonstração online" ao `README.md` com os links do demo e do Storybook; verificar que os links abrem o site publicado.
- [x] 4.2 Documentar o procedimento (variáveis `GITHUB_PAGES` e `NEXT_PUBLIC_STORYBOOK_URL`, pré-requisito de repositório público, republicação manual, limitações do Pages) em `docs/` e linkar a partir de `docs/release-process.md`; verificar que os comandos documentados rodam como escritos.

## 5. Validação final

- [x] 5.1 Executar `npx.cmd prettier --write` nos arquivos alterados e `npm run format`, `npm run lint`, `npm run build`, `npm run typecheck`, `npm run test:quiet` e `npm run test:e2e`; verificar que todos passam sem atualizar snapshots.
- [x] 5.2 Executar `openspec.cmd validate publicar-demo-storybook-github-pages --strict`; verificar saída sem erros. (`validate --all --strict` falha por avisos pré-existentes de outras specs, fora desta change.)

## Workflow follow-up

- Abrir PR para `develop` com `Closes #103`, seguindo `docs/release-process.md`.
- Arquivar a change após a revisão e a publicação verificada.
