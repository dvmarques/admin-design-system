# Proposal

## Why

A auditoria `axe-core` de `/componentes` no admin demo (change
`add-nextjs-admin-demo`, tarefa 6.2) encontrou, no tema escuro, violações de
contraste em dois componentes de `@admin-ds/components`, e a investigação mostrou
um defeito de estilo mais amplo:

- Os links de `AdsBreadcrumb` não definem cor e usam o azul padrão do
  navegador (`#0000ee`), que sobre `surface-raised` escuro (`#334155`) tem
  contraste de 1,1:1.
- Os gatilhos de `AdsTabs` combinam utilidades conflitantes
  (`bg-transparent text-primary` com `bg-surface-selected text-on-surface-selected`
  e `border-primary`). O CSS compilado resolve o conflito pela ordem das
  utilidades, e o estado ativo **perde**: em ambos os temas a aba ativa fica com
  fundo transparente, a mesma cor de texto da inativa e borda inferior de 2 px
  na cor de borda neutra. `text-primary` escuro (`#60a5fa`) sobre
  `surface-raised` (`#334155`) tem 4,07:1, abaixo dos 4,5:1.

Isso descumpre requisitos já existentes: "Tabs e navegação persistente MUST
comunicar seleção por indicador, borda ou superfície suave" e "os estilos [do
breadcrumb] MUST responder aos tokens públicos de texto" (`navigation-structure`),
além do contraste AA do `theming`.

## What Changes

**Biblioteca reutilizável (`packages/components`)**

- `AdsBreadcrumb`: os links passam a usar o token público de texto
  (`text-text-muted`, com `hover:text-text`) em vez da cor padrão do navegador.
- `AdsTabs`: as classes do gatilho passam a ser mapeadas por estado, sem
  utilidades conflitantes. O estado ativo mantém `border-primary border-b-2
bg-surface-selected text-on-surface-selected`, e o inativo usa
  `bg-transparent text-text-secondary` com `hover:bg-surface-hover
hover:text-text`. O texto inativo deixa de ser `text-primary`.
- Testes de classes por estado, de CSS distribuído e de pares de contraste dos
  tokens usados, em ambos os temas e sobre todas as superfícies.
- Story do Storybook para tabs e breadcrumb em superfície elevada nos dois temas.

**Aplicações de demonstração**

- Nenhuma mudança de código. O admin demo apenas valida a correção: a tarefa
  6.2 de `add-nextjs-admin-demo` passa sem alterar o teste, e o item de contraste
  é removido de `docs/limitations.md`.

## Objetivos e fora do escopo

Objetivos: contraste AA em tabs e breadcrumb nos dois temas, seleção de tab
visível e independente da ordem do CSS, sem mudar a API pública.

Fora do escopo: links de consumidor em `AdsNav`, `AdsBreadcrumb` e
`AdsPagination` (limitação já registrada, change própria); alterar valores de
tokens; novos tokens; outros componentes.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `navigation-structure`: adiciona o requisito de contraste e de seleção visível
  de tabs e breadcrumb nos dois temas (os requisitos atuais permanecem).

## Impact

- **Pacotes e APIs públicas**: `@admin-ds/components`, `AdsBreadcrumb` e
  `AdsTabs`. Nenhuma prop, tipo, export, classe `ads-*` ou variável `--ads-*`
  muda; compatibilidade retroativa preservada. A aparência muda de forma
  intencional: a aba ativa passa a mostrar a seleção e a aba inativa deixa de ser
  azul.
- **Dependências**: nenhuma.
- **Consumidores**: tabs e breadcrumb passam a atender AA nos dois temas e em
  superfícies elevadas, sem configuração.
