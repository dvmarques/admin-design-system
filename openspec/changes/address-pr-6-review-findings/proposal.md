## Why

Os comentários da PR #6 identificaram que overlays ancorados usam a camada de
notificações e que o novo estado de superfície selecionada não tem um token de
conteúdo pareado. Corrigir esses contratos agora preserva a previsibilidade de
empilhamento e a personalização acessível pelos consumidores.

## What Changes

- Incluir um token semântico público para o conteúdo sobre superfície selecionada
  nos temas claro e escuro e aplicá-lo a `AdsNav` e `AdsTabs`.
- Posicionar `AdsTooltip` e `AdsPopover` abaixo dos toasts e acima de conteúdo
  comum por meio da camada de overlay.
- Remover o artefato local `debug.log` do controle de versão e evitar sua
  reincidência pelo `.gitignore`.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `design-tokens`: parear o papel de superfície selecionada com um papel de
  conteúdo personalizável.
- `anchored-overlays`: definir a camada de overlays ancorados em relação a
  notificações.

## Impact

- Pacotes afetados: `@admin-ds/tokens` e `@admin-ds/components`.
- APIs públicas adicionadas: `--ads-color-on-surface-selected` e os metadados
  TypeScript equivalentes.
- Sem dependências novas ou alterações no admin-demo.
