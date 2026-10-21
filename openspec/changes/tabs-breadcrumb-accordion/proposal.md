# Proposal

## Why

`AdsTabs` e `AdsBreadcrumb` cobrem só o caso mais simples, e a família de navegação estrutural não tem `AdsAccordion` (issue #90, filha do épico #85). Hoje o Tabs não oferece orientação vertical nem ativação automática, gera ids a partir do valor sem sanitizar e deixa a tab ativa desabilitada sem nenhuma parada de tabulação. O Breadcrumb não colapsa trilhas longas e não aceita separador próprio. Além disso, `navigation.tsx` usa hooks sem declarar `"use client"`, o que só funciona por acaso quando o consumidor já é um Client Component.

## What Changes

- Novo `AdsAccordion` composto (`Root`, `Item`, `Header`, `Trigger`, `Panel`), com modos `single` e `multiple`, estado controlado ou não, itens desabilitados, nível de heading configurável, navegação por teclado e `unmountOnCollapse` opt-in.
- `AdsTabs` ganha `activationMode` (`manual` por padrão, `automatic` opt-in), `orientation` (`horizontal` por padrão, `vertical` opt-in) e `keepMounted` opt-in. O padrão continua desmontando painéis inativos.
- `AdsTabs` passa a gerar ids válidos e únicos para qualquer `value` e a manter sempre uma tab tabulável, inclusive quando a tab ativa está desabilitada.
- `AdsBreadcrumb` ganha colapso de trilhas longas (`maxItems`, `itemsBeforeCollapse`, `itemsAfterCollapse`, `expandLabel`) e separador configurável (`separator`). Sem `maxItems`, nada muda.
- Separação cliente/servidor: `AdsTabs` e `AdsAccordion` declaram `"use client"`; `AdsBreadcrumb` e `AdsNav` continuam compatíveis com Server Components, inclusive recebendo `renderLink` de um Server Component. O export público continua único (`"."`).
- Todo texto embutido novo tem padrão em inglês, concentrado em constante nomeada e sobrescrevível por prop. Isso prepara internacionalização futura sem introduzir provider.
- Demo, stories, documentação, testes unitários, E2E por papéis ARIA, baseline de bundle e snapshots visuais atualizados para o que é novo.

Não há mudança incompatível: os padrões de todas as props novas reproduzem o comportamento atual.

**Fora do escopo:** menu dropdown no colapso do Breadcrumb, animação de altura do Accordion, overflow ou scroll dedicado das Tabs, `AdsLocaleProvider`, RTL, pluralização e tradução dos textos padrão já existentes em outros componentes (por exemplo o rótulo padrão `Navegação` de `AdsNav`).

## Capabilities

### New Capabilities

- `accordion`: `AdsAccordion` com seções expansíveis acessíveis, modos single e multiple, teclado, itens desabilitados, painel montado ou desmontado e temas.

### Modified Capabilities

- `navigation-structure`: Tabs com ativação automática, orientação vertical, `keepMounted`, ids válidos e parada de tabulação garantida; Breadcrumb com colapso e separador configurável; textos padrão sobrescrevíveis; fronteira entre Client e Server Components.

## Impact

- **`packages/components`**: `navigation.tsx` deixa de conter o Tabs (novo `tabs.tsx` com `"use client"`); novos `accordion.tsx` (`"use client"`) e uma ilha cliente para o colapso do Breadcrumb; `index.ts` exporta as novas APIs; `scripts/verify-package.mjs` passa a conferir a diretiva `"use client"` nos módulos cliente de navegação. Novos tipos públicos `AdsAccordion*`, novas props opcionais de `AdsTabs*` e `AdsBreadcrumbProps`.
- **`apps/docs`**: stories de Accordion e variantes novas de Tabs e Breadcrumb.
- **`apps/admin-demo`**: seções novas na página de componentes; `public-consumption.test.ts` cobre os exports novos.
- **`e2e`**: novo spec de navegação estrutural; snapshots da rota `/componentes` revisados.
- **Docs**: `docs/integration.md` (uso, textos e i18n), `docs/bundle-baseline.md` e `docs/bundle-baseline.json`, README.
- **Dependências de runtime**: nenhuma.
- **Tamanho do bundle**: cresce com o Accordion e as novas props; o baseline é atualizado de forma explícita.
