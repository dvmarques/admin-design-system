# avatar Specification

## Purpose

Representar pessoas ou entidades de maneira previsível, com alternativas úteis quando uma imagem não estiver disponível.

## Requirements

### Requirement: Avatar com imagem e fallback

O sistema MUST fornecer `AdsAvatar`, um avatar que apresente uma imagem quando disponível e um fallback textual identificável quando ela estiver ausente ou não puder ser exibida.

#### Scenario: Imagem não está disponível

- **WHEN** o avatar não recebe uma imagem utilizável
- **THEN** ele apresenta o fallback fornecido pelo consumidor

### Requirement: Tamanhos, temas e responsividade

O avatar MUST oferecer tamanhos documentados e permanecer legível e proporcional nos temas claro e escuro e em contêineres reduzidos.

#### Scenario: Avatar é usado em uma lista compacta

- **WHEN** uma aplicação seleciona o menor tamanho público
- **THEN** o avatar mantém uma área visual consistente sem ultrapassar seu contêiner

### Requirement: Nome acessível do avatar

O avatar MUST permitir que o consumidor forneça texto alternativo significativo quando a imagem comunica identidade e MUST evitar anunciar decoração redundante.

#### Scenario: Avatar representa uma pessoa

- **WHEN** o avatar recebe texto alternativo
- **THEN** tecnologias assistivas recebem a identificação fornecida

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

### Requirement: Fundo configurável por tom ou por cor livre

`AdsAvatar` MUST aceitar `tone` (`neutral`, `primary`, `success`, `warning`, `danger`), com cores dos tokens do tema e contraste adequado nos temas claro e escuro, e `backgroundColor` e `foregroundColor` com qualquer cor CSS, que prevalecem sobre `tone`. O padrão MUST permanecer o aspecto neutro anterior.

#### Scenario: Aspecto padrão preservado

- **WHEN** `tone`, `backgroundColor` e `foregroundColor` não são informados
- **THEN** o avatar mantém o fundo e o texto neutros de antes, sem estilo em linha

#### Scenario: Tom do tema

- **WHEN** `tone="primary"` é informado
- **THEN** o avatar usa o fundo e o texto do tom, definidos pelos tokens

#### Scenario: Cor livre

- **WHEN** `backgroundColor` e `foregroundColor` são informados
- **THEN** o avatar usa essas cores no fundo e nas iniciais
