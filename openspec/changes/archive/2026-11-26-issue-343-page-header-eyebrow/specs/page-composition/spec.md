## ADDED Requirements

### Requirement: Eyebrow opcional no cabeçalho de página

`AdsPageHeader` MUST aceitar a prop opcional `eyebrow`, renderizada como parágrafo acima do H1 com conteúdo inline, e MUST NOT renderizar nó adicional quando ela estiver ausente.

#### Scenario: Eyebrow informado

- **WHEN** a aplicação informa `eyebrow`
- **THEN** o texto aparece em um `<p>` antes do H1, com estilo de texto pequeno em caixa-alta e espaçamento tokenizado até o título

#### Scenario: Eyebrow ausente

- **WHEN** a aplicação não informa `eyebrow`
- **THEN** o markup do cabeçalho permanece idêntico ao anterior

### Requirement: Ações alinhadas à primeira linha do título

O slot `actions` de `AdsPageHeader` MUST ficar alinhado à primeira linha do H1, com título de uma ou várias linhas, sem exigir contêiner ou valores mágicos no consumidor, e MUST continuar quebrando abaixo do texto em larguras estreitas.

#### Scenario: Título e ação lado a lado

- **WHEN** o cabeçalho tem um botão pequeno ao lado do título
- **THEN** o centro do botão coincide com o centro da primeira linha do H1, com ou sem eyebrow

#### Scenario: Largura estreita

- **WHEN** a largura disponível é de 320px
- **THEN** as ações quebram abaixo da descrição sem overflow horizontal
