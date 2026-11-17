## ADDED Requirements

### Requirement: Atalhos de exemplos no Catálogo

O Catálogo MUST apresentar os quatro atalhos administrativos como lista navegável sem marcadores ou recuo nativo, com separação uniforme e quebra responsiva.

#### Scenario: Navegação por teclado em viewport estreita

- **WHEN** a pessoa percorre os atalhos por teclado em largura de celular
- **THEN** todos mantêm ordem, foco visível e destinos funcionais, sem colisão ou overflow

### Requirement: Contraste em demonstração de tema aninhado

O exemplo de tema aninhado MUST manter o texto legível no tema efetivo da demonstração, independentemente do tema externo do Catálogo.

#### Scenario: Tema claro dentro do Catálogo escuro

- **WHEN** a demonstração usa tema claro e o Catálogo usa tema escuro
- **THEN** o texto e a superfície da demonstração mantêm contraste adequado
