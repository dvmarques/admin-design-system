# Design

## Context

Estado observado em `develop`:

- `packages/components/src/navigation.tsx` reúne `AdsBreadcrumb`, `AdsNav` e `AdsTabs` sem `"use client"`. O Tabs usa `useState`, `useId` e contexto, então só funciona se o importador já for um Client Component.
- `AdsTabs` é composto (`Root`, `List`, `Trigger`, `Panel`), controlado ou não, com ativação manual. Setas fazem wrap, Home e End vão às extremidades. O painel inativo retorna `null`. Os ids são `${useId()}-tab-${value}` e `-panel-${value}`, com o `value` cru. O trigger usa `tabIndex={active ? 0 : -1}`.
- `AdsBreadcrumb` e `AdsNav` não têm estado e recebem `renderLink` (função). O rótulo padrão do Breadcrumb é `Breadcrumb`; o de `AdsNav` é `Navegação`.
- O pacote tem um único export `"."`. O `tsc` preserva a diretiva `'use client'`, e `scripts/verify-package.mjs` já confere isso para `theme-toggle`.

Motivação e escopo: ver `proposal.md`.

## Goals / Non-Goals

**Goals:**

- Adicionar o Accordion e as lacunas do Tabs e do Breadcrumb sem quebrar consumidores existentes.
- Dar a cada módulo a fronteira correta entre Client e Server Component.
- Deixar os textos embutidos prontos para i18n sem criar infraestrutura.

**Non-Goals:**

- Provider de idioma, RTL, pluralização e animação de altura.
- Traduzir ou alterar textos padrão de outros componentes (inclusive `Navegação` em `AdsNav`).

## Decisions

### D1. Arquivos e fronteira cliente/servidor

`navigation.tsx` mantém `AdsBreadcrumb`, `AdsNav` e `AdsLinkRenderProps` (Server). Novos: `tabs.tsx` e `accordion.tsx` com `"use client"`, e `breadcrumb-collapse.tsx` com `"use client"` (ilha do colapso). `index.ts` continua sendo o único ponto público e reexporta os mesmos nomes.

Alternativa descartada: tornar `AdsBreadcrumb` inteiro cliente para simplificar o colapso. Quebraria quem passa `renderLink` a partir de um Server Component, porque funções não atravessam a fronteira cliente. A decisão é manter o Breadcrumb como Server Component e isolar só o estado.

### D2. Colapso do Breadcrumb como ilha cliente

O Server Component calcula quais itens ficam visíveis e renderiza, no servidor, todos os `<li>` (inclusive os de `renderLink`). Quando há colapso, entrega os `<li>` escondidos como `children` (ReactNode, serializável) à ilha cliente, que guarda `expanded` e renderiza o botão de expansão. Ao expandir, o foco vai ao primeiro item revelado (efeito com `ref`), pois o botão sai do DOM.

Regras: colapsa se `items.length > maxItems`; `itemsBeforeCollapse` padrão 1, `itemsAfterCollapse` padrão 2, ambos com mínimo 1 (o item atual nunca é escondido); se `before + after >= items.length`, não colapsa. Sem `maxItems`, o caminho é o atual, sem a ilha.

Alternativa descartada: popover ou menu no "…". Exige gerenciamento de foco e posicionamento e dependência de `AdsDropdown`; fica como evolução.

### D3. Tabs: ativação, orientação e keepMounted

Estado do contexto ganha `activationMode`, `orientation` e `keepMounted`. Padrões: `manual`, `horizontal`, `false`.

- Navegação por teclado em `Trigger` passa a escolher as teclas pela orientação (`ArrowLeft/Right` na horizontal, `ArrowUp/Down` na vertical). Wrap, Home e End são mantidos. No modo `automatic`, o foco movido chama `setValue` do trigger de destino.
- `List` expõe `aria-orientation` conforme a prop herdada do contexto. Na vertical, o layout usa coluna e indicador lateral (classes explícitas por estado, sem concatenação dinâmica).
- `keepMounted` na raiz, sobrescrevível em `Panel`. Painel inativo mantido renderiza `hidden` e sem `tabIndex`. O padrão continua `null`.

### D4. Tabs: ids e parada de tabulação

Os ids passam a ser `${baseId}-tab-${key}`, onde `key` codifica o `value` de forma injetiva (caracteres fora de `[A-Za-z0-9_-]` viram `_` + código hexadecimal, e `_` também é escapado) e `baseId` é sanitizado para remover os caracteres de `useId` que quebram seletores (`:`, `«`, `»`). A função fica em módulo interno e é testada com colisões.

A parada de tabulação não pode depender de conhecer os triggers no render, porque os filhos são livres. A `List` mede os triggers no cliente (`useEffect`, e não `useLayoutEffect`, que emite aviso na renderização no servidor com React 18, suportado pelo peer; sobre `[role="tab"]:not([disabled])`) e guarda em estado o `value` do primeiro habilitado quando a tab ativa não é habilitada. O trigger usa `tabIndex = (active && !disabled) || value === fallback ? 0 : -1`. No primeiro render do servidor a regra é a atual; a correção ocorre na hidratação, sem divergência de marcação porque só `tabindex` muda depois dela.

### D5. Accordion

API composta, no mesmo estilo de `AdsTabs` (`Object.assign`): `AdsAccordion.Root/Item/Header/Trigger/Panel`.

- Raiz: `type` obrigatório (`single` | `multiple`) como união discriminada; `single` usa `value?: string`, `defaultValue?: string`, `collapsible?: boolean`; `multiple` usa `string[]`. `onValueChange` tipado por modo. Estado controlado ou não, igual ao Tabs. `unmountOnCollapse` na raiz, sobrescrito por `Item`.
- `Header` mapeia `level` (2 a 6, padrão 3) para a tag por mapeamento explícito. O `Trigger` é o `<button>` dentro do heading, com `aria-expanded` e `aria-controls` somente enquanto o painel existe.
- `Panel`: `role="region"` com `aria-labelledby`; fechado, recebe `hidden`; com `unmountOnCollapse`, retorna `null`. O CSS não pode sobrescrever `display` do `[hidden]`, o que o teste de estilos confere.
- Teclado: Enter e Space pelo botão nativo; setas, Home e End movem o foco entre triggers habilitados da própria raiz. Os candidatos vêm de `closest('[data-ads-accordion-root]')` filtrados para os que têm esse mesmo ancestral mais próximo, o que isola accordions aninhados. Todos os triggers continuam tabuláveis (sem roving tabindex), seguindo o padrão do WAI-ARIA APG.
- Item desabilitado usa `disabled` nativo no botão, o que o exclui da tabulação, e é filtrado da navegação por setas.
- Indicador: chevron em SVG `aria-hidden`, com rotação por `data-state` e `motion-reduce:transform-none`. Sem prop de ícone na v1.

### D6. Textos padrão e i18n

Os textos embutidos (`Breadcrumb` como rótulo e `Show full path` no botão de expansão) ficam em constantes nomeadas no próprio módulo (`defaultBreadcrumbLabels`), sobrescrevíveis pelas props `aria-label` (já existente) e `expandLabel`. A ordem de resolução documentada é prop explícita, depois padrão em inglês, com espaço reservado para um contexto de idioma futuro. Nada de texto em `content:` de CSS. Tabs e Accordion não têm texto embutido nesta change; o requisito vale para qualquer um que surja na implementação.

Pendência registrada: `AdsNav` tem rótulo padrão em português (`Navegação`). Alterá-lo seria mudança observável fora do escopo; fica como follow-up junto com os demais textos já existentes.

### D7. CSS e tokens

Estilos novos usam apenas utilidades Tailwind estáticas com tokens semânticos já existentes (`surface`, `border`, `text-*`, `focus-ring`, `surface-selected`), compiladas em `dist/styles.css`, sem exigir Tailwind do consumidor. Classes públicas novas: `ads-accordion`, `ads-accordion-item`, `ads-accordion-header`, `ads-accordion-trigger`, `ads-accordion-panel` e `ads-breadcrumb-collapse`. Nenhum token novo é necessário.

### D8. Bundle

Sem dependências novas. O crescimento vem de `accordion.js`, `tabs.js` (props novas), da ilha do colapso, declarações, source maps e CSS. O baseline em `docs/bundle-baseline.json` é atualizado explicitamente, com o motivo registrado em `docs/bundle-baseline.md`, e `verify-package` passa a exigir `'use client'` em `tabs.js`, `accordion.js` e `breadcrumb-collapse.js` e a sua ausência em `navigation.js`.

## Risks / Trade-offs

- **Efeito de medição no Tabs (D4)** → o `tabindex` pode mudar um quadro após a hidratação. Mitigação: só afeta a tab ativa desabilitada, caso hoje sem solução; teste cobre o resultado final.
- **`renderLink` e ilha cliente (D2)** → os itens escondidos são elementos já renderizados no servidor, então não há função cruzando a fronteira. Mitigação: teste e página do demo em Server Component com `renderLink`.
- **Painel sempre montado no Accordion** → conteúdo pesado fica no DOM. Mitigação: `unmountOnCollapse`, na raiz ou por item.
- **`role="region"` em muitos painéis** → o APG recomenda evitar com mais de seis painéis, por poluir os pontos de referência. Mitigação: documentar; a decisão de remover o papel fica para o consumidor via `role` sobrescrevível no `Panel`.
- **Padrões diferentes de montagem** (Tabs desmonta, Accordion mantém) → herdados do comportamento atual e do mais seguro para formulários; documentados e iguais nas opções (`keepMounted`, `unmountOnCollapse`).
- **Snapshots visuais da rota `/componentes`** mudam → revisar o diff e atualizar só o que for intencional.
