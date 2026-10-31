# Guia de desenvolvimento

Este é o ponto de entrada para quem deseja **desenvolver o Admin Design System**, executar suas aplicações e contribuir para o monorepo. Para **consumir a biblioteca** em outro projeto, use o [README principal](../README.md) e a [integração](integration.md). Os pacotes foram preparados para npm, mas ainda não foram publicados.

## Pré-requisitos

- Git e Node.js **24.15 ou superior na linha 24**, conforme `.nvmrc` e a exigência da suíte `jsdom` 30.
- npm **11.19.1**, versão fixada no campo `packageManager` da raiz.
- Navegadores do Playwright quando for executar testes E2E localmente; veja [qualidade](quality.md).

Confira seu ambiente:

```bash
node --version
npm --version
```

## Preparar o monorepo

Clone e execute na **raiz**:

```bash
git clone https://github.com/dvmarques/admin-design-system.git
cd admin-design-system
# Use o Node indicado em .nvmrc (por exemplo: nvm use).
npm ci
npm run build
```

`npm ci` respeita o lockfile; `npm run build` gera os artefatos de bibliotecas que as aplicações consomem. Depois de alterar tokens, componentes ou composições, refaça o build para não usar um `dist` desatualizado.

## Subir as aplicações

Após o build, execute cada aplicação em seu **próprio terminal**, sempre a partir da raiz:

| Aplicação                                                   | Comando                                        | Endereço                                       |
| ----------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| **Storybook** — catálogo visual e referência da API         | `npm run dev --workspace @admin-ds/docs`       | [http://localhost:6006](http://localhost:6006) |
| **Admin Demo** — aplicação Next.js App Router de referência | `npm run dev --workspace @admin-ds/admin-demo` | [http://localhost:3000](http://localhost:3000) |

Encerre cada servidor com `Ctrl+C`. O Storybook gera a referência de API em `predev`. A Demo usa dados e autenticação demonstrativos, não fornece backend de produção. Consulte o [catálogo da Demo](admin-demo-catalog.md) e o [fluxo de autenticação ilustrativo](demo-auth-flow.md).

## Como o repositório é organizado

| Caminho                        | Responsabilidade                                      |
| ------------------------------ | ----------------------------------------------------- |
| `packages/tokens`              | Tokens, temas e CSS base                              |
| `packages/components`          | Componentes React e estilos reutilizáveis             |
| `packages/admin`               | Shell, dashboard e fluxos administrativos             |
| `packages/highlighted-code`    | Código destacado opcional, isolado de components      |
| `apps/admin-demo`              | Integração Next.js dos pacotes                        |
| `apps/docs`                    | Storybook, stories e API                              |
| `e2e`                          | Testes Playwright e baselines visuais                 |
| `openspec`                     | Propostas, requisitos, tarefas e histórico de changes |
| `scripts`, `.github/workflows` | Build, validações, CI e release                       |

A [arquitetura](architecture.md) detalha os limites entre pacotes e aplicações. Componentes públicos usam nomes `Ads*`, classes `ads-*`, tokens `--ads-*` e imports declarados em `package.json#exports`; nunca dependa de `src/` de outro pacote. Confira [identidade visual](visual-identity.md), [acessibilidade e qualidade](quality.md) e [limitações conhecidas](limitations.md).

## Validar antes da PR

Na raiz do projeto:

```bash
npm run format
npm run lint
npm run build
npm run typecheck
npm run test:quality
npm run test:e2e

# Suíte completa (inclui os passos anteriores e verificações adicionais)
npm run validate

# OpenSpec estrito com a versão fixada na CI
npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive
```

`npm run format` **verifica**, não corrige; para corrigir arquivos modificados, use `npx prettier --write <arquivo>` e confira novamente. `npm run validate:impact` oferece feedback parcial rápido e **não substitui** a validação integral. Para E2E, construa a Demo com `npm run build` antes: o Playwright verifica se o build está atualizado. Veja [qualidade](quality.md), [CI por impacto](ci-impact-validation.md) e [comandos OpenSpec](openspec-commands.md). Um job com etapas `skipped` não comprova execução dessas verificações.

## Contribuir: issue → OpenSpec → PR

1. Confira a issue e as changes existentes. Crie sua branch a partir de `develop` (padrões `feat/`, `fix/`, `docs/` e `chore/` com número da issue). Quando houver PR aberta, continue a branch existente.
2. Para mudanças relevantes, escreva ou atualize a change em `openspec/changes/` antes da implementação e siga o [workflow de desenvolvimento](ai-development-workflow.md).
3. Atualize testes, documentação e `CHANGELOG.md`; faça as validações oficiais.
4. Abra PR para `develop`. PRs em Draft não disparam a CI automática de PR; após marcar **Ready for review**, confira os jobs no SHA atualizado e obtenha revisão humana.
5. Archive e merge são etapas posteriores, sujeitas aos gates de [contribuição](../CONTRIBUTING.md), [OpenSpec](openspec-lifecycle.md) e aprovação cabível.

As regras obrigatórias estão em [AGENTS.md](../AGENTS.md) e [CONTRIBUTING.md](../CONTRIBUTING.md). O [mapa de contexto](agent-context-map.md) facilita encontrar documentos por área. Para Codex, Cursor e Claude Code, consulte [configuração de agentes](agent-setup.md).

## Releases e publicação da Demo

O fluxo de versão é `develop → release/X.Y.Z → PR master → back-merge develop → publicação → tag e GitHub Release`. As decisões, os merges e a publicação obedecem ao [processo de release](release-process.md).

A publicação dos **pacotes no npm** é diferente do deploy da **Demo e do Storybook pelo GitHub Pages**. Para testar o site estático localmente, consulte `npm run build:pages` e `npm run test:e2e:pages` no [guia Pages](github-pages.md), lembrando que o E2E principal usa o build normal da Demo.

## Diagnóstico rápido

- **Node/npm incompatíveis:** confira `.nvmrc`, `packageManager` e as versões instaladas. Testes com `jsdom` 30 exigem Node 24.15+.
- **Exports/CSS não aparecem:** refaça `npm run build` e verifique imports públicos e ordem de CSS no [guia de integração](integration.md).
- **Playwright falha antes dos testes:** gere primeiro o build normal e consulte os requisitos de navegadores, o stamp do build e os baselines Linux em [qualidade](quality.md).
- **Falha de Prettier:** formate os arquivos alterados e execute `npm run format` novamente.
- **Dúvidas sobre CI, releases e histórico:** veja [validação por impacto](ci-impact-validation.md), [release](release-process.md), [CHANGELOG](../CHANGELOG.md) e o [projeto no GitHub](https://github.com/users/dvmarques/projects/2).
