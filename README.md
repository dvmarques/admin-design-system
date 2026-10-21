# Admin Design System

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/brand/admin-ds-logo-lockup-dark.svg">
  <img alt="Admin Design System" src="assets/brand/admin-ds-logo-lockup.svg" height="64">
</picture>

> Identidade visual oficial: símbolo A minimalista com recorte lilás sobre roxo profundo. Os SVGs em `assets/brand` são a fonte da marca: `admin-ds-logo.svg` (símbolo), `admin-ds-mark.svg` (sem fundo, para superfícies escuras), `admin-ds-favicon.svg` (variante chapada para tamanhos pequenos) e os lockups com o nome. `admin-ds-logo.png` (512×512) é gerado a partir do SVG.

Design system React reutilizável para a construção de aplicações
administrativas com Next.js App Router, com arquitetura, identidade visual
e implementação próprias.

A biblioteca utiliza TypeScript, Tailwind CSS e variáveis CSS
semânticas para oferecer componentes acessíveis, responsivos e
personalizáveis, com suporte a temas claro e escuro. Os pacotes são
documentados no Storybook e validados por uma aplicação Next.js de
referência.

O desenvolvimento é orientado por especificações com OpenSpec. Cada
mudança relevante passa por proposta, requisitos, design, tarefas,
implementação, validação e arquivamento.

## Demonstração online

- [Aplicação de demonstração](https://dvmarques.github.io/admin-design-system/)
- [Storybook](https://dvmarques.github.io/admin-design-system/storybook/)

O site é publicado pelo GitHub Pages a partir de `develop`; veja `docs/github-pages.md`.

## Requisitos

- Node.js 24 ou superior (veja `.nvmrc`; use `nvm use` ou equivalente);
- npm `11.19.1`, fixado em `packageManager`.

## Executar as aplicações

Instale as dependências uma vez, na raiz do repositório:

```powershell
npm install
```

Antes de iniciar qualquer aplicação, gere os artefatos distribuídos dos
pacotes internos:

```powershell
npm run build
```

### Catálogo de componentes (Storybook)

Inicie o catálogo visual dos componentes com:

```powershell
npm run dev --workspace @admin-ds/docs
```

Abra [http://localhost:6006](http://localhost:6006) no navegador. Para
interromper o servidor, pressione `Ctrl+C` no terminal.

### Aplicação de demonstração (`admin-demo`)

Inicie a aplicação Next.js de referência com:

```powershell
npm run dev --workspace @admin-ds/admin-demo
```

Abra [http://localhost:3000](http://localhost:3000) no navegador. Para
interromper o servidor, pressione `Ctrl+C` no terminal.

## Releases

Fluxo resumido:

```text
develop -> release/X.Y.Z -> PR master -> back-merge develop -> Publicar release -> vX.Y.Z + GitHub Release
```

A escolha da versão, os merges e o disparo da publicação são ações humanas. A preparação, as validações de consistência, a resolução do commit liberado, a tag anotada e a GitHub Release são automatizadas. Pull Requests em Draft não executam a CI automática de PR; a validação completa é disparada ao marcar o PR como Ready for review.

Consulte o passo a passo, regras de recuperação e configuração de branch protection em [Processo de release](docs/release-process.md).

## Documentação

- [Projeto e issues no GitHub](https://github.com/users/dvmarques/projects/2)
- [Estrutura e arquitetura do monorepo](docs/architecture.md)
- [Critérios de qualidade](docs/quality.md)
- [Acessibilidade visual dos estilos](docs/visual-accessibility.md)
- [Elevação, densidade e estados](docs/visual-polish.md)
- [Identidade visual: superfícies, espaçamento e gráficos](docs/visual-identity.md)
- [Processo de release](docs/release-process.md)
- [Integração em aplicações consumidoras](docs/integration.md)
- [Licenças e atribuições](docs/licensing.md)
- [Limitações conhecidas](docs/limitations.md)
- [Comandos úteis do OpenSpec](docs/openspec-commands.md)
- [Modelos recomendados por fase](docs/models.md)

## Recursos

- `@admin-ds/tokens`: design tokens semânticos, temas claro e escuro e CSS público.
- `@admin-ds/components`: primitivas, formulários, calendário, overlays,
  navegação (tabs, breadcrumb e accordion), apresentação de dados e o gráfico compacto `AdsSparkline`.
- `@admin-ds/admin`: shell administrativo, painéis de dashboard com sparkline opcional, filtros,
  tabela inteligente e fluxos de listagem, formulário em etapas e confirmação.
- `apps/admin-demo`: integração dos pacotes em uma aplicação Next.js.
- `apps/docs`: APIs, variantes e estados documentados no Storybook.

Os pacotes não são publicados no npm. Consulte a [integração](docs/integration.md)
e as [limitações conhecidas](docs/limitations.md) para os requisitos de consumo e
os limites de suporte. O histórico está no [changelog](CHANGELOG.md) e em
`openspec/changes/archive/`; o trabalho é acompanhado pelas issues no GitHub.

## Tecnologias

- React e TypeScript com modo estrito
- Next.js com App Router
- Tailwind CSS e variáveis CSS semânticas
- npm workspaces
- Storybook
- Vitest e React Testing Library
- Playwright
- OpenSpec
