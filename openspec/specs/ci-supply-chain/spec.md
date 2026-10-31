# ci-supply-chain Specification

## Purpose

Fortalecer a execução de automações do repositório de modo verificável, preservando qualidade, releases e revisão de snapshots.

## Requirements

### Requirement: Dependências de workflow imutáveis

Todos os workflows MUST referenciar actions externas por SHA completo de commit, manter a versão revisável e MUST fixar por digest uma imagem Playwright alinhada ao pacote e lockfile.

#### Scenario: Uma action volta para uma tag mutável

- **WHEN** um workflow contém `uses:` externo que não referencia SHA completo de commit
- **THEN** o teste de segurança de workflows falha com arquivo e ação

#### Scenario: Imagem diverge do lockfile

- **WHEN** a tag, digest ou a versão de Playwright diverge entre os workflows e o lockfile
- **THEN** a verificação de consistência falha antes de considerar a alteração pronta

### Requirement: Privilégios de token isolados

O projeto MUST executar instalação, build e testes sobre código de PR com token sem escrita em contents, sem secrets privilegiados, e MUST restringir escrita à publicação/deploy e registro de baselines em etapas isoladas.

#### Scenario: PR não confiável solicita validação

- **WHEN** uma PR de fork chega à CI
- **THEN** nenhuma execução de seu código dispõe de token com `contents: write`, sem uso de `pull_request_target`

#### Scenario: Release publica artefato

- **WHEN** uma publicação de release previamente validada é acionada em develop
- **THEN** o job de publicação conserva somente os privilégios necessários, após validação read-only dos SHAs

### Requirement: Snapshots podem ser regenerados com revisão

A atualização de snapshots MUST gerar imagens sem privilégio de push e registrar apenas PNGs de baseline na branch elegível correspondente à revisão originalmente testada.

#### Scenario: Regeneração de baselines em branch permitida

- **WHEN** o mantenedor aciona manualmente o workflow numa branch de feature não protegida do próprio repositório e a atualização passa nos testes
- **THEN** somente os PNGs de baseline podem ser registrados e ficam revisáveis no diff da PR

#### Scenario: Branch protegida, mudança de SHA ou artefato estranho

- **WHEN** o workflow é acionado em develop/master/release, a branch avança ou um artefato contém caminho não permitido
- **THEN** o job de commit não grava mudanças

### Requirement: Regressões de CI e publicação evitadas

O hardening MUST conservar Node 24, `engines.node >=24.0.0`, required check names, três browsers, publicação Pages restrita a develop e validação de release por SHA.

#### Scenario: PR em Draft passa a Ready

- **WHEN** uma PR Draft torna-se Ready para revisão
- **THEN** a CI e os gates de segurança voltam a executar sem que a publicação Pages ocorra para a PR
