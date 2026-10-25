# admin-shell-layout Specification

## Purpose

Fornece a composição estrutural reutilizável de aplicações administrativas com header, sidebar e conteúdo principal sem acoplamento a framework de aplicação, roteador ou domínio.

## Requirements

### Requirement: Shell fornece regiões estruturais explícitas

O sistema MUST fornecer `AdsAdminShell` em `@admin-ds/admin` com regiões públicas para header, sidebar e conteúdo principal. A API MUST permitir composição React arbitrária dentro de cada região e MUST NOT exigir conhecimento de rotas, autenticação, autorização, dados ou domínio da aplicação consumidora.

#### Scenario: Aplicação compõe uma página administrativa

- **WHEN** o consumidor fornece branding e ações no header, navegação na sidebar e conteúdo de página na área principal
- **THEN** o shell organiza essas regiões em uma estrutura administrativa coerente sem interpretar o conteúdo recebido

#### Scenario: Conteúdo usa componentes públicos existentes

- **WHEN** o consumidor usa componentes de `@admin-ds/components` dentro das regiões do shell
- **THEN** a composição funciona apenas por APIs públicas, sem imports internos entre pacotes consumidos pela aplicação

### Requirement: Shell expõe landmarks acessíveis

A composição MUST produzir landmarks estruturais apropriados para header, navegação lateral e conteúdo principal. O conteúdo principal MUST usar semântica `main` no caso padrão, e a navegação lateral MUST poder receber nome acessível configurável.

#### Scenario: Usuário navega por landmarks

- **WHEN** uma tecnologia assistiva enumera as regiões da página
- **THEN** header, navegação e conteúdo principal podem ser identificados e diferenciados semanticamente

### Requirement: Shell respeita tokens e temas públicos

O shell MUST utilizar tokens e CSS distribuído do design system para superfícies, texto, bordas, foco, espaçamento e motion. A aparência MUST permanecer funcional nos temas claro e escuro sem exigir Tailwind na aplicação consumidora.

#### Scenario: Aplicação alterna o tema

- **WHEN** o tema público muda entre claro e escuro
- **THEN** header, sidebar, conteúdo e divisores do shell permanecem legíveis e coerentes com os tokens ativos

### Requirement: Shell permanece extensível sem impor conteúdo de domínio

Header, sidebar e conteúdo MUST aceitar composição arbitrária e o shell MUST NOT criar contratos específicos para usuário, avatar, produto, permissões, breadcrumbs, notificações ou rotas. Conceitos desse tipo MAY ser compostos pelo consumidor usando componentes públicos.

#### Scenario: Header recebe ações customizadas

- **WHEN** uma aplicação inclui controle de tema, menu de usuário e uma ação própria no header
- **THEN** o shell apresenta o conteúdo recebido sem exigir props específicas para esses conceitos

### Requirement: Controle de tema do cabeçalho usa a tipografia do design system

`ThemeToggle`, quando composto no cabeçalho de `AdsAdminShell`, MUST usar a família tipográfica pública do design system, mesmo em uma aplicação cujo `body` não define `font-family`, e MUST manter o rótulo em uma única linha.

#### Scenario: Aplicação sem fonte definida no body

- **WHEN** `ThemeToggle` é composto no cabeçalho em uma aplicação cujo `body` não define `font-family`
- **THEN** o botão usa a família tipográfica do design system e mantém o rótulo em uma única linha

#### Scenario: Largura reduzida

- **WHEN** a viewport tem 390px de largura
- **THEN** o rótulo do `ThemeToggle` não é quebrado em várias linhas

### Requirement: Cabeçalho composto com conteúdo responsivo cabe em larguras estreitas

Um cabeçalho de `AdsAdminShell` composto com conteúdo capaz de quebrar linha MUST permanecer dentro da largura da viewport em 390px, sem cortar controles nem provocar rolagem horizontal da página, e MUST manter em telas largas a disposição em uma única linha.

#### Scenario: Ações do cabeçalho em tela estreita

- **WHEN** a viewport tem 390px de largura e o cabeçalho contém marca, controle de tema e ações em um grupo que pode quebrar linha
- **THEN** nenhum controle fica cortado, nenhum rótulo é quebrado no meio de uma palavra e a página não rola na horizontal

#### Scenario: Larguras amplas

- **WHEN** a viewport tem 1280px de largura
- **THEN** o cabeçalho mantém a disposição em uma única linha e a mesma altura de antes

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

### Requirement: Topo opcional da sidebar acompanha o cabeçalho

AdsAdminShell MUST oferecer composição opcional com conteúdo no topo da sidebar alinhado à altura natural do header principal, preservando o layout padrão quando não solicitada. O topo MUST permanecer alcançável enquanto a navegação e o main rolam independentemente.

#### Scenario: Header cresce e sidebar recolhe

- **WHEN** a composição é ativada e o header ou branding tem múltiplas linhas, ou a sidebar é recolhida
- **THEN** os topos compartilham a altura necessária sem sobreposição, corte de texto ou rolagem duplicada

#### Scenario: Conteúdo opcional ausente

- **WHEN** não há conteúdo de topo ou organização fornecido
- **THEN** não há bloco vazio, separador ou altura reservada para esse conteúdo

#### Scenario: Consumidor mantém composição anterior

- **WHEN** o consumidor não ativa a nova composição
- **THEN** layout, estados controlados/não controlados, CSS distribuído e renderização no servidor preservam os contratos existentes

#### Scenario: Navegação móvel

- **WHEN** a viewport passa ao mobile e o usuário abre o menu pelo header
- **THEN** o conteúdo de topo aparece em uma única instância no Drawer, com organização opcional, foco, fechamento e isolamento existentes

#### Scenario: Temas e personalização

- **WHEN** o consumidor aplica temas ou sobrescreve tokens públicos
- **THEN** superfícies, texto, foco e bordas da nova composição respondem sem Tailwind no consumidor

### Requirement: Seleção recolhida é proporcional e tem recuo consistente

Na composição sidebar-header, o item ativo recolhido MUST ter destaque de 2,75rem por 2,75rem sem alargar a barra. Expandido e recolhido MUST ter o mesmo recuo lateral do destaque, preservando ícones, texto, hierarquia, foco e aria-current, com ou sem espaço ocupado pela scrollbar.

#### Scenario: Recolhimento com scrollbar

- **WHEN** a navegação precisa de scrollbar e a sidebar alterna seu estado
- **THEN** o destaque mantém o mesmo recuo da borda e fica quadrado no recolhido, sem mudar a largura da barra ou cortar o conteúdo

#### Scenario: Navegação sem scrollbar

- **WHEN** os itens cabem ou o navegador usa scrollbar sobreposta
- **THEN** o destaque recolhido continua quadrado, com recuo coerente no estado expandido

### Requirement: Menu móvel do shell ocupa a viewport

O menu móvel do shell MUST ocupar a largura e altura da viewport sem faixa de backdrop no rodapé. O branding opcional MUST coexistir com o botão de fechar sem sobreposição, mesmo sem mobileTitle.

#### Scenario: Menu sem título adicional

- **WHEN** o consumidor fornece branding e omite mobileTitle
- **THEN** marca, organização e navegação aparecem a partir do topo, sem espaço editorial vazio, mantendo nome acessível, fechamento e foco

### Requirement: Ícones da navegação mantêm posição horizontal no desktop

Na composição sidebar-header, os ícones de links e grupos de navegação MUST manter a mesma coordenada horizontal ao expandir e recolher a sidebar desktop, com ou sem scrollbar física. Os ícones MUST ficar centralizados no destaque azul recolhido, e o avatar da organização MUST compartilhar a mesma coluna nos dois estados. Ícones MUST permanecer visíveis e contidos nos seus alvos, preservando foco, nomes acessíveis, aria-current e a navegação móvel.

#### Scenario: Recolhimento com scrollbar nativa

- **WHEN** o usuário recolhe e expande a sidebar desktop com itens suficientes para rolagem nos temas claro ou escuro
- **THEN** os ícones mantêm sua coordenada horizontal e a centralização no destaque e o alinhamento do avatar da organização sem serem cortados

#### Scenario: Navegação com scrollbar sobreposta

- **WHEN** o navegador não reserva espaço lateral para a scrollbar
- **THEN** a posição dos ícones permanece estável entre os dois estados

#### Scenario: Consumo com tokens e mobile

- **WHEN** uma aplicação Next.js importa o CSS compilado, personaliza a largura compacta e depois abre o menu em viewport móvel
- **THEN** o eixo desktop acompanha a largura configurada e o menu móvel mantém rótulos e composição completa
