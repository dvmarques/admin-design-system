# Design

## Context

`AdsTabs` (`packages/components/src/navigation.tsx`) monta as classes do gatilho
com um conjunto base e, quando ativo, acrescenta outro conjunto:

- base: `border-transparent border-b-border bg-transparent text-primary hover:bg-surface-hover hover:text-primary-hover`
- ativo: `border-primary border-b-2 bg-surface-selected text-on-surface-selected`

`classNames` apenas concatena. Utilidades conflitantes têm a mesma
especificidade, então vale a ordem em que o Tailwind as emite no CSS distribuído.
Medido no navegador, em ambos os temas, a aba ativa ficou com `background:
transparent`, `color` igual ao da inativa e borda inferior neutra de 2 px: o
conjunto ativo perde para o base. A borda tem o mesmo problema: `border-b-border`
(inferior) e `border-primary` (todos os lados) disputam a borda inferior, por
isso o novo mapeamento define `border-b-*` em cada estado.

`AdsBreadcrumb` renderiza `<a>` sem classe de cor. O navegador aplica a cor
padrão de link (`#0000ee`), que passa no tema claro e falha no escuro.

Pares medidos (razão de contraste), tema escuro, sobre `surface-raised` /
`surface-muted` / `surface-hover` (`#334155`): `primary` 4,07; `text-secondary`
8,40; `text` 9,90. Sobre `surface-selected` (`#1e40af`): `on-surface-selected`
8,34. No tema claro, `text-secondary` tem no mínimo 6,92 sobre as superfícies
neutras e `text` tem 16,30.

## Goals / Non-Goals

**Goals:**

- Contraste AA em tabs e breadcrumb nos dois temas e em todas as superfícies.
- Seleção de tab visível, sem depender da ordem do CSS.
- Nenhuma mudança de API pública, de classe `ads-*` ou de variável `--ads-*`.

**Non-Goals:**

- Alterar valores de tokens ou criar tokens (por exemplo um token de link).
- Aceitar elemento de link customizado em `AdsNav`/`AdsBreadcrumb`.
- Tocar em outros componentes.

## Decisions

### 1. Mapeamento explícito por estado

O gatilho passa a escolher um único conjunto por estado, sem sobreposição:

- ativo: `border-b-2 border-b-primary bg-surface-selected text-on-surface-selected`
- inativo: `border-b-border bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text`

Cada propriedade (cor, fundo, borda) é definida por exatamente uma utilidade em
cada estado, o que remove a dependência da ordem do CSS. É o padrão que o
`AGENTS.md` pede ("mapeamentos explícitos"). Os estados desabilitado e foco são
mantidos como estão.

**Alternativa descartada**: manter os dois conjuntos e usar `!important` ou um
utilitário de merge. Acrescenta dependência ou aumenta a especificidade sem
tornar o mapeamento claro.

### 2. Tokens: `text-secondary` e `text`, não `primary`

`primary` é cor de ação (fundo de botão com `on-primary`), e seu valor escuro
não atinge 4,5:1 sobre as superfícies elevadas. Usar `text-secondary` em repouso
e `text` no hover atinge AA com folga nos dois temas, sem alterar nenhum token.

**Alternativas descartadas**: escurecer/clarear `--ads-color-primary` no tema
escuro (afeta botões e outros componentes, fora do escopo) e criar um token de
link (nova API pública para um ajuste de estilo).

### 3. Breadcrumb

Os links usam `text-text-muted hover:text-text`, igual ao restante da trilha e
com o item atual em `text-text font-medium`. A hierarquia visual (atual em
destaque, anteriores discretos) é preservada, e o sublinhado no hover continua.

### 4. Evidência

- Teste de componente: classes por estado (ativo sem `bg-transparent` nem
  `text-text-secondary`; inativo sem `text-primary` nem `bg-surface-selected`),
  links do breadcrumb com `text-text-muted`.
- Teste de CSS distribuído: as classes usadas existem em `dist/styles.css`.
- Teste de tokens: `textSecondary` e `text` contra `canvas`, `surface`,
  `surfaceRaised`, `surfaceMuted` e `surfaceHover`, e `onSurfaceSelected` contra
  `surfaceSelected`, a 4,5:1, nos dois temas (estende o teste existente de pares).
- No admin demo, a auditoria `axe-core` de `/componentes` (change
  `add-nextjs-admin-demo`, tarefa 6.2) passa sem mudar o teste.

## Risks / Trade-offs

- **[Mudança visual intencional]** → A aba ativa passa a mostrar a seleção e a
  inativa deixa de ser azul. Documentado no CHANGELOG; baselines visuais do
  Windows e do Storybook são revisadas, não aceitas às cegas.
- **[Consumidores que sobrescreviam `text-primary` nas tabs]** → A classe de
  cor muda para tokens públicos; quem personaliza por tokens continua
  funcionando. Registrado no CHANGELOG.
