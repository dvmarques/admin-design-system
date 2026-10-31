# npm-publication Specification

## Purpose

Define a publicação npm dos quatro pacotes públicos por GitHub Actions com Trusted Publishing/OIDC, usando os mesmos tarballs validados, com recuperação idempotente e bloqueio de tag e GitHub Release até a confirmação no registry.

## Requirements

### Requirement: Publicação npm vinculada à release aprovada

O sistema MUST publicar somente os quatro pacotes autorizados, com a versão e artefatos derivados do commit de release integrado em master, após back-merge e validação de develop.

#### Scenario: Versão coordenada

- **WHEN** a publicação da versão X.Y.Z for solicitada
- **THEN** o sistema MUST conferir nomes e versões dos quatro pacotes, raiz e apps privados, e o commit resolvido da release
- **AND** MUST NOT publicar conteúdo do HEAD arbitrário de master ou develop

#### Scenario: Empacotamento inspecionado

- **WHEN** um tarball for promovido entre jobs
- **THEN** o conteúdo do tarball publicado MUST ser byte a byte idêntico ao validado no smoke externo
- **AND** sua integridade MUST ser confirmada antes e depois da publicação

### Requirement: Trusted Publishing sem segredo persistente

A publicação npm MUST autenticar por Trusted Publishing/OIDC em job separado com permissões mínimas.

#### Scenario: OIDC indisponível

- **WHEN** o contexto de OIDC estiver ausente ou a identidade do publisher for incompatível
- **THEN** o job MUST falhar
- **AND** MUST NOT recorrer a token npm persistente ou publicar pacotes

### Requirement: Recuperação idempotente

O sistema MUST detectar versões existentes, validar sua identidade e continuar somente com versões ausentes na ordem tokens, components, highlighted-code, admin.

#### Scenario: Versão já existe com integridade diferente

- **WHEN** um pacote da mesma versão já existir no registro com SHA-512 incompatível
- **THEN** o sistema MUST falhar antes de efetuar qualquer nova publicação
- **AND** MUST NOT substituir a versão existente

#### Scenario: Publicação parcial

- **WHEN** pacotes anteriores já estiverem publicados com a integridade correta e o próximo estiver ausente
- **THEN** o sistema MUST preservar os anteriores e publicar somente os ausentes
- **AND** MUST NOT considerar a release concluída até confirmar todos os quatro pacotes

#### Scenario: Dependência não publicada

- **WHEN** admin for publicado mas sua dependência components da versão alvo não estiver confirmada no registry
- **THEN** o sistema MUST interromper a publicação de admin

### Requirement: GitHub Release somente após npm confirmado

A tag e GitHub Release MUST ser criadas somente após confirmar o conjunto npm completo e MUST continuar imutáveis e recuperáveis pelas regras existentes.

#### Scenario: Npm publicado e GitHub Release ausente

- **WHEN** todos os pacotes estiverem confirmados no npm mas tag/release ainda não existir
- **THEN** o processo MAY criar a tag anotada e GitHub Release para o commit validado
- **AND** MUST NOT mover tag preexistente ou publicar versão diferente

#### Scenario: Npm incompleto

- **WHEN** qualquer pacote não tiver sido confirmado com integridade correta
- **THEN** tag e GitHub Release MUST NOT ser criadas
