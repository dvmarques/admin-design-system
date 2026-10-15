# Proposal

## Why

O `admin-demo` é hoje uma página-vitrine de componentes (`app/page.tsx`), que
monta seu próprio `AdsAdminShell`, mais uma rota isolada (`/data-display`) que
não usa o shell.
Com componentes básicos, navegação, exibição de dados e o shell administrativo
arquivados, falta provar que esses blocos funcionam **juntos** como uma aplicação
administrativa real. Esta change entrega essa validação de consumo e uma
referência prática de integração para aplicações consumidoras, antes de iniciar
os padrões avançados (item 9 do roadmap).

## What Changes

**Aplicação de demonstração (`apps/admin-demo`)**

- Introduzir um layout administrativo compartilhado no App Router, com o
  `AdsAdminShell`, navegação principal e controle de tema montados uma única vez.
- Organizar o demo em rotas administrativas navegáveis, cada uma com cenários
  integrados: visão geral (indicadores e progresso), listagem com tabela,
  paginação e estados vazio/carregando/erro, formulário de cadastro com
  validação e confirmação, e uma página de preferências (tema e layout).
- Navegar entre rotas por links fornecidos pela aplicação, indicando a página
  atual de forma acessível (`aria-current`), sem exigir roteador na biblioteca.
- Usar dados estáticos locais e determinísticos; nenhuma regra de negócio,
  autenticação ou backend.
- Manter a página de componentes atual acessível como catálogo de avaliação,
  preservando as specs `admin-demo-evaluation` existentes.
- Ampliar testes: consumo público, SSR/hidratação por rota, acessibilidade
  (`axe-core`), Playwright por rota nos temas claro e escuro, e snapshots visuais
  revisados.

**Biblioteca reutilizável (`packages/*`)**

- Nenhuma API pública nova é planejada. Se o demo expuser uma lacuna real em um
  componente existente, ela deve ser registrada e tratada em change própria, não
  contornada com estilos internos no demo.

**Documentação**

- Atualizar `docs/integration.md` com o padrão de layout compartilhado,
  navegação por links no App Router, sobrescrita de tokens e os parâmetros
  `?estado` e `?pagina` como recursos do demo, não API do design system; registrar em
  `docs/limitations.md` que `AdsNav` não comporta link do consumidor sem gerar
  conteúdo interativo aninhado e `AdsBreadcrumb` só aplica estilo e foco de link
  quando recebe `href` (um `next/link` em `label` perde esse estilo), ambos
  divergindo da spec `navigation-structure` e a corrigir em change própria, que `AdsPagination.renderPage` sempre envolve o `<button>` da
  página (divergência da spec `pagination`, a corrigir em change própria) e que a sobrescrita com `:root[data-theme=…]` documentada em
  `packages/tokens/README.md` não alcança overlays em portal; adicionar a entrada da change ao `CHANGELOG.md`; atualizar
  `docs/roadmap.md` (item 8), o passo de próximos passos do `README.md` e a
  árvore de `e2e/` em `docs/quality.md`, que deve listar todos os arquivos
  `.spec.ts`.

## Objetivos e fora do escopo

Objetivos: consumo integrado e exclusivo de APIs públicas, funcionamento nos
temas claro e escuro, referência de integração para consumidores.

Fora do escopo: filtros complexos, tabelas inteligentes, seletores de data,
dashboards avançados e fluxos compostos (issue #17 / item 9); novos componentes;
autenticação, persistência e fetching real; i18n; mudanças em tokens.

## Capabilities

### New Capabilities

- `admin-demo-application`: estrutura de navegação, layout compartilhado e
  cenários administrativos integrados da aplicação de referência, incluindo
  tema, estados e acessibilidade por rota.

### Modified Capabilities

- `nextjs-consumption`: o requisito "Aplicação de referência" passa a exigir uma
  aplicação multi-rota com layout compartilhado, validada quanto a SSR e
  hidratação em cada rota.

## Impact

- **Código**: `apps/admin-demo/app/**` (rotas, layout, componentes de
  demonstração), `apps/admin-demo/lib/**` (dados estáticos e tema),
  `apps/admin-demo/tests/**`, `e2e/**` e seus snapshots.
- **Pacotes públicos**: `@admin-ds/components`, `@admin-ds/admin` e
  `@admin-ds/tokens` apenas consumidos; sem alteração de exports nem de
  compatibilidade retroativa.
- **Dependências**: nenhuma nova dependência de runtime.
- **Valor para consumidores**: exemplo executável e testado de integração do
  shell, navegação, formulários e dados em Next.js App Router, sem Tailwind no
  consumidor.
