## ADDED Requirements

### Requirement: Hierarquia tátil de variantes

`AdsButton` MUST diferenciar as variantes por hierarquia visual e MUST comunicar hover, foco, pressionamento, carregamento e indisponibilidade por contraste, forma e feedback de movimento não essencial nos dois temas.

#### Scenario: Pessoa interage com uma ação secundária

- **WHEN** uma pessoa aponta, focaliza ou pressiona um botão secundário habilitado
- **THEN** a mudança de estado é perceptível, mantém contraste acessível e não altera a operação nativa do botão

### Requirement: Foco e hover respeitam a hierarquia de ação

AdsButton MUST usar papéis semânticos de hover e foco que preservem a distinção entre ações primária, secundária, discreta e destrutiva. O foco visível MUST permanecer externo ao limite do botão e o estado de carregamento MUST manter a largura da ação.

#### Scenario: Ação destrutiva recebe foco

- **WHEN** uma pessoa focaliza pelo teclado uma ação destrutiva habilitada
- **THEN** o foco é perceptível sem confundir a ação com uma variante primária e o rótulo não sofre deslocamento ao iniciar o carregamento
