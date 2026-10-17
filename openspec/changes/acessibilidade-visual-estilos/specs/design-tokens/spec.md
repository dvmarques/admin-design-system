## ADDED Requirements

### Requirement: Tokens de movimento respeitam a preferência de movimento

Os tokens públicos de duração de movimento MUST resolver para duração zero quando o usuário prefere movimento reduzido, de forma que todo componente que os consome elimine suas transições sem configuração adicional.

#### Scenario: Componente consome o token de movimento

- **WHEN** um componente usa o token de duração e o usuário prefere movimento reduzido
- **THEN** a duração efetiva da transição é zero

#### Scenario: Aplicação personaliza a duração

- **WHEN** a aplicação sobrescreve a duração de movimento e o usuário prefere movimento reduzido
- **THEN** a preferência do usuário continua resultando em duração zero

### Requirement: Sobrescritas de contraste são distribuídas com os tokens

O pacote de tokens MUST distribuir sobrescritas dos papéis de cor para `prefers-contrast: more` nos dois temas, mantendo os nomes públicos existentes e sem exigir que a aplicação importe arquivos adicionais.

#### Scenario: Consumidor importa os estilos de tokens

- **WHEN** a aplicação importa `@admin-ds/tokens/styles.css` e o usuário prefere maior contraste
- **THEN** os papéis de borda, texto secundário e foco assumem valores de maior contraste no tema ativo
