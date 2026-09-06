## ADDED Requirements

### Requirement: Feedback visual refinado dos campos textuais

`AdsInput`, `AdsTextarea` e `AdsSelect` MUST diferenciar estados vazio, preenchido, foco, inválido, sucesso, somente leitura e desabilitado por tokens semânticos, sem comprometer o comportamento nativo.

#### Scenario: Campo inválido recebe foco

- **WHEN** uma pessoa focaliza pelo teclado um controle textual inválido
- **THEN** foco e erro permanecem simultaneamente distinguíveis nos temas claro e escuro

### Requirement: Somente leitura é distinguível de indisponibilidade

AdsInput, AdsTextarea e AdsSelect MUST comunicar visualmente somente leitura de forma distinta de indisponibilidade, preservando a legibilidade e o comportamento nativo aplicável. Estados de hover e foco MUST ser perceptíveis apenas quando a interação for permitida.

#### Scenario: Valor somente leitura é exibido

- **WHEN** uma aplicação renderiza um controle textual somente leitura ao lado de um controle desabilitado
- **THEN** ambos são distinguíveis visualmente e o valor somente leitura continua legível para cópia ou seleção quando o elemento nativo permitir
