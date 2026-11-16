# Design técnico e revisão crítica — #319

## Sincronização e revisão de 16/11/2026

- Incorporado `origin/develop` em `83e68698b26e032291c3b04da7c42bb987bf3f44` via merge, sem conflitos. Preservados #325 (auditoria), #329 (reconciliação), #330 (hover do Demo) e #331 (Playwright 1.65.1, workflows e lockfile). As mudanças de dependências são exclusivamente as já integradas na base.
- A revisão identificou que Tab/Shift+Tab só fechavam o menu quando o foco estava no Content portado. Após abertura por clique ou em menu sem itens habilitados, o foco fica no Trigger: fechar também nesse caminho, preservando o comportamento nativo de Tab e callbacks que previnem o evento. Cobrir os dois sentidos em testes de componente e navegador.
- Mantidos o shell compartilhado, footer condicional, mecanismos de tema/portal e APIs públicas. Sem alteração intencional de aparência ou atualização de snapshots.
- A correção acrescenta 77 bytes de JS/CSS publicado em `components` (306.728 → 306.805), excedendo o teto anterior de 306.800 em 5 bytes. Teto raw ajustado para 306.900 (+100 bytes); gzip e cenários permanecem sujeitos aos limites existentes, sem aumento preventivo.
- Inspeção axe do Demo real em 320 px identificou `scrollable-region-focusable` na tabela da consulta. Consumir a API pública existente `AdsTable.containerProps` com `role=region`, nome e `tabIndex=0` permite rolagem por teclado sem alterar o componente ou o layout. Teste E2E confirma foco nas quatro larguras e rolagem com ArrowRight a 320 px.

## Inventário verificado em develop (553461b)

- `AdsAdminShell`: `Header`, `Body`, `Sidebar`, `Main`; main com rolagem própria no desktop; modo `sidebar-header` é grid com `Body {display:contents}` e sidebar na coluna 1. Nenhum footer existe.
- `AdsDropdown`: menu portado existente; `role=menu` e `role=menuitem`; keyboard setas/Home/End já filtra `[role^=menuitem]` habilitados; Escape e clique externo já fecham, focando gatilho em Escape. Não há headers/dividers.
- `AdsThemeControl` emite preferência `light/dark/system`; `ThemeToggle` mantém toggle binário. `OverlayPortal` replica o `data-theme` ancestral e acompanha alterações por MutationObserver. O Demo resolve preferência e inicializa antes do primeiro paint; CSS ordenado tokens → components → admin. O seletor de overrides recomendado é `[data-theme]`, não `:root[data-theme]`, porque os portais vivem sob body.
- #316 (ícones agnósticos), #317 (`AdsPageHeader` sem `AdsSection`), #318 (classes `ads-layout-*`) estão integradas em develop. Não replicar seus contratos.

## Footer — decisão

| Alternativa            | Benefícios                                              | Limitações                                                            | Decisão                               |
| ---------------------- | ------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------- |
| `<footer>` puro        | API zero                                                | cada aplicação replica geometria do shell, grid, responsividade e CSS | manter como alternativa fora do shell |
| `AdsFooter` global     | possível fora do shell                                  | duplica superfície e regras sem caso demonstrado                      | não criar                             |
| `AdsAdminShell.Footer` | um slot coerente com Header/Main, só ativo quando usado | acoplado ao layout shell, intencional                                 | **criar somente este**                |

- API: `FooterProps extends HTMLAttributes<HTMLElement>` com `start?: ReactNode`, `end?: ReactNode`; `children` permanece como conteúdo livre intermediário. Renderiza `<footer>` no DOM; fragmentos start/end somente quando presentes. Sem placeholder quando Footer não foi montado.
- O footer é **filho direto de `AdsAdminShell` e irmão de `Body`**, após ele. Isso gera landmark nativa `contentinfo` fora de `main`. Não duplicar `main` ou `footer` em regiões existentes. No desktop padrão, é flex child após body; em `sidebar-header`, ocupa grid col 2 row 3, enquanto a sidebar permanece na col 1. No mobile com footer, shell se torna coluna flex preenchendo viewport; sem footer CSS anterior permanece inalterado. `main` continua rolando no desktop sem footer sobreposto ou clipping.
- Slots inicio/fim por flex-wrap e `overflow-wrap:anywhere`, tokens de superfície/borda/texto e personalização opcional `--ads-footer-background`, `--ads-footer-border`, `--ads-footer-text`; default sem alterações globais. Breakpoints existentes de 48rem e padding respeitando `env(safe-area-inset-bottom)`; sem JS.

## Dropdown — decisão

- `Header` é uma `div` não focável com texto rotulador e `id` fornecido pelo consumidor; `Divider` é `div role=separator aria-orientation=horizontal` não focável. Não criar `Group`: `<div role=group aria-labelledby=...>` nativo e `Header id` cobrem agrupamentos acessíveis, se desejado. Headers/dividers nunca têm `role^=menuitem` e a seleção de foco existente os ignora.
- Manter portal, posicionamento, z-index e gestão central de Escape existentes; corrigir Tab/Shift+Tab para fechar menu e mover foco a partir da posição lógica do gatilho no documento, porque Tab nativo a partir do portal ao final do body pode saltar a ordem esperada. Reutilizar helper interno de tab stops já presente em `overlay-utils`. Respeitar itens desabilitados e sem elegíveis, sem novo trap.

## Temas/tokens — decisão

- Não criar API de tema nova. Contrato público efetivo `data-theme=light|dark` ou ausência do atributo para `prefers-color-scheme`; `AdsThemeControl` só emite preferência e consumidor aplica, opcionalmente persiste e acompanha `matchMedia`. Com SSR, servidor escolhe fallback coerente e opcional script cedo antes da pintura; hidratação não deve inferir valor de `window` no render inicial.
- Overrides aplicados depois dos CSS de tokens via `[data-theme='light']` / `[data-theme='dark']` alcançam overlays portados (pois portal copia `data-theme`). Overrides confinados só ao estilo inline de um ancestral **não** atravessam document.body; documentar explicitamente. Não copiar a árvore de computed CSS vars para o portal nem introduzir segundo sistema de temas.
- Verificar por testes o tema local, mudança em overlay aberto e precedência de CSS. Sem ajustes nos valores de tokens de cor.

## Revisão de riscos, rollback e validação

- Alteração de layout restrita a shells com footer; `:has` já empregado no pacote; confirmar mobile, sidebar aberta/recolhida e 320/390/768/1440. Footer imprevisto ou duplicado precisa ser corrigido no consumidor por landmark de nível documento.
- Tab deve preservar sequência nativa equivalente sem prender foco; testar Shift+Tab, menu sem item elegível, Escape e SSR, portal e viewport reduzida. Caso o helper de foco seja alterado, executar regressões de overlays adjacentes.
- CSS compilado deve respeitar `@layer components`, exports e imports públicos; testes via Node/React/Playwright e builds, OpenSpec `--all --strict`. Não aprovar zoom nativo 200%, leitor de tela ou estética manual sem evidência humana. Sem snapshot automático.

## Primeira rodada de CI e controle de tamanho (PR #328)

- `Política de develop` executou OpenSpec 1.15.0 com `validate --all --strict --no-interactive`: **success** no SHA `16266a3` (validação posterior à primeira implementação; não presumir validação prévia).
- `inspect:packages` no mesmo SHA mediu **306.728 bytes** de JS/CSS publicados de `components`, diante do teto anterior de 305.200 (+1.528 bytes, aproximadamente +0,50%). O teto ajustado é 306.800 bytes com apenas 72 bytes de folga; não alterar o teto gzip ou cenários sem a próxima medição.
- E2E preexistente de `ThemeControl` espera exatamente `Preferência: system`; preservar seu contrato de texto e exibir o tema efetivo em parágrafo separado, sem mudar testes antigos.
- `prettier --check` identificou 8 arquivos de fonte/documentação para formatação; corrigir antes de alegar conformidade. Nenhuma alteração de snapshot automática.

## Segunda rodada de CI — correções da revisão

- Vitest identificou drift de snippets. Atualizar `catalog-snippets.json` com os três exemplos gerados por `scripts/catalog-snippets.mjs`.
- Demo não permite classes utilitárias de Tailwind: usar apenas classes públicas ADS e estilos de tokens inline no exemplo de tema.
- Manter o shell no topo de `/catalogo-shell/` para não alterar a geometria de navegação coberta pelo E2E; controles adicionais seguem abaixo do shell. O E2E do footer passa a acessar essa rota dedicada.
- Axe no tema escuro identificou contraste insuficiente (1,55) do link não tematizado no footer. Estilo escopado faz links herdarem a cor do footer, sem impacto global.
- Medição do gzip de `components`: 92.060 bytes, contra 92.000 anteriores; o novo teto 92.100 tem 40 bytes de folga. Restante permanece sem mudança até nova medição.

- A rodada de CI subsequente mediu o JS/CSS publicado de `admin` em **173.020 bytes**, acima de 171.400. O teto foi corrigido para **173.100 bytes** (+80 bytes de folga) sem alterar gzip ou cenários sem evidência.

- O `inspect:packages` continuou após corrigir orçamento raw de `admin`: todos os cenários anteriores passaram, e `admin-public` mediu **71.749 bytes** JS minificado (limite 71.800), **24.125 bytes** JS gzip (limite 24.200), **104.369 bytes** CSS minificado (limite anterior 103.000). Teto de CSS corrigido para **104.400** (+31 bytes de folga), sem alterar outros cenários. O teto de CSS gzip foi ajustado conservadoramente para **15.700** (+250 bytes contra limite anterior 15.450) e exige evidência da execução seguinte.

## Integração real no Admin Demo — revisão adicional

- O layout administrativo compartilhado em `apps/admin-demo/app/(admin)/layout.tsx` já utiliza `AdsAdminShell` com header, sidebar e controles de tema/conta. Não criar outro shell ou outra página administrativa.
- `DemoFooter` atua como consumidor opt-in do slot: apresenta o footer apenas na rota existente `/exemplos/composicao-semantica/consulta`. O componente ocupa o lugar exigido pelo contrato (irmão de Body); nas demais rotas não renderiza footer nem reserva espaço. A decisão evita mudanças desnecessárias nos baselines visuais de outras páginas.
- No conteúdo desta rota, preservar o link atual "Novo cadastro" e acrescentar um dropdown de navegação com `Header`, `Divider`, grupos semânticos e ações reais do Demo via Next Router.
- Os E2E de integração devem comprovar ausência do footer na visão geral, presença no fluxo de consulta, um único shell/main/sidebar, sem overflow nas quatro larguras, navegação por teclado, mudança de rota e herança de tema do portal. Não atualizar snapshots sem revisão visual.
