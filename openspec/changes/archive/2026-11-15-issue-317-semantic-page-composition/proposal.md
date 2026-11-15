# Composição semântica de páginas administrativas (#317)

## Why

Páginas de consulta, formulário e dashboard usam composições próprias de cabeçalho e seções. O ADS já possui `AdsTypography` com headings semânticos e `as`, além de `AdsSurface` e `AdsCard`, mas ainda não ensina um contrato consistente de página e ações responsivas. A ausência de um padrão induz a envolver toda página em card.

## What Changes

- Adotar um padrão documental `main > header (h1, descrição, ações) + section (h2, subseções h3/h4)`, com headings verdadeiros, sem redundância de landmarks.
- Adicionar **somente** `AdsPageHeader` em `@dvmarques/admin-ds-components`: composição leve, sem estado, com título, descrição e ações opcionais em ReactNode, aproveitando `AdsTypography` e o CSS compilado/tokenizado. O componente traz valor por centralizar reflow/spacing acessíveis que se repetem nas telas existentes.
- **Não** criar `AdsSection`: HTML `<section>` com `AdsTypography`, Grid/Flex e `AdsSurface` quando necessário já representa a semântica sem wrappers redundantes.
- Documentar e demonstrar três cenários independentes (consulta, formulário validado e dashboard) no Admin Demo e Storybook; adicionar o novo export ao catálogo rastreado.
- Testar SSR/hidratação e acessibilidade/keyboard/temas/larguras, preserving snapshots existentes salvo alteração intencional e inspecionada.

## Perfil, pacotes e impacto

**Critical**: novo export/API e CSS publicado afetam o pacote `packages/components`, a aplicação Next.js `apps/admin-demo`, o Storybook `apps/docs`, testes E2E, documentação, changelog e OpenSpec. `packages/admin` permanece intacto; apps consumidoras podem instalar apenas `components` (junto de `tokens`). API aditiva, sem migração; nenhum pacote ou ícone obrigatório novo.

## Fora do escopo

Reestruturar páginas existentes, mudar `AdsCard`/`AdsSurface`/`AdsAdminShell`, criar framework, roteamento, breadcrumbs, autenticação, lógica de backend, novo layout primitive (#318), redesenho global, alterações de tokens, merge ou archive.
