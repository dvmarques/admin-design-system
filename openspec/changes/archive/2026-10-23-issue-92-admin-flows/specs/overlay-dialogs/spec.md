# Delta de especificação: overlay-dialogs

## ADDED Requirements

### Requirement: Papel configurável do diálogo

`AdsDialog` MUST aceitar `role` com `dialog` (padrão) ou `alertdialog` e MUST aplicá-lo ao painel modal, preservando `aria-modal`, nome e descrição acessíveis, foco e fechamento. `AdsDrawer` MUST manter `role="dialog"`.

#### Scenario: Papel padrão

- **WHEN** `AdsDialog` abre sem `role`
- **THEN** o painel tem `role="dialog"`

#### Scenario: Alertdialog

- **WHEN** `AdsDialog` abre com `role="alertdialog"`
- **THEN** o painel tem `role="alertdialog"`, `aria-modal="true"` e o mesmo nome e descrição acessíveis
