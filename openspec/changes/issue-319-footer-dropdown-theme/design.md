# Design técnico e revisão crítica — #319

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
