# Design técnico — página, cabeçalho e seções

## Auditoria e alternativas

- `AdsTypography` já usa `h1`–`h4` por padrão e aceita `as` para dissociar visual de semântico. Não o modificar.
- `AdsAdminShell.Main` é um `<main tabIndex={0}>`: `AdsPageHeader` renderiza só `<header>`, nunca outro main. Páginas sem shell criam seu próprio `<main>` único.
- `AdsCard` é `AdsSurface` autocontida com Header/Content/Actions; não virar wrapper obrigatório nem adicionar APIs CardTitle/Text/Footer.
- `AdsSurface` é `div` visual e não substitui section ou landmark. Não alterar.
- **Criar `AdsPageHeader`**: repetição de flex/reflow para texto e ações aparece em múltiplas páginas demo; uma primitiva pronta garante transbordamento controlado, alinhamento e estilos de tipografia sem conhecer aplicações. Usar `header` com `title:ReactNode` obrigatório, `description?:ReactNode`, `actions?:ReactNode` e atributos nativos de header, sem children para evitar posições ambíguas. Sem `use client`. Renderizar title em `AdsTypography` com `as='h1'`; descrição, se existir, em `AdsTypography variant='muted'` com `p`. ReactNode nesses slots deve ser conteúdo *phrasing*, não heading ou `p` aninhado; links/botões ficam em `actions`.
- **Não criar `AdsSection`**: API de id/title/actions repetiria HTML, `AdsTypography` e CSS Grid/Flex. Recomendar `<section aria-labelledby=...>` + `AdsTypography as='h2'`, com `h3/h4` conforme hierarquia.
- Não criar variante de nível do PageHeader: ele identifica a página com h1; cards podem ter heading3 visual como h2/h3 de acordo com contexto via `AdsTypography as`.
- Não impor `role=group` nem `aria-label` por padrão às ações; os próprios controles têm nomes acessíveis. `header` é cabeçalho da página dentro de main/section (sem landmark banner global duplicado quando inserido no main).
- Controlar larguras pelo flex-wrap e `min-width:0`; `overflow-wrap:anywhere` só no título/descrição, inclusive palavras longas; ações podem quebrar linhas em 320/390px e zoom 200%. Classes internas prefixadas `ads-`, tokens Tailwind internos compilados, sem exigir Tailwind consumidor. Sem cores/tokens adicionais. `className` e atributos HTML continuam customizáveis.
- Botões e links nas ações mantêm ordem DOM e foco nativo. Componente sem interatividade própria, sem estado, IDs dinâmicos ou efeitos: SSR/hidratação devem produzir markup determinístico.
- `AdsPageHeader` fica em `components` para não exigir `admin`. Exports tipados de `index.ts`, catálogo, Storybook e demo são públicos; nenhum peer adicional. O pacote recompila CSS usando `@source`.
- Três páginas demo distintas mantêm um único H1 visível por página e não geram headings duplicados por abas. Consulta: h1, ação, h2, filtros e tabela; formulário: h1, h2, validação e ações; dashboard: h1, h2, cartões apenas de indicadores e resumos. Storybook apresenta cada composição isoladamente.

## Compatibilidade, riscos e rollback

Mudança aditiva; sem modificação dos contratos públicos existentes. Risco de código consumidor injetar elementos block em title/description (documentar conteúdo textual/inline), títulos longos e largura insuficiente de botões (cobrir). Storybook em canvas isolado; screenshots novas só após revisão explícita; snapshots existentes não devem ser regravados por conveniência. Rollback remove o novo export e seu exemplo antes de publicar, sem mexer no comportamento legado.

## Validação

`openspec validate --all --strict --no-interactive`, `npm run format`, `lint`, `build`, `typecheck`, `test:quality`, `test:e2e`, testes unitários SSR e acessibilidade, Playwright 320/390/768/desktop, themes e zoom 200% (zoom real separado da aproximação por viewport), inspeção de screenshots/regressão, CI, Security e Pages no SHA da PR. Se o checkout local/CLI não estiver disponível, registrar claramente e não substituir CI por alegação de teste local.
