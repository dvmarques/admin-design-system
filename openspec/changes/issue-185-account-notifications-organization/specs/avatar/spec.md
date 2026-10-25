## ADDED Requirements

### Requirement: Imagem que falhou é reavaliada quando a origem muda

Se a imagem informada em `src` falhar, `AdsAvatar` MUST exibir o fallback e, quando `src` mudar para outro valor, MUST tentar carregar a nova imagem.

#### Scenario: Troca de foto após falha

- **WHEN** a imagem falha e o consumidor altera `src`
- **THEN** o avatar tenta exibir a nova imagem

#### Scenario: Fallback vazio

- **WHEN** o avatar não recebe imagem utilizável e `fallback` é vazio
- **THEN** o avatar mantém suas dimensões sem quebrar o layout

### Requirement: Imagem que falhou antes da hidratação

Quando a imagem renderizada no servidor falha antes da hidratação, `AdsAvatar` MUST exibir o fallback ao hidratar, mesmo sem ter recebido o evento de erro.

#### Scenario: Falha antes da hidratação

- **WHEN** a imagem já está concluída e sem dimensões quando o avatar é hidratado
- **THEN** o avatar exibe o fallback e não a imagem quebrada
