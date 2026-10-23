# pagination Specification

## Purpose

Fornece controles de paginação responsivos e acessíveis, permitindo que aplicações naveguem por coleções sem impor estratégia de dados ou roteamento.

## Requirements

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

### Requirement: Paginação preserva estabilidade em largura reduzida

AdsPagination MUST usar métricas numéricas estáveis quando aplicável e MUST manter página atual, foco e controles de avanço distinguíveis em largura reduzida. Quando o conjunto não couber, o componente MUST adotar rolagem horizontal ou quebra controlada sem ocultar ações operáveis.

#### Scenario: Paginação excede o contêiner compacto

- **WHEN** a paginação possui mais controles do que a largura disponível comporta
- **THEN** a pessoa consegue alcançar controles adicionais sem sobreposição, truncamento de controles ou perda da identificação da página atual

### Requirement: Links do consumidor sem conteúdo interativo aninhado

`AdsPagination` MUST permitir que o consumidor forneça o elemento de link de cada destino (página, anterior e próxima habilitados), recebendo as props de estilo, `aria-current` e nome acessível para aplicá-las ao link. A biblioteca MUST NOT renderizar um botão dentro do link nem acessar o roteador. Anterior e próxima indisponíveis MUST permanecer desabilitados. A API `renderPage` existente MUST continuar funcionando.

#### Scenario: Links do Next.js em cada página

- **WHEN** uma aplicação Next.js fornece `next/link` para cada página
- **THEN** cada destino é um único link, sem botão aninhado, a página atual expõe `aria-current="page"` e mantém o estilo de item da biblioteca

#### Scenario: Limites com links

- **WHEN** a primeira página está ativa e o consumidor fornece links
- **THEN** o destino anterior é um botão desabilitado e o seguinte é um link

#### Scenario: Compatibilidade com renderPage

- **WHEN** uma aplicação usa apenas `renderPage`
- **THEN** o comportamento anterior é preservado

### Requirement: Adaptação à largura real

O componente MUST ajustar a quantidade de páginas adjacentes à largura observada do próprio contêiner, sem depender exclusivamente de breakpoints de viewport. MUST preservar primeira, atual, última e controles anterior/próxima sem números duplicados, com fallback horizontal acessível apenas quando fisicamente necessário. MUST preservar bordas, hover e foco vertical.

#### Scenario: Redimensionamento com página intermediária

- **WHEN** o contêiner da página 25 de 50 é reduzido por sidebar ou zoom
- **THEN** números adjacentes são removidos antes dos números obrigatórios e as reticências representam lacunas reais

#### Scenario: Páginas extremas

- **WHEN** a página é 1, 2, penúltima ou última, ou pageCount é 0, 1 ou 2
- **THEN** não há duplicatas e os limites de navegação são respeitados

### Requirement: Navegação opcional e localizada

O componente MUST preservar texto anterior/próxima por padrão e MAY oferecer setas, conteúdo customizado, primeira/última, labels configuráveis e estado de carregamento por props opcionais. MUST preservar aria-current, nome acessível, foco visível e teclado.

#### Scenario: Navegação com setas em carregamento

- **WHEN** o consumidor habilita setas e loading
- **THEN** os botões mantêm nomes acessíveis e não disparam navegação duplicada

### Requirement: Salto direto opcional

O componente MUST oferecer showPageJump desativado por padrão, campo numérico rotulado e confirmação por Enter ou clique, rejeitando vazio, fração, valor fora do intervalo e página atual. MUST sincronizar com mudanças externas de page e suportar renderPageLink sem interativos aninhados.

#### Scenario: Salto inválido

- **WHEN** o usuário tenta navegar para uma página inválida
- **THEN** onPageChange não é chamado e o erro é comunicado de forma acessível

### Requirement: Robustez e compatibilidade

O componente MUST representar uma única página omitida quando houver espaço, minimizar saltos de largura de dígitos e documentar a correção controlada quando pageCount diminui. MUST evitar callbacks durante render e hidratação divergente.

#### Scenario: Redução do total

- **WHEN** pageCount diminui abaixo de page controlada
- **THEN** a página exibida permanece válida, e a política de sincronização com o consumidor é previsível e documentada

#### Scenario: SSR e links

- **WHEN** renderizado no servidor e hidratado com links customizados
- **THEN** não ocorre mismatch e os links permanecem semanticamente válidos

### Requirement: Correção controlada e foco estável

O componente MUST solicitar a correção de uma página inválida por callback após montagem, no máximo uma vez por combinação de página e total positivo, sem emitir durante carregamento. Sem callback, o consumidor MUST normalizar URL e dados. MUST preservar foco em controles mantidos e não mover foco em mudanças externas.

#### Scenario: Consumidor não aplica imediatamente a correção

- **WHEN** page é 25, pageCount cai para 10 e o consumidor mantém page 25 em novas renderizações
- **THEN** a página 10 é exibida e apenas uma solicitação de correção é emitida, fora do render

#### Scenario: Total vazio

- **WHEN** pageCount é zero
- **THEN** não há página ativa nem solicitação de correção para uma página inexistente

#### Scenario: Loading com link focado

- **WHEN** loading inicia com foco em um link de página
- **THEN** o link e o foco permanecem, a navegação é bloqueada e a região informa estado ocupado

#### Scenario: Salto com link e formulário consumidor

- **WHEN** a paginação está em um formulário e renderPageLink é fornecido sem callback
- **THEN** Enter e confirmação ativam o link válido do consumidor sem formulário ou controles interativos aninhados

#### Scenario: Personalização e estabilidade de largura

- **WHEN** textos traduzidos, fonte, número de dígitos ou largura do contêiner mudam
- **THEN** a capacidade considera os controles reais, os números usam largura estável e foco, hover e bordas continuam visíveis
