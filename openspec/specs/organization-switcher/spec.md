# organization-switcher Specification

## Purpose

Define o seletor opcional de organização para a sidebar: seleção controlada pela aplicação, busca, troca assíncrona, modo recolhido e uso no menu móvel, sem regras de permissão ou multitenancy na biblioteca.

## Requirements

### Requirement: Componente opcional e independente do shell

`AdsOrganizationSwitcher` MUST ser um componente independente que o consumidor inclui como primeiro filho da sidebar. `AdsAdminShell` MUST NOT exigi-lo nem criar organização fictícia. Sem o componente, a navegação MUST ocupar o espaço normalmente, sem bloco vazio, altura reservada ou separador residual. O componente MUST NOT exigir o shell, provider global, roteador nem backend.

#### Scenario: Ausente

- **WHEN** a sidebar é composta sem o seletor
- **THEN** a navegação é o primeiro conteúdo da sidebar e não há elemento residual do seletor

#### Scenario: Presente

- **WHEN** o consumidor o coloca antes da navegação
- **THEN** ele aparece no topo da sidebar, acima dos itens de navegação

#### Scenario: Fora do shell

- **WHEN** o componente é renderizado sem `AdsAdminShell`
- **THEN** ele funciona expandido, sem erro

### Requirement: Gatilho com organização atual

O gatilho MUST exibir logo ou iniciais, nome atual, descrição opcional e indicador de seta, ter nome acessível que inclua o nome da organização e expor `aria-expanded`. Nomes longos MUST truncar sem quebrar o layout; logo indisponível MUST cair para iniciais.

#### Scenario: Logo falha

- **WHEN** a imagem do logo falha
- **THEN** as iniciais da organização são exibidas

### Requirement: Lista, seleção, busca e ação de gerenciamento

O painel MUST listar as organizações com logo/iniciais e nome, marcar a atual explicitamente (`aria-current` e marca visual, não só cor), oferecer busca quando houver muitas organizações (padrão: a partir de 7), exibir estado sem resultados e `Gerenciar organizações` somente quando fornecido. Opções desabilitadas MUST NOT ser selecionáveis. Selecionar MUST chamar `onValueChange` com o id e fechar o painel devolvendo o foco ao gatilho.

#### Scenario: Selecionar

- **WHEN** a pessoa escolhe outra organização
- **THEN** `onValueChange` recebe o id, o painel fecha e o foco volta ao gatilho

#### Scenario: Busca sem resultados

- **WHEN** o termo não corresponde a nenhuma organização
- **THEN** o painel mostra o estado sem resultados

#### Scenario: Zero, uma e muitas

- **WHEN** há zero organizações
- **THEN** o gatilho indica a ausência e fica desabilitado
- **WHEN** há uma organização
- **THEN** não há busca
- **WHEN** há muitas
- **THEN** a busca aparece

### Requirement: Troca assíncrona sem confirmar antes do sucesso

Quando `onValueChange` retorna `Promise`, a opção escolhida MUST ficar pendente (`aria-busy`), as demais inoperantes, e o gatilho MUST continuar exibindo a organização anterior até `value` mudar. Rejeição MUST manter o painel aberto com mensagem `role="alert"`.

#### Scenario: Pendente

- **WHEN** a promessa está pendente
- **THEN** a nova organização não está marcada como atual

#### Scenario: Erro

- **WHEN** a promessa é rejeitada
- **THEN** o alerta aparece e a organização atual permanece a anterior

### Requirement: Carregamento e erro da lista

`status` `loading` MUST exibir estado de carregamento (`role="status"`) e `error` MUST exibir alerta com `Tentar novamente` que chama `onRetry`.

#### Scenario: Erro da lista

- **WHEN** `status` é `error`
- **THEN** o painel mostra o alerta e a ação de tentar novamente

### Requirement: Sidebar recolhida e mobile

Na sidebar desktop recolhida, o gatilho MUST ficar compacto (logo/iniciais) com tooltip e nome acessível, e a seleção MUST continuar utilizável sem expandir a sidebar. Dentro do drawer de navegação móvel, o painel MUST funcionar como camada acima do modal, com foco e Escape por camada.

#### Scenario: Recolhida

- **WHEN** a sidebar está recolhida
- **THEN** só logo/iniciais são visíveis, o nome acessível permanece e o painel abre

#### Scenario: Mobile

- **WHEN** o seletor está no drawer móvel e o painel abre
- **THEN** Escape fecha apenas o painel e o foco volta ao gatilho; o drawer continua aberto

### Requirement: Contexto visual sem regras de negócio

O componente MUST NOT implementar permissões, autorização, persistência ou mudança efetiva de contexto: a aplicação fornece organizações, seleção, estados e o callback. O componente MUST NOT ser incorporado ao `AdsAccountMenu`.

#### Scenario: Controlado

- **WHEN** `value` não é atualizado após `onValueChange`
- **THEN** o gatilho continua exibindo a organização anterior

### Requirement: SSR e temas

O servidor MUST renderizar o gatilho fechado sem acessar o DOM, e o componente MUST funcionar nos temas claro e escuro.

#### Scenario: Hidratação

- **WHEN** o componente é renderizado no servidor e hidratado
- **THEN** não há divergência

### Requirement: Organização permite escolher o tom de seu avatar

AdsOrganization MUST aceitar avatarTone opcional, com os tons públicos de AdsAvatar, aplicado no gatilho e na opção correspondente. Sem configuração, MUST preservar neutral e os comportamentos de imagem e fallback.

#### Scenario: Tom informado e seleção alterada

- **WHEN** o consumidor fornece avatarTone e seleciona uma organização
- **THEN** gatilho e lista usam o tom informado, com logo ou fallback de iniciais, nos dois temas

#### Scenario: Consumidor anterior

- **WHEN** avatarTone não é fornecido
- **THEN** a aparência anterior e o contrato de seleção permanecem inalterados

### Requirement: Seletor expandido conserva largura independente do nome

O seletor de organização expandido MUST ocupar a largura disponível no contêiner e manter seu tamanho ao trocar entre nomes curtos e longos. No modo recolhido, a borda MUST ficar invisível sem mudar posição, dimensões e área de foco do gatilho.

#### Scenario: Nome curto e nome longo

- **WHEN** a organização selecionada muda para um nome menor ou maior
- **THEN** a borda do gatilho expandido mantém a mesma largura, respeitando o contêiner e truncando rótulos quando necessário

#### Scenario: Organização recolhida

- **WHEN** a sidebar está recolhida
- **THEN** o avatar permanece no mesmo lugar com borda externa transparente, nome acessível e foco visível; o expandido preserva sua borda

### Requirement: Seletor alinha sua caixa ao item ativo

Na composição sidebar-header expandida, o seletor de organização MUST ter a mesma largura e os mesmos limites laterais do destaque de um item raiz ativo da navegação, preservando a posição do avatar e dos rótulos.

#### Scenario: Sidebar com scrollbar

- **WHEN** a largura útil muda por scrollbar ou troca de viewport
- **THEN** a caixa do seletor e o destaque raiz permanecem alinhados, independentemente do tamanho do nome

### Requirement: OrganizationSwitcher compõe o AdsCombobox popover sem regressão pública

`AdsOrganizationSwitcher` MUST implementar pesquisa e seleção por composição da apresentação `popover` do `AdsCombobox`, preservando a API pública de organizações, labels, `manage`, posição opcional na sidebar, estados visuais e semântica acessível.

#### Scenario: API e localização continuam iguais

- **WHEN** uma aplicação consome o `AdsOrganizationSwitcher` anteriormente disponível, com ou sem seletor na sidebar
- **THEN** não precisa mudar props, assinaturas, estrutura do shell ou importar novas primitivas; a ausência continua sem espaço residual

#### Scenario: Avatar com tom configurado

- **WHEN** uma organização possui `avatarTone` ou a foto está indisponível
- **THEN** gatilho e opções preservam tom e fallback sem duplicação visual nem regras de domínio na primitiva

#### Scenario: Pesquisa automática, avatar e sidebar recolhida

- **WHEN** `searchable="auto"` é usado com sete ou mais organizações ou a sidebar é recolhida
- **THEN** a pesquisa e o gatilho compacto com avatar/iniciais/tooltip permanecem utilizáveis, e nome/descrição continuam filtráveis

#### Scenario: Gerenciar organizações e estados

- **WHEN** `manage`, lista vazia, status loading/error ou logo indisponível são fornecidos
- **THEN** a ação fica no footer, os estados ficam acessíveis, e o fallback de imagem continua funcionando sem alterar a API

### Requirement: Troca de organização assíncrona confirma apenas após sucesso

`AdsOrganizationSwitcher` MUST manter seleção controlada/não controlada e o callback de troca síncrono ou Promise, bloqueando ações conflitantes enquanto pendente. A organização ativa MUST NOT ser exibida como confirmada antes de o consumidor sinalizar sucesso; falhas MUST preservar a seleção anterior.

#### Scenario: Troca assíncrona pendente

- **WHEN** `onValueChange` retorna uma Promise ainda pendente
- **THEN** o gatilho e a seleção confirmada continuam no valor anterior, a opção pendente é anunciada e outra troca não é executada

#### Scenario: Troca concluída e rejeitada

- **WHEN** a Promise resolve e o estado atualizado é confirmado
- **THEN** o seletor atualiza a organização somente nos termos do contrato controlado/não controlado, fecha e restaura foco de forma segura
- **WHEN** a Promise rejeita ou há falha síncrona
- **THEN** a organização anterior permanece ativa e o painel exibe erro recuperável, sem confirmação otimista

#### Scenario: Uso dentro de navegação móvel

- **WHEN** o seletor é aberto dentro do drawer mobile com outros overlays
- **THEN** pesquisa, rodapé, Escape por camada e retorno do foco preservam o drawer ancestral e o shell

### Requirement: Nome acessível do seletor contém suas iniciais visíveis

O gatilho do `AdsOrganizationSwitcher` MUST incluir no nome acessível as iniciais visíveis do logo/avatar, além do nome e descrição da organização, com a mesma regra de fallback e sem alterar a API de seleção ou o layout.

#### Scenario: Logo ausente ou falho

- **WHEN** a organização atual é `Acme Brasil` e o logo está ausente
- **THEN** o gatilho exibe `AB` e `Acme Brasil`, seu nome acessível contém esses textos, e a auditoria WCAG 2.2 AA de `axe-core@4.14.0` não acusa `label-content-name-mismatch`

#### Scenario: Sidebar recolhida

- **WHEN** a sidebar é recolhida e o gatilho mostra apenas o avatar
- **THEN** o nome acessível ainda identifica a organização, com iniciais, e permite seleção por teclado
