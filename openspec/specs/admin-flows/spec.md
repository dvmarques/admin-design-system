# admin-flows Specification

## Purpose

Compõe os componentes públicos em fluxos administrativos recorrentes (listagem com ações em massa, formulário em etapas e confirmação de ações destrutivas), sem regras de negócio, persistência nem roteamento, com todo o estado controlado pela aplicação consumidora.

## Requirements

### Requirement: Composição sem regras de negócio

O sistema MUST fornecer `AdsBulkActionBar`, `AdsListFlow`, `AdsStepForm` e `AdsConfirmDialog` em `@dvmarques/admin-ds-admin`, compostos apenas por APIs públicas existentes. Os componentes e tipos públicos MUST usar o prefixo `Ads`, as classes públicas `ads-` e as variáveis `--ads-`, sem expor Tailwind. Eles MUST NOT persistir nem enviar dados, MUST NOT guardar a seleção nem a etapa ativa e MUST NOT importar o roteador do Next.js nem ler a URL.

#### Scenario: Estado não aplicado pelo consumidor

- **WHEN** o consumidor não atualiza `selectedIds`, `activeStepId` ou `open` após uma notificação de mudança
- **THEN** o componente continua exibindo o estado anterior

#### Scenario: Uso em Next.js

- **WHEN** os componentes são renderizados no servidor e hidratados em uma aplicação Next.js
- **THEN** a marcação inicial depende só das props e não há erro de hidratação

### Requirement: Barra de ações em massa

`AdsBulkActionBar` MUST renderizar a barra com as ações do consumidor e um botão para limpar a seleção apenas quando `selectedCount` for maior que zero, e MUST NOT renderizar a barra sem seleção. Uma região `role="status"` MUST anunciar a quantidade de itens selecionados de forma educada, e a mesma contagem MUST estar visível na barra.

#### Scenario: Barra aparece com seleção

- **WHEN** `selectedCount` passa de zero para três
- **THEN** a barra aparece com as ações, exibe "3 itens selecionados" e a região de status anuncia a mesma quantidade

#### Scenario: Barra some sem seleção

- **WHEN** `selectedCount` é zero
- **THEN** a barra e suas ações não estão no DOM e a região de status está vazia

#### Scenario: Limpar seleção

- **WHEN** a pessoa aciona "Limpar seleção" por teclado
- **THEN** `onClear` é chamado

### Requirement: Fluxo de listagem

`AdsListFlow` MUST compor, na ordem, a barra de filtros (quando `filterBar` é informado), a barra de ações em massa (quando `bulkActions` é informado, com a contagem de `selectedIds`), a tabela inteligente e a paginação (quando `pagination` é informada). O fluxo MUST NOT buscar, filtrar, ordenar nem paginar dados, e MUST preservar o comportamento de `AdsSmartTable`.

#### Scenario: Composição completa

- **WHEN** o consumidor informa `filterBar`, `bulkActions`, linhas e `pagination` com linhas selecionadas
- **THEN** a página exibe filtros, a barra com a contagem, a tabela e a paginação

#### Scenario: Selecionar linhas mostra a barra

- **WHEN** a pessoa marca uma linha da tabela
- **THEN** `onSelectionChange` recebe o id e, após o consumidor aplicar, a barra aparece com "1 item selecionado"

#### Scenario: Limpar seleção sem handler dedicado

- **WHEN** `onClearSelection` não é informado e a pessoa aciona "Limpar seleção"
- **THEN** `onSelectionChange` recebe uma lista vazia

#### Scenario: Estados da tabela

- **WHEN** a tabela está carregando, vazia ou com erro
- **THEN** o estado correspondente de `AdsSmartTable` é exibido e a barra de ações segue a contagem de `selectedIds`

### Requirement: Confirmação de ação destrutiva

`AdsConfirmDialog` MUST usar `AdsDialog` com título e descrição associados e oferecer "Cancelar" e "Confirmar", sem fechar nem confirmar por conta própria: `onConfirm` e `onOpenChange` notificam o consumidor. O foco inicial MUST ir ao primeiro controle elegível de `children` ou, sem ele, a "Cancelar". `Escape` MUST cancelar e o foco MUST voltar ao elemento que abriu o diálogo. `destructive` MUST usar a variante de perigo e `pending` MUST deixar as ações indisponíveis (cenário Pendente).

#### Scenario: Foco e nome acessível

- **WHEN** o diálogo abre sem controles interativos em `children`
- **THEN** ele tem nome e descrição acessíveis e o foco está em "Cancelar"

#### Scenario: Foco no primeiro controle do conteúdo

- **WHEN** o diálogo abre com um controle interativo elegível em `children`
- **THEN** o foco está nesse primeiro controle, e não em "Cancelar"

#### Scenario: Controles inelegíveis são ignorados

- **WHEN** o diálogo abre e os controles de `children` estão desabilitados, ocultos ou inertes
- **THEN** o foco está em "Cancelar"

#### Scenario: Cancelar com Escape

- **WHEN** a pessoa pressiona `Escape`
- **THEN** `onOpenChange(false)` é chamado e `onConfirm` não

#### Scenario: Confirmar

- **WHEN** a pessoa aciona "Confirmar"
- **THEN** `onConfirm` é chamado e o diálogo permanece aberto até o consumidor fechá-lo

#### Scenario: Pendente

- **WHEN** `pending` é verdadeiro, inclusive com `closeOnEscape` e `closeOnBackdrop` informados, e o foco está em "Confirmar"
- **THEN** "Cancelar" e "Confirmar" ficam com `aria-disabled="true"` e não respondem ao clique, "Confirmar" exibe indicador de carregamento, `Escape` e o clique fora não cancelam e o foco permanece em "Confirmar", durante e depois do `pending`

#### Scenario: Variante de perigo

- **WHEN** `destructive` é verdadeiro
- **THEN** a confirmação usa a variante de perigo

#### Scenario: Retorno do foco

- **WHEN** o diálogo fecha
- **THEN** o foco volta ao elemento que o abriu

### Requirement: Indicador e navegação do formulário em etapas

`AdsStepForm` MUST renderizar as etapas de `steps` com um indicador de progresso em lista ordenada, `aria-current="step"` na etapa atual e estado textual das demais. A etapa ativa MUST ser `activeStepId`, e avançar e voltar MUST chamar `onActiveStepChange`. Voltar MUST NOT validar e MUST NOT perder os dados dos campos.

#### Scenario: Indicador de progresso

- **WHEN** a etapa 2 de 3 está ativa
- **THEN** a lista de etapas marca a segunda com `aria-current="step"`, a primeira como concluída e a terceira como pendente, e o progresso expõe "Etapa 2 de 3"

#### Scenario: Avançar

- **WHEN** `validate` retorna `true` ou não existe
- **THEN** `onActiveStepChange` recebe o id da próxima etapa

#### Scenario: Foco e anúncio da etapa

- **WHEN** `activeStepId` muda
- **THEN** o foco vai ao título da nova etapa e uma região `role="status"` anuncia "Etapa 3 de 3: rótulo"; na renderização inicial o foco não é movido

#### Scenario: Dados preservados ao voltar

- **WHEN** a pessoa preenche campos, avança e volta
- **THEN** os valores digitados continuam nos campos, sem nova validação

#### Scenario: Primeira etapa

- **WHEN** a primeira etapa está ativa
- **THEN** o botão "Voltar" está desabilitado

#### Scenario: Enter não envia

- **WHEN** a pessoa pressiona `Enter` em um campo de texto
- **THEN** o formulário não é enviado nem avança

### Requirement: Validação por etapa

Avançar MUST executar `validate` da etapa atual e, se retornar `false`, MUST NOT navegar, MUST exibir uma mensagem `role="alert"` e MUST mover o foco ao primeiro campo `aria-invalid="true"` da etapa ou, na falta dele, ao título da etapa.

#### Scenario: Etapa inválida

- **WHEN** a pessoa aciona "Próxima" e `validate` da etapa retorna `false`
- **THEN** `onActiveStepChange` não é chamado, a mensagem de erro é anunciada e o foco vai ao primeiro campo inválido

#### Scenario: Sem campo inválido marcado

- **WHEN** `validate` retorna `false` e nenhum campo tem `aria-invalid="true"`
- **THEN** o foco vai ao título da etapa e a mensagem é anunciada

### Requirement: Confirmação final do formulário em etapas

Na última etapa, `AdsStepForm` MUST oferecer a ação de confirmação (`labels.submit`) no lugar de "Próxima", MUST executar `validate` da etapa e só então chamar `onSubmit`. `onCancel`, quando informado, MUST exibir uma ação de cancelamento. Com `submitting`, as ações MUST ficar desabilitadas e o formulário MUST ter `aria-busy`.

#### Scenario: Confirmar

- **WHEN** a última etapa está ativa e a pessoa aciona a confirmação
- **THEN** `onSubmit` é chamado

#### Scenario: Confirmação inválida

- **WHEN** `validate` da última etapa retorna `false`
- **THEN** `onSubmit` não é chamado e o erro é exibido e anunciado

#### Scenario: Enviando

- **WHEN** `submitting` é verdadeiro
- **THEN** as ações ficam desabilitadas e o formulário tem `aria-busy="true"`

### Requirement: Acessibilidade, temas e telas estreitas

Os fluxos MUST funcionar por teclado, com foco visível, nos temas claro e escuro, e MUST permanecer utilizáveis em telas estreitas sem rolagem horizontal da página. Os estilos MUST consumir tokens `--ads-*` e MUST NOT exigir Tailwind nas aplicações consumidoras.

#### Scenario: Teclado

- **WHEN** a pessoa navega com `Tab`, `Shift+Tab`, `Enter`, `Space` e `Escape`
- **THEN** todas as ações dos fluxos são alcançáveis e acionáveis

#### Scenario: Sem violações automáticas

- **WHEN** cada fluxo é analisado com `axe-core`
- **THEN** não há violações

#### Scenario: Tema e tela estreita

- **WHEN** o tema escuro está ativo e a largura é de 375 px
- **THEN** os fluxos usam os tokens do tema e quebram linha sem rolagem horizontal da página

#### Scenario: Personalização por tokens

- **WHEN** a aplicação sobrescreve tokens `--ads-*`
- **THEN** os fluxos refletem a mudança sem recompilar os componentes

### Requirement: Confirmação pendente protege o diálogo de Escape em camadas aninhadas

Enquanto `pending` for verdadeiro, `AdsConfirmDialog` MUST NOT fechar por Escape, inclusive quando houver um overlay aberto dentro dele. Um Escape destinado a esse overlay interno MUST fechar apenas ele e MUST NOT cancelar a confirmação.

#### Scenario: Popover aberto dentro de uma confirmação pendente

- **WHEN** `pending` é verdadeiro, há um popover aberto dentro do diálogo e o usuário pressiona Escape duas vezes
- **THEN** o primeiro Escape fecha só o popover e o segundo não cancela a confirmação

### Requirement: Papel do diálogo de confirmação

`AdsConfirmDialog` MUST usar `role="alertdialog"` quando `destructive` for verdadeiro (padrão) e `role="dialog"` caso contrário, e MUST aceitar `role` explícito, que prevalece sobre essa regra. A mudança de papel MUST NOT alterar foco inicial, `Escape`, retorno de foco nem o estado `pending`.

#### Scenario: Confirmação destrutiva

- **WHEN** `destructive` é verdadeiro ou omitido e o diálogo abre
- **THEN** o painel tem `role="alertdialog"` com nome e descrição acessíveis e o foco está em "Cancelar"

#### Scenario: Confirmação não destrutiva

- **WHEN** `destructive` é falso
- **THEN** o painel tem `role="dialog"`

#### Scenario: Papel explícito

- **WHEN** `role="dialog"` é informado com `destructive` verdadeiro
- **THEN** o painel tem `role="dialog"` e a confirmação mantém a variante de perigo

### Requirement: Navegação pelo indicador de etapas

`AdsStepForm` MUST permitir ativar uma etapa pelo indicador somente quando ela estiver antes da atual ou quando a etapa atual e todas as intermediárias já tiverem sido validadas ao avançar. Etapas não navegáveis MUST NOT ser interativas. A navegação MUST chamar `onActiveStepChange`, MUST NOT guardar dados e MUST NOT validar de novo etapas já válidas. Editar uma etapa MUST exigir nova validação por "Próxima" antes de navegar adiante a partir dela.

#### Scenario: Voltar pelo indicador

- **WHEN** a etapa 2 está ativa e a pessoa aciona a etapa 1 no indicador por teclado
- **THEN** `onActiveStepChange` recebe o id da etapa 1 e os dados são preservados

#### Scenario: Etapa futura ainda não validada

- **WHEN** a etapa 1 está ativa e nunca foi validada
- **THEN** as etapas seguintes não são controles interativos no indicador

#### Scenario: Retornar a etapa já validada

- **WHEN** a pessoa avançou da etapa 1 à 2 e voltou à 1
- **THEN** a etapa 2 pode ser acionada no indicador sem nova validação

#### Scenario: Edição invalida a marca

- **WHEN** a pessoa edita um campo da etapa 1 depois de validá-la
- **THEN** a etapa 2 deixa de ser navegável pelo indicador até a etapa 1 ser validada de novo

#### Scenario: Enviando ou validando

- **WHEN** `submitting` ou uma validação assíncrona está em andamento
- **THEN** os controles do indicador não navegam

### Requirement: Validação assíncrona por etapa

`AdsStepDefinition.validate` MUST aceitar retorno `boolean` ou `Promise<boolean>`, mantendo síncrono o tratamento do retorno síncrono. Enquanto uma Promise está pendente, o formulário MUST sinalizar o carregamento de forma acessível e MUST ignorar novas ações. Resolver `false` ou rejeitar MUST ser tratado como etapa inválida, e resultados obsoletos MUST ser descartados.

#### Scenario: Estado de carregamento acessível

- **WHEN** a validação assíncrona está pendente
- **THEN** o formulário tem `aria-busy="true"`, uma região `role="status"` anuncia o estado, a ação acionada exibe carregamento e as ações ficam com `aria-disabled` sem perder o foco

#### Scenario: Edição durante a validação

- **WHEN** a validação assíncrona está pendente e um campo da etapa é editado
- **THEN** a validação pendente é cancelada, o resultado dela é descartado, a etapa não é marcada como validada e a pessoa precisa acionar "Próxima" de novo; durante a espera os campos da etapa ficam inertes

#### Scenario: Valor alterado por código durante a validação

- **WHEN** o valor de um campo nativo da etapa é alterado por código, sem evento `change`, enquanto a validação está pendente
- **THEN** o resultado é descartado e a etapa não avança nem é marcada como validada

#### Scenario: Resultado obsoleto

- **WHEN** a etapa ativa muda ou o componente desmonta antes de a Promise resolver
- **THEN** o resultado é descartado e `onActiveStepChange` e `onSubmit` não são chamados por ele

#### Scenario: Avançar com validação assíncrona válida

- **WHEN** `validate` retorna uma Promise que resolve `true` e a pessoa aciona "Próxima"
- **THEN** durante a espera o formulário tem `aria-busy="true"` e `onActiveStepChange` não foi chamado; ao resolver, `onActiveStepChange` recebe a próxima etapa

#### Scenario: Validação assíncrona inválida

- **WHEN** a Promise resolve `false`
- **THEN** a etapa não muda, a mensagem de erro é anunciada e o foco vai ao primeiro campo inválido ou ao título

#### Scenario: Promise rejeitada

- **WHEN** a Promise rejeita
- **THEN** a etapa é tratada como inválida, sem exceção não tratada

#### Scenario: Ações durante a validação

- **WHEN** a validação está pendente e a pessoa aciona "Próxima" de novo
- **THEN** `validate` não é chamado outra vez

#### Scenario: Confirmação final assíncrona

- **WHEN** a última etapa tem `validate` assíncrona que resolve `true`
- **THEN** `onSubmit` é chamado uma vez após a resolução

#### Scenario: Validação síncrona preservada

- **WHEN** `validate` retorna `boolean`
- **THEN** o resultado é aplicado no mesmo evento, sem estado de carregamento
