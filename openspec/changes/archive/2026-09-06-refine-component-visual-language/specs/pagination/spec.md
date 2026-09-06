## ADDED Requirements

### Requirement: Paginação com página atual evidente

`AdsPagination` MUST distinguir página atual, páginas disponíveis, controles de avanço e controles indisponíveis mantendo alvos de interação e foco visível em layouts estreitos.

#### Scenario: Página atual é exibida entre controles

- **WHEN** uma aplicação renderiza paginação com múltiplas páginas
- **THEN** a página atual é identificável sem depender apenas de cor e os demais controles continuam operáveis por teclado

### Requirement: Paginação preserva estabilidade em largura reduzida

AdsPagination MUST usar métricas numéricas estáveis quando aplicável e MUST manter página atual, foco e controles de avanço distinguíveis em largura reduzida. Quando o conjunto não couber, o componente MUST adotar rolagem horizontal ou quebra controlada sem ocultar ações operáveis.

#### Scenario: Paginação excede o contêiner compacto

- **WHEN** a paginação possui mais controles do que a largura disponível comporta
- **THEN** a pessoa consegue alcançar controles adicionais sem sobreposição, truncamento de controles ou perda da identificação da página atual
