## ADDED Requirements

### Requirement: Movimento reduzido

Componentes públicos MUST NOT apresentar transições nem animações relevantes quando o usuário prefere movimento reduzido. Animações contínuas, como indicadores de carregamento e esqueletos, MUST ser desativadas e a informação de estado MUST permanecer disponível por texto ou semântica.

#### Scenario: Usuário prefere movimento reduzido

- **WHEN** o sistema operacional indica `prefers-reduced-motion: reduce` e o usuário interage com um componente com transição
- **THEN** a mudança de estado ocorre sem transição de duração perceptível e sem deslocamento animado

#### Scenario: Indicador de carregamento com movimento reduzido

- **WHEN** um indicador de carregamento ou esqueleto é exibido com movimento reduzido
- **THEN** não há animação contínua e o estado de carregamento continua exposto ao usuário

### Requirement: Cores forçadas

Em `forced-colors: active`, foco, bordas, estados selecionados, Button, campos de formulário e Badge MUST permanecer distinguíveis usando as cores do sistema, sem depender de sombras ou de cores de fundo personalizadas.

#### Scenario: Foco visível em cores forçadas

- **WHEN** um controle interativo recebe foco por teclado com cores forçadas ativas
- **THEN** há indicador de foco visível com cor de sistema

#### Scenario: Seleção distinguível em cores forçadas

- **WHEN** uma linha de tabela, item de navegação ou dia do calendário está selecionado com cores forçadas ativas
- **THEN** ele se distingue dos não selecionados por contorno ou borda e não apenas por cor de fundo

#### Scenario: Limites de campos e botões em cores forçadas

- **WHEN** um Button, um campo de formulário ou um Badge é exibido com cores forçadas ativas
- **THEN** seus limites permanecem visíveis

### Requirement: Preferência por maior contraste

Quando o usuário prefere `prefers-contrast: more`, os temas claro e escuro MUST aumentar o contraste de bordas, texto secundário e indicador de foco, mantendo o tema ativo e as sobrescritas explícitas da aplicação.

#### Scenario: Usuário prefere maior contraste

- **WHEN** o sistema operacional indica `prefers-contrast: more` em qualquer tema
- **THEN** bordas, texto secundário e foco usam valores mais fortes que os padrões do tema

#### Scenario: Aplicação personaliza um token

- **WHEN** a aplicação sobrescreve um token de cor e o usuário prefere maior contraste
- **THEN** a sobrescrita explícita da aplicação continua prevalecendo
