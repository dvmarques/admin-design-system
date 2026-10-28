# AdsAlert — requisitos

## ADDED Requirements

### Requirement: Feedback persistente inline
O sistema SHALL disponibilizar `AdsAlert` inline, sem portal e sem timeout, com variante info, success, warning ou error, e apresentação compact ou callout.

#### Scenario: Feedback de operação
- **WHEN** o consumidor renderiza um alerta de sucesso
- **THEN** título e conteúdo são apresentados no fluxo normal e permanecem até o consumidor removê-los ou o usuário fechá-los

### Requirement: Controle e composição
O sistema SHALL aceitar título opcional, conteúdo e ações arbitrários, ícone padrão substituível ou ocultável, e fechamento opcional controlado ou não controlado.

#### Scenario: Fechar alerta não controlado
- **WHEN** o usuário ativa o botão de fechar com teclado
- **THEN** o alerta deixa de ser exibido e o callback é chamado uma vez

#### Scenario: Fechar alerta controlado
- **WHEN** o usuário aciona fechamento com `open` controlado
- **THEN** o callback é chamado e a visibilidade continua sob responsabilidade do consumidor

### Requirement: Semântica acessível
O sistema SHALL usar `role=alert` para erro urgente e `role=status` para mensagens não urgentes por padrão, oferecer nome acessível ao botão fechar e foco visível.

#### Scenario: Leitor de tela
- **WHEN** um alerta de erro é inserido
- **THEN** o conteúdo é exposto como alerta sem adicionar uma segunda região live redundante

### Requirement: Temas e consumo
O sistema SHALL oferecer cores semânticas via tokens, responsividade, foco e compatibilidade com CSS distribuído e aplicação Next.js.

#### Scenario: Catálogo interativo
- **WHEN** o usuário abre o Admin Demo
- **THEN** consegue testar variantes, aparências, fechamento, ações e mensagens de formulário

#### Scenario: Storybook
- **WHEN** o componente é visualizado no Storybook
- **THEN** seus estados principais e semântica estão demonstrados
