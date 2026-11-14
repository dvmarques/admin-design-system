## Why

Issue: [#316](https://github.com/dvmarques/admin-design-system/issues/316), épico #315.

Os 20 ícones públicos resolvem a experiência padrão, mas a seleção é limitada. Consumidores precisam usar bibliotecas React ou SVGs próprios sem que o ADS escolha um fornecedor. Componentes que fixam ícones devem permitir sobrescrita quando fizer sentido.

## What Changes

- Expor `AdsIconSlot`, um invólucro sem dependência de catálogo que aceita elemento React já renderizado, controla espaço/alinhamento, cor herdada e semântica acessível, sem clonar nem injetar props no filho.
- Preservar exatamente `AdsIcon`, seus 20 nomes, imports e SVGs licenciados.
- Evoluir slots opcionais nos controles prioritários com ícones internos; manter defaults.
- Inventariar os demais pontos fixos e documentar escolhas, demonstrações, testes, footprint e trade-offs.
- Bibliotecas externas são escolhas do consumidor, nunca dependencies ou peers obrigatórios dos pacotes.

## Capabilities

### New Capabilities

Nenhuma capability separada: estender contrato da capability `icon`.

### Modified Capabilities

- `icon`: composição genérica, semântica acessível e personalização opcional.

## Impact

`packages/components` (API React pública), `packages/admin` nos slots aplicáveis, testes, `apps/docs` e `apps/admin-demo`, `docs/icon-architecture.md` e `CHANGELOG.md`. Sem alterar design tokens, sem novos catálogos distribuídos e sem migração compulsória.

## Compatibility / Risk

Perfil **Critical**: API pública aditiva, acessibilidade transversal, SSR/RSC, componente integrado e licença. `AdsIcon name` permanece invariável. Cor e tamanhos de ícones externos não são forçados: o consumidor controla o SVG. Rollback por reversão da PR sem mudança de dados. E2E, snapshots e CI devem confirmar não-regressão; nenhum check pendente será marcado como aprovado.
