## ADDED Requirements

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
