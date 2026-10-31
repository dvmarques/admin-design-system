# Proposal

## Why

A issue #195 precisa acrescentar a distribuição pública npm ao processo de release coordenada existente. Hoje o workflow manual valida a release e cria tag/GitHub Release, mas não publica os quatro tarballs preparados na #194. A #198 já documentou a adoção, sem afirmar que os pacotes estão no registry.

## What Changes

- Estender a publicação manual para preparar e validar os mesmos tarballs depois utilizados pelo job npm, sem publicar em PRs ou no push de develop.
- Vincular a versão dos quatro pacotes ao merge commit exato de `release/X.Y.Z -> master`, após back-merge para develop, com verificações existentes de histórico, changelog e versão coordenada.
- Usar Trusted Publishing/OIDC em job próprio de menor privilégio e publicação direta, sem token npm duradouro; separar criação de tag/GitHub Release da publicação npm.
- Validar nomes, versões, acesso público, integridade SHA-512 e conteúdo validado dos tarballs; publicar somente os pacotes ausentes em ordem fixa.
- Implementar idempotência: falhar em divergência, recuperar publicação parcial, conferir o estado final no registry antes de criar tag/release.
- Documentar bootstrap inicial, configuração exata de publisher, operação, falhas e verificação externa. Nenhuma publicação npm nesta PR.
- Incluir revisão editorial obrigatória do changelog antes de `release:prepare`: proposta de agrupamento/encurtamento, revisão humana, aprovação ligada ao conteúdo, verificação de duplicidades e proteção das versões já fechadas.

## Capabilities

### New Capabilities

- `npm-publication`: fluxo de empacotamento, confiança OIDC, inspeção do registry, publicação idempotente e recuperação.

### Modified Capabilities

- `release-process`: a tag e GitHub Release passam a depender da confirmação de publicação de todos os pacotes no npm.

## Impact

Perfil Critical (publicação irrevogável, identidade externa, supply chain). Afeta `.github/workflows/release.yml`, scripts de release e empacotamento, testes e `docs/release-process.md`. Não muda API, CSS, interface nem versões de workspaces. Não altera as #194/#198 retroativamente; atualização dos avisos pré-publicação ocorrerá somente após publicação real confirmada.

## Limites

Sem publicação real, sem escolher a primeira versão, sem tokens/2FA ou configurações manuais npm em issue/commit/log. O mantenedor aprovou **publicação direta após aprovação da release**, não staged publishing. Preservar workflow_dispatch, gates, branches e rulesets existentes.
