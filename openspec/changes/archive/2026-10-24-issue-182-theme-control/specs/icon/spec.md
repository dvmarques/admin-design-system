## ADDED Requirements

### Requirement: Ícones de modo de cor

`AdsIcon` MUST oferecer os nomes `sun`, `moon` e `monitor`, representando respectivamente os modos Claro, Escuro e Sistema, com as mesmas regras de tamanho, `currentColor` e semântica dos demais ícones.

#### Scenario: Ícones de modo de cor decorativos

- **WHEN** `AdsIcon` é renderizado com `name="sun"`, `moon` ou `monitor` sem `label`
- **THEN** o SVG é ocultado da árvore de acessibilidade e herda a cor do texto
