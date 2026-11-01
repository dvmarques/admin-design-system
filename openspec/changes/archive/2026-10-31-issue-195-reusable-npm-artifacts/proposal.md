## Why

O bootstrap e o workflow atual podem construir tarballs diferentes da mesma versão imutável. A #195 precisa separar geração e publicação, reutilizando bytes validados sem depender de backups pessoais.

Perfil **Critical**: segurança e arquitetura de release. A revisão independente deve verificar limites de confiança e recuperação antes do Ready.

## What Changes

- Preparação manual sem publicação produz um único conjunto identificado por versão, merge SHA, run e tentativa, com smoke Next.js e hashes.
- Publicação recebe artifact ID explícito e verifica origem confiável, expiração, digest e conteúdo; não reconstrói pacotes.
- Reexecução reutiliza o mesmo ID e retoma somente versões ausentes; expiração interrompe a operação sem rebuild automático.
- Documentar bootstrap com download temporário do artifact e recuperação sem ZIP pessoal permanente.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `release-process`: preparação e consumo de tarballs imutáveis vinculados a execução confiável.

## Impact

Workflows, scripts de release, testes e documentação operacional. Os quatro pacotes são objetos de validação; APIs React, tokens, CSS, bundles e apps não mudam. O smoke externo preserva tipos, CSS e hidratação dos consumidores. Fora do escopo: publicar, configurar npm, tags, merge e alterar a release 0.1.1.
