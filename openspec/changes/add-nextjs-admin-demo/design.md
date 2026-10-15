# Design

## Context

Estado atual do `apps/admin-demo` (ver proposal.md — Why):

- `app/layout.tsx` carrega os três CSS públicos (`tokens`, `components`, `admin`),
  resolve o tema pelo cookie `ads-theme` e define `data-theme` no `<html>`.
- `app/page.tsx` (Server Component) monta `AdsAdminShell` com navegação por
  âncoras; `app/data-display/page.tsx` (Client Component) **não** usa o shell.
- Showcases interativos já isolados em Client Components
  (`overlay-showcase`, `navigation-showcase`, `evaluation-showcase`,
  `theme-control`).
- `tests/public-consumption.test.ts` valida imports públicos; `e2e/` cobre `/`
  e `/data-display` com snapshots visuais.
- A biblioteca não pode depender do roteador do Next.js (AGENTS.md); `AdsNav` e
  `AdsBreadcrumb` aceitam `href` e `current`.

## Goals / Non-Goals

**Goals:**

- Um único shell em layout compartilhado, com navegação por links entre rotas.
- Rotas administrativas coerentes que combinem componentes existentes.
- Manter o contrato de consumo público e a ausência de Tailwind no consumidor.

**Non-Goals:**

- Novas APIs públicas ou alterações de componentes e tokens.
- Padrões avançados (issue #17), backend, autenticação ou i18n.
- Tornar o demo um template de produto; é uma referência de integração.

## Decisions

### 1. Rotas e conteúdo

| Rota             | Conteúdo                                                       |
| ---------------- | -------------------------------------------------------------- |
| `/`              | Visão geral: indicadores (`AdsCard`), `AdsProgress`, `AdsList` |
| `/clientes`      | `AdsTable`, `AdsPagination`, estados vazio/carregando/erro     |
| `/clientes/novo` | Formulário (`AdsField`, controles, `AdsToast`)                 |
| `/preferencias`  | Tema e estado da sidebar                                       |
| `/componentes`   | Catálogo de avaliação atual (conteúdo de `page.tsx` hoje)      |
| `/data-display`  | Mantida com a mesma URL e headings; passa a usar o layout      |

Itens da navegação principal: Visão geral (`/`), Clientes (`/clientes`), Novo
cliente (`/clientes/novo`), Preferências, Componentes e Exibição de dados. A
rota atual é a de correspondência **exata** com o `pathname`, de modo que, no
nav principal ("Navegação do demo"), toda rota tem exatamente um item marcado
com `aria-current="page"`. Outros `aria-current` (por exemplo, no catálogo de
navegação) não contam, e os testes escopam suas asserções ao nav principal. O
item atual tem estilo próprio (`[aria-current='page']`) com variáveis `--ads-*`.
O layout (Server Component) renderiza `AdsAdminShell.Sidebar` com `label` e
`mobileTitle` "Navegação do demo", e `DemoNavigation` é apenas seu conteúdo.

**Por quê**: `/data-display` e seus testes são contrato estável do e2e; manter a
URL evita churn de snapshots sem valor. O catálogo sai de `/` para liberar a
raiz como visão geral, e seus snapshots serão regenerados com revisão do diff.

**Alternativa descartada**: manter o catálogo em `/` e criar o admin em
`/admin`. Rejeitada porque a raiz do demo é o primeiro contato de quem avalia o
pacote e deve mostrar o produto integrado.

### 2. Layout compartilhado e limite servidor/cliente

- O shell fica em `app/(admin)/layout.tsx` (Server Component), que renderiza
  `AdsAdminShell`, a lista de navegação e o `ThemeControl`.
- O realce da página atual precisa de `usePathname`, hook do Next.js. Ele fica
  **somente** em um Client Component do demo (`demo-navigation.tsx`) que define
  `aria-current="page"` nos links. Nada disso entra em `packages/*`.
- Como o estado do shell sobrevive à navegação, o drawer móvel **não** fecha
  sozinho ao trocar de rota. No celular, `AdsDrawer` não monta os filhos quando
  fechado, então `demo-navigation.tsx` só existe com o drawer aberto e **não**
  pode ser o lugar do efeito: um efeito dependente de `pathname` rodaria na
  montagem e fecharia o drawer ao abri-lo. Um Client Component próprio e
  sempre montado (`route-change-handler.tsx`, renderizado dentro de
  `AdsAdminShell`, fora de `Sidebar`) usa `useAdsAdminShell` (API pública) e
  guarda o `pathname` anterior em `useRef`, chamando `setMobileOpen(false)`
  somente quando ele muda em relação ao anterior. A biblioteca segue sem
  conhecer o roteador.
- Estado de `collapsed` e `mobileOpen` permanece no `AdsAdminShell` não
  controlado: como o layout não é remontado entre rotas do mesmo grupo, o estado
  é preservado sem persistência automática (spec: sidebar mantida ao navegar).
- A navegação principal é composta como `children` de `AdsAdminShell.Sidebar`
  com `next/link`, como o demo atual já faz com `<a>` próprio. `AdsNav` **não**
  é usado para isso: ele renderiza `<a href>` simples (sem elemento de link
  customizável) e causaria navegação completa, perdendo o estado do shell.
  `AdsNav` continua apenas no catálogo de componentes.
- `AdsPagination` **não** usa `renderPage` com `next/link`: o componente envolve
  cada página em um `<button>`, e um link contendo botão é interativo aninhado
  (HTML inválido, falha no `axe-core`). O demo usa um Client Component fino que
  passa `onPageChange` e chama `router.push` com `?pagina=N`.

### 3. Dados e estados

- Dados estáticos em `apps/admin-demo/lib/data/*.ts`, determinísticos (sem
  `Date.now()`/`Math.random()`) para evitar divergência de hidratação.
- Estados carregando/vazio/erro selecionados por parâmetro de URL
  (`?estado=vazio|carregando|erro`) lido no servidor, para que e2e e snapshots
  sejam estáveis sem timers. No estado carregando, a região da tabela expõe
  `aria-busy="true"` e `AdsSkeleton` recebe `label` (sem ele fica `aria-hidden`),
  sem linhas de dados. Valor desconhecido equivale a ausência do
  parâmetro (dados normais). O erro usa `AdsEmptyState` (que repassa props) com
  `role="alert"` e, em `actions`, um `next/link` "Tentar novamente" para a rota
  sem o parâmetro `estado`; não há componente de alerta dedicado na biblioteca.
  O estado vazio usa `AdsEmptyState` com mensagem e a ação "Ver todos os
  clientes" (`next/link` para a rota sem `estado`). `next/link` pode ser
  renderizado direto de Server Components; um `<a>` simples causaria navegação
  completa e perderia o estado do shell (decisão 2).
- Paginação por `?pagina=N` lida no servidor; a mudança de página é feita pelo
  Client Component fino descrito na decisão 2. Normalização do parâmetro: ausente
  ou não numérico vale 1; numérico é truncado para inteiro e limitado ao
  intervalo [1, total de páginas] (negativos e zero valem 1, acima do total vale
  o total). O valor normalizado alimenta tanto o filtro dos dados quanto
  `AdsPagination`.

### 3.1 Páginas existentes dentro do layout

`/data-display` hoje tem `<main>`, link "Voltar para a página inicial" e
`ThemeControl` próprios. O `app/page.tsx` atual monta seu próprio
`AdsAdminShell` (header, sidebar de âncoras, `Main`), um `ThemeControl` no hero
e links para `/data-display`. Ao entrar no layout compartilhado, todos esses
elementos são removidos (o shell já fornece `main`, navegação e tema); do
catálogo permanece apenas o conteúdo das seções, em `/componentes`. Os e2e que dependem deles
(`data-display.spec.ts`, `admin-demo.spec.ts`, `overlay.spec.ts`) são
atualizados na mesma change, mantendo os contratos por papel ARIA e nome
acessível que continuam válidos. Os testes do shell em `admin-demo.spec.ts`
(drawer móvel, transição para desktop, sidebar recolhida) permanecem em `/`,
que também tem o shell; só as asserções de conteúdo do catálogo (por exemplo, o
heading "Tokens públicos") e `overlay.spec.ts` passam a usar `/componentes`.

### 4. Formulário

- Client Component com validação local e `aria-describedby`/`aria-invalid`
  fornecidos por `AdsField`; no envio, o foco vai ao primeiro elemento
  `[aria-invalid="true"]` do formulário, sem depender de refs nos controles. Como
  `AdsField` só define `aria-invalid` quando `validationState="error"`, a página
  guarda os erros em estado e passa `validationState` ao campo; o foco é movido
  em um efeito executado depois da atualização do estado, não de forma síncrona
  no handler de envio. O efeito depende de um contador de envios incrementado a
  cada submissão, para refocar também quando os erros não mudam entre dois
  envios.
- Sucesso dispara `AdsToast`; nada é persistido.

### 5. Tema e estilos

- Tema continua definido por cookie e `data-theme` no servidor. O header de todas
  as rotas mantém o único `ThemeControl`. A página de preferências oferece o
  tema como grupo de seleção (`AdsSelectionGroup`/`AdsRadio`), com nome acessível
  distinto, para não duplicar o botão "Usar tema ..." no mesmo documento.
- O controle de sidebar das preferências usa `useAdsAdminShell` e só se aplica ao
  layout desktop: quando `isDesktop` é falso (a sidebar desktop não existe e o
  `SidebarToggle` fica oculto), o controle fica desabilitado e informa o motivo.
  O estado não é persistido.
- Os dois controles compartilham um estado de tema. `lib/theme.ts` continua puro
  e seguro para servidor, pois é importado pelo layout (Server Component): mantém
  `resolveTheme` e o tipo `Theme` e passa a conter o nome do cookie `ads-theme`
  (hoje repetido no layout e em `theme-control.tsx`) e uma função que grava
  cookie e `data-theme` (só toca em `document` quando chamada). O hook fica em módulo próprio com
  `'use client'` (`app/use-theme.ts`), porque `useSyncExternalStore` não existe
  no build de servidor do React e marcar `lib/theme.ts` como cliente tornaria
  `resolveTheme` uma referência de cliente, inutilizável no layout. O hook usa
  `useSyncExternalStore`, observa o atributo `data-theme` do `<html>`
  (`MutationObserver`) e recebe o tema inicial do servidor como argumento, que
  serve de snapshot de servidor (igual ao cookie); o layout lê o cookie e a
  página `/preferencias`, também Server Component, o repassa. Assim a mudança
  feita em um controle é refletida no outro nos dois sentidos, sem divergência
  de hidratação. O `ThemeToggle` público não aceita tema controlado, então o
  `ThemeControl` o remonta por `key` para refletir mudanças externas; a `key`
  só muda quando a alteração não vem do próprio toggle, para não remontar o
  botão (e perder o foco do teclado) a cada clique. A origem é sinalizada por um
  `useRef` (`ownChangeRef`) ligado no `onThemeChange` do toggle e consumido pelo
  observer na mutação seguinte.
- Estilos do demo ficam em `globals.css` e usam apenas variáveis `--ads-*`
  públicas. Nenhum Tailwind, nenhuma classe interna `ads-*` redefinida, e nenhum
  utilitário Tailwind em `className`: só tokens `demo-*` (do demo) e `ads-*`
  públicos. Utilitários como `ml-auto` ou `h-3` só funcionariam por existirem no
  CSS distribuído da biblioteca, o que é detalhe interno.
- CSS compilado e distribuído: cada pacote publica sua folha compilada
  (`@admin-ds/tokens/styles.css`, `@admin-ds/components/styles.css`,
  `@admin-ds/admin/styles.css`), importadas uma única vez no `app/layout.tsx`
  raiz, e o demo não compila nem escaneia classes dos pacotes. Conflitos de CSS
  com a aplicação consumidora são evitados pelos prefixos: as classes públicas
  usam `ads-`, as do demo usam `demo-`, e o demo não redefine seletores `ads-*`.
  A personalização é feita sobrescrevendo `--ads-*` no escopo da aplicação,
  sem recompilar componentes; um teste verifica que a sobrescrita chega às
  rotas (tarefa 6.2). Sem novas dependências de runtime, o impacto no bundle é
  nulo.
- Acessibilidade: um `h1` por rota e `main` único fornecido pelo shell, verificados
  em `e2e/admin-demo-routes.spec.ts` (criado na tarefa 1.2 e estendido a cada
  rota) e pelo `axe-core`. A ausência de Tailwind no demo é verificada na
  tarefa 6.1.

### 6. Testes

- Layouts e páginas são Server Components assíncronos (`cookies()`,
  `searchParams`) e ficam finos; o conteúdo vai para componentes de apresentação
  que recebem props (por exemplo, dados, página e estado). O Vitest renderiza
  esses componentes com `renderToString`; a rota real, incluindo o layout, é
  validada no Playwright. Hoje só o primeiro teste de `admin-demo.spec.ts`, em
  `/`, falha em erros de hidratação no console; a tarefa 6.2 estende isso ao
  carregamento de cada rota.
  `next/navigation` é mockado nos testes de componentes que usam `usePathname`
  ou `useRouter`.
- Extensão do teste de imports públicos para varrer `app/**` em busca de
  caminhos internos.
- `axe-core` por rota em ambos os temas, executado no Playwright: o
  `axe-core/axe.min.js`, já instalado na raiz, é injetado com
  `page.addScriptTag`. Em jsdom não há CSS, então tema e contraste não seriam
  exercitados.
- Playwright por rota, usando papéis ARIA e nomes acessíveis (AGENTS.md);
  snapshots regenerados para `/` (visão geral), `/data-display` e o shell, e
  criados para as rotas novas, com diff revisado (lista na tarefa 6.4).

## Risks / Trade-offs

- **[Navegação completa perde estado do shell]** → Usar `next/link` na sidebar
  e cobrir o cenário "sidebar recolhida" em e2e. `AdsNav` e `AdsBreadcrumb` não
  aceitam elemento de link customizado; é uma limitação da biblioteca para
  consumidores com roteamento no cliente, a registrar em `docs/limitations.md`
  e tratar em change própria, fora desta.
- **[Churn de snapshots visuais]** → Os snapshots só rodam localmente (pulados na
  CI) e os existentes são `-win32`. Regenerar apenas os intencionais, em
  Windows, revisando cada diff; este ambiente Linux não os valida.
- **[Demo vira vitrine de gambiarras]** → Lacunas encontradas são registradas em
  `docs/limitations.md` e tratadas fora desta change.
- **[Aumento do bundle do demo]** → Sem novas dependências; o demo não entra no
  baseline de `docs/bundle-baseline.json`, mas o build do app é validado.
- **[Parâmetros de URL para estados]** → São recurso de demonstração, não API do
  design system; documentados como tal.
