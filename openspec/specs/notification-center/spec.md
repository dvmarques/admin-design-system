# notification-center Specification

## Purpose

Define a central de notificações em painel lateral: sino com contador, filtros, leitura controlada pela aplicação, estados assíncronos e acessibilidade, sem transporte nem armazenamento de notificações.

## Requirements

### Requirement: Sino com contador acessível

`AdsNotificationCenter` MUST renderizar um botão com sino que abre o painel. O contador visual MUST ficar oculto quando a contagem é zero e MUST exibir `99+` acima de 99, enquanto o nome acessível do botão MUST conter a contagem exata. A contagem MUST ser controlada pelo consumidor (`unreadCount`), sem presumir que equivale aos itens carregados. Atualizações de contagem ou lista MUST NOT ser anunciadas por região viva.

#### Scenario: Zero não lidas

- **WHEN** a contagem é zero
- **THEN** nenhum badge numérico é exibido e o nome acessível não menciona itens não lidos

#### Scenario: Mais de 99

- **WHEN** a contagem é 120
- **THEN** o badge exibe `99+` e o nome acessível informa 120 não lidas

#### Scenario: Total diferente dos itens carregados

- **WHEN** `unreadCount` é 42 e há 5 itens carregados
- **THEN** o contador mostra 42

### Requirement: Painel lateral direito modal

O painel MUST abrir à direita reutilizando `AdsDrawer`, com título `Notificações`, fechamento explícito, Escape, isolamento do fundo, foco inicial no painel e retorno do foco ao sino. Em viewport estreita MUST ocupar a largura disponível sem overflow horizontal, mantendo cabeçalho e ações visíveis e rolagem interna da lista.

#### Scenario: Abrir e fechar

- **WHEN** a pessoa ativa o sino e depois pressiona Escape
- **THEN** o painel abre à direita e fecha, e o foco volta ao sino

#### Scenario: Mobile

- **WHEN** o painel abre em viewport de 320 px
- **THEN** ele cabe na viewport, sem rolagem horizontal, e a lista rola internamente

### Requirement: Abrir não marca como lido e política de ativação

Abrir o painel MUST NOT marcar notificações como lidas. Ativar um item MUST chamar `onItemSelect` e, quando `markReadOnSelect` for verdadeiro (padrão), chamar `onMarkRead` para itens não lidos. Cada item MUST separar navegação e leitura: o botão `Marcar como lida` MUST ser irmão do link ou botão do item, nunca descendente.

#### Scenario: Abertura sem leitura

- **WHEN** o painel abre com itens não lidos
- **THEN** `onMarkRead` e `onMarkAllRead` não são chamados

#### Scenario: Ativar item não lido

- **WHEN** a pessoa ativa o título de um item não lido
- **THEN** `onItemSelect` e `onMarkRead` são chamados com o item correspondente

#### Scenario: Política desativada

- **WHEN** `markReadOnSelect` é `false` e a pessoa ativa o item
- **THEN** somente `onItemSelect` é chamado

#### Scenario: Sem botões dentro de links

- **WHEN** um item tem `href`
- **THEN** o botão de leitura não está contido no link

### Requirement: Filtros e ações de leitura

O painel MUST oferecer os filtros `Todas` e `Não lidas` (com estado pressionado exposto) e `Marcar todas como lidas`, desabilitada sem não lidas ou durante ação pendente. O filtro MUST suportar `filter` controlado e `defaultFilter`.

#### Scenario: Filtrar não lidas

- **WHEN** a pessoa escolhe `Não lidas`
- **THEN** apenas itens não lidos são listados

#### Scenario: Filtro sem resultados

- **WHEN** `Não lidas` está ativo e não há itens não lidos carregados
- **THEN** o painel mostra um estado vazio específico do filtro

### Requirement: Estados do item e distinção sem depender de cor

Itens não lidos MUST ser indicados por marca visual e por texto acessível ("Não lida"), e itens lidos MUST ser visualmente distintos. Cada item MAY ter ícone ou avatar, descrição, data/hora e link. Datas MUST poder ser apresentadas pelo consumidor (`formatTime` ou `timeLabel`) sem acoplar a idioma nem a biblioteca de datas.

#### Scenario: Item não lido

- **WHEN** o item está não lido
- **THEN** o texto acessível "Não lida" está presente além da marca visual

#### Scenario: Formatação do consumidor

- **WHEN** `formatTime` é fornecido
- **THEN** o resultado é exibido no lugar do formato padrão

### Requirement: Carregamento, vazio, erro, ação pendente e lista longa

O painel MUST representar carregamento (`role="status"`), vazio, erro com `Tentar novamente` (`role="alert"`), ação de leitura pendente (`aria-busy`) com erro recuperável, lista longa com rolagem interna e `Carregar mais` opcional com estado de carregamento. A biblioteca MUST NOT implementar API, WebSocket, push, armazenamento ou paginação de backend.

#### Scenario: Erro de carregamento

- **WHEN** `status` é `error`
- **THEN** o alerta e o botão `Tentar novamente` aparecem e acioná-lo chama `onRetry`

#### Scenario: Marcar como lida pendente

- **WHEN** `onMarkRead` retorna uma `Promise` não resolvida
- **THEN** o item fica `aria-busy` e o botão de leitura fica inoperante; ao rejeitar, o item mostra o erro e permite tentar de novo

#### Scenario: Carregar mais

- **WHEN** `hasMore` é verdadeiro e a pessoa aciona `Carregar mais`
- **THEN** `onLoadMore` é chamado e, com `loadingMore`, o botão fica ocupado

#### Scenario: Carregar mais sem callback

- **WHEN** `hasMore` é verdadeiro e `onLoadMore` não é informado
- **THEN** `Carregar mais` não é renderizado, para não haver botão inerte

#### Scenario: Leitura individual e global não se sobrepõem

- **WHEN** a leitura de um item está pendente
- **THEN** `Marcar todas como lidas` fica inoperante e não chama `onMarkAllRead`, e, com a leitura global pendente, os botões individuais ficam inoperantes e não chamam `onMarkRead`

### Requirement: Personalização de rótulos, SSR e temas

Todos os textos MUST ser personalizáveis por `labels`. O servidor MUST renderizar apenas o gatilho fechado, sem acessar o DOM. O componente MUST funcionar nos temas claro e escuro, com movimento reduzido e em zoom de 200%.

#### Scenario: Rótulos personalizados

- **WHEN** o consumidor fornece `labels.title`
- **THEN** o painel usa esse título

#### Scenario: Hidratação

- **WHEN** o componente é renderizado no servidor e hidratado
- **THEN** não há divergência e o painel está fechado
