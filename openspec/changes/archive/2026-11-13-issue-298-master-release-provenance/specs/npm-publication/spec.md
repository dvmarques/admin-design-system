# Spec Delta

## ADDED Requirements

### Requirement: Provenance da publicação npm atribuída à release em master

A publicação OIDC MUST usar a identidade do workflow `release.yml` executado no commit aprovado da release em `master`, mantendo os bytes do artifact preparado em `develop` e todas as verificações de integridade.

#### Scenario: Origem de artifact preparada em develop e publicação em master

- **WHEN** o artifact foi gerado por `release-prepare.yml` em `develop` e aprovado para o merge de release
- **AND** o workflow de publicação executa no merge exato em `master`
- **THEN** MUST verificar o commit de preparação como ancestral do SHA confiável de `develop` capturado na validação
- **AND** MUST preservar ID, digest, hashes e manifests do artifact sem rebuild
- **AND** MUST autenticar no npm apenas com Trusted Publisher/OIDC

#### Scenario: Origem ou integridade divergente

- **WHEN** o commit produtor não pertence ao histórico aprovado de `develop`, ou os hashes, manifests ou origem são divergentes
- **THEN** a publicação MUST falhar antes de qualquer escrita no registry
- **AND** MUST NOT tentar reconstruir os tarballs ou recorrer a token persistente

#### Scenario: Evidência real da próxima publicação

- **WHEN** a próxima versão for publicada com autorização própria
- **THEN** as quatro attestations de provenance MUST referenciar o repositório, `release.yml` e o merge SHA aprovado
- **AND** MUST confirmar as quatro integridades publicadas, auditoria de assinaturas e smoke externo
