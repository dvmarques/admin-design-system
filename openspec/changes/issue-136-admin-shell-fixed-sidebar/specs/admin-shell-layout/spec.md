## ADDED Requirements

### Requirement: Shell desktop mantém header e sidebar fixos com rolagem independente

No layout desktop, `AdsAdminShell` MUST limitar sua altura à viewport, manter header e sidebar em posição ao rolar o conteúdo principal e MUST rolar o conteúdo principal de forma independente da sidebar. A sidebar MUST rolar internamente somente quando seus itens excederem a altura disponível. O shell MUST NOT depender de altura fixa do header e MUST NOT gerar rolagem vertical duplicada nem rolagem horizontal inesperada da página no uso padrão.

#### Scenario: Página longa no desktop

- **WHEN** a viewport tem 1280×800 e o conteúdo principal excede a altura disponível
- **THEN** o conteúdo principal rola, header e sidebar permanecem na mesma posição e a página não rola

#### Scenario: Sidebar com muitos itens

- **WHEN** os itens da sidebar excedem a altura disponível
- **THEN** a sidebar rola internamente sem movimentar o conteúdo principal

#### Scenario: Sidebar com poucos itens

- **WHEN** os itens da sidebar cabem na altura disponível
- **THEN** a sidebar não apresenta barra de rolagem

#### Scenario: Header com múltiplas linhas

- **WHEN** o conteúdo do header quebra em mais de uma linha no desktop
- **THEN** o header cresce e nem a sidebar nem o conteúdo principal ficam sobrepostos ou cortados

#### Scenario: Viewport com altura reduzida

- **WHEN** a viewport desktop tem altura reduzida
- **THEN** header permanece visível e sidebar e conteúdo principal rolam dentro da altura restante, sem rolagem da página

#### Scenario: Sidebar expandida e recolhida

- **WHEN** o usuário recolhe ou expande a sidebar no desktop
- **THEN** a largura correspondente, a navegação por teclado e o comportamento de rolagem independente são preservados

### Requirement: Layout móvel preserva a rolagem e o Drawer

Fora do layout desktop, o shell MUST manter a rolagem da página e a navegação em `AdsDrawer`, com foco, rolagem e fechamento existentes.

#### Scenario: Viewport móvel

- **WHEN** a viewport tem 390×844 e o usuário abre a navegação
- **THEN** o Drawer abre, rola internamente quando necessário, devolve o foco ao fechar e a página mantém a rolagem própria
