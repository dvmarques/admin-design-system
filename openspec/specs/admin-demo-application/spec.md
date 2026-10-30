# admin-demo-application Specification

## Purpose

Definir o comportamento observável da aplicação administrativa de demonstração, que integra os componentes e o shell do design system em rotas navegáveis e serve como referência prática de consumo para aplicações Next.js. Os requisitos descrevem funcionalidades já incorporadas à aplicação de referência, inclusive filtros, tabelas inteligentes, seletores de data e padrões de dashboard; não representam backlog futuro.

## Requirements

### Requirement: Layout administrativo compartilhado entre rotas

O admin-demo MUST apresentar o mesmo shell administrativo, com cabeçalho, navegação principal e controle de tema, em todas as rotas administrativas, preservando o estado do shell durante a navegação.

#### Scenario: Pessoa navega entre rotas

- **WHEN** uma pessoa navega da visão geral para outra rota administrativa
- **THEN** o cabeçalho, a navegação e o tema escolhido permanecem os mesmos e o conteúdo principal é substituído

#### Scenario: Navegação móvel fecha ao trocar de rota

- **WHEN** a navegação móvel está aberta e a pessoa ativa um link para outra rota
- **THEN** a navegação móvel fecha, o conteúdo da nova rota fica visível e o foco permanece em um elemento disponível

#### Scenario: Sidebar recolhida é mantida ao navegar

- **WHEN** a sidebar está recolhida e a pessoa navega para outra rota
- **THEN** a sidebar permanece recolhida

### Requirement: Navegação principal indica a página atual

A navegação principal MUST listar todas as rotas administrativas e indicar a rota atual de forma programática e visual, usando links fornecidos pela aplicação.

#### Scenario: Rota atual é identificada

- **WHEN** uma rota administrativa está aberta
- **THEN** apenas o item cuja rota é exatamente a atual é marcado como página atual para tecnologias assistivas e destacado visualmente

#### Scenario: Navegação por teclado

- **WHEN** uma pessoa percorre a navegação com o teclado
- **THEN** cada item recebe foco visível e pode ser ativado com Enter

### Requirement: Visão geral com indicadores

O admin-demo MUST oferecer uma rota de visão geral que apresente indicadores, progresso e atividade recente a partir de dados locais determinísticos.

#### Scenario: Visão geral é aberta

- **WHEN** a rota de visão geral é carregada
- **THEN** indicadores, progresso e lista de atividade são exibidos com nomes acessíveis e valores iguais em renderizações repetidas

### Requirement: Listagem com estados operacionais

O admin-demo MUST oferecer uma rota de listagem com tabela e paginação que demonstre os estados com dados, carregando, vazio e erro.

#### Scenario: Listagem com dados

- **WHEN** a listagem possui registros
- **THEN** a tabela apresenta legenda ou nome acessível e a paginação altera os registros exibidos e informa a página atual

#### Scenario: Página solicitada é inválida

- **WHEN** a página solicitada está ausente, não é numérica, é menor que 1 ou excede o total de páginas
- **THEN** a listagem exibe a primeira página (ausente, não numérica ou menor que 1) ou a última (acima do total) e a paginação indica essa página

#### Scenario: Listagem sem registros

- **WHEN** a listagem não possui registros a exibir
- **THEN** um estado vazio com mensagem e ação sugerida substitui a tabela

#### Scenario: Listagem carregando

- **WHEN** a listagem está carregando
- **THEN** a estrutura esperada da tabela é preservada com placeholders, a região é indicada como ocupada a tecnologias assistivas e nenhuma linha de dados é apresentada

#### Scenario: Listagem com erro

- **WHEN** a listagem falhou
- **THEN** o erro é anunciado a tecnologias assistivas com ação para tentar novamente

### Requirement: Formulário de cadastro com validação e confirmação

O admin-demo MUST oferecer uma rota com formulário que valide campos obrigatórios e o formato do e-mail, associe cada mensagem de erro ao seu campo e apresente notificação de resultado ao concluir.

#### Scenario: Envio com campo inválido

- **WHEN** a pessoa envia o formulário com um campo obrigatório vazio
- **THEN** o erro é exibido junto ao campo, associado a ele de forma acessível, e o foco vai para o primeiro campo inválido

#### Scenario: E-mail com formato inválido

- **WHEN** a pessoa envia o formulário com um e-mail preenchido sem formato válido, como `abc`
- **THEN** o campo de e-mail é marcado como inválido com mensagem própria de formato, associada a ele de forma acessível, e nenhuma confirmação é apresentada

#### Scenario: Envio válido

- **WHEN** a pessoa envia o formulário com todos os campos válidos
- **THEN** uma notificação de sucesso é apresentada e nenhum dado é persistido ou enviado a um servidor

### Requirement: Preferências de aparência e layout

O admin-demo MUST oferecer uma rota de preferências que permita escolher o tema e o estado da sidebar, aplicando a escolha de tema na renderização inicial seguinte.

#### Scenario: Sidebar é alterada pelas preferências

- **WHEN** a pessoa, em layout desktop, recolhe ou expande a sidebar pelas preferências
- **THEN** a sidebar do shell reflete o estado imediatamente e volta ao padrão após recarregar

#### Scenario: Controle de sidebar em largura de celular

- **WHEN** as preferências são abertas em largura de celular
- **THEN** o controle de sidebar fica indisponível e informa que se aplica ao layout desktop

#### Scenario: Tema escolhido é restaurado

- **WHEN** a pessoa escolhe um tema e recarrega a página
- **THEN** no build normal com SSR a preferência explícita `light` ou `dark` disponível no cookie é aplicada no HTML do servidor; no export estático a preferência é aplicada pelo script inicial antes da pintura, sem assumir leitura de cookie no servidor

### Requirement: Todas as rotas funcionam nos temas claro e escuro

Cada rota administrativa MUST permanecer legível e utilizável nos temas claro e escuro, sem perda de contraste, foco ou distinção de estados.

#### Scenario: Tema é alternado em qualquer rota

- **WHEN** o tema é alternado em uma rota com estados de erro e seleção visíveis
- **THEN** texto, foco, erro e seleção continuam distinguíveis

### Requirement: Responsividade das rotas administrativas

Cada rota administrativa MUST ser utilizável em larguras de celular, tablet e desktop, a partir de 320 px de largura, sem rolagem horizontal da página.

#### Scenario: Rota em largura de celular

- **WHEN** uma rota é aberta em largura de celular
- **THEN** a navegação fica disponível pelo gatilho do shell e o conteúdo se reorganiza sem rolagem horizontal da página; tabelas largas rolam dentro do próprio contêiner

#### Scenario: Rota na largura mínima de 320 px

- **WHEN** qualquer rota administrativa é aberta com 320 px de largura, nos temas claro e escuro
- **THEN** a página não rola na horizontal; conteúdo que não quebra linha, como a paginação, rola dentro do próprio painel

### Requirement: Acessibilidade por rota

Cada rota administrativa MUST ter um único título principal, regiões de referência identificáveis e nenhuma violação detectável de acessibilidade automatizada.

#### Scenario: Auditoria automatizada de uma rota

- **WHEN** uma rota é auditada com verificação automatizada de acessibilidade
- **THEN** nenhuma violação é reportada nos temas claro e escuro

### Requirement: Demo consome somente contratos públicos

O admin-demo MUST importar componentes, tipos, tokens e estilos apenas pelos pontos de entrada públicos dos pacotes, sem importar arquivos internos, sem configurar Tailwind, sem depender de classes utilitárias internas e sem redefinir a aparência interna dos componentes.

#### Scenario: Import interno é introduzido

- **WHEN** uma rota importa um caminho interno de um pacote do design system
- **THEN** a validação de consumo público falha

### Requirement: Personalização por design tokens sem recompilar

O admin-demo MUST refletir em todas as rotas a sobrescrita de variáveis CSS públicas `--ads-*`, sem exigir recompilar os componentes nem alterar suas folhas de estilo.

#### Scenario: Variável pública é sobrescrita no demo

- **WHEN** uma variável `--ads-*` de cor é sobrescrita no escopo da aplicação
- **THEN** os componentes de todas as rotas exibem o novo valor, nos temas claro e escuro, sem recompilar os pacotes

### Requirement: Catálogo de avaliação permanece disponível

O admin-demo MUST manter acessível a página de avaliação de componentes existente, sem alterar os requisitos de `admin-demo-evaluation`.

#### Scenario: Pessoa abre o catálogo de avaliação

- **WHEN** a pessoa acessa o catálogo pela navegação principal
- **THEN** os cenários de carregamento, formulário, confirmação destrutiva e sobreposições continuam disponíveis

### Requirement: Demo gerável como site estático

O admin-demo MUST poder ser gerado como site estático servido sob um subcaminho, sem alterar o comportamento do build normal nem exigir servidor para nenhuma de suas rotas.

#### Scenario: Todas as rotas administrativas no build estático

- **WHEN** o demo é gerado como site estático
- **THEN** todas as rotas administrativas existem como páginas estáticas e abrem sem servidor

#### Scenario: Build normal inalterado

- **WHEN** o demo é construído e iniciado sem a configuração do site estático
- **THEN** o tema continua sendo aplicado a partir da preferência salva e o comportamento é o mesmo de antes

### Requirement: Preferência de tema no site estático

No site estático, o admin-demo MUST aplicar a preferência de tema salva pela pessoa antes da primeira pintura e manter os controles de tema sincronizados.

#### Scenario: Troca de tema

- **WHEN** a pessoa alterna o tema no cabeçalho ou na página de preferências do site estático
- **THEN** o tema muda, os dois controles refletem o mesmo valor e a escolha é mantida ao recarregar

### Requirement: Link opcional para o Storybook

O admin-demo MUST exibir na navegação principal, junto de Catálogo, um link para o Storybook somente quando o endereço do catálogo for configurado no build, sem duplicá-lo no cabeçalho.

#### Scenario: Endereço configurado

- **WHEN** o demo Next.js é construído com o endereço do Storybook configurado
- **THEN** a navegação principal exibe um link acessível para o catálogo, que informa e abre o destino configurado em nova aba

#### Scenario: Endereço ausente

- **WHEN** o demo é construído sem o endereço do Storybook
- **THEN** o link e seu item de navegação não são renderizados

#### Scenario: Navegação responsiva e temas

- **WHEN** a pessoa usa a sidebar expandida, recolhida ou o menu móvel nos temas claro e escuro
- **THEN** Storybook permanece acessível por teclado com nome e foco visível, seguindo os estilos e tokens existentes da navegação

### Requirement: Visão geral exibe a evolução dos indicadores

A visão geral da demo MUST exibir, nos indicadores, a variação com `sentiment` coerente com o significado de cada métrica e uma série de evolução com alternativa textual, usando `AdsMetricCard` pelos exports públicos, sem regras de negócio nem dados reais.

#### Scenario: Indicadores com série

- **WHEN** a pessoa abre a visão geral
- **THEN** cada indicador com série exibe uma imagem com nome acessível que resume a evolução, e uma métrica em que a queda é boa mostra a queda com cor positiva

#### Scenario: Temas claro e escuro

- **WHEN** a visão geral é exibida nos temas claro e escuro
- **THEN** os traços são visíveis e a informação não depende só de cor

### Requirement: Página de exibição de dados mostra o sparkline avulso

A página `/data-display` da demo MUST exibir uma seção "Sparkline" com `AdsSparkline` importado do export público de `@dvmarques/admin-ds-components`, cobrindo os tons, uma série com lacunas e rótulos e um ponto único, cada um com nome acessível.

#### Scenario: Seção de sparkline

- **WHEN** a pessoa abre `/data-display`
- **THEN** a seção "Sparkline" exibe cada gráfico como imagem com nome acessível que resume a série, sem violações de acessibilidade nos temas claro e escuro

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

### Requirement: Preferência de tema Claro, Escuro e Sistema

O admin-demo MUST oferecer Claro, Escuro e Sistema no cabeçalho (menu compacto por ícones) e na página de preferências (grupo), ambos lendo e alterando a mesma preferência, sem remontar controles nem perder o foco. Sem preferência salva, MUST usar Sistema. A preferência explícita MUST ser persistida e restaurada, e preferências `light`/`dark` salvas anteriormente MUST continuar válidas. O tema efetivo (`light`/`dark`) MUST ser aplicado ao documento compatível com os tokens atuais.

#### Scenario: Controles sincronizados

- **WHEN** a pessoa escolhe Escuro no cabeçalho
- **THEN** o grupo nas preferências reflete Escuro e vice-versa, sem remontagem

#### Scenario: Foco preservado

- **WHEN** a pessoa escolhe um modo no grupo das preferências pelo teclado
- **THEN** o foco permanece na opção escolhida

#### Scenario: Sem preferência salva

- **WHEN** a página é aberta sem preferência salva
- **THEN** a preferência ativa é Sistema e o tema efetivo segue o sistema operacional

#### Scenario: Preferência restaurada

- **WHEN** a pessoa escolhe Escuro, Claro ou Sistema e recarrega
- **THEN** a mesma preferência é restaurada e Sistema volta a seguir o sistema operacional

#### Scenario: Preferência anterior migrada

- **WHEN** existe o cookie `ads-theme` com `light` ou `dark` de versões anteriores
- **THEN** essa preferência explícita é mantida

### Requirement: Sistema acompanha o sistema operacional

Enquanto a preferência for Sistema, o admin-demo MUST acompanhar mudanças de `prefers-color-scheme` e atualizar o tema efetivo. Em Claro ou Escuro explícitos, mudanças do sistema MUST NOT alterar o tema. Os listeners MUST ser removidos quando a preferência deixa de ser Sistema ou o componente é desmontado.

#### Scenario: Sistema muda com Sistema selecionado

- **WHEN** a preferência é Sistema e o sistema passa de claro para escuro
- **THEN** o tema efetivo passa a escuro e o ícone do gatilho continua sendo o monitor

#### Scenario: Preferência explícita estável

- **WHEN** a preferência é Claro e o sistema passa a escuro
- **THEN** o tema efetivo permanece claro

#### Scenario: Limpeza de listeners

- **WHEN** a pessoa troca de Sistema para um modo explícito
- **THEN** o listener de `prefers-color-scheme` é removido

### Requirement: Aplicação inicial sem flash e armazenamento resiliente

O admin-demo MUST aplicar a preferência efetiva antes da primeira pintura nos builds normal e estático, sem divergência de hidratação. Quando o servidor desconhece a preferência do sistema, MUST renderizar o fallback `light` e corrigi-lo antes da pintura. A indisponibilidade de armazenamento ou cookies MUST NOT quebrar a interface nem impedir a escolha na sessão.

#### Scenario: Estratégia de aplicação por build

- **WHEN** o tema é aplicado nos builds normal e estático
- **THEN** o cookie explícito pode informar o SSR normal e o export estático usa HTML pré-renderizado e script inicial no navegador
- **AND** a preferência Sistema ou ausente usa fallback `light` no servidor e é corrigida antes da primeira pintura

#### Scenario: Cookie explícito renderizado no servidor

- **WHEN** o build normal com SSR recebe cookie `ads-theme` igual a `dark`
- **THEN** a resposta do servidor já traz `data-theme="dark"` e `data-theme-preference="dark"`

#### Scenario: Sistema escuro antes da pintura

- **WHEN** a preferência é Sistema e o sistema está escuro
- **THEN** o script inicial define `data-theme="dark"` antes da hidratação, sem alternância visível

#### Scenario: Armazenamento indisponível

- **WHEN** a escrita do cookie falha
- **THEN** a escolha é aplicada na sessão atual e a interface continua funcional

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

### Requirement: Controles do cabeçalho sem borda

No cabeçalho do demo, o botão do menu de tema e o sino de notificações MUST aparecer sem borda, e o menu de tema MUST mostrar ícone e nome em cada opção, mantendo o gatilho só com ícone.

#### Scenario: Cabeçalho

- **WHEN** a pessoa abre o demo em viewport ampla
- **THEN** tema e sino não têm contorno, o avatar tem fundo colorido e as opções do tema mostram ícone e texto ao abrir o menu

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

### Requirement: Entrada do demo permanece sem autenticação

O admin-demo MUST manter `/` e todas as rotas administrativas existentes acessíveis sem login, sem redirecionamento automático para autenticação e sem middleware de sessão.

#### Scenario: Pessoa abre a visão geral

- **WHEN** a pessoa abre `/`
- **THEN** a visão geral administrativa é exibida com o shell habitual, sem exigir credenciais

#### Scenario: Pessoa navega entre rotas administrativas

- **WHEN** a pessoa percorre links da navegação principal do demo
- **THEN** nenhuma rota administrativa exige login nem bloqueia o conteúdo

### Requirement: Link opcional para o exemplo de login

O admin-demo MUST oferecer na navegação principal, na seção de exemplos de aplicação, um link acessível para o exemplo de login, sem remover ou ocultar os destinos existentes.

#### Scenario: Link na navegação

- **WHEN** a pessoa abre a navegação do demo em desktop ou no menu móvel
- **THEN** um item leva a `/login` com nome que identifica o exemplo de login

### Requirement: Rotas de autenticação fora do shell administrativo

O admin-demo MUST expor `/login`, `/esqueci-senha` e `/redefinir-senha` sem `AdsAdminShell`, com link visível **Voltar ao Demo** para `/` e controle de tema alinhado ao restante da aplicação.

#### Scenario: Layout sem sidebar

- **WHEN** a pessoa abre `/login`
- **THEN** não há sidebar administrativa nem cabeçalho do shell, e **Voltar ao Demo** está disponível

#### Scenario: Voltar ao demo

- **WHEN** a pessoa ativa **Voltar ao Demo** em qualquer rota de autenticação
- **THEN** a visão geral administrativa é exibida sem exigir login

### Requirement: Layout split com painel abstrato e logo oficial

As rotas de autenticação MUST usar layout dividido em viewport ampla: formulário à esquerda (~45% da largura útil) e painel decorativo à direita (~55%) com SVG abstrato leve, logo oficial do projeto e cores derivadas de tokens semânticos `--ads-*` (incluindo `--ads-color-primary`), sem cores hexadecimais fixas no SVG decorativo e sem pré-visualização do dashboard.

#### Scenario: Desktop com tema e cor primária

- **WHEN** a pessoa abre `/login` em largura desktop com tema claro ou escuro e com `--ads-color-primary` sobrescrito no escopo do documento
- **THEN** o painel decorativo reflete o tema e a cor primária configurada

#### Scenario: Mobile prioriza o formulário

- **WHEN** a pessoa abre uma rota de autenticação em largura de celular
- **THEN** o painel decorativo não compete com o formulário (oculto ou simplificado) e o formulário permanece legível sem rolagem horizontal da página

### Requirement: Login demonstrativo

A rota `/login` MUST oferecer campos de e-mail e senha (com mostrar/ocultar senha), opção **Lembrar-me** apenas demonstrativa, link para recuperação de senha, botão de entrar e mensagens que deixem claro que a autenticação é simulada. O envio válido MUST aceitar e-mail em formato válido e senha não vazia, exibir loading simulado breve e navegar para `/` sem validar usuário real nem persistir credenciais.

#### Scenario: Envio inválido

- **WHEN** a pessoa envia o formulário com e-mail inválido ou senha vazia
- **THEN** os erros são exibidos junto aos campos de forma acessível e nenhuma navegação para o demo ocorre

#### Scenario: Envio válido simulado

- **WHEN** a pessoa envia e-mail válido e senha não vazia
- **THEN** um estado de carregamento simulado é apresentado e, ao concluir, a pessoa é levada à visão geral do demo sem criar sessão real

### Requirement: Recuperação de senha simulada

A rota `/esqueci-senha` MUST solicitar e-mail, validar formato, simular confirmação de envio sem backend, oferecer continuar para redefinição e link para voltar ao login, com mensagens de demonstração acessíveis.

#### Scenario: E-mail inválido

- **WHEN** a pessoa envia um e-mail com formato inválido
- **THEN** o campo é marcado como inválido com mensagem associada

#### Scenario: Confirmação simulada

- **WHEN** a pessoa envia um e-mail válido
- **THEN** uma confirmação de envio simulado é apresentada com o foco movido para a mensagem e links permitem ir para `/redefinir-senha` ou `/login`

### Requirement: Redefinição de senha simulada

A rota `/redefinir-senha` MUST oferecer nova senha e confirmação com feedback de regras/força conforme `AdsPasswordInput`, validar coincidência e regras localmente, simular sucesso sem persistir senha e permitir retorno ao login.

#### Scenario: Confirmação divergente

- **WHEN** a pessoa envia senhas que não coincidem
- **THEN** um erro acessível é exibido junto ao campo correspondente, com o foco nele, e a senha não é tratada como redefinida

#### Scenario: Sucesso simulado

- **WHEN** a pessoa envia senha e confirmação válidas segundo as regras demonstrativas
- **THEN** uma mensagem de sucesso simulado é apresentada com o foco movido para ela e a pessoa pode voltar ao login por um link

### Requirement: Fluxo navegável com histórico e recarga

O fluxo de autenticação MUST funcionar com links, recarga da página e histórico do navegador, preservando a preferência de tema do demo e sem armazenar senha, token ou credenciais em cookies, `localStorage` ou `sessionStorage`, e sem colocar valores digitados na URL quando o envio nativo ocorrer sem JavaScript ou antes da hidratação.

#### Scenario: Navegação por links e voltar

- **WHEN** a pessoa percorre login, recuperação e redefinição por links e usa o botão voltar do navegador
- **THEN** cada etapa anterior é exibida corretamente

#### Scenario: Tema após recarga

- **WHEN** a pessoa escolhe um tema no fluxo de autenticação e recarrega a página
- **THEN** a mesma preferência de tema do demo é restaurada

#### Scenario: Ausência de armazenamento de credenciais

- **WHEN** a pessoa conclui login ou redefinição simulados
- **THEN** nenhum cookie, entrada de `localStorage` ou de `sessionStorage` contém senha ou token de autenticação

#### Scenario: Envio nativo sem JavaScript

- **WHEN** a pessoa envia um formulário de autenticação sem JavaScript ou antes da hidratação
- **THEN** a URL resultante não contém e-mail nem senha digitados

### Requirement: Acessibilidade e responsividade do fluxo de autenticação

Cada rota de autenticação MUST ter título principal único, controles operáveis por teclado, foco visível e auditoria automatizada sem violações nos temas claro e escuro em larguras de celular e desktop.

#### Scenario: Auditoria automatizada

- **WHEN** cada rota de autenticação é auditada com verificação automatizada de acessibilidade nos temas claro e escuro, em larguras de 320 px, 375 px e desktop, inclusive após erro de validação e após sucesso simulado
- **THEN** nenhuma violação é reportada

#### Scenario: Operação por teclado

- **WHEN** a pessoa preenche o formulário e percorre os controles com Tab até o botão de envio e ativa com Enter
- **THEN** o envio simulado ocorre sem uso do ponteiro

### Requirement: Demonstração interativa de código destacado

O admin-demo MUST oferecer uma rota de exemplos de `AdsHighlightedCodeSnippet` acessível pela navegação principal, sem substituir páginas existentes, com exemplos interativos que incluam Java, SQL e TSX e permitam alternar tema, linguagem, numeração de linhas e quebra de linha.

#### Scenario: Link na navegação

- **WHEN** a pessoa abre a navegação do demo
- **THEN** um item em exemplos de aplicação leva à rota da demonstração de código destacado

#### Scenario: Exemplos e controles

- **WHEN** a pessoa abre a rota da demonstração
- **THEN** pode alternar entre exemplos que incluem Java, SQL e TSX, mudar tema (`light`, `dark`, `auto`), linhas e wrap, e o snippet permanece utilizável em larguras de celular e desktop sem overflow horizontal da página

### Requirement: Fluxo de autenticação contido na viewport

As rotas demonstrativas de autenticação MUST ocupar a viewport sem rolagem da página nem crescimento causado pela decoração. O login MUST caber sem rolagem nas dimensões de referência com fonte padrão e ambos os temas. Quando o conteúdo exceder a altura disponível, MUST permitir rolagem interna acessível, mantendo o cabeçalho visível e a personalização por tokens.

#### Scenario: Login em desktop e celular

- **WHEN** a pessoa abre o login do demo Next.js em 1920×915, 1280×720, 768×600, 390×667 e 320×568, nos temas claro e escuro
- **THEN** título, campos, botão e recuperação estão na viewport sem rolagem da página nem do formulário, com painel à direita somente a partir de 48rem

#### Scenario: Conteúdo excede altura disponível

- **WHEN** uma rota de autenticação apresenta erros ou é aberta em uma viewport muito baixa ou com zoom
- **THEN** a página permanece contida e a rolagem interna permite alcançar o início, o fim e todos os controles por teclado, sem recortar conteúdo funcional

#### Scenario: Redimensionamento

- **WHEN** a viewport muda de largura ou altura
- **THEN** a composição acompanha a nova área disponível sem altura excedente imposta pela decoração
