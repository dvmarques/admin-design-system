## MODIFIED Requirements

### Requirement: Cabeçalho do demo exibe a marca

O admin-demo MUST exibir marca oficial e nome no topo da sidebar desktop e dentro da navegação móvel aberta, com recolhimento separado e acessível no desktop. Com Drawer fechado, MUST manter símbolo e nome acessível no header móvel. MUST usar o favicon oficial e carregar a marca na raiz e sob subcaminho, sem duplicar branding visível no header desktop.

#### Scenario: Pessoa abre uma rota do demo

- **WHEN** uma pessoa abre qualquer rota administrativa no desktop
- **THEN** marca e nome aparecem no topo da sidebar com nome curto Admin DS em uma linha e controle de recolhimento circular na divisória, com organização opcional abaixo e ações de tema/notificações/conta no header principal

#### Scenario: Pessoa alterna o tema

- **WHEN** a pessoa alterna entre claro e escuro
- **THEN** a marca permanece legível e a paleta dark é preservada

#### Scenario: Sidebar recolhida

- **WHEN** a sidebar desktop é recolhida
- **THEN** o topo preserva a altura anterior e símbolo, botão de expansão na divisória e navegação por ícones ou abreviações continuam acessíveis e não se sobrepõem

#### Scenario: Pessoa abre o demo em tela estreita

- **WHEN** a pessoa abre o demo a partir de 320px ou com zoom de 200%
- **THEN** menu e identificação compacta ficam alcançáveis no header, e o Drawer apresenta marca, organização opcional e navegação sem overflow horizontal

## ADDED Requirements

### Requirement: Visão geral apresenta densidade equilibrada

A Visão geral MUST aproximar apresentação, indicadores e progresso usando espaçamentos locais e tokens existentes, sem alturas fixas nem divisórias redundantes. Quatro indicadores MUST formar 2×2 em 1280px com sidebar expandida, quatro colunas quando a largura útil comportar e uma no mobile, preservando ordem e valores longos.

#### Scenario: Largura útil varia

- **WHEN** a viewport muda ou a sidebar recolhe
- **THEN** os indicadores seguem a largura do conteúdo em 1/2/4 colunas sem card isolado em terceira coluna ou overflow

#### Scenario: Texto e temas

- **WHEN** o conteúdo contém textos longos ou muda entre light e dark
- **THEN** a hierarquia e os estados atuais permanecem legíveis sem alterar espaçamentos globais de outras páginas

### Requirement: Seleção light do demo usa preenchimento suave

O item ativo da sidebar do demo MUST usar preenchimento light mais suave preservando texto destacado, faixa lateral, aria-current, hover, disabled e foco visível. A aparência dark MUST ser preservada.

#### Scenario: Navegação acessível

- **WHEN** o usuário navega por teclado entre itens nos dois temas
- **THEN** foco e seleção são distinguíveis sem depender apenas da cor do preenchimento

### Requirement: Organização usa avatar colorido no demo

O demo MUST fornecer ao avatar da organização o tom primary dos tokens, como no avatar da conta, preservando logo, iniciais, seleção e contraste em ambos os temas.

#### Scenario: Sidebar expandida ou recolhida

- **WHEN** a pessoa alterna o estado da sidebar ou escolhe outra organização
- **THEN** o avatar mantém o fundo colorido e as iniciais ou logo corretos, sem afetar a seleção

### Requirement: Branding mantém sua posição ao recolher

O símbolo oficial do demo MUST manter as mesmas coordenadas ao expandir ou recolher a sidebar desktop. Expandido, somente o nome Admin DS aparece ao lado. No mobile o menu MUST usar apenas esse branding como identificação visível, sem título Navegação do demo adicional.

#### Scenario: Alternância de estado

- **WHEN** a pessoa expande ou recolhe a sidebar
- **THEN** o símbolo permanece centralizado na largura recolhida, na mesma posição horizontal e vertical
