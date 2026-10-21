## ADDED Requirements

### Requirement: Conteúdo fora do modal fica inerte

Enquanto um `AdsDialog` ou `AdsDrawer` estiver aberto, o conteúdo da página fora do overlay MUST ficar inerte: sem receber foco, cliques ou ativação por teclado e fora da árvore de acessibilidade, nos navegadores com suporte ao atributo `inert`.

#### Scenario: Usuário tenta alcançar o fundo por teclado

- **WHEN** um modal está aberto e o usuário percorre a página com Tab e Shift+Tab
- **THEN** o foco permanece dentro do modal e nenhum controle do fundo o recebe

#### Scenario: Usuário clica no conteúdo de fundo

- **WHEN** um modal está aberto e o usuário clica em um controle do fundo
- **THEN** o controle não é acionado e o clique na área do backdrop segue as regras de fechamento por backdrop

#### Scenario: Tecnologia assistiva lê a página

- **WHEN** um modal está aberto
- **THEN** o conteúdo do fundo não é exposto na árvore de acessibilidade e o modal permanece acessível

### Requirement: Estado anterior do conteúdo é restaurado

Ao fechar ou desmontar o modal, o conteúdo da página MUST voltar ao estado anterior à abertura, preservando um `inert` que a aplicação já tivesse aplicado e sem deixar a página inerte.

#### Scenario: Modal é fechado

- **WHEN** o modal aberto é fechado ou desmontado
- **THEN** o fundo volta a receber foco e cliques e o foco retorna ao elemento que abriu o modal

#### Scenario: Aplicação já tornou uma região inerte

- **WHEN** uma região já marcada como inerte pela aplicação existe quando o modal abre e depois fecha
- **THEN** a região continua inerte depois do fechamento

### Requirement: Modais aninhados restauram o fundo apenas no último fechamento

Com mais de um modal aberto, apenas o modal mais recente MUST ficar interativo, e a página MUST voltar a ser interativa somente quando o último modal fechar, em qualquer ordem de fechamento.

#### Scenario: Modal aberto a partir de outro modal

- **WHEN** um segundo modal é aberto a partir do primeiro
- **THEN** o primeiro modal fica inerte e apenas o segundo recebe foco e cliques

#### Scenario: Modais fechados fora de ordem

- **WHEN** o primeiro modal fecha enquanto o segundo continua aberto
- **THEN** o fundo continua inerte até o segundo modal fechar

### Requirement: Inerte sem suporte, em StrictMode e na renderização do servidor

Em navegadores sem suporte ao atributo `inert`, o modal MUST manter o comportamento de foco preso e `aria-modal` sem erro. O mesmo comportamento MUST valer em StrictMode, e a renderização no servidor e a hidratação MUST NOT ser alteradas.

#### Scenario: Aplicação em StrictMode

- **WHEN** um modal abre e fecha em StrictMode
- **THEN** o fundo fica inerte enquanto o modal está aberto e é restaurado ao fechar

#### Scenario: Aplicação Next.js com App Router

- **WHEN** uma página com um modal inicialmente fechado é renderizada no servidor e hidratada
- **THEN** o HTML do servidor não contém `inert` e a hidratação ocorre sem divergência
