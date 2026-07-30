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
