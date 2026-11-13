## Context

O CSS existente é distribuído em `@dvmarques/admin-ds-admin/styles.css` e consome `--ads-color-*` da biblioteca de tokens. Não existe API React para fornecer uma paleta. Os seletores e fallbacks CSS já suportam `--ads-sidebar-active-background`.

## Goals / Non-Goals

- Permitir cores isoladas por região em cada tema, com fallback dinâmico para valores globais.
- Zero alteração de cores atuais e nenhuma dependência de Tailwind no consumidor.
- Não criar palette editor, alteração de DOM/props React ou novo esquema de tokens globais.
- Preservar o comportamento móvel do Drawer e não alterar as superfícies de overlays.

## Decisions

1. **Fallback em tempo de uso**: `background: var(--ads-sidebar-background, var(--ads-color-surface-raised))`; não definir `--ads-sidebar-background: var(--ads-color-surface-raised)` nos blocos de tema, pois esse default poderia mascarar overrides em escopos aninhados.
2. **Papéis explícitos**:
   - `--ads-sidebar-background` → `--ads-color-surface-raised`
   - `--ads-sidebar-text` → `--ads-color-text`
   - `--ads-sidebar-text-muted` → `--ads-color-text-muted`
   - `--ads-sidebar-hover-background` → `--ads-color-surface-hover`
   - `--ads-sidebar-active-background` (existente) → `--ads-color-surface-selected`
   - `--ads-sidebar-active-text` → `--ads-color-on-surface-selected`
   - `--ads-sidebar-active-indicator` → `--ads-color-primary`
   - `--ads-sidebar-border` → `--ads-color-border`
   - `--ads-sidebar-header-background` → `--ads-sidebar-background` → `--ads-color-surface-raised`
   - `--ads-header-background` → `--ads-color-surface`
   - `--ads-header-text` → `--ads-color-text`
   - `--ads-header-border` → `--ads-color-border`
3. **Escopo seletivo**: aplicar cada papel no CSS de classes da região, não recolorir tokens globais da árvore inteira. Itens da navegação herdam os papéis específicos via CSS onde antes usavam global; outros componentes compostos intencionalmente mantêm seus próprios tokens.
4. **Composição**: a barra de branding recebe background da sidebar com possibilidade de override; botão flutuante do cabeçalho usa o mesmo fallback para conservar cor atual. Mobile Drawer conserva o fundo transparente do contêiner interno; avaliar explicitamente superfície do painel externo antes de adaptar a customização móvel.
5. **Resiliência**: selectors de override para temas usam `[data-theme='light']` e `[data-theme='dark']`, não `:root[data-theme]` exclusivo, para suportar portais.

## Risks / Trade-offs

- Variáveis específicas podem produzir contraste inadequado se o consumidor alterar só uma face do par; documentar responsabilidade de ajustar texto/hover/ativo e validar WCAG.
- O `AdsDrawer` tem superfície própria. `.ads-admin-shell-mobile-drawer` recebe a mesma variável opcional de fundo da sidebar (default `surface-raised` do Drawer), mantendo a navegação interna transparente. O cabeçalho móvel permanece transparente por padrão e só pinta cor própria quando o consumidor define `--ads-sidebar-header-background`. O Drawer genérico não muda.
- Componentes compostos na sidebar (switcher, botões) ainda usam tokens próprios. Não reestilizar todos por herança global nesta issue.
- Evitar especificidade e `!important` que vençam customizações externas.

## Validation

Testes de contrato estático das expressões CSS e comparação das cores computadas existentes em claro/escuro para sidebar, branding, header e estados. Testar override de token global, override isolado e cor do item ativo existente. Rodar format, lint, typecheck, testes, build, validação OpenSpec estrita e CI Linux; não atualizar baselines sem diffs revisados.
