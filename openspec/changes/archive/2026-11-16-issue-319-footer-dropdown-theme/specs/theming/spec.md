## ADDED Requirements

### Requirement: Contrato de tema sem sistema paralelo

O ADS MUST documentar e preservar um único contrato de tema efetivo `data-theme` e tokens semânticos existentes; `AdsThemeControl` MUST continuar a emitir apenas a preferência claro, escuro ou sistema, sem impor persistência ou gerenciamento global.

#### Scenario: Preferência sistema e SSR

- **WHEN** um consumidor escolhe `system` ou renderiza HTML no servidor antes de descobrir a preferência do sistema operacional
- **THEN** pode resolver o tema com o CSS público e inicializar um fallback determinístico sem divergência React, adotando um script opcional antes da primeira pintura para reduzir flash visual

#### Scenario: Tokens personalizados e overlays portados

- **WHEN** o consumidor importa tokens antes dos estilos de componentes e substitui tokens depois usando seletores `[data-theme]`
- **THEN** shell, dropdown e overlays portados usam o tema efetivo, respeitam precedência de CSS e continuam atualizando quando a origem troca tema

#### Scenario: Sem regressão visual

- **WHEN** nenhuma personalização nova é usada
- **THEN** as cores, fontes, tokens, opções do ThemeToggle e ThemeControl e demais valores padrão permanecem os mesmos
