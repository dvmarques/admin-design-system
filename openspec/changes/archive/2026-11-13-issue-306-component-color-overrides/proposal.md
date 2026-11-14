## Why

Issue: [#306](https://github.com/dvmarques/admin-design-system/issues/306).

As aplicações consumidoras precisam usar cores próprias no menu lateral e no header sem alterar os tokens globais e sem recompilar o design system. Hoje, CSS do Admin Shell acopla sidebar/header a tokens de superfícies globais; apenas o fundo do item ativo já tem override específico.

## What Changes

- Tornar públicos os papéis CSS da sidebar (background, texto, texto atenuado, hover, ativo, indicador, borda, cabeçalho) e do header principal.
- Cada papel segue o token global existente por fallback nativo via `var()` quando não há customização; nenhum token específico recebe valor padrão fixo.
- Preservar `--ads-sidebar-active-background` existente e os overrides do demo.
- Documentar e demonstrar a separação das cores por tema, sem interferir nos componentes fora dessas regiões.
- Testar regressão visual e contratos de CSS, inclusive desktop, colapso e drawer móvel.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `admin-shell-layout`: customização opcional de cor por região, com compatibilidade visual e semântica.

## Impact

`packages/admin/src/styles.css`, testes do pacote admin e E2E, `docs/integration.md`, Storybook e documentação específica. Sem mudança de DOM, API React, dependências, tokens globais ou build de tokens.

## Compatibility

Perfil Critical: alteração no CSS público de pacote npm. **Nenhuma alteração cromática no padrão**, em tema claro/escuro, preferência do sistema ou contraste aumentado. Se um token global do consumidor mudar, o componente o acompanha enquanto não houver override específico. Rollback por reversão da PR; não alterar snapshots/baselines para esconder diferenças.
