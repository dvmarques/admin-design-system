# Publicação no GitHub Pages

O demo (`apps/admin-demo`) e o Storybook (`apps/docs`) são publicados, gratuitamente, como um único
site estático:

- demo: `https://dvmarques.github.io/admin-design-system/`
- Storybook: `https://dvmarques.github.io/admin-design-system/storybook/`

Os quatro pacotes `@dvmarques/admin-ds-*` ainda não foram publicados no npm; a primeira publicação pertence à [#195](https://github.com/dvmarques/admin-design-system/issues/195). A publicação no Pages distribui somente a demonstração e o catálogo Storybook.

## Como funciona

O workflow `.github/workflows/pages.yml` roda a cada push em `develop` e por
`workflow_dispatch` em develop. PRs não Draft para develop executam o mesmo build e testes no Linux, sem configurar, enviar artefatos ou publicar no Pages. Cada PR usa concorrência própria. O job de build roda no container oficial do Playwright (`mcr.microsoft.com/playwright:v1.62.0-noble`, ver `docs/playwright-ci-container.md`), que já traz o Chromium e dispensa `playwright install`. Ele constrói os pacotes, gera o demo e o Storybook a partir do
mesmo commit, monta `site/`, verifica o site com `npm run test:e2e:pages` e só então publica. Se
qualquer etapa falhar, nada é publicado e o site anterior continua no ar.

## Configuração única no GitHub

1. Settings → Pages → Source: **GitHub Actions** (o repositório precisa ser público no plano
   gratuito).
2. Settings → Environments → `github-pages` → Deployment branches: permitir `develop` (por padrão o
   ambiente só aceita o ramo padrão do repositório).

## Variáveis de build

| Variável                    | Onde                           | Efeito                                                                                                                   |
| --------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `GITHUB_PAGES=true`         | build do demo                  | `output: 'export'`, `basePath: '/admin-design-system'`, `trailingSlash` e imagens sem otimização                         |
| `NEXT_PUBLIC_STORYBOOK_URL` | definida pelo `next.config.ts` | exibe o link "Storybook (abre em nova aba)" na navegação principal, junto de Catálogo; sem ela, o link não é renderizado |

Sem `GITHUB_PAGES`, o demo se comporta como antes: `next dev`, `next start` e os testes E2E não mudam.

## Particularidades do build estático

- **Tema:** sem servidor, o cookie `ads-theme` não pode ser lido no render. O build estático
  renderiza o tema claro e um script inline no `<head>` aplica o tema salvo antes da primeira
  pintura (`themeInitScript` em `apps/admin-demo/lib/theme.ts`).
- **Clientes:** `/clientes` lê filtros, ordenação e página da URL no navegador
  (`customers-static-view.tsx`); no build normal continua sendo resolvido no servidor.
- **Links:** o link para o Storybook é um `<a>` comum, pois o Storybook é outro site estático e não
  recebe o `basePath` do Next.js.

## Comandos locais

```powershell
npm run build                # pacotes e apps
npm run build:pages          # gera o demo estático e o Storybook e monta site/
node scripts/serve-pages-site.mjs   # serve site/ em http://127.0.0.1:4173/admin-design-system/
npm run test:e2e:pages       # verifica o site publicado sob o subcaminho
```

No Windows, o export do Next.js pode gerar caminhos de prefetch como diretórios onde o cliente solicita nomes separados por pontos, causando 404 na suíte Pages. A validação fiel do site ocorre no Linux da PR; não ignore esses erros para aprovar o build local.

Depois de `build:pages`, rode `npm run build` antes de `npm run test:e2e`: o E2E principal usa o
build normal do demo, não o estático.

## Limitações

- Não há preview por Pull Request (o GitHub Pages não oferece).
- O site expõe o estado de `develop`, inclusive código ainda não liberado.
- Um build quebrado no demo ou no Storybook impede a publicação dos dois.
