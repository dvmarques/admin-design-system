## ADDED Requirements

### Requirement: Conta, notificações e organização integradas ao demo

O admin demo MUST apresentar no cabeçalho, à direita, o controle de tema existente, o sino de notificações e o avatar da conta, e no topo da sidebar o seletor de organização, com dados fictícios e interações locais funcionais. Ações sem backend, inclusive `Sair`, MUST dar feedback de demonstração sem encerrar sessão real.

#### Scenario: Cabeçalho

- **WHEN** a pessoa abre o demo em viewport ampla
- **THEN** tema, sino com contador e avatar aparecem, cada um abrindo sua própria interação

#### Scenario: Sair

- **WHEN** a pessoa ativa `Sair`
- **THEN** o demo mostra feedback de demonstração e a sessão permanece

#### Scenario: Notificações

- **WHEN** a pessoa abre o painel, filtra e marca itens como lidos
- **THEN** a lista, o contador do sino e os filtros refletem o estado local, sem marcar tudo ao abrir

#### Scenario: Organização

- **WHEN** a pessoa troca de organização com a sidebar expandida, recolhida ou no menu móvel
- **THEN** a organização atual muda após a confirmação local e o contexto visual é atualizado

### Requirement: Showcases e exemplo sem organização

O catálogo MUST oferecer showcases próprios e navegáveis de `AdsAccountMenu`, `AdsNotificationCenter` e `AdsOrganizationSwitcher`, incluindo variações de foto, iniciais e falha de imagem, estados de carregamento, vazio e erro, e um exemplo de shell **sem** seletor de organização que comprove a ausência de espaço residual.

#### Scenario: Catálogo

- **WHEN** a pessoa visita as rotas dos três componentes no catálogo
- **THEN** cada uma apresenta exemplos executáveis, código e variações relevantes

#### Scenario: Sem organização

- **WHEN** o exemplo sem seletor é aberto
- **THEN** a navegação ocupa o topo da sidebar, sem bloco ou separador residual
