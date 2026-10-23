# Design — fluxos administrativos (#92)

## Limites Client/Server

Sem mudança: `AdsDialog`, `AdsConfirmDialog` e `AdsStepForm` continuam Client Components (`"use client"`). A marcação inicial depende só das props; nada novo acessa o DOM durante a renderização.

## AdsDialog e AdsConfirmDialog

`AdsDialogProps` passa a incluir `role?: 'dialog' | 'alertdialog'` (padrão `dialog`); `AdsDrawerProps` não o expõe. `AdsConfirmDialog` usa `role ?? (destructive ? 'alertdialog' : 'dialog')`. Como `destructive` é `true` por padrão, a confirmação padrão passa a ser `alertdialog`: o contrato atual (descrição associada, foco inicial em "Cancelar", `Escape` cancela) já atende ao padrão WAI-ARIA do alertdialog.

## AdsStepForm: navegação pelo indicador

O componente guarda internamente quais etapas passaram por `validate` (ou não têm `validate`) ao avançar ou confirmar. Um item do indicador vira `button` quando:

- a etapa está antes da atual (equivale a "Voltar", sem validar); ou
- está depois da atual e a atual e todas as intermediárias estão marcadas como válidas.

Os demais itens permanecem texto, sem interatividade. Editar um campo de uma etapa (`onChange` da seção) remove a marca dela, exigindo "Próxima" para revalidá-la. O estado ativo segue controlado pelo consumidor (`onActiveStepChange`) e o componente não guarda dados. Limitação: campos que não disparam `onChange` borbulhante não invalidam a marca.

## AdsStepForm: validação assíncrona

`validate?: () => boolean | Promise<boolean>`. Resultado síncrono é tratado de forma síncrona, preservando o comportamento atual. Para uma Promise: o formulário entra em `validating` (`aria-busy`, ações com `aria-disabled` sem perder o foco, indicador de carregamento no botão acionado) e uma região `role="status"` anuncia `labels.validating`; ao resolver, aplica o resultado como na validação síncrona. Rejeição equivale a `false` (etapa inválida) e exibe `invalidStep`. Resultados obsoletos (a etapa ativa mudou ou o componente desmontou) são descartados por token. Ações durante `validating` são ignoradas. Os campos das etapas ficam inertes (atributo `inert` definido por efeito, compatível com React 18) até a validação terminar, e um `change` na etapa durante a espera cancela a validação pendente (o resultado é descartado e a etapa não é marcada como válida). Alterações feitas por código nos valores dos campos nativos da etapa (sem evento `change`) são detectadas comparando um instantâneo dos valores no início e no fim da validação; o resultado é descartado se diferirem. Estado do consumidor sem campo nativo correspondente não é detectável: o consumidor deve evitá-lo enquanto valida (limitação registrada em `docs/limitations.md`). A revalidação após edição usa o mesmo resultado, em modo silencioso (sem carregamento e sem mover o foco).

## Acessibilidade

Os botões do indicador têm `type="button"`, nome acessível (rótulo da etapa mais estado textual), foco visível; `aria-current="step"` permanece no `li` da etapa atual.

## CSS e tokens

Apenas classes `ads-` e variáveis `--ads-*` em `packages/admin/src/styles.css`, compiladas no CSS distribuído. O botão do indicador herda fonte e cor, com `:focus-visible` pelo token de foco, e `forced-colors` usa contorno de sistema. Tailwind não é exposto.

## Alternativas

- Permitir pular para qualquer etapa: viola "apenas etapas já válidas".
- Tornar `validate` sempre assíncrona: quebra consumidores e testes síncronos.
- Propagar a rejeição ao consumidor: obriga `try/catch` em todo uso; tratar como inválida é mais seguro.

## Bundle e dependências

Sem dependências novas. Medido: `@admin-ds/admin` 186447 → 198480 bytes (+12033, com declarações e mapas) e `@admin-ds/components` 388846 → 389188 (+342). O baseline do admin foi atualizado de 170121 para 198480 (o commit base já estava 9,6% acima do baseline anterior); detalhes em `docs/bundle-baseline.md`.

## Rollback

Reverter componente, CSS, stories, testes e docs desta change em conjunto.
