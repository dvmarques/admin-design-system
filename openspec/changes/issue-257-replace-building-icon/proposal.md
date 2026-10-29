## Why

A auditoria da issue #257 identificou que a procedência do SVG atual de `AdsIcon name="building"` não é comprovada. O consumidor de um design system público se beneficia de um desenho de procedência verificável, licenciado para redistribuição e com avisos de copyright preservados.

## What Changes

Perfil **Standard**: mudança visual pontual de SVG, sem alteração da API ou dependências.

- Substituir exclusivamente o conjunto de caminhos de `building` pelo desenho oficial `Building06Icon` do pacote gratuito `@hugeicons/core-free-icons` (MIT), preservando os comandos de geometria e seu stroke.
- Manter o nome `building`, API `AdsIcon`, semântica acessível, cor via `currentColor`, temas e tamanhos.
- Preservar o aviso integral MIT/copyright da Hugeicons em `THIRD_PARTY_NOTICES.md`, registrar a origem e revisar a auditoria de ícones.
- Incluir teste focalizado, documentação, changelog e validação visual para a alteração.

Fora do escopo: instalar pacote npm da Hugeicons, alterar outros ícones, alterar CSS/tokens, reorganizar os módulos, alterar API pública ou licenciar como próprio o SVG de terceiro.

## Capabilities

### Modified Capabilities

- `icon`: desenho visual renderizado pelo identificador público `building`.

## Impact

- `@admin-ds/components`: somente JSX SVG em `src/icon.tsx`; sem dependências.
- `apps/docs`/demo: desenho existente do ícone passa a refletir o SVG oficial, sem mudanças de contrato.
- `THIRD_PARTY_NOTICES.md`, `docs/licensing.md`, `docs/icons-license-audit.md` e `CHANGELOG.md`: atribuição/copyright com referência oficial e atualização do estado da auditoria.
