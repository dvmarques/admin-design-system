## ADDED Requirements

### Requirement: Apresentação opt-in de tabelas

AdsTable MUST aceitar `striped` e `wrap` booleanos opcionais independentes, sem alterar a apresentação padrão.

#### Scenario: Listras tematizadas

- **WHEN** striped é verdadeiro
- **THEN** linhas pares do corpo usam o token público de listra em ambos os temas, distinto do cabeçalho e do hover, preservando hover interativo e semântica

#### Scenario: Quebra de texto

- **WHEN** wrap é verdadeiro e células contêm texto longo em um contêiner estreito
- **THEN** texto pode quebrar inclusive palavras longas, sem largura mínima intrínseca obrigatória; conteúdo de largura fixa ainda pode exigir rolagem

#### Scenario: Padrão preservado

- **WHEN** as opções são omitidas ou falsas
- **THEN** não há listras nem mudança de markup ou largura mínima
