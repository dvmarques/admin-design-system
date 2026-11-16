# integrated-admin-compositions Specification

## Purpose

Definir a demonstração integrada de consulta, formulário, shell e indicadores e a verificação de acessibilidade e compatibilidade dos consumidores do design system.

## Requirements

### Requirement: Índice navegável de composições administrativas

A Demo MUST disponibilizar um índice de integração que conduza a consulta, formulário, shell e indicadores, preservando o único shell compartilhado. A documentação e o Storybook MUST apontar exemplos e decisões de uso, distinguindo primitivos de composições.

#### Scenario: Navegação entre cenários

- **WHEN** uma pessoa abre o índice e acessa qualquer exemplo
- **THEN** a rota de destino é navegável pelo teclado, mantém um único `main` e `h1`, e reutiliza o layout administrativo

#### Scenario: Sem dependência de sistemas externos

- **WHEN** os exemplos são renderizados sem acesso à rede do consumidor
- **THEN** dados e estados são fictícios e locais, com imports públicos e CSS já compilado

### Requirement: Consulta completa com estados e ações

A composição de consulta MUST apresentar filtro, tabela responsiva, paginação, ações por linha e estados distintos de resultados, vazio, carregamento e falha.

#### Scenario: Filtragem e paginação

- **WHEN** a busca altera a lista ou a pessoa troca de página
- **THEN** a lista e o total são atualizados coerentemente, e a paginação permanece dentro dos limites

#### Scenario: Vazio, erro e carregamento

- **WHEN** a pessoa seleciona um estado demonstrativo
- **THEN** o conteúdo adequado é mostrado, com status anunciado, sem que dados fictícios sejam enviados para backend

#### Scenario: Ação de linha

- **WHEN** a pessoa ativa uma ação por mouse ou teclado
- **THEN** recebe um feedback contextual e nenhuma operação real ocorre

### Requirement: Formulário completo e conteúdo resumido

O formulário MUST demonstrar campos e seções semânticas, validação, mensagem de resultado, controles desabilitados e ações primárias/secundárias. O dashboard MUST usar cards somente em resumos e indicadores, sem impor card ao conteúdo inteiro.

#### Scenario: Validação e controle desabilitado

- **WHEN** uma pessoa submete campos inválidos e depois os corrige
- **THEN** erros acessíveis são apresentados e removidos, o sucesso é anunciado, e o campo desabilitado permanece indisponível para edição

#### Scenario: Indicadores independentes

- **WHEN** uma pessoa visita o dashboard
- **THEN** encontra métricas em cards e seções com H2/H3/H4 sem card externo obrigatório

### Requirement: Compatibilidade verificável dos consumidores

Os exemplos MUST ser validados nos temas claro/escuro, larguras 320px, 390px, 768px e desktop, com foco/teclado, acessibilidade automatizada e ausência de erros de hidratação. Os pacotes MUST continuar consumíveis por exports públicos e CSS distribuído, sem obrigar Tailwind.

#### Scenario: Testes integrados

- **WHEN** a suíte Playwright e o build de distribuição são executados
- **THEN** cada rota tem headings e landmarks coerentes, sem overflow crítico e sem erros conhecidos de hidratação, e os orçamentos existentes sinalizam regressões

#### Scenario: Limites das verificações

- **WHEN** são documentados resultados de zoom, contraste, capturas e bundle
- **THEN** métricas, SHA, ferramentas e limitações são informados; simulação de reflow não é declarada como aprovação humana de zoom 200% ou leitor de tela
