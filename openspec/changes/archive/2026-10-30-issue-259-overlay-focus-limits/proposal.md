## Why

Issue #259 reúne três pendências conhecidas do ciclo de Tab e do foco inicial dos overlays modais (`AdsDialog`, `AdsDrawer` e `AdsConfirmDialog`), deixadas fora da #234 e registradas em `docs/limitations.md`:

1. **Grupos de rádio:** o ciclo trata cada `input[type=radio]` como uma parada, mas o navegador trata o grupo como uma só (o marcado; sem marcado, o primeiro no Tab e o último no Shift+Tab). Com um grupo numa ponta, um Tab sai brevemente do modal antes de voltar. Um `iframe` na ponta transfere o foco para dentro dele.
2. **Foco inicial sob StrictMode:** em `useOverlayFocus`, `previousOpen` só é atualizado em efeito passivo; no re-run de efeitos do StrictMode o layout effect vê `previousOpen=true` e não foca, e o cleanup já cancelou o timer. Um modal montado com `open={true}` fica com `document.activeElement` no `body`.
3. **`tabindex` positivo:** reordena a tabulação nativa, mas as pontas do ciclo são decididas pela ordem do documento; o foco pode saltar controles ou escapar.

## What Changes

- Reduzir cada grupo de rádio a uma parada por direção no cálculo das pontas do ciclo (marcado; senão primeiro em Tab, último em Shift+Tab), considerando `name` e formulário associado.
- Ordenar os candidatos pela ordem real de tabulação (`tabindex` positivo em ordem crescente, depois os demais em ordem de documento), tornando **suportado** o `tabindex` positivo no interior do modal.
- Corrigir o foco inicial com `open` inicial `true` em StrictMode, sem mudar a API pública.
- Manter `iframe` como limitação **documentada**: o foco passa a outro documento e o ciclo não pode interceptá-lo; excluir o `iframe` do ciclo o tornaria inalcançável por teclado, regressão pior que a limitação.
- Testes unitários (JSDOM) e testes reais de teclado em Chromium; atualizar `docs/limitations.md`, `docs/integration.md` e CHANGELOG.
- Decisão explícita de orçamento: medir o custo e elevar somente ao valor medido mais folga mínima, justificando na PR (sujeito à aprovação na revisão humana).

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `overlay-dialogs`: pontas do ciclo de Tab seguem a ordem real de tabulação e tratam grupos de rádio como uma parada; foco inicial com `open` inicial verdadeiro em StrictMode.

## Impact

Perfil **Critical** (acessibilidade transversal e foco de APIs públicas), embora o diff seja pequeno. Pacote `@admin-ds/components`: `overlay-utils.tsx` (`useOverlayFocus`, helpers internos); consumidor `@admin-ds/admin`: `AdsConfirmDialog`. Sem nova prop, token, export, dependência ou mudança de hierarquia de overlays; sem mudança de CSS.

Limites: não alterar Escape, retorno de foco, `pending`, popups descendentes nem inércia do fundo. Compatibilidade: o ciclo só muda onde antes divergia do navegador (rádio, `tabindex` positivo) ou deixava o modal sem foco (StrictMode).

Referências: [issue #259](https://github.com/dvmarques/admin-design-system/issues/259), #234 e PR #253.
