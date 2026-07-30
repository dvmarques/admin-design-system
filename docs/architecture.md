# Arquitetura do monorepo

O repositório é um monorepo: bibliotecas reutilizáveis e aplicações que as
consomem convivem no mesmo projeto. Isso permite validar o design system
da mesma forma que uma aplicação externa o utilizaria.

```text
apps/
packages/
```

## Aplicações (`apps/`)

`apps/` contém aplicações executáveis. Elas consomem os pacotes públicos
do design system e não devem depender de arquivos internos das bibliotecas.

```text
apps/
├── admin-demo/  # aplicação Next.js de referência
└── docs/        # catálogo e documentação visual no Storybook
```

- `admin-demo/` será uma aplicação Next.js com App Router. Ela comprova a
  integração dos pacotes com renderização no servidor, Client Components,
  temas e CSS compilado.
- `docs/` será o Storybook. Ele documenta componentes, variantes, estados,
  acessibilidade e temas claro e escuro.

## Bibliotecas (`packages/`)

`packages/` contém bibliotecas compartilhadas. Elas não são aplicações:
devem ser importadas por `apps/` e, futuramente, por projetos externos.

```text
packages/
├── tokens/      # design tokens e temas
├── components/  # componentes React reutilizáveis
└── admin/       # composições de layout administrativo
```

- `tokens/` define cores, tipografia, espaçamentos, raios, sombras e
  movimentos. Ele gera variáveis CSS, metadados TypeScript e tipos públicos.
- `components/` contém componentes React genéricos, como os futuros Button,
  Input, Card, Modal, Table e Sidebar. Os componentes usam os tokens e
  distribuem CSS compilado.
- `admin/` contém composições administrativas reutilizáveis, como AdminShell,
  SidebarLayout, PageHeader e DashboardLayout. Ele não inclui regras de
  negócio nem depende do roteamento do Next.js.

## Relação entre os diretórios

```text
packages/tokens
        ↓
packages/components
        ↓
packages/admin
        ↓
apps/admin-demo e apps/docs
```

## Limites de responsabilidade

- `packages/tokens` mantém a fonte, geração e distribuição dos design tokens.
- `packages/components` contém componentes React reutilizáveis e seus estilos.
- `packages/admin` conterá composições administrativas sem dependência de roteamento ou regras de negócio.
- `apps/docs` documenta e demonstra as APIs públicas dos pacotes.
- `apps/admin-demo` valida o consumo dos pacotes por uma aplicação Next.js App Router.

## APIs públicas

Consumidores devem importar apenas caminhos declarados no campo `exports` de cada pacote. Caminhos sob `src`, `scripts` e demais diretórios internos não fazem parte da API pública.

Pacotes React declaram `react` e `react-dom` como peer dependencies, evitando duplicação no bundle. Ferramentas de build, documentação, testes e Tailwind CSS permanecem como dependências de desenvolvimento até que uma necessidade de runtime seja comprovada.

## Estilos

Variáveis CSS semânticas serão a API de personalização visual. Tailwind CSS será usado internamente para gerar CSS distribuível, sem exigir que aplicações consumidoras instalem ou configurem Tailwind.
