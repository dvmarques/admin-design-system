## Why

Issue #231: aplicações administrativas utilizam adaptadores de máscara sobre controles visuais de terceiros; o DS deve oferecer integração própria reutilizável sem acoplamento a outros componentes. É necessário um campo genérico de máscara que preserve teclado, caret, validação de formulário e acessibilidade sem importar regras de negócio nem adicionar runtime obrigatório à biblioteca principal.

## What Changes

- Oferecer `AdsMaskedInput` reutilizável como subpath opt-in `@admin-ds/components/masked-input`, com APIs e tipos públicos; usar `react-imask` somente nesse módulo e declará-lo como peer opcional de forma compatível com npm/consumidores.
- Controlar o valor formatado exibido (`value`/`defaultValue`), fornecer `onValueChange` com valor formatado e não formatado e documentar `onChange` DOM separadamente. Máscara opcional, máscaras fixas/dinâmicas e valores `typed` quando fornecidos pelo mecanismo.
- Preservar `ref`/`inputRef`, associação ao `AdsField`, focus, disabled/readOnly, inserção/colagem/remoção/edição no meio, seleção/caret, IME, SSR e hidratação.
- Acrescentar exemplo **na mesma PR** no Admin Demo e stories; testes unitários, axe, E2E, temas, bundle do root e documentação de adaptação de campos mascarados existentes para o DS.

## Capabilities

### New Capabilities

- `masked-input`: input com máscara, contrato de valores/eventos, integração de formulário e distribuição opt-in.

### Modified Capabilities

- `library-distribution`: novo subpath com dependência opcional que não contamina o entrypoint principal.

## Impact

Perfil **Critical**: novo componente e export público, contratos de eventos/ref, dependência opcional, novos entrypoints/CSS e compatibilidade com aplicações. `@admin-ds/components` e ferramentas de build/package; `apps/admin-demo`, `apps/docs`, `docs/integration.md` e testes. Não migra aplicações consumidoras neste change.

Fora do escopo: imports do bibliotecas visuais de terceiros, máscaras de regras de negócio, validação semântica de CPF/data/código de banco, integrações de backend, mudanças em #91, dependência em Next.js ou alteração de outros componentes. Fonte: [#231](https://github.com/dvmarques/admin-design-system/issues/231), [documentação pública do react-imask](https://imask.js.org/api/modules/react_imask.html).
