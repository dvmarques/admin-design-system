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
  **somente** em um Client Component do demo (`demo-navigation.tsx`) que passa
  `current` aos itens do `AdsNav`. Nada disso entra em `packages/*`.
- Estado de `collapsed` e `mobileOpen` permanece no `AdsAdminShell` não
  controlado: como o layout não é remontado entre rotas do mesmo grupo, o estado
  é preservado sem persistência automática (spec: sidebar mantida ao navegar).
- A navegação principal é composta como `children` de `AdsAdminShell.Sidebar`
  com `next/link`, como o demo atual já faz com `<a>` próprio. `AdsNav` **não**
  é usado para isso: ele renderiza `<a href>` simples (sem elemento de link
  customizável) e causaria navegação completa, perdendo o estado do shell.
  `AdsNav` continua apenas no catálogo de componentes.
- `AdsPagination` oferece `renderPage`, que permite ao demo envolver cada página
  em `next/link` sem mudança na biblioteca.

### 3. Dados e estados

- Dados estáticos em `apps/admin-demo/lib/data/*.ts`, determinísticos (sem
  `Date.now()`/`Math.random()`) para evitar divergência de hidratação.
- Estados carregando/vazio/erro selecionados por parâmetro de URL
  (`?estado=vazio|carregando|erro`) lido no servidor, para que e2e e snapshots
  sejam estáveis sem timers.
- Paginação por `?pagina=N` lida no servidor; `AdsPagination` recebe os
  callbacks/links fornecidos pelo demo.

### 4. Formulário

- Client Component com validação local e `aria-describedby`/`aria-invalid`
  fornecidos por `AdsField`; foco movido ao primeiro campo inválido no envio.
- Sucesso dispara `AdsToast`; nada é persistido.

### 5. Tema e estilos

- Tema continua definido por cookie e `data-theme` no servidor; a página de
  preferências reutiliza `ThemeControl`.
- Estilos do demo ficam em `globals.css` e usam apenas variáveis `--ads-*`
  públicas. Nenhum Tailwind, nenhuma classe interna `ads-*` redefinida.
- Acessibilidade: um `h1` por rota, `main` único fornecido pelo shell, link para
  pular ao conteúdo se o shell não o oferecer (verificar na implementação).

### 6. Testes

- Vitest: render de cada rota (SSR via `renderToString`) sem erros, e extensão do
  teste de imports públicos para varrer `app/**` em busca de caminhos internos.
- `axe-core` por rota em ambos os temas.
- Playwright por rota, usando papéis ARIA e nomes acessíveis (AGENTS.md);
  snapshots só para as novas rotas e para `/`, com diff revisado.

## Risks / Trade-offs

- **[Navegação completa perde estado do shell]** → Usar `next/link` na sidebar
  e cobrir o cenário "sidebar recolhida" em e2e. `AdsNav` e `AdsBreadcrumb` não
  aceitam elemento de link customizado; é uma limitação da biblioteca para
  consumidores com roteamento no cliente, a registrar em `docs/limitations.md`
  e tratar em change própria, fora desta.
- **[Churn de snapshots visuais em `/`]** → Revisar cada diff; regenerar apenas
  os intencionais.
- **[Demo vira vitrine de gambiarras]** → Lacunas encontradas são registradas em
  `docs/limitations.md` e tratadas fora desta change.
- **[Aumento do bundle do demo]** → Sem novas dependências; o demo não entra no
  baseline de `docs/bundle-baseline.json`, mas o build do app é validado.
- **[Parâmetros de URL para estados]** → São recurso de demonstração, não API do
  design system; documentados como tal.
