# Design

## Context

Estado atual observado:

- `apps/admin-demo/next.config.ts` não define `output`; o demo roda com `next start` nos E2E.
- O tema vem do cookie `ads-theme`, lido por `cookies()` em `app/layout.tsx`, `app/(admin)/layout.tsx` e `app/(admin)/preferencias/page.tsx`, e gravado por `applyTheme` em `lib/theme.ts`. **`cookies()` é incompatível com `output: 'export'`**, então o build estático precisa de outro caminho para o tema.
- `app/(admin)/clientes/page.tsx` lê `searchParams` no servidor (filtros, ordenação e página na URL), o que também é incompatível com `output: 'export'`.
- Os dados do demo são locais e determinísticos (`lib/data`); não há route handlers nem server actions. A navegação usa `next/link` com `href` raiz-relativo (que respeita `basePath`); o único `href` literal está em `customers-listing.tsx`, também com `Link`.
- `apps/docs` constrói com `storybook build` (saída estática relativa). O CI atual só roda em `develop`/`master`; `docs/release-process.md` define que mudanças funcionais entram em `develop` e `master` recebe releases.

Ver `proposal.md` para a motivação.

## Goals / Non-Goals

**Goals:**

- Um único workflow publica demo (raiz) e Storybook (`/storybook/`) no GitHub Pages.
- O build normal, o `dev` e os E2E permanecem iguais.
- Mudança mínima no demo: nenhuma alteração em `packages/`.

**Non-Goals:**

- npm, preview por PR, domínio próprio, link de volta do Storybook ao demo.

## Decisions

### D1. Export estático ativado por variável de ambiente

`next.config.ts` aplica `output: 'export'`, `basePath: '/admin-design-system'`, `trailingSlash: true` e `images.unoptimized` somente quando `GITHUB_PAGES === 'true'`. Alternativa: sempre exportar. Descartada porque o `next start` dos E2E e o fluxo atual deixariam de valer.

### D2. Tema sem `cookies()` no build estático

Um helper de servidor único (`lib/server-theme.ts`) devolve `'light'` quando `GITHUB_PAGES === 'true'` e, nos demais casos, lê o cookie como hoje; os três pontos que chamam `cookies()` passam a usá-lo. No build estático, um script inline no `<head>` lê o cookie `ads-theme` e define `data-theme` em `<html>` antes da primeira pintura, e `<html>` recebe `suppressHydrationWarning` apenas para o atributo `data-theme`. `useTheme` já lê o tema do DOM, então os controles se sincronizam após a hidratação; o snapshot de servidor permanece `'light'` e é corrigido pela leitura do DOM. O cookie continua sendo a fonte da preferência (mesmo mecanismo de `applyTheme`), sem novo armazenamento.

Alternativas: `localStorage` (descartada: dois mecanismos de persistência); tema sempre claro no Pages (descartada: perde o tema escuro, que é requisito do projeto).

### D2b. `/clientes` no build estático

A montagem da visão (filtros, ordenação, página) foi extraída para `customers-view.ts`. No build normal, `page.tsx` a executa no servidor com `searchParams`, como antes. No build estático, `page.tsx` não toca em `searchParams` e renderiza `CustomersStaticView` (Client Component) dentro de `Suspense`, que lê a URL com `useSearchParams` e chama a mesma função; o fallback é a listagem em estado de carregamento. Alternativa: excluir `/clientes` do Pages (descartada: o spec exige todas as rotas administrativas). Trade-off: no build estático os dados mock são enviados ao navegador, aceitável por serem dados fictícios e determinísticos.

### D3. Um workflow, um artefato

`pages.yml` faz checkout, `npm ci --ignore-scripts`, builda `tokens`, `components` e `admin`, gera o demo (`GITHUB_PAGES=true`) e o Storybook, monta `site/` (demo na raiz, Storybook em `site/storybook/`, mais `.nojekyll`) e publica com `actions/upload-pages-artifact` e `actions/deploy-pages`. Permissões mínimas: `contents: read`, `pages: write`, `id-token: write`; `concurrency` do grupo `pages` sem cancelar deploy em andamento. Ações fixadas por versão major, como no `ci.yml`.

Alternativa: dois workflows/ramos `gh-pages`. Descartada: um repositório tem um único site e o artefato único garante o "tudo ou nada" do requisito de publicação.

Antes de publicar, o job de build monta `site/` com `scripts/build-pages-site.mjs --build` (multiplataforma, sem `cross-env`) e executa `npm run test:e2e:pages`: uma configuração Playwright própria (`playwright.pages.config.ts`) que serve `site/` sob `/admin-design-system/` com `scripts/serve-pages-site.mjs` e verifica rotas, tema, link e Storybook. O E2E principal não muda.

Também foi adicionado `app/icon.svg`: sem ele o navegador pede `/favicon.ico` fora do `basePath`, gerando um 404 em todas as páginas do site publicado.

### D4. Ramo de publicação

Dispara em `push` para `develop` e em `workflow_dispatch`, de modo que o site reflita sempre o estado mais recente enquanto o projeto não tem versão final, e possa ser republicado manualmente. O ambiente `github-pages` precisa permitir implantações a partir de `develop` (Settings → Environments → github-pages → Deployment branches). Quando houver uma versão final, o gatilho passa para `master` (releases, conforme `docs/release-process.md`) em uma nova change. Alternativa: `master` desde já; descartada porque o site só atualizaria a cada release.

### D5. Link para o Storybook por variável de build

`NEXT_PUBLIC_STORYBOOK_URL` (definida só no build do Pages como `/admin-design-system/storybook/`) controla um `<a>` comum no cabeçalho, ao lado do controle de tema, com `target="_blank"`, `rel="noopener"` e nome acessível "Storybook (abre em nova aba)". É `<a>` e não `Link`, porque o destino é outro site estático e não recebe `basePath`. Sem a variável, nada é renderizado, mantendo E2E e dev inalterados.

### D6. README

Seção "Demonstração online" com os links do demo e do Storybook, no topo do `README.md`.

## Risks / Trade-offs

- [`output: 'export'` falha se algum ponto ainda chamar `cookies()` ou APIs dinâmicas] → o build do Pages roda no CI da implementação; a verificação local usa o mesmo comando.
- [Flash do tema errado no estático] → script inline síncrono no `<head>` e teste E2E do tema escuro sobre o build exportado.
- [Erro de hidratação por divergência de `data-theme`] → `suppressHydrationWarning` restrito ao `<html>` e verificação via `e2e/hydration.ts`.
- [Pages exige repositório público no plano gratuito] → pré-requisito documentado; alternativa é Cloudflare Pages.
- [Build quebrado em um lado impede o deploy dos dois] → aceito: é o comportamento exigido ("tudo ou nada").
- [O site expõe código ainda não liberado] → aceito enquanto o projeto é de estudo e não há versão final; a migração para `master` fica registrada como trabalho futuro.
- [Ambiente `github-pages` bloqueia implantação a partir de `develop`] → ajustar as regras de ramo do ambiente na habilitação do Pages (tarefa 3.3).
