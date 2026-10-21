# Tasks

## 1. Ativos de marca

- [x] 1.1 Manter `assets/brand/admin-ds-logo.svg` como fonte do desenho, sem emenda visível entre branco e lilás, com IDs únicos e `<desc>` correto; verificar o render em 512px e em 16/32px.
- [x] 1.2 Gerar `assets/brand/admin-ds-logo.png` (512×512, transparente) a partir do SVG; verificar que o desenho é o mesmo do SVG.
- [x] 1.3 Adicionar `admin-ds-mark.svg`, `admin-ds-favicon.svg` e os lockups claro e escuro; verificar o render sobre fundo claro e escuro.

## 2. Aplicação da marca

- [x] 2.1 Exibir o logotipo no cabeçalho do admin demo (decorativo, `alt=""`) e usar o favicon da marca em `apps/admin-demo/app/icon.svg`.
- [x] 2.1b Em telas de até 30rem, ocultar visualmente o título do cabeçalho do demo, mantendo-o acessível; verificar que o cabeçalho não passa de 64px em 390px (`e2e/smoke.spec.ts`).
- [x] 2.2 Usar o favicon da marca no manager e no iframe do Storybook, com `href` relativo ao documento.
- [x] 2.3 Exibir o lockup no README, com variante para o tema escuro.
- [x] 2.4 Documentar os arquivos do logotipo em `docs/visual-identity.md`.

## 3. Publicação sob subcaminho

- [x] 3.1 Expor `NEXT_PUBLIC_BASE_PATH` apenas no export do Pages e montar o `src` do logotipo do cabeçalho com ele; verificar que `next dev/start` seguem sem prefixo.
- [x] 3.2 Cobrir em `e2e-pages/pages-site.spec.ts` o logotipo do cabeçalho e os favicons do manager e do iframe sob `/admin-design-system/storybook/`; verificar que passam sobre o build do Pages.
- [x] 3.3 Cobrir em `e2e/smoke.spec.ts` o carregamento do logotipo no demo local.

## 4. Validação final

- [x] 4.1 Regenerar os baselines visuais Linux do Chromium pelo workflow `update-visual-baselines.yml` e revisar o diff do cabeçalho nos dois temas.
- [x] 4.2 Executar `npm run lint`, `npm run build`, `npm run typecheck` e `npm run test:quiet`; verificar que passam.
- [x] 4.3 Confirmar a CI verde (Chromium, Firefox, WebKit) no head da PR.
- [x] 4.4 Conferir o logotipo e o favicon em um navegador real; confirmado visualmente pelo autor da PR após a publicação.
- [x] 4.5 Confirmar o favicon e o logotipo no GitHub Pages depois da publicação a partir de `develop`; confirmado pelo autor da PR.
- [x] 4.6 Executar `npm run format` e `openspec validate --all --strict`; verificar que passam.
