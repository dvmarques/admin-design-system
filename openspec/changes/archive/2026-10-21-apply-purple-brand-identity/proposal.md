# Proposal

## Why

O projeto não tinha logotipo próprio: o demo usava um favicon azul genérico e o
README e o Storybook não exibiam marca. A PR #154 introduz o símbolo "A" em roxo
profundo com recorte lilás. Como a marca é parte da identidade visual, a mudança
precisa de especificação, e a publicação no GitHub Pages (subcaminho
`/admin-design-system/`) exige que o logotipo e os favicons resolvam fora da
raiz do domínio.

A paleta do logotipo (roxo e lilás) é intencionalmente independente da escala
`brand*` dos tokens, que permanece azul. A interface não muda de cor.

## What Changes

**Ativos de marca (`assets/brand`)**

- `admin-ds-logo.svg`: símbolo completo, fonte da marca.
- `admin-ds-logo.png`: 512×512 com fundo transparente, gerado a partir do SVG.
- `admin-ds-mark.svg`: só o "A", sem fundo, para superfícies escuras.
- `admin-ds-favicon.svg`: variante chapada para tamanhos pequenos.
- `admin-ds-logo-lockup.svg` e `admin-ds-logo-lockup-dark.svg`: símbolo com o
  nome, para fundos claros e escuros, com o texto convertido em curvas.

**Aplicações de demonstração e documentação**

- Admin demo: logotipo no cabeçalho do shell e favicon da marca.
- Storybook: favicon da marca no manager e no iframe de preview.
- README: lockup com variante para o tema escuro.
- `docs/visual-identity.md`: seção "Logotipo" com os arquivos e seus usos.
- GitHub Pages: logotipo e favicons resolvem sob o subcaminho do repositório.

**Biblioteca reutilizável**

- Nenhuma mudança em `packages/tokens`, `packages/components` ou `packages/admin`.

## Objetivos e fora do escopo

Objetivo: dar ao projeto uma marca consistente em README, demo, Storybook e
Pages, sem alterar tokens, componentes ou a paleta da interface.

Fora do escopo: trocar a escala `brand*` ou a cor primária da interface;
alterar a Inter, os temas ou os componentes existentes; imagem de social preview
do repositório (configuração manual em Settings → General do GitHub); exportar
o logotipo como componente React ou pelos `exports` dos pacotes.

## Capabilities

### New Capabilities

- `brand-identity`: arquivos oficiais do logotipo, variantes por uso e
  acessibilidade da marca.

### Modified Capabilities

- `admin-demo-application`: o cabeçalho do demo exibe a marca.
- `site-publishing`: logotipo e favicons resolvem sob o subcaminho do Pages.

## Impact

- **Pacotes e APIs públicas**: `@admin-ds/tokens`, `@admin-ds/components` e
  `@admin-ds/admin` não mudam. Nenhum export, tipo, classe `ads-*` ou variável
  `--ads-*` é criado ou alterado; compatibilidade retroativa preservada.
- **Aplicações**: `apps/admin-demo` (cabeçalho, favicon, `NEXT_PUBLIC_BASE_PATH`
  no export do Pages) e `apps/docs` (favicon do Storybook).
- **Dependências**: nenhuma.
- **Testes**: snapshots visuais Linux do Chromium regenerados pelo workflow
  oficial; testes novos em `e2e/smoke.spec.ts` e `e2e-pages/pages-site.spec.ts`.
- **Acessibilidade**: o logotipo do cabeçalho é decorativo (`alt=""`); o nome
  acessível continua sendo o texto "Admin Design System" ao lado dele.
