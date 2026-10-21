# sparkline Specification

## Purpose

Fornece o `AdsSparkline`, um gráfico de linha minúsculo e acessível em SVG, sem regras de negócio, para mostrar a evolução de uma série em cards e listas.

## Requirements

### Requirement: Sparkline desenha a evolução de uma série

O sistema MUST fornecer `AdsSparkline` em `@admin-ds/components`, um gráfico de linha minúsculo em SVG, sem eixos, sem regras de negócio e sem dependência de runtime nova, que recebe uma lista de valores numéricos e desenha uma linha na largura do contêiner. Valores não finitos MUST ser ignorados sem alterar a posição horizontal dos demais, e o componente MUST aceitar `className` e atributos do elemento `svg`.

#### Scenario: Série com vários pontos

- **WHEN** o consumidor informa `values` com dois ou mais valores finitos
- **THEN** o componente desenha uma linha que liga os pontos na ordem informada, dentro do intervalo entre o mínimo e o máximo da série

#### Scenario: Escala fixada pelo consumidor

- **WHEN** o consumidor informa `min` e `max`
- **THEN** a escala vertical usa esses limites e valores fora deles são limitados às bordas

#### Scenario: Série constante

- **WHEN** todos os valores válidos são iguais
- **THEN** o componente desenha uma linha reta na altura intermediária

#### Scenario: Ponto único

- **WHEN** há exatamente um valor válido
- **THEN** o componente desenha apenas um marcador na posição desse valor

#### Scenario: Valores ausentes

- **WHEN** `values` contém `null`, `undefined` ou `NaN` entre valores válidos
- **THEN** esses itens são ignorados e a linha continua ligando os pontos válidos, preservando o espaçamento pelo índice original

#### Scenario: Sem pontos válidos

- **WHEN** `values` está vazio ou não contém valores finitos
- **THEN** o componente não renderiza nada

### Requirement: Sparkline tem alternativa textual

O `AdsSparkline` MUST expor `role="img"` com um nome acessível que resuma a série: a quantidade de pontos, o primeiro e o último valor, o mínimo e o máximo. O consumidor MUST poder nomear a série com `label`, fornecer rótulos por ponto com `labels`, formatar os valores com `formatValue` e substituir o texto inteiro com `summary`. A informação do gráfico MUST NOT depender apenas de cor.

#### Scenario: Resumo gerado

- **WHEN** o consumidor informa `values` com vários pontos e `label="Receita diária"`
- **THEN** o nome acessível da imagem contém o rótulo, a quantidade de pontos, o primeiro e o último valor, o mínimo e o máximo, formatados em português do Brasil por padrão

#### Scenario: Rótulos por ponto

- **WHEN** o consumidor informa `labels` correspondentes a `values`
- **THEN** o resumo identifica o primeiro e o último ponto pelos seus rótulos

#### Scenario: Texto substituído

- **WHEN** o consumidor informa `summary`
- **THEN** o nome acessível é exatamente esse texto

#### Scenario: Ponto único no resumo

- **WHEN** há exatamente um valor válido
- **THEN** o nome acessível informa um ponto e o seu valor

### Requirement: Sparkline usa tokens públicos e respeita preferências de acessibilidade

O `AdsSparkline` MUST colorir o traço por `tone` (`default`, `positive`, `negative`) usando `--ads-color-chart1`, `--ads-color-success` e `--ads-color-danger`, com contraste mínimo de 3:1 contra `surface` e `surfaceRaised` nos temas claro e escuro, verificado pela lista central de pares de contraste. Em `forced-colors: active`, o traço MUST usar cores de sistema e continuar visível. O componente MUST NOT usar animação.

#### Scenario: Tema escuro

- **WHEN** o tema escuro está ativo
- **THEN** o traço usa os valores do tema ativo dos tokens de cor, com ao menos 3:1 contra a superfície

#### Scenario: Cores forçadas

- **WHEN** `forced-colors: active` está ativo
- **THEN** o traço permanece visível com a cor de texto do sistema

### Requirement: Sparkline funciona no servidor e na hidratação

O `AdsSparkline` MUST ser renderizável em Server Components, sem `"use client"`, hooks ou observadores de tamanho, e MUST produzir o mesmo HTML no servidor e no cliente.

#### Scenario: Renderização no servidor

- **WHEN** o componente é renderizado no servidor e hidratado no cliente
- **THEN** não há aviso de hidratação e o HTML é o mesmo
