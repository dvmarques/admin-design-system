# nextjs-consumption Specification

## Purpose

Garantir que os pacotes do design system possam ser consumidos por aplicações Next.js com App Router, respeitando renderização no servidor e hidratação no cliente.

## Requirements

### Requirement: Consumo pelo App Router

A biblioteca MUST permitir que uma aplicação Next.js com App Router importe suas APIs públicas e seus estilos globais por caminhos documentados.

#### Scenario: Aplicação Next.js executa build de produção

- **WHEN** a aplicação de referência importa os pacotes apenas por pontos de entrada públicos
- **THEN** o build de produção é concluído sem configuração baseada em caminhos internos do workspace

### Requirement: Compatibilidade com renderização no servidor

Componentes que não exigem estado, efeitos, eventos ou APIs do navegador MUST ser consumíveis em um contexto de Server Component.

#### Scenario: Componente estático é renderizado no servidor

- **WHEN** um Server Component importa e renderiza um componente estático compatível
- **THEN** o componente é produzido sem exigir que seu consumidor seja convertido em Client Component

### Requirement: Limite explícito de componentes interativos

Componentes que exigem execução no navegador MUST expor um ponto de entrada compatível com Client Components e documentar esse requisito.

#### Scenario: Componente interativo é utilizado

- **WHEN** uma aplicação renderiza um componente que depende de interação no navegador
- **THEN** o componente funciona dentro de um limite de Client Component explicitamente identificável

### Requirement: Hidratação consistente

Os componentes MUST produzir marcação inicial determinística para as mesmas propriedades e o mesmo estado de tema disponíveis no servidor e no cliente. Em um build normal, o servidor pode ler a preferência explícita do cookie; um export estático não tem renderização por requisição e precisa reconciliar preferência Sistema ou explícita por script pré-hidratação sem prometer SSR personalizado.

#### Scenario: Página é hidratada

- **WHEN** o servidor e o cliente recebem as mesmas propriedades e configuração inicial de tema
- **THEN** a hidratação ocorre sem divergência de marcação atribuível ao design system

### Requirement: Aplicação de referência

O projeto MUST manter uma aplicação Next.js de referência que consuma os artefatos distribuíveis como uma aplicação externa, organizada em múltiplas rotas com layout compartilhado e validada quanto a renderização no servidor e hidratação em cada rota. Quando os itens navegam, a aplicação MUST usar `renderLink` em `AdsNav` e `AdsBreadcrumb` e `renderPageLink` em `AdsPagination` com `next/link`, sem conteúdo interativo aninhado, consumindo a biblioteca apenas por caminhos públicos.

#### Scenario: Contrato público é verificado

- **WHEN** o pipeline valida a aplicação de referência
- **THEN** imports internos ou dependências implícitas do workspace fazem a validação falhar

#### Scenario: Rotas são renderizadas e hidratadas

- **WHEN** cada rota da aplicação de referência é renderizada no servidor e hidratada no navegador
- **THEN** nenhuma divergência de hidratação atribuível ao design system é reportada em nenhuma rota

#### Scenario: Paginação de clientes por links

- **WHEN** a página `/clientes` é exibida
- **THEN** cada página da paginação é um link com nome acessível "Página N", a página atual expõe `aria-current="page"` e acionar uma página navega para `/clientes?pagina=N`, preservando os filtros e a ordenação ativos

#### Scenario: Navegação e breadcrumb por links

- **WHEN** o catálogo de componentes exibe `AdsNav` e `AdsBreadcrumb` com destinos
- **THEN** cada destino é um único link do `next/link`, sem elemento interativo aninhado

### Requirement: Padrões avançados na aplicação de referência

A aplicação de referência MUST demonstrar `AdsFilterBar`, `AdsSmartTable`, `AdsMetricCard`, `AdsDashboardGrid` e `AdsDashboardPanel`, mantendo filtros, ordenação e página de `/clientes` em `searchParams`, tratados de forma determinística no servidor, com dados estáticos.

#### Scenario: Filtros e ordenação de clientes na URL

- **WHEN** a página `/clientes` é aberta com `?q=`, `?status=`, `?plano=`, `?de=`, `?ate=` ou `?ordem=`
- **THEN** o servidor exibe somente os clientes correspondentes, na ordem pedida, e abrir a mesma URL de novo produz o mesmo resultado

#### Scenario: Parâmetros inválidos são normalizados

- **WHEN** a URL contém filtro desconhecido, data inválida, ordenação por coluna inexistente ou página fora do intervalo
- **THEN** o parâmetro inválido é ignorado ou normalizado e a página não falha

#### Scenario: Alterar filtro ou ordenação

- **WHEN** a pessoa altera um filtro ou a ordenação em `/clientes`
- **THEN** a URL é atualizada, a lista é recalculada no servidor e a paginação volta para a página 1

#### Scenario: Filtros sem resultado

- **WHEN** os filtros não correspondem a nenhum cliente
- **THEN** a tabela exibe um estado vazio com a ação "Limpar filtros" e a barra de filtros continua utilizável

#### Scenario: Visão geral com padrões de dashboard

- **WHEN** a página `/` é exibida
- **THEN** os indicadores usam `AdsMetricCard` e o progresso e a atividade recente ficam em painéis de `AdsDashboardGrid`, com títulos e nomes acessíveis estáveis

#### Scenario: Listagem com ações em massa no demo

- **WHEN** a pessoa seleciona linhas em `/clientes`
- **THEN** a barra de ações em massa aparece e a exclusão demonstrada exige confirmação destrutiva, sem persistir dados

#### Scenario: Formulário em etapas no demo

- **WHEN** a página `/clientes/novo` é exibida
- **THEN** o cadastro usa `AdsStepForm` com validação por etapa e confirmação final sem enviar dados
