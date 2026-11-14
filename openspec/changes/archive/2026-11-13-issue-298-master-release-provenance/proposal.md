# Proposal

## Why

Na publicação OIDC da versão 0.1.2, os tarballs foram aprovados contra o merge de release em `master`, mas a execução de publicação ocorreu em `develop`. A provenance npm atesta o SHA da execução, que não é o merge aprovado. A issue #298 corrige a identidade da execução sem republicar a 0.1.2.

**Perfil: Critical.** A mudança afeta segurança, supply chain e fluxo de release, exigindo preservação dos gates e revisão independente.

## What Changes

- Aceitar `workflow_dispatch` de `release.yml` somente em `refs/heads/master`, com `github.sha` exatamente igual ao `merge_commit_sha` resolvido para a versão.
- Preservar a resolução da release, a existência do back-merge, validação de predecessora, changelog e versão coordenada em `master` e `develop`.
- Continuar preparando o artifact em `develop` e vinculá-lo ao merge aprovado; ao publicar em `master`, validar sua origem contra o SHA confiável de `develop` capturado pelo gate inicial, não contra o HEAD de `master`.
- Manter consumo dos bytes preparados sem rebuild, publicação OIDC por Trusted Publisher `release.yml`, permissões mínimas e smoke externo.
- Atualizar testes automatizados e documentação, incluindo a conferência futura de provenance e integridades nos quatro pacotes.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `release-process`: autorização de ref e commit da publicação, preservação do back-merge.
- `npm-publication`: identidade da provenance para os quatro pacotes.

## Impact

Altera workflow de release, verificação de artifact, testes e documentação, sem mudança em `packages/*`, APIs públicas, CSS, tokens, acessibilidade, Storybook ou aplicações consumidoras. Mantém npm 11.19.1/Node 24 e não acrescenta dependências de runtime. A validação externa existente continua como gate de distribuição.

Fora do escopo: publicar versões, preparar artifacts, criar/mover tags, GitHub Releases, alterar a versão 0.1.2 ou segredos npm. A prova de provenance real é condicionada à próxima release autorizada.
