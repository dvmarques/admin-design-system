## ADDED Requirements

### Requirement: Menu de conta aberto pelo avatar

`AdsAccountMenu` MUST apresentar um único botão que contém o `AdsAvatar` e abre um painel compacto ancorado abaixo dele. O botão MUST ter nome acessível, expor o estado de abertura (`aria-expanded`) e a relação com o painel (`aria-controls` quando aberto), e MUST NOT conter elementos interativos aninhados. `AdsAvatar` MUST continuar utilizável sozinho, sem comportamento de menu.

#### Scenario: Abertura e fechamento

- **WHEN** a pessoa ativa o botão do avatar por clique, Enter ou Espaço
- **THEN** o painel abre, o foco vai para a primeira ação e `aria-expanded` é `true`; Escape ou clique externo fecham o painel e o foco volta ao botão

#### Scenario: Avatar isolado

- **WHEN** `AdsAvatar` é renderizado fora de `AdsAccountMenu`
- **THEN** ele não recebe papel, foco nem comportamento de menu

### Requirement: Identidade com foto, iniciais e falha de imagem

O painel MUST exibir avatar, nome e e-mail. O avatar MUST mostrar a foto quando `avatarSrc` carrega e as iniciais quando a foto está ausente ou falha. As iniciais MUST poder ser definidas pelo consumidor; sem elas MUST derivar do nome. Nome, e-mail ou foto ausentes MUST NOT quebrar o layout, e textos longos MUST NOT causar rolagem horizontal.

#### Scenario: Foto indisponível

- **WHEN** a imagem falha ao carregar
- **THEN** o avatar exibe as iniciais

#### Scenario: Iniciais do consumidor

- **WHEN** `initials` é informado
- **THEN** o avatar usa esse texto no lugar das iniciais derivadas

#### Scenario: Nome e e-mail longos em tela estreita

- **WHEN** nome e e-mail excedem a largura do painel em viewport de 320 px
- **THEN** o texto é truncado dentro do painel, que não ultrapassa a viewport

### Requirement: Ações configuráveis e conta opcional

O painel MUST renderizar as ações dos grupos informados, cada uma com ícone opcional, como link (`href`) ou botão (`onSelect`), com separação visual entre grupos. `Trocar conta` MUST aparecer somente quando `switchAccount` for informado e MUST NOT ser tratado como troca de organização. A biblioteca MUST NOT implementar autenticação, sessão nem logout reais, e MUST NOT duplicar uma ação quando o consumidor a fornece uma vez.

#### Scenario: Sem troca de conta

- **WHEN** `switchAccount` não é informado
- **THEN** nenhuma ação de troca de conta é renderizada

#### Scenario: Ação como callback

- **WHEN** a pessoa ativa uma ação com `onSelect`
- **THEN** o callback é chamado uma vez e o painel fecha ao concluir

#### Scenario: Ação desabilitada

- **WHEN** uma ação está `disabled`
- **THEN** ela é exposta como desabilitada, não executa `onSelect` e é ignorada pela navegação por setas

### Requirement: Ação assíncrona pendente e com erro

Quando `onSelect` retorna uma `Promise`, a ação MUST ficar `aria-busy` e inoperante enquanto pendente, o painel MUST permanecer aberto até a conclusão, e uma rejeição MUST exibir mensagem com `role="alert"` e reabilitar a ação.

#### Scenario: Sair com atraso

- **WHEN** a ação retorna uma `Promise` ainda não resolvida
- **THEN** a ação fica ocupada e o painel permanece aberto; ao resolver, o painel fecha

#### Scenario: Falha

- **WHEN** a `Promise` é rejeitada
- **THEN** o painel permanece aberto, exibe o alerta e a ação volta a ficar disponível

### Requirement: Estado de abertura controlado ou não

`AdsAccountMenu` MUST suportar `open` com `onOpenChange` (controlado) e `defaultOpen` (não controlado).

#### Scenario: Controlado

- **WHEN** `open` é `false` e a pessoa ativa o botão sem atualizar `open`
- **THEN** `onOpenChange(true)` é chamado e o painel permanece fechado

### Requirement: Teclado, responsividade, temas e hidratação

O painel MUST ser operável por teclado (setas, Home, End movem entre ações habilitadas; Tab fecha o painel e devolve o foco ao botão), ter foco visível e contraste adequados nos temas claro e escuro, caber na viewport em 320 px sem clipping, e o markup de servidor MUST ser o do estado fechado, sem acessar o DOM na renderização.

#### Scenario: Navegação por setas

- **WHEN** o foco está na primeira ação e a pessoa pressiona ArrowDown
- **THEN** o foco vai para a próxima ação habilitada; em End vai para a última

#### Scenario: Next.js

- **WHEN** o componente é renderizado no servidor e hidratado no cliente
- **THEN** não há divergência de hidratação e o botão do avatar está presente e fechado

#### Scenario: Viewport estreita

- **WHEN** o painel abre em viewport de 320 px
- **THEN** seus limites ficam dentro da viewport

### Requirement: Fundo do avatar configurável

`AdsAccountMenu` MUST dar ao avatar do gatilho e da identidade um fundo, por padrão o tom `primary`, e MUST aceitar `user.avatarTone`, `user.avatarBackgroundColor` e `user.avatarForegroundColor` para escolher o tom do tema ou qualquer cor CSS.

#### Scenario: Fundo padrão

- **WHEN** nenhuma cor é informada e não há foto
- **THEN** o avatar mostra as iniciais sobre o fundo do tom `primary`

#### Scenario: Cor escolhida pelo consumidor

- **WHEN** `avatarBackgroundColor` e `avatarForegroundColor` são informados
- **THEN** o gatilho e a identidade do painel usam essas cores
