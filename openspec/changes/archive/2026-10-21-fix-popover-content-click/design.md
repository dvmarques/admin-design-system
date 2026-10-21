## Context

O painel está num portal DOM, mas continua descendente React de `.ads-popover-anchor`. O handler atual alterna `open` para qualquer clique propagado. O calendário suprime a propagação para contornar isso.

## Goals / Non-Goals

Preservar abertura controlada, handlers, relação ARIA e fechamento existente. Não alterar a política de Escape compartilhada nem a identidade visual.

## Decisions

- Manter o handler no wrapper e conferir se `currentTarget.contains(target)` antes de alternar. Assim, cliques em descendentes do gatilho funcionam e eventos do portal são ignorados. Não é necessário sobrescrever/compor `onClick` do filho, evitando mudanças no contrato de componentes customizados e em `stopPropagation` do consumidor.
- Não bloquear propagação do painel: seus handlers e os de ancestrais continuam funcionando. Remover o contorno local em `DatePickerCalendar`.
- Usar testes React com estado controlado e callbacks observáveis, além do demo Next.js consumindo `dist`. Storybook demonstra edição e fechamento explícito. Testes de navegador cobrem temas claro/escuro e viewports estreita/larga sem alterar snapshots.
- Componentes continuam Client Components; nenhuma dependência de roteamento, runtime adicional, mudança de export ou impacto relevante no bundle. Tokens semânticos, classes públicas e distribuição do CSS compilado permanecem existentes; sem classes ou estilos novos que possam conflitar com consumidores.
- Acessibilidade: manter nome do diálogo, `aria-controls`, `aria-expanded`, ativação nativa por teclado e restauração de foco. Auditar o painel aberto com axe.

## Risks / Trade-offs

- Eventos de portais adicionais no conteúdo → a checagem positiva de pertencimento ao gatilho também os ignora.
- Remover o contorno do calendário → regressões verificam navegação de mês, primeira data pendente e fechamento após seleção final.
- Lint global pode incluir worktrees aninhados (#128) → registrar resultado e validar arquivos alterados, sem remover worktrees ou mudar configuração.
- Baselines são Linux → manter imagens existentes e registrar a limitação local Windows.

## Migration Plan

Sem migração de consumidores. Integrar por PR para `develop` com `Closes #126`; eventual rollback reverte o commit da correção.
