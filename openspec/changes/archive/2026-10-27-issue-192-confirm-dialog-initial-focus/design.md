## Contexto

`useOverlayFocus` focava `container.querySelector(focusableSelector)`. O seletor exclui `disabled` no próprio elemento, mas não `fieldset` desabilitado, `hidden`, `display: none`, `visibility: hidden` nem `inert`; o foco falhava silenciosamente e ficava no contêiner, contradizendo a regra descrita.

## Decisões

- **Preservar a regra atual** (decisão aprovada na issue): primeiro controle elegível de `children`; sem ele, "Cancelar", que é o primeiro botão elegível do contêiner.
- **Filtro de elegibilidade só no foco inicial** (`isInitialFocusEligible`): `:disabled` (cobre `fieldset`), ancestral `[inert]`, `visibility` computada e `hidden`/`display: none` do elemento aos ancestrais até o contêiner.
- **Sem nova prop** de foco e sem alterar a navegação por Tab.

## Alternativas

Forçar "Cancelar" sempre (rejeitado pela decisão aprovada); tratar a elegibilidade só em `AdsConfirmDialog` (a escolha do foco vive em `useOverlayFocus`).
