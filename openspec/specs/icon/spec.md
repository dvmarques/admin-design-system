# icon Specification

## Purpose

Oferecer uma forma tipada e consistente de apresentar ícones decorativos ou informativos nas APIs públicas do design system.

## Requirements

### Requirement: Ícones nomeados e dimensionáveis

O sistema MUST fornecer `AdsIcon`, com identificadores públicos tipados e tamanhos documentados.

#### Scenario: Consumidor seleciona um ícone público

- **WHEN** uma aplicação informa um identificador documentado
- **THEN** o ícone correspondente é renderizado no tamanho solicitado

### Requirement: Semântica acessível de ícones

Ícones decorativos MUST ser ocultos de tecnologias assistivas; ícones que comunicam informação MUST aceitar um nome acessível.

#### Scenario: Ícone informa uma ação sem texto adjacente

- **WHEN** o consumidor fornece um nome acessível ao ícone
- **THEN** tecnologias assistivas recebem essa descrição

### Requirement: Tema e personalização visual

O ícone MUST herdar cor de forma compatível com os tokens e com classes adicionais do consumidor nos dois temas.

#### Scenario: Cor de texto muda com o tema

- **WHEN** o tema é alternado
- **THEN** o ícone decorativo acompanha a cor de conteúdo aplicável

### Requirement: Ícones de modo de cor

`AdsIcon` MUST oferecer os nomes `sun`, `moon` e `monitor`, representando respectivamente os modos Claro, Escuro e Sistema, com as mesmas regras de tamanho, `currentColor` e semântica dos demais ícones.

#### Scenario: Ícones de modo de cor decorativos

- **WHEN** `AdsIcon` é renderizado com `name="sun"`, `moon` ou `monitor` sem `label`
- **THEN** o SVG é ocultado da árvore de acessibilidade e herda a cor do texto

### Requirement: Ícones de conta, notificações e seleção

`AdsIconName` MUST incluir `bell`, `building`, `chevronDown`, `chevronsUpDown`, `logOut`, `settings` e `user`, decorativos por padrão e informativos quando `label` for informado, sem alterar os identificadores existentes.

#### Scenario: Ícone decorativo

- **WHEN** `AdsIcon` renderiza `bell` sem `label`
- **THEN** o SVG é ocultado de tecnologias assistivas

#### Scenario: Compatibilidade

- **WHEN** `AdsIcon` renderiza um ícone anterior
- **THEN** o resultado permanece igual em nome público e contrato de propriedades, com alteração visual intencional dos traçados

#### Scenario: Compatibilidade pública

- **WHEN** uma aplicação renderiza qualquer dos 20 nomes públicos nos tamanhos suportados
- **THEN** o mesmo nome e contrato de propriedades continua disponível
- **AND** o SVG herda a cor do componente e preserva a semântica acessível

#### Scenario: SVG regularizado

- **WHEN** uma aplicação renderiza o nome público `building`
- **THEN** os quatro paths correspondem ao `Building06Icon` do pacote Hugeicons Free MIT, com medidas e espessura originais

### Requirement: Proveniência verificável dos desenhos externos

Os 20 desenhos SVG incorporados MUST ter arquivo de origem oficialmente identificado sob licença MIT ou ISC, mapeado por nome público, com copyrights e avisos integrais preservados.

#### Scenario: Auditoria da fonte

- **WHEN** o mantenedor consulta o nome público de qualquer ícone
- **THEN** a documentação fornece link para o arquivo oficial e identifica a licença correspondente
- **AND** o histórico dos traçados substituídos não é apresentado como autoria própria comprovada

### Requirement: Módulo interno de ícones preparado para extração

A implementação de `AdsIcon` MUST separar desenhos SVG, tipos e componente em `packages/components/src/icons/`, preservando as exportações existentes de `@admin-ds/components` e `src/icon.tsx`. Esta entrega MUST NOT criar um pacote independente ou adicionar dependências.

#### Scenario: Import público mantém identidade

- **WHEN** um consumidor importa `AdsIcon` pelo export principal ou por `src/icon.tsx`
- **THEN** ambos resolvem a mesma implementação modularizada
- **AND** `AdsIconName`, `AdsIconProps` e `AdsIconSize` continuam compatíveis

#### Scenario: Catálogo de desenhos desacoplado

- **WHEN** o mantenedor consulta os SVGs em `src/icons/paths.tsx`
- **THEN** encontra os 20 nomes e desenhos oficiais sem alterar geometria, atributos, licença ou renderização
- **AND** a separação não muda os subpaths públicos do pacote

### Requirement: Avisos de licença acompanham o pacote distribuído

O build de `@admin-ds/components` MUST publicar as licenças e atribuições relevantes junto dos componentes.

#### Scenario: Artefato de distribuição completo

- **WHEN** `@admin-ds/components` termina o build
- **THEN** `dist/LICENSE.md` e `dist/THIRD_PARTY_NOTICES.md` contêm cópias exatas dos arquivos oficiais do repositório
- **AND** a validação de pacote rejeita cópias ausentes ou divergentes
