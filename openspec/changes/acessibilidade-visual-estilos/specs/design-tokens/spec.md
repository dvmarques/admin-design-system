## ADDED Requirements

### Requirement: Tokens de movimento respeitam a preferência de movimento

Os tokens públicos de duração de movimento MUST resolver para duração zero quando o usuário prefere movimento reduzido, de forma que todo componente que os consome elimine suas transições sem configuração adicional.

#### Scenario: Componente consome o token de movimento

- **WHEN** um componente usa o token de duração e o usuário prefere movimento reduzido
- **THEN** a duração efetiva da transição é zero

#### Scenario: Aplicação personaliza a duração

- **WHEN** a aplicação sobrescreve a duração de movimento apenas quando o usuário não prefere movimento reduzido
- **THEN** a duração personalizada vale sem movimento reduzido e continua zero com `prefers-reduced-motion: reduce`

### Requirement: Sobrescritas de contraste são distribuídas com os tokens

O pacote de tokens MUST distribuir sobrescritas dos papéis de cor para `prefers-contrast: more` nos dois temas, mantendo os nomes públicos existentes e sem exigir que a aplicação importe arquivos adicionais.

#### Scenario: Consumidor importa os estilos de tokens

- **WHEN** a aplicação importa `@admin-ds/tokens/styles.css` e o usuário prefere maior contraste
- **THEN** os papéis de borda, texto secundário e foco assumem valores de maior contraste no tema ativo

### Requirement: Borda de controle e borda decorativa são papéis distintos

O sistema MUST disponibilizar um token semântico público de borda de controle
(`borderControl`) para limites de controles interativos e indicadores de seleção
que exigem contraste mínimo de 3:1 contra os fundos aplicáveis. O papel `border`
MUST permanecer para divisões e contornos decorativos, sem esse requisito de
contraste não textual.

#### Scenario: Papéis de borda estão disponíveis nos formatos públicos

- **WHEN** uma aplicação importa os tokens de cor públicos
- **THEN** `borderControl` e `border` são papéis distintos nos dois temas, com
  equivalência entre variáveis CSS e metadados TypeScript

#### Scenario: Contraste do limite de controle

- **WHEN** o teste automatizado de contraste avalia `borderControl` sobre os
  fundos de formulário e superfície documentados
- **THEN** a razão de contraste é de pelo menos 3:1 em cada combinação de tema e
  `prefers-contrast: more` coberta pela lista de pares
