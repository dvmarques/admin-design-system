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

## Licenciamento e distribuição

- `THIRD_PARTY_NOTICES.md` na raiz preserva integralmente Feather MIT, Lucide ISC (incluindo seus avisos Feather incorporados) e Hugeicons Free MIT.
- A pasta publicada `packages/components/dist/` deve conter cópias exatas de `LICENSE.md` e `THIRD_PARTY_NOTICES.md` por `scripts/copy-license-notices.mjs`, executado no build.
- `scripts/verify-package.mjs` valida as cópias. O `package.json` continua com `files: ["dist"]`, garantindo inclusão na futura distribuição.
- Sem nova dependência de runtime ou alteração de export público; manter separação entre documentação de origem e certificação indevida da autoria dos traçados antigos.

## Validação e orçamento

Testes de todos os nomes públicos, quantidade de shapes, geometria `building`, stroke de 19 ícones, acessibilidade, temas e Storybook; `npm run format`, lint, typecheck, build, `npm run test:e2e`, `openspec validate --all --strict`. Aumento de bundle/dist deverá ser medido em ambiente de build adequado antes de modificar limites orçamentários. CI e validação visual são gates antes do merge.
