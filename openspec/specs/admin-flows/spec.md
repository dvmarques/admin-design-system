# admin-flows Specification

## Purpose

Compõe os componentes públicos em fluxos administrativos recorrentes (listagem com ações em massa, formulário em etapas e confirmação de ações destrutivas), sem regras de negócio, persistência nem roteamento, com todo o estado controlado pela aplicação consumidora.

## Requirements

### Requirement: Composição sem regras de negócio

O sistema MUST fornecer `AdsBulkActionBar`, `AdsListFlow`, `AdsStepForm` e `AdsConfirmDialog` em `@admin-ds/admin`, compostos apenas por APIs públicas existentes. Os componentes e tipos públicos MUST usar o prefixo `Ads`, as classes públicas `ads-` e as variáveis `--ads-`, sem expor Tailwind. Eles MUST NOT persistir nem enviar dados, MUST NOT guardar a seleção nem a etapa ativa e MUST NOT importar o roteador do Next.js nem ler a URL.

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

`AdsConfirmDialog` MUST usar `AdsDialog` com título e descrição associados e oferecer "Cancelar" e "Confirmar", sem fechar nem confirmar por conta própria: `onConfirm` e `onOpenChange` notificam o consumidor. O foco inicial MUST ir a "Cancelar", `Escape` MUST cancelar e o foco MUST voltar ao elemento que abriu o diálogo ao fechar. Com `destructive`, a confirmação MUST usar a variante de perigo. Com `pending`, as ações MUST ficar indisponíveis, como descrito no cenário Pendente.

#### Scenario: Foco e nome acessível

- **WHEN** o diálogo abre
- **THEN** ele tem nome e descrição acessíveis e o foco está em "Cancelar"

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
