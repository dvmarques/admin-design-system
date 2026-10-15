## Context

`AdsField`, `AdsInput`, `AdsSelect`, `AdsCheckbox`, `AdsSelectionGroup`, `AdsDatePicker` e `AdsButton` já existem em `@admin-ds/components`. `@admin-ds/admin` hospeda composições administrativas sem regras de negócio, com CSS simples (`styles.css`, sem Tailwind) que consome tokens `--ads-*`, como o dashboard. A barra de filtros é uma composição desse tipo.

## Goals / Non-Goals

### Goals

- Filtros de texto, seleção, seleção múltipla e data (única e intervalo), controlados pelo consumidor.
- Chips de filtros ativos removíveis e "Limpar filtros", acessíveis por teclado e leitor de tela.
- Layout que recolhe os filtros em telas estreitas; estados desabilitado, carregando e sem filtros.
- Sem acoplamento a URL, roteador ou Tailwind.

### Non-Goals

- Consulta e filtragem de dados, filtros salvos, operadores lógicos e demonstração em `apps/admin-demo`.

## Decisions

### 1. Pacote `@admin-ds/admin`

É uma composição de layout administrativo sobre componentes existentes, sem primitivo novo. Colocá-la em `@admin-ds/components` misturaria composição com primitivos; em `@admin-ds/admin` ela segue o padrão do dashboard, usa `styles.css` próprio e importa apenas caminhos públicos de `@admin-ds/components`. Trade-off: quem usa só `components` não a recebe.

### 2. Filtros declarativos e estado controlado

`filters` é uma lista de definições (`{ id, type, label, ... }`) e `value` é `AdsFilterValues`, um objeto `Record<string, AdsFilterValue>` por `id`. `AdsFilterValue` é `string` (texto, seleção, data), `string[]` (múltipla) ou `AdsDateRange` (intervalo). Valor ausente, `''`, `[]` ou intervalo sem extremidades contam como vazios: não geram chip e podem ser omitidos pelo consumidor. `onChange(next)` recebe sempre o objeto completo, sem chaves de filtros vazios, o que facilita serializar em `searchParams`. Não há modo não controlado: o estado pertence ao consumidor (por exemplo, URL). Alternativa descartada: composição por filhos (`<AdsFilterBar.Text />`); exigiria inspecionar filhos para montar os chips, e a lista declarativa mantém uma única fonte para campos e chips. Trade-off: menos flexibilidade de layout por campo, compensada por `description`, `placeholder` e `className`.

### 3. Sem URL e sem roteador

A barra não importa `next/*` e não lê `window.location`. A documentação mostra um Client Component que lê `searchParams` (recebidos como props pela página, Server Component), converte para `AdsFilterValues` e navega com `router.replace` no `onChange`. Esse código fica no consumidor.

### 4. Aplicação do filtro de texto

O texto emite `onChange` a cada digitação (controlado, como `AdsInput`); o consumidor aplica debounce ou usa `useDeferredValue`. A barra não tem botão "Aplicar", pois o estado já é o filtro. O texto aparece como chip enquanto não vazio.

### 5. Chips e limpeza

Cada filtro ativo gera um item de lista no formato `Rótulo: valor` com botão de remoção nomeado `Remover filtro {rótulo}: {valor}` (`labels.removeFilter`). Multisseleção gera um chip por opção marcada. Datas usam o formato do `AdsDatePicker` (`pt-BR` por padrão, via `Intl`); o intervalo mostra `início – fim` e usa `—` para extremidade ausente. "Limpar filtros" (`labels.clearAll`) só aparece com filtros ativos. Remover um chip devolve o foco ao próximo chip, ao anterior ou, se não restar nenhum, ao primeiro controle da barra, para o foco não se perder. Uma região `aria-live="polite"` visualmente oculta anuncia a quantidade de filtros ativos (`labels.activeCount`).

### 6. Semântica

O contêiner é `<section aria-label>` (região rotulada, nome em `label`, padrão "Filtros"). Como a barra não envia dados, não usa `<form>`. Os campos de texto, seleção e data usam `AdsField` (rótulo associado), e a seleção múltipla usa `AdsSelectionGroup` (`fieldset` com `legend`) com um `AdsCheckbox` por opção. Os chips ficam em `<ul aria-label="Filtros ativos">`. O botão de alternância tem `aria-expanded` e `aria-controls` apontando para o corpo.

### 7. Recolhimento responsivo

Em telas largas os campos sempre aparecem e o botão de alternância some (CSS, `display: none`). Abaixo de um ponto de quebra (container query no próprio `.ads-filter-bar`, como o dashboard, em vez da viewport), o corpo fica oculto quando `data-expanded="false"`. O estado inicial é recolhido apenas via CSS e atributo, igual no servidor e no cliente, sem leitura de `matchMedia`, evitando erro de hidratação. `defaultExpanded` (padrão `false`) controla o estado inicial; `expanded` e `onExpandedChange` permitem controle opcional. Os chips ficam sempre visíveis, mesmo recolhida, para o usuário ver o que está aplicado. Com `display: none`, os campos recolhidos saem da ordem de tabulação e da árvore de acessibilidade.

### 8. Estados

`disabled` desabilita todos os campos, o botão de limpar e os botões dos chips (os chips continuam visíveis, para leitura). `loading` mantém a barra interativa, define `aria-busy="true"` na região e exibe `labels.loading` em uma região `aria-live="polite"` visualmente oculta e um indicador discreto; é o estado "aplicando filtros" enquanto o consumidor consulta os dados. Sem filtros ativos, a lista de chips é substituída pelo texto `labels.noActiveFilters` ("Nenhum filtro ativo"), sem o botão de limpar. Opções vazias em `select` e `multiselect` não geram erro. Erros de validação por campo são responsabilidade de `description`/`error` do filtro (repassados ao `AdsField`).

### 9. Estilos e tokens

CSS simples em `packages/admin/src/styles.css`, classes `ads-filter-bar*` na camada `components`, tokens `--ads-color-*`, `--ads-elevation-*` e espaçamentos existentes, temas claro e escuro herdados das variáveis. Sem Tailwind nem classes dinâmicas. Os controles internos mantêm as classes dos componentes de `@admin-ds/components`, cujo CSS o consumidor já importa. A personalização é por sobrescrita de tokens, sem recompilar. Conflitos com a aplicação consumidora são evitados pelo prefixo `ads-` e pela camada `@layer components`.

### 10. Client Component e hidratação

`AdsFilterBar` é Client Component (`"use client"`), pois manipula estado, foco e eventos. Os ids vêm de `useId`. A renderização inicial depende só das props; nada lê data atual, `window` ou `matchMedia`.

## Risks / Trade-offs

- Sem baseline visual (`win32`) novo: os snapshots visuais só têm baseline `win32` e são pulados fora do Windows; o comportamento é coberto por testes de componente, SSR e `axe`. Esta limitação fica registrada nas tasks e em `docs/limitations.md`.
- Texto emitido a cada digitação pode gerar muitas navegações; a documentação recomenda debounce no consumidor.
- Impacto no bundle: `@admin-ds/admin` cresce pelo componente e pelo CSS; se passar da margem de 10% de `inspect:packages`, o baseline em `docs/bundle-baseline.json` é atualizado e justificado em `docs/bundle-baseline.md`. Nenhuma dependência de runtime é adicionada.
