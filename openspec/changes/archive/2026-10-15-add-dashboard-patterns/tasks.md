## 1. Contratos públicos

- [x] 1.1 Definir a API de `AdsMetricCard`, `AdsDashboardGrid` e `AdsDashboardPanel` e exportá-la em `@admin-ds/admin`.
- [x] 1.2 Confirmar que nenhuma dependência de runtime é adicionada e que `@admin-ds/components` segue como peer dependency.

## 2. Implementação

- [x] 2.1 Implementar `AdsMetricCard` com tendência por ícone e texto, `sentiment`, progresso opcional e estados.
- [x] 2.2 Implementar `AdsDashboardGrid` e `AdsDashboardPanel` com `span`, heading configurável e estados de carregamento, erro e vazio.
- [x] 2.3 Adicionar CSS próprio sem Tailwind, com tokens `--ads-*`, temas claro/escuro e reduced motion.

## 3. Documentação

- [x] 3.1 Criar a story `Layout/Dashboard` no Storybook.
- [x] 3.2 Atualizar `docs/integration.md`, `docs/limitations.md`, `docs/architecture.md` e `README.md`.

## 4. Testes e validação

- [x] 4.1 Testes de comportamento: valores, tendência, `span`, headings e estados.
- [x] 4.2 Testes de acessibilidade com axe e verificação de pacote/CSS.
- [x] 4.3 Executar format, lint, build, typecheck, testes, E2E e `openspec validate --all --strict`.
- [x] 4.4 Registrar que os snapshots visuais só têm baseline win32: no Linux (Chromium do Playwright, sem baseline) 7 testes de snapshot falharam por ausência de baseline linux e os 85 demais passaram; nenhum snapshot foi aceito ou criado. No Windows, o E2E completo com os baselines win32 passou (92 de 92), sem regerar baselines.
- [x] 4.5 Revisar o diff, confirmar o escopo da Issue #60 e arquivar a change.
