# Spec Delta

## ADDED Requirements

### Requirement: Legenda alinhada ao conteúdo da tabela

Dentro do contêiner da `AdsSmartTable`, a legenda visível MUST ter espaçamento horizontal igual ao das células e espaçamento vertical da densidade, e MUST NOT encostar na borda do contêiner. A legenda oculta (`hideCaption`) MUST continuar oculta visualmente e presente no DOM como nome acessível da região. `AdsTable` usada isoladamente MUST NOT mudar.

#### Scenario: Legenda visível

- **WHEN** `AdsSmartTable` é renderizada com `caption` e sem `hideCaption`
- **THEN** o texto da legenda começa alinhado ao texto das células da primeira coluna, com espaço acima, e não encosta na borda do contêiner

#### Scenario: Legenda oculta

- **WHEN** `AdsSmartTable` é renderizada com `hideCaption`
- **THEN** a legenda não ocupa espaço visível e a região rolável mantém a legenda como nome acessível

#### Scenario: AdsTable isolada

- **WHEN** `AdsTable` é usada diretamente, com `AdsTableCaption`
- **THEN** a marcação e o espaçamento da legenda não mudam
