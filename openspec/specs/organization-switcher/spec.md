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
