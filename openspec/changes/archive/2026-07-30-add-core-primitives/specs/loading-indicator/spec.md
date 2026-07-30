## Purpose

Comunicar estados indeterminados de espera de forma reutilizável, acessível e consistente com os temas do design system.

## ADDED Requirements

### Requirement: Indicador de carregamento indeterminado

O sistema MUST fornecer `AdsLoadingIndicator`, um indicador visual de carregamento com tamanhos documentados para representar trabalho em andamento sem progresso mensurável.

#### Scenario: Conteúdo está aguardando

- **WHEN** uma aplicação renderiza o indicador enquanto aguarda uma operação
- **THEN** a interface comunica visualmente que o trabalho está em andamento

### Requirement: Comunicação acessível do carregamento

O indicador MUST permitir texto ou semântica acessível que informe o estado de carregamento sem depender somente da animação visual.

#### Scenario: Pessoa usa tecnologia assistiva

- **WHEN** o indicador é apresentado para uma operação em andamento
- **THEN** seu estado de espera é disponibilizado de forma acessível

### Requirement: Temas, movimento e personalização

O indicador MUST responder aos tokens públicos dos dois temas e respeitar a preferência de redução de movimento quando houver animação.

#### Scenario: Pessoa prefere movimento reduzido

- **WHEN** o ambiente informa preferência por redução de movimento
- **THEN** o indicador reduz ou remove movimento não essencial sem ocultar o estado de carregamento
