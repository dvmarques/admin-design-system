## ADDED Requirements

### Requirement: Ritmo visual de composição de campo

Os componentes de composição de campo MUST alinhar e espaçar rótulo, descrição, controle e validação de acordo com a hierarquia tipográfica e os tokens de espaçamento revisados.

#### Scenario: Campo possui ajuda e erro

- **WHEN** uma aplicação renderiza um campo com descrição e mensagem de erro
- **THEN** a informação de orientação e a validação permanecem legíveis e visualmente associadas ao controle

### Requirement: Estados de campo não dependem exclusivamente de cor

A composição de campo MUST preservar distância, tipografia e associação semântica suficientes para distinguir ajuda, erro e sucesso; quando houver estado, a comunicação visual MUST combinar cor com ao menos outro sinal já disponível na composição.

#### Scenario: Campo apresenta validação em layout compacto

- **WHEN** uma aplicação apresenta mensagem de validação abaixo de um controle em largura reduzida
- **THEN** rótulo, valor e mensagem permanecem associados, legíveis e sem sobreposição
