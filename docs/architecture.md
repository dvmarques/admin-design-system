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

- `admin-demo/` é uma aplicação Next.js com App Router. Ela comprova a
  integração dos pacotes com renderização no servidor, Client Components,
  temas e CSS compilado.
- `docs/` executa o Storybook. Ele documenta componentes, variantes, estados,
  acessibilidade e temas claro e escuro.

## Bibliotecas (`packages/`)

`packages/` contém bibliotecas compartilhadas. Elas não são aplicações:
expõem APIs públicas consumidas por `apps/`. A integração por aplicações
externas está documentada em [Integração](integration.md); os pacotes não são
publicados no npm.

```text
packages/
├── tokens/      # design tokens e temas
├── components/      # componentes React reutilizáveis
├── admin/           # composições de layout administrativo
└── highlighted-code/ # realce de código opcional
```

- `tokens/` define cores, tipografia, espaçamentos, raios, sombras e
  movimentos. Ele gera variáveis CSS, metadados TypeScript e tipos públicos.
- `components/` contém componentes React genéricos, como `AdsButton`,
  `AdsInput`, `AdsCard`, `AdsDialog`, `AdsTable` e `AdsSparkline`. Os componentes usam os tokens e
  distribuem CSS compilado.
- `highlighted-code/` oferece `AdsHighlightedCodeSnippet` com realce Shiki sob demanda; é independente do pacote básico de componentes.
- `admin/` contém o layout administrativo `AdsAdminShell` e os padrões de dashboard (`AdsMetricCard`,
  `AdsDashboardGrid` e `AdsDashboardPanel`), a barra de filtros
  (`AdsFilterBar`), a tabela inteligente (`AdsSmartTable`) e os fluxos
  administrativos (`AdsListFlow`, `AdsBulkActionBar`, `AdsStepForm` e
  `AdsConfirmDialog`). Ele não inclui regras de negócio nem depende do
  roteamento do Next.js.

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

`packages/highlighted-code` é opcional e pode ser consumido de forma independente, com tokens e CSS próprios. Não é dependência de `packages/components` nem de `packages/admin`.

## Limites de responsabilidade

- `packages/tokens` mantém a fonte, geração e distribuição dos design tokens.
- `packages/components` contém componentes React reutilizáveis e seus estilos.
- `packages/admin` contém composições administrativas sem dependência de roteamento ou regras de negócio.
- `packages/highlighted-code` contém realce de código independente e opcional.
- `apps/docs` documenta e demonstra as APIs públicas dos pacotes.
- `apps/admin-demo` valida o consumo dos pacotes por uma aplicação Next.js App Router.

## APIs públicas

Consumidores devem importar apenas caminhos declarados no campo `exports` de cada pacote. Caminhos sob `src`, `scripts` e demais diretórios internos não fazem parte da API pública.

Pacotes React declaram `react` e `react-dom` como peer dependencies, evitando duplicação no bundle. Ferramentas de build, documentação, testes e Tailwind CSS permanecem como dependências de desenvolvimento até que uma necessidade de runtime seja comprovada.

## Estilos

Variáveis CSS semânticas são a API de personalização visual. Tailwind CSS é usado internamente para gerar CSS distribuível, sem exigir que aplicações consumidoras instalem ou configurem Tailwind.

## Estado e limitações conhecidas

Os pacotes distribuem tokens, componentes e composições administrativas. As
limitações atuais, incluindo cobertura de navegadores, persistência de tema,
snapshots e baseline de tamanho, estão registradas em
[Limitações conhecidas](limitations.md).

As licenças e atribuições das dependências e recursos incorporados estão em
[Licenças e atribuições](licensing.md).
