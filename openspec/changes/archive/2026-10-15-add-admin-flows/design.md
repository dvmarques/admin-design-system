## Context

`AdsFilterBar`, `AdsSmartTable`, `AdsPagination`, `AdsDialog`, `AdsProgress`, `AdsButton` e os campos de formulário já existem. `AdsSmartTable` expõe um slot `filters` e é controlada pelo consumidor. `@admin-ds/admin` hospeda composições administrativas sem regras de negócio, com CSS simples (`styles.css`, sem Tailwind) sobre tokens `--ads-*`. Esta change parte de `origin/feat/smart-table` (PR #67 ainda não está em `develop`); ao mergear a #67 em `develop`, a branch deve ser atualizada com `develop` antes do merge.

## Goals / Non-Goals

### Goals

- Listagem com filtros, tabela, paginação e barra de ações em massa acessível.
- Formulário em etapas com progresso, validação por etapa, foco/anúncio da etapa, preservação de dados e confirmação final.
- Confirmação destrutiva por diálogo acessível.
- Estado controlado pelo consumidor; sem rotas, persistência, envio nem dependências novas.

### Non-Goals

- Regras de negócio, persistência, envio, roteamento, fluxos de domínio, navegação por clique nas etapas, etapas condicionais, validação assíncrona e demonstração em `apps/admin-demo`.

## Decisions

### 1. Pacote `@admin-ds/admin`

São composições administrativas sobre primitivos existentes, sem primitivo novo (AGENTS.md e `docs/architecture.md`: `components` guarda primitivos genéricos; `admin` guarda composições, como `AdsFilterBar` e `AdsSmartTable`). Importam só caminhos públicos de `@admin-ds/components` e usam o `styles.css` do pacote. Trade-off: quem usa só `components` não as recebe e pode compor manualmente.

### 2. `AdsBulkActionBar`

Props: `selectedCount`, `onClear`, `children` (ações, do consumidor), `labels`, `aria-label` e `className`. Com `selectedCount` igual a zero, o contêiner visível NÃO é renderizado ("some"). Para que a quantidade seja anunciada quando a barra aparece, uma região `role="status"` (`aria-live="polite"`, visualmente oculta) é sempre renderizada e recebe o texto `labels.selected(n)` (vazia sem seleção); a mesma contagem é visível na barra. A barra é um `role="group"` nomeado (padrão "Ações em massa"): é uma lista curta de botões na ordem natural de `Tab`, sem promessa de navegação por setas como em `toolbar`. O botão "Limpar seleção" chama `onClear`. O consumidor decide o que as ações fazem, inclusive abrir `AdsConfirmDialog`.

### 3. `AdsListFlow`

Genérica em `Row`, aceita todas as props de `AdsSmartTable` (exceto `filters`) mais `filterBar?: AdsFilterBarProps`, `bulkActions?: ReactNode` e `onClearSelection?`. Compõe `AdsFilterBar` e `AdsBulkActionBar` no slot `filters` de `AdsSmartTable`, mantendo uma única tabela, paginação (`pagination`) e estados já existentes. A contagem vem de `selectedIds.length`. A barra aparece só se `bulkActions` for informado; `onClearSelection` padrão chama `onSelectionChange([])`. Alternativa descartada: reimplementar a tabela; duplicaria acessibilidade e estados. Trade-off: o slot `filters` fica ocupado pelo fluxo; para outro arranjo o consumidor compõe `AdsSmartTable` diretamente.

### 4. `AdsStepForm`

Controlado: `steps` (`{ id, label, description?, content, validate? }`), `activeStepId`, `onActiveStepChange(id)`, `onSubmit()`, `onCancel?`, `submitting?`, `labels`, `aria-label`. Sem estado de navegação interno e sem roteador.

- **Indicador**: `<ol>` com o rótulo de cada etapa e estado (concluída, atual, pendente) em texto oculto visualmente; `aria-current="step"` na atual; mais um `AdsProgress` com o rótulo "Etapa X de N". As etapas anteriores à atual são concluídas.
- **Validação por etapa**: `validate?: () => boolean` síncrona, chamada ao avançar e ao confirmar. Se retornar `false`, a navegação não ocorre, uma mensagem `role="alert"` (`labels.invalidStep`) é exibida e o foco vai ao primeiro campo com `aria-invalid="true"` da etapa, ou ao título da etapa. Os erros dos campos são do consumidor (que guarda os dados), como em `AdsField`. Voltar não valida.
- **Foco e anúncio**: ao mudar `activeStepId` (depois da primeira renderização), o foco vai ao título da etapa (`tabIndex={-1}`) e uma região `role="status"` anuncia "Etapa X de N: rótulo". Na renderização inicial o foco não é movido.
- **Dados preservados**: todas as etapas permanecem montadas e as inativas recebem `hidden`; campos não controlados mantêm o valor ao voltar, e dados controlados são do consumidor. Alternativa descartada: desmontar etapas inativas (perde estado local dos filhos). Trade-off: todos os campos ficam no DOM; o `form` usa `noValidate` para que campos obrigatórios ocultos não bloqueiem o envio nativo.
- **Confirmação final**: a última etapa substitui "Próxima" por `labels.submit` (padrão "Confirmar"); ao ativar, valida a etapa e chama `onSubmit`. O consumidor inclui como última etapa um resumo para revisão. `submitting` desabilita as ações e define `aria-busy`.
- **Teclado**: Enter em campo de texto não envia o formulário (`onSubmit` do `<form>` é impedido); só os botões navegam, evitando envio acidental.

### 5. `AdsConfirmDialog`

Compõe `AdsDialog` com título, descrição, "Cancelar" e "Confirmar" (`destructive` usa `AdsButton variant="danger"`). `showCloseButton` é desligado para que o foco inicial vá ao primeiro controle, "Cancelar" (ação segura primeiro na ordem do DOM). `Escape` e clique fora cancelam (`onOpenChange(false)`); `onConfirm` não fecha sozinho: o consumidor decide. `pending` desabilita os botões. Limitação documentada: `AdsDialog` não expõe `role="alertdialog"`; usa-se `role="dialog"` com `aria-labelledby`/`aria-describedby`; alterar `AdsDialog` fica para uma change própria de `components`.

### 6. Estilos e tokens

CSS simples em `packages/admin/src/styles.css`, classes `ads-bulk-action-bar*`, `ads-list-flow*`, `ads-step-form*` em `@layer components`, tokens `--ads-color-*` existentes, temas por variáveis, sem Tailwind e sem classes dinâmicas. Em telas estreitas, a barra e as ações do formulário quebram linha e o indicador empilha. Personalização por tokens, conflitos evitados pelo prefixo e pela camada.

### 7. Client Components e hidratação

Todos são Client Components (`"use client"`): usam estado, efeitos, foco e eventos. Ids via `useId`; a renderização inicial depende só das props. Funções (`validate`, `cell`) não atravessam a fronteira de um Server Component; a documentação mostra o uso dentro de um Client Component. Sem `next/*`.

## Risks / Trade-offs

- Sem baseline visual (`win32`): snapshots só existem para `win32`, são pulados na CI Linux e falham/são pulados fora do Windows; o comportamento é coberto por testes de componente, SSR e `axe`. Registrado nas tasks e em `docs/limitations.md`.
- Impacto no bundle: `@admin-ds/admin` cresce; se exceder o baseline, `docs/bundle-baseline.json` é atualizado e justificado. Sem dependência de runtime.
- `AdsStepForm` mantém todas as etapas montadas; formulários muito grandes pagam esse custo.
- Base em `feat/smart-table`: se a #67 mudar antes do merge, esta branch precisa acompanhar.
