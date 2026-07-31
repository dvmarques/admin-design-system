# typography Specification

## Purpose

Fornecer escala tipográfica semântica e reutilizável para que conteúdo administrativo mantenha hierarquia e legibilidade consistentes.

## Requirements

### Requirement: Elementos tipográficos semânticos

O sistema MUST fornecer `AdsTypography`, uma API tipográfica documentada para texto e títulos que permita escolher hierarquia visual sem perder a semântica do elemento renderizado.

#### Scenario: Consumidor apresenta um título

- **WHEN** uma aplicação usa a API de título com um nível semântico
- **THEN** o conteúdo é exposto como o elemento de título correspondente

### Requirement: Legibilidade entre temas e tamanhos de tela

Os elementos tipográficos MUST usar tokens públicos e preservar contraste e leitura nos temas claro e escuro e em larguras reduzidas.

#### Scenario: Tema escuro é selecionado

- **WHEN** a aplicação alterna para o tema escuro
- **THEN** o texto padrão e secundário permanecem legíveis sobre suas superfícies

### Requirement: Personalização compatível

O consumidor MUST conseguir personalizar os tokens tipográficos suportados e complementar a apresentação com classe adicional sem acessar detalhes internos.

#### Scenario: Aplicação altera a fonte base

- **WHEN** a aplicação sobrescreve um token tipográfico documentado
- **THEN** os elementos tipográficos refletem o novo valor

### Requirement: Fundação tipográfica moderna e personalizável

O sistema MUST expor tokens públicos para a família tipográfica principal, fallbacks de sistema, tamanhos, pesos e alturas de linha usados pela hierarquia tipográfica. A configuração padrão MUST oferecer leitura consistente em interfaces administrativas nos temas claro e escuro, e continuar personalizável por aplicações consumidoras.

#### Scenario: Consumidor utiliza a tipografia padrão

- **WHEN** uma aplicação importa os estilos públicos sem sobrescrever tokens tipográficos
- **THEN** textos e títulos usam a família, escala, pesos e alturas de linha da fundação tipográfica documentada

#### Scenario: Consumidor substitui a família tipográfica

- **WHEN** uma aplicação sobrescreve o token público da família tipográfica no escopo documentado
- **THEN** os elementos tipográficos existentes usam a nova família e seus fallbacks sem mudança de API dos componentes

### Requirement: Fontes distribuídas com licença comercial compatível

O sistema MUST distribuir somente arquivos de fontes cuja licença permita uso, incorporação e redistribuição comercial, e MUST incluir os avisos de licença aplicáveis aos arquivos distribuídos.

#### Scenario: Pacote inclui arquivos de fonte

- **WHEN** uma versão da biblioteca publica arquivos de fonte como parte de seus estilos ou artefatos
- **THEN** cada arquivo publicado possui licença compatível com uso comercial e seu aviso de licença acompanha a distribuição

### Requirement: Hierarquia tipográfica compacta nos componentes existentes

Os componentes existentes MUST usar `14 px` como base tokenizada para corpo e controles, `12 px` para texto auxiliar e tokens semânticos de `20`, `24`, `30` e `36 px` para os títulos principais.

#### Scenario: Overlay apresenta título e conteúdo

- **WHEN** um dialog, drawer, toast ou tooltip renderiza texto
- **THEN** seu conteúdo segue a base global de `14 px` (ou `12 px` quando auxiliar) e seu título usa um token semântico de título
