## ADDED Requirements

### Requirement: Armadilha de Tab usa elegibilidade consistente com o foco inicial

Em `AdsDialog` e `AdsDrawer`, incluindo o `AdsConfirmDialog` que os compõe, o sistema MUST determinar o primeiro e o último destino da navegação por Tab usando o mesmo critério de elegibilidade de foco inicial. Controles desabilitados, incluindo por `fieldset disabled`, ocultos e inertes MUST NOT atuar como pontos de virada do ciclo.

#### Scenario: Tab avança com controle inelegível no início

- **WHEN** um modal aberto contém um controle inelegível antes do primeiro controle elegível e o usuário usa Tab no último controle elegível
- **THEN** o foco retorna ao primeiro controle elegível e não fica parado, não vai ao controle inelegível nem escapa ao fundo

#### Scenario: Shift+Tab retorna com controle inelegível no fim

- **WHEN** um modal aberto contém controles inelegíveis depois do último elegível e o usuário usa Shift+Tab no primeiro elegível
- **THEN** o foco chega ao último elegível e não vai ao controle inelegível nem ao fundo

#### Scenario: Nenhum candidato elegível

- **WHEN** um modal não contém controles elegíveis e o usuário pressiona Tab ou Shift+Tab
- **THEN** o contêiner do modal permanece como fallback seguro de foco, sem liberar navegação ao fundo

#### Scenario: Popup descendente e retorno de foco

- **WHEN** um popup portalled descendente do modal está interativo ou o modal fecha
- **THEN** o ciclo do modal não interrompe o popup e os contratos existentes de retorno de foco, Escape e camadas continuam válidos

#### Scenario: Temas, dispositivos e renderização

- **WHEN** os overlays são usados nos temas claro/escuro, em viewport estreita ou em página Next.js hidratada
- **THEN** a regra de foco e os indicadores acessíveis mantêm-se sem divergência de hidratação
