## Why

O repositório define `0.0.1` como a primeira versão em andamento no
`CHANGELOG.md` e no manifesto raiz, mas os workspaces e o lockfile ainda usam
`0.0.0`. A divergência torna a preparação da primeira release ambígua e impede
que os metadados do monorepo identifiquem de forma uniforme a mesma versão.

## What Changes

- Alinhar a versão de todos os workspaces privados à versão canônica `0.0.1`.
- Atualizar as referências internas entre as aplicações e os pacotes do design
  system para `0.0.1`.
- Regenerar o lockfile para refletir os manifestos alinhados.
- Manter `CHANGELOG.md` em `0.0.1 - Em andamento`, pronto para a preparação da
  primeira release descrita no issue #7.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

Nenhuma. Esta mudança é exclusivamente de metadados e não altera requisitos
observáveis do design system.

## Impact

- Manifests: `package.json`, `packages/*/package.json` e `apps/*/package.json`.
- Lockfile: `package-lock.json`.
- Nenhuma API pública, dependência externa, componente reutilizável ou
  comportamento das aplicações de demonstração será alterado.
