## Why

Issue #234: o foco inicial de `AdsDialog`, `AdsDrawer` e `AdsConfirmDialog` já ignora candidatos inelegíveis, mas o ciclo de Tab/Shift+Tab em `useOverlayFocus` usa a lista bruta de `focusableSelector`. Se o primeiro ou último candidato estiver desabilitado por `fieldset`, oculto ou sob `inert`, o foco pode estacionar ou não completar o ciclo. A falha **foi reproduzida** (JSDOM e Chromium real, ver "Resultado da reprodução"); a primeira entrega foi o teste que a confirmou, antes de qualquer mudança no runtime.

## What Changes

- Criar testes de regressão para as duas direções de Tab, em diálogo, drawer e composição `AdsConfirmDialog`, com elementos inelegíveis nas extremidades; confirmar resultado em navegador real.
- Caso o bug seja reproduzido, consolidar seleção e filtro de candidatos num helper interno compartilhado por foco inicial e trap de Tab, sem mudar API pública nem o comportamento de Escape/retorno de foco.
- Descrever a regra observável de navegação e documentar a evidência; se a hipótese for descartada, revisar a proposta e a issue antes de qualquer alteração no runtime.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `overlay-dialogs`: somente controles elegíveis participam do ciclo de Tab.

## Impact

Perfil **Critical** (acessibilidade transversal e foco em APIs públicas), apesar do diff esperado ser pequeno. Pacote `@admin-ds/components`: `overlay-utils.tsx`; consumidor `@admin-ds/admin`: `AdsConfirmDialog`; testes, Storybook/Admin Demo e docs somente onde a regra observável exigir. Sem nova prop, token, dependência ou mudança de hierarquia de overlays.

Limites: não alterar a seleção de foco de popovers descendentes, retorno de foco, `pending`, `Escape` em camadas, `role`, API pública nem o conteúdo de outras issues. Preservar orçamento JS/CSS publicado (baseline atual do orçamento `@admin-ds/components`: 226.000 B / 68.500 B gzip); medir e justificar qualquer delta.

Referências: [issue #234](https://github.com/dvmarques/admin-design-system/issues/234), #192 e PR #229.

## Resultado da reprodução (Apply)

A hipótese **foi reproduzida** antes de qualquer alteração de runtime, em JSDOM (45 de 48 casos falharam no runtime original) e no Chromium real do Admin Demo: com `fieldset disabled` na ponta, Tab no último controle elegível e Shift+Tab no primeiro deixavam o foco fora da camada (`document.activeElement` fora do diálogo). Após a correção os mesmos testes passam. Detalhes e limites em `design.md`.
