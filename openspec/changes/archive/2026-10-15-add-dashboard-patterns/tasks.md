## 1. Contratos públicos

- [x] 1.1 Definir a API de `AdsMetricCard`, `AdsDashboardGrid` e `AdsDashboardPanel` e exportá-la em `@admin-ds/admin`.
- [x] 1.2 Confirmar que nenhuma dependência de runtime é adicionada e que `@admin-ds/components` segue como peer dependency.

## 2. Implementação

- [x] 2.1 Implementar `AdsMetricCard` com tendência por ícone e texto, `sentiment`, progresso opcional e estados.
- [x] 2.2 Implementar `AdsDashboardGrid` e `AdsDashboardPanel` com `span`, heading configurável e estados de carregamento, erro e vazio.
- [x] 2.3 Adicionar CSS próprio sem Tailwind, com tokens `--ads-*`, temas claro/escuro e colunas do grid por container query.

## 3. Documentação

- [x] 3.1 Criar a story `Layout/Dashboard` no Storybook.
- [x] 3.2 Atualizar `docs/integration.md`, `docs/limitations.md`, `docs/architecture.md` e `README.md`.

## 4. Testes e validação

- [x] 4.1 Testes de comportamento: valores, tendência, `span`, headings e estados.
- [x] 4.2 Testes de acessibilidade com axe e verificação de pacote/CSS.
- [x] 4.3 Testar a renderização no servidor e a hidratação sem avisos, inclusive com conteúdo em bloco em `error`.
- [x] 4.4 Atualizar o baseline de bundle do admin em `docs/bundle-baseline.json`, com o motivo em `docs/bundle-baseline.md`.
- [x] 4.5 Executar format, lint, build, typecheck, testes, `inspect:packages`, E2E com snapshots win32 e `openspec validate --all --strict`.
