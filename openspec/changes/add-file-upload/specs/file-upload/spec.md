# Spec Delta

## ADDED Requirements

### Requirement: Seleção nativa e controlável de arquivos

`AdsFileUpload` MUST permitir selecionar, apresentar e remover arquivos usando o seletor nativo, sem executar upload HTTP e sem depender de diálogo ou roteamento.

#### Scenario: Seleção única
- **WHEN** uma pessoa escolhe um arquivo válido
- **THEN** o controle apresenta nome, tamanho e tipo, e emite `onFilesChange` com o arquivo selecionado

#### Scenario: Seleção múltipla e estado controlado
- **WHEN** `multiple` está ativo e o consumidor fornece `files` e `onFilesChange`
- **THEN** o controle emite a nova lista e respeita o valor fornecido pelo consumidor sem alterar a lista visual por conta própria

#### Scenario: Remover e selecionar o mesmo arquivo
- **WHEN** a pessoa remove um arquivo e reabre o seletor para escolher o mesmo arquivo
- **THEN** o controle aceita a seleção e anuncia o novo estado

#### Scenario: Cancelar o seletor
- **WHEN** a pessoa abre e cancela o seletor nativo sem selecionar arquivo
- **THEN** os arquivos e os callbacks de mudança permanecem inalterados

### Requirement: Validação configurável e rejeições explícitas

O controle MUST aplicar `accept`, limite de tamanho e de quantidade à seleção local, MUST informar rejeições tipadas e MUST NOT afirmar que a validação do navegador substitui a validação de segurança do servidor.

#### Scenario: Arquivo rejeitado por tipo ou tamanho
- **WHEN** a seleção contém arquivo que não corresponde ao filtro ou excede o tamanho
- **THEN** o arquivo não é aceito, `onReject` informa motivo e nome, e o erro é exibido textualmente

#### Scenario: Quantidade máxima
- **WHEN** a seleção excede a quantidade configurada
- **THEN** os excedentes são rejeitados e a lista válida não ultrapassa `maxFiles`

#### Scenario: Rejeição parcial
- **WHEN** arquivos válidos e inválidos são escolhidos juntos
- **THEN** apenas os válidos compõem a seleção, e os inválidos são anunciados

### Requirement: Estados e acessibilidade

O controle MUST expor os estados vazio, selecionado, erro, desabilitado e carregando, com foco visível, controles nativos por teclado, rótulo legível e feedback em tecnologias assistivas.

#### Scenario: Estado vazio e acessibilidade
- **WHEN** o controle é renderizado sem arquivos
- **THEN** o texto de estado vazio é visível e a seleção pode ser acionada por teclado

#### Scenario: Enviando ou desabilitado
- **WHEN** `isLoading` ou `disabled` está ativo
- **THEN** seleção, remoção e limpeza ficam indisponíveis, mantendo metadados legíveis e o estado ocupado acessível

#### Scenario: Temas e viewport estreita
- **WHEN** o controle é renderizado em tema claro/escuro com largura de 320px
- **THEN** nomes longos quebram linha sem rolagem horizontal da página e os controles conservam contraste e foco visível

### Requirement: Integração desacoplada

O Storybook MUST apresentar variantes do controle e o Admin Demo MUST demonstrar seleção e importação simulada por `AdsDialog` e `AdsButton`, sem rede ou dependência de backend.

#### Scenario: Exemplo de importação
- **WHEN** o consumidor seleciona um arquivo válido e confirma o envio na demonstração
- **THEN** a demonstração apresenta feedback de importação simulada, sem fazer requisição HTTP
