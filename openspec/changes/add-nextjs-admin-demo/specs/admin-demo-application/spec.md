# Spec Delta

## Purpose

Definir o comportamento observável da aplicação administrativa de demonstração, que integra os componentes e o shell do design system em rotas navegáveis e serve como referência prática de consumo para aplicações Next.js. Os requisitos abaixo são o escopo obrigatório (MVP) da demonstração; filtros complexos, tabelas inteligentes, seletores de data e dashboards avançados são melhorias futuras, tratadas na issue #17, e não são exigidos aqui.

## ADDED Requirements

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

O admin-demo MUST oferecer uma rota com formulário que valide campos obrigatórios, associe cada mensagem de erro ao seu campo e apresente notificação de resultado ao concluir.

#### Scenario: Envio com campo inválido

- **WHEN** a pessoa envia o formulário com um campo obrigatório vazio
- **THEN** o erro é exibido junto ao campo, associado a ele de forma acessível, e o foco vai para o primeiro campo inválido

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

Cada rota administrativa MUST ser utilizável em larguras de celular, tablet e desktop, sem rolagem horizontal da página.

#### Scenario: Rota em largura de celular

- **WHEN** uma rota é aberta em largura de celular
- **THEN** a navegação fica disponível pelo gatilho do shell e o conteúdo se reorganiza sem rolagem horizontal da página; tabelas largas rolam dentro do próprio contêiner

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
