## Context

O `package.json` raiz e a primeira seção em andamento do `CHANGELOG.md` já
declaram `0.0.1`. Os manifestos dos pacotes e aplicações privadas, bem como as
dependências de workspace registradas no lockfile, ainda declaram `0.0.0`.

## Goals / Non-Goals

**Goals:**

- Representar `0.0.1` de forma consistente em todos os manifestos de primeiro
  nível do monorepo e no lockfile.
- Manter as dependências internas resolvidas por npm workspaces.

**Non-Goals:**

- Publicar pacotes, criar tags ou uma GitHub Release.
- Alterar versões de dependências externas.
- Fechar a seção `0.0.1` do changelog.

## Decisions

- Usar `0.0.1` como a única versão do produto e dos workspaces privados. Esta é
  a versão canônica confirmada para a primeira release e reduz divergências nos
  metadados locais. A alternativa de preservar `0.0.0` nos workspaces manteria
  a ambiguidade entre manifests.
- Atualizar as faixas exatas das dependências internas nas aplicações para
  `0.0.1`. Como os pacotes são workspaces privados, npm continuará vinculando
  as cópias locais; a faixa expressa corretamente o contrato pretendido para
  uma futura publicação coordenada.
- Regenerar somente o lockfile com npm após editar os manifests, sem instalar
  ou atualizar dependências externas.

## Risks / Trade-offs

- [Ferramentas que assumem `0.0.0` nos workspaces] → Verificar o lockfile e
  executar as validações de tipo e build aplicáveis após a atualização.
- [Lockfile alterado além dos metadados de workspace] → Revisar o diff e manter
  somente as alterações decorrentes dos manifests, sem upgrades de pacotes.
