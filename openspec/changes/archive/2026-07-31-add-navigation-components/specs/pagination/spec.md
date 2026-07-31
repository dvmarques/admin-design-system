## Purpose

Fornece controles de paginação responsivos e acessíveis, permitindo que aplicações naveguem por coleções sem impor estratégia de dados ou roteamento.

## ADDED Requirements

### Requirement: Paginação semântica e independente de dados

O sistema MUST fornecer `AdsPagination` em uma região de navegação nomeável, recebendo a página atual, total de páginas e uma forma de o consumidor tratar a mudança de página ou fornecer links. A biblioteca MUST validar estados impossíveis visualmente: não deve oferecer destinos abaixo da primeira página ou acima da última página, e MUST marcar a página atual com `aria-current="page"`. A API MUST não buscar dados, não manipular URL e não depender de roteamento.

#### Scenario: Página atual e limites

- **WHEN** a paginação é renderizada na primeira ou última página
- **THEN** o destino indisponível anterior ou seguinte é desabilitado e a página atual é anunciada corretamente

#### Scenario: Integração com Next.js

- **WHEN** uma aplicação Next.js fornece links próprios para cada página
- **THEN** os links são renderizados e a biblioteca não acessa ou altera o roteador

### Requirement: Intervalo responsivo de páginas

`AdsPagination` MUST apresentar a página atual, controles anterior e seguinte e um intervalo de páginas configurável. Quando o conjunto completo não couber na largura disponível, MUST reduzir os números intermediários usando indicadores não interativos de páginas omitidas, mantendo alcançáveis primeira, última e página atual quando aplicáveis.

#### Scenario: Coleção extensa em viewport estreita

- **WHEN** há muitas páginas e a viewport é estreita
- **THEN** a paginação reduz itens intermediários sem ocultar a página atual, a primeira ou a última página

### Requirement: Estados visuais consistentes

Os controles MUST apresentar foco visível, alvo interativo distinguível, estado desabilitado e contraste compatível com os tokens semânticos nos temas claro e escuro. O consumidor MUST poder ajustar a aparência por tokens públicos sem recompilar os componentes.

#### Scenario: Navegação por teclado

- **WHEN** um usuário percorre a paginação com Tab e ativa uma página elegível
- **THEN** o controle recebe foco visível e solicita a mudança apenas para a página selecionada
