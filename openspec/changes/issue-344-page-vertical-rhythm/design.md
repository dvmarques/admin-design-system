# Design

## Decisions

- Classe `ads-layout-page` em vez de alterar o padrão de `ads-layout-stack` (compatibilidade retroativa) ou impor margem ao `AdsPageHeader` (o espaçamento externo é do contêiner, não do componente).
- Variáveis `--ads-layout-page-gap` e `--ads-page-header-gap` seguem o padrão de `--ads-layout-stack-gap`, com fallback nos tokens existentes `--ads-spacing-6`/`--ads-spacing-2`; nenhum token global novo.
- O `gap-y-2` do header migra do utilitário Tailwind para `.ads-page-header` em `@layer components`, permitindo o ajuste pela variável.
- Rollback: reverter o commit.
