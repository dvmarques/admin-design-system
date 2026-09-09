## Purpose

Define os contratos de estado e preferências estruturais do Admin Shell sem impor persistência ou um sistema global de configurações.

## ADDED Requirements

### Requirement: Sidebar suporta estado controlado e não controlado

`AdsAdminShell` MUST permitir que o estado expandido/recolhido da sidebar seja controlado pela aplicação por prop e callback ou mantido internamente a partir de um valor inicial/default. O comportamento MUST seguir convenções React previsíveis e MUST NOT sobrescrever um valor controlado recebido do consumidor.

#### Scenario: Aplicação controla a sidebar

- **WHEN** o consumidor fornece o estado da sidebar e callback de alteração
- **THEN** o shell solicita alterações pelo callback e renderiza de acordo com o valor controlado recebido

#### Scenario: Shell mantém estado local

- **WHEN** o consumidor fornece apenas um valor inicial/default
- **THEN** o shell mantém internamente as alterações de expansão e recolhimento durante seu ciclo de vida

### Requirement: Navegação móvel suporta estado controlado e não controlado

A abertura da navegação móvel MUST poder ser controlada externamente ou mantida internamente. O shell MUST expor callback de alteração suficiente para que a aplicação coordene esse estado quando necessário.

#### Scenario: Aplicação fecha menu após navegação

- **WHEN** a aplicação controla o estado móvel e uma ação de navegação é concluída
- **THEN** ela consegue fechar a navegação atualizando a prop correspondente sem depender de API interna do shell

### Requirement: Persistência de preferências pertence ao consumidor

O shell MUST NOT gravar estado automaticamente em localStorage, cookies, sessão ou backend. O consumidor MAY persistir uma preferência externamente e fornecer o valor restaurado ao shell por sua API controlada ou valor inicial.

#### Scenario: Aplicação restaura preferência persistida

- **WHEN** uma aplicação recupera externamente que o usuário prefere sidebar recolhida
- **THEN** ela consegue inicializar ou controlar o shell nesse estado sem que o design system conheça o mecanismo de persistência

### Requirement: Tema permanece fora do estado do shell

O shell MUST NOT criar um segundo mecanismo de tema. Controles como `ThemeToggle` MAY ser compostos no header, e a aparência do shell MUST responder aos tokens/tema globais já aplicados pelo design system.

#### Scenario: Header inclui controle de tema

- **WHEN** o consumidor compõe `ThemeToggle` ou controle equivalente no header
- **THEN** a alteração do tema afeta o shell pelos contratos públicos existentes sem estado de tema duplicado no pacote admin

### Requirement: Primeira versão limita preferências ao necessário para a estrutura

A change MUST NOT introduzir um sistema genérico de configurações de layout. Densidade global, posicionamento arbitrário do header, múltiplas sidebars, presets de layout e outras preferências não exigidas pelo shell ficam fora do escopo.

#### Scenario: Consumidor precisa de configuração não suportada

- **WHEN** uma aplicação necessita de uma preferência estrutural além dos contratos definidos nesta change
- **THEN** essa necessidade é tratada pela composição da aplicação ou por evolução futura da especificação, sem API genérica prematura
