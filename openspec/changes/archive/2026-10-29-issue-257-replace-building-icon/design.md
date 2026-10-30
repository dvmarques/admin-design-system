## Contexto e decisões de fonte

A auditoria da issue #257 não comprovou origem dos 20 traçados históricos. Foi aprovada a substituição pelos SVGs oficiais:

- **Feather Icons** — 18 SVGs do diretório `icons/`, licença MIT ([original](https://github.com/feathericons/feather/blob/main/LICENSE)), copyright Cole Bemis.
- **Lucide Icons** — `icons/chevrons-up-down.svg`, ISC ([original](https://github.com/lucide-icons/lucide/blob/main/LICENSE)), copyright Lucide Icons and Contributors.
- **Hugeicons Free** — `Building06Icon` de `@hugeicons/core-free-icons`, MIT ([original](https://github.com/hugeicons/hugeicons/blob/main/packages/core-free-icons/LICENSE.md)), copyright Hugeicons.

A tabela completa de URLs oficiais, nomes públicos e blob SHAs consultados fica em `docs/icons-license-audit.md`.

## SVG, estrutura e contratos

- Renderizar os elementos oficiais `path`, `circle`, `line`, `rect` e `polyline` como JSX, sem dependência externa. A geometria de origem não deve ser simplificada ou redesenhada.
- Preservar `viewBox="0 0 24 24"`, `currentColor` e `fill="none"` compartilhados de `AdsIcon`.
- Cada elemento Feather/Lucide recebe `strokeWidth="2"` para não herdar `1.75` do wrapper; Hugeicons preserva `1.5` e pontas `butt`/`round` por path. Cor e stroke-linejoin/linecap normais permanecem herdados quando são idênticos aos originais.
- Não alterar nomes, tipagem `AdsIconName`, tamanhos `sm/md/lg`, semântica decorativa/informativa, SSR ou tree-shaking existente.
- Mudanças de geometria são visuais: revisar o Storybook, os consumidores e baselines visuais afetados, sem gerar snapshots indiscriminadamente.

## Modularização para futura extração

- `packages/components/src/icons/paths.tsx` contém **somente** os 20 SVGs licenciados, com comentários de origem no próprio registro. Não alterar sua geometria nem suas propriedades ao mover.
- `packages/components/src/icons/types.ts` define `AdsIconName` a partir das chaves de `iconPaths`, `AdsIconSize` e `AdsIconProps`. Isso preserva a união fechada de nomes e a tipagem existente.
- `packages/components/src/icons/icon.tsx` contém o componente React e os estilos por tamanho. O import relativo de `classNames` permanece uma dependência interna de `@admin-ds/components`.
- `packages/components/src/icons/index.ts` centraliza os exports internos; `packages/components/src/icon.tsx` permanece um **reexport de compatibilidade** de `./icons/index.js`, para manter os imports públicos e os consumidores existentes, inclusive `src/index.ts`.
- Nenhuma nova exportação de subpath no `package.json`, pacote npm, biblioteca runtime ou dependência. Uma futura extração para `@admin-ds/icons` requer change separada para resolver `classNames`, distribuição de licenças, tipos e compatibilidade de imports, sem antecipar essa decisão agora.
- Teste de contrato garante identidade das exportações do módulo público e do reexport, preserva exatamente 20 chaves e verifica HTML de renderização dos nomes.

## Licenciamento e distribuição

- `THIRD_PARTY_NOTICES.md` na raiz preserva integralmente Feather MIT, Lucide ISC (incluindo seus avisos Feather incorporados) e Hugeicons Free MIT.
- A pasta publicada `packages/components/dist/` deve conter cópias exatas de `LICENSE.md` e `THIRD_PARTY_NOTICES.md` por `scripts/copy-license-notices.mjs`, executado no build.
- `scripts/verify-package.mjs` valida as cópias. O `package.json` continua com `files: ["dist"]`, garantindo inclusão na futura distribuição.
- Sem nova dependência de runtime ou alteração de export público; manter separação entre documentação de origem e certificação indevida da autoria dos traçados antigos.

## Validação e orçamento

Testes de todos os nomes públicos, quantidade de shapes, geometria `building`, stroke de 19 ícones, acessibilidade, temas e Storybook; `npm run format`, lint, typecheck, build, `npm run test:e2e`, `openspec validate --all --strict`. Aumento de bundle/dist deverá ser medido em ambiente de build adequado antes de modificar limites orçamentários. CI e validação visual são gates antes do merge.
