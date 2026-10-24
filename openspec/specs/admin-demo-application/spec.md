# admin-demo-application Specification

## Purpose

Definir o comportamento observável da aplicação administrativa de demonstração, que integra os componentes e o shell do design system em rotas navegáveis e serve como referência prática de consumo para aplicações Next.js. Os requisitos abaixo são o escopo obrigatório (MVP) da demonstração; filtros complexos, tabelas inteligentes, seletores de data e dashboards avançados são melhorias futuras, tratadas na issue #17, e não são exigidos aqui.

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
- **THEN** a página é renderizada com o tema escolhido desde o servidor, sem alternância visível

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

O admin-demo MUST exibir no cabeçalho um link para o Storybook somente quando o endereço do catálogo for configurado no build.

#### Scenario: Endereço configurado

- **WHEN** o demo é construído com o endereço do Storybook configurado
- **THEN** o cabeçalho exibe um link acessível para o catálogo e a navegação principal permanece inalterada

#### Scenario: Endereço ausente

- **WHEN** o demo é construído sem o endereço do Storybook
- **THEN** o cabeçalho não exibe o link

### Requirement: Visão geral exibe a evolução dos indicadores

A visão geral da demo MUST exibir, nos indicadores, a variação com `sentiment` coerente com o significado de cada métrica e uma série de evolução com alternativa textual, usando `AdsMetricCard` pelos exports públicos, sem regras de negócio nem dados reais.

#### Scenario: Indicadores com série

- **WHEN** a pessoa abre a visão geral
- **THEN** cada indicador com série exibe uma imagem com nome acessível que resume a evolução, e uma métrica em que a queda é boa mostra a queda com cor positiva

#### Scenario: Temas claro e escuro

- **WHEN** a visão geral é exibida nos temas claro e escuro
- **THEN** os traços são visíveis e a informação não depende só de cor

### Requirement: Página de exibição de dados mostra o sparkline avulso

A página `/data-display` da demo MUST exibir uma seção "Sparkline" com `AdsSparkline` importado do export público de `@admin-ds/components`, cobrindo os tons, uma série com lacunas e rótulos e um ponto único, cada um com nome acessível.

#### Scenario: Seção de sparkline

- **WHEN** a pessoa abre `/data-display`
- **THEN** a seção "Sparkline" exibe cada gráfico como imagem com nome acessível que resume a série, sem violações de acessibilidade nos temas claro e escuro

### Requirement: Cabeçalho do demo exibe a marca

O admin-demo MUST exibir o logotipo do projeto no cabeçalho do shell, ao lado do nome "Admin Design System", em todas as rotas administrativas e nos temas claro e escuro, e MUST usar o favicon da marca. O logotipo MUST carregar tanto no demo servido na raiz quanto no demo publicado sob um subcaminho.

#### Scenario: Pessoa abre uma rota do demo

- **WHEN** uma pessoa abre qualquer rota administrativa do demo
- **THEN** o cabeçalho exibe o logotipo carregado ao lado do nome do projeto, e o logotipo não é anunciado como conteúdo separado por leitores de tela

#### Scenario: Pessoa alterna o tema

- **WHEN** a pessoa alterna entre os temas claro e escuro
- **THEN** o logotipo permanece visível e legível no cabeçalho

#### Scenario: Pessoa abre o demo em tela estreita

- **WHEN** uma pessoa abre o demo em uma tela de até 480 pixels de largura
- **THEN** o logotipo substitui o título visível, o cabeçalho não ganha altura e o nome "Admin Design System" continua disponível para tecnologias assistivas

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

O admin-demo MUST aplicar a preferência antes da primeira pintura em todos os builds, sem divergência de hidratação. Quando o servidor não conhece a preferência do sistema (Sistema ou ausente), MUST renderizar o fallback `light` e corrigi-lo antes da primeira pintura. A indisponibilidade de armazenamento ou de cookies MUST NOT quebrar a interface: a escolha continua valendo na sessão.

#### Scenario: Cookie explícito renderizado no servidor

- **WHEN** o cookie `ads-theme` é `dark`
- **THEN** a resposta do servidor já traz `data-theme="dark"` e `data-theme-preference="dark"`

#### Scenario: Sistema escuro antes da pintura

- **WHEN** a preferência é Sistema e o sistema está escuro
- **THEN** o script inicial define `data-theme="dark"` antes da hidratação, sem alternância visível

#### Scenario: Armazenamento indisponível

- **WHEN** a escrita do cookie falha
- **THEN** a escolha é aplicada na sessão atual e a interface continua funcional
