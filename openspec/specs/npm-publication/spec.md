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

### Requirement: Confirmação temporizada e comprovada após publicação npm

O sistema MUST confirmar a publicação por releituras limitadas do registry, sem presumir sucesso a partir do código de saída do npm publish.

#### Scenario: Propagação superior à janela anterior

- **WHEN** npm publish termina com sucesso, mas a versão só aparece após mais de 30 segundos
- **THEN** a publicação MUST continuar consultando por até 150 segundos e 20 leituras por pacote
- **AND** MUST verificar `name`, `version` e `dist.integrity` antes de avançar

#### Scenario: Janela de propagação esgotada

- **WHEN** a versão não aparece até o deadline ou máximo de tentativas
- **THEN** a execução MUST falhar com pacote, versão e orientação de reconciliação/reexecução
- **AND** MUST NOT publicar o próximo pacote nem declarar sucesso

#### Scenario: Registry retorna versão com integridade divergente

- **WHEN** nome, versão ou `dist.integrity` diverge do artifact aprovado
- **THEN** o processo MUST falhar imediatamente
- **AND** MUST NOT tratar a divergência como atraso transitório

#### Scenario: Limites de tempo e supply chain preservados

- **WHEN** o registry responde lentamente
- **THEN** cada consulta MUST respeitar o timeout por requisição e o tempo restante do deadline
- **AND** o job npm MUST ter timeout finito com margem para os quatro pacotes
- **AND** MUST preservar OIDC, provenance, ausência de tokens npm persistentes e recuperação idempotente

### Requirement: Reconciliação final resiliente e estritamente somente leitura

A verificação final MUST reconfirmar cada pacote com integridade aprovada sem emitir novo `npm publish` e tolerar leituras transitórias, mantendo deadline e tentativas explícitas.

#### Scenario: Registry alterna 200, 404 e 200

- **WHEN** um pacote foi confirmado com HTTP 200, mas a primeira releitura final responde 404 e a seguinte retorna a mesma versão
- **THEN** a verificação final MUST concluir após reconfirmar `name`, `version` e `dist.integrity`
- **AND** MUST NOT publicar novamente qualquer pacote

#### Scenario: Verificação final esgotada

- **WHEN** o pacote não é reconfirmado dentro de 60 segundos ou 12 leituras finais
- **THEN** a execução MUST falhar com nome, versão, fase, quantidade de consultas e último motivo registrado
- **AND** MUST NOT declarar a publicação completa nem publicar novos pacotes

### Requirement: Falhas HTTP transitórias durante a confirmação

A confirmação pós-publicação e a verificação final MUST tolerar indisponibilidade transitória reconhecida sem afrouxar a validação de integridade ou os limites temporais.

#### Scenario: Timeout ou resposta temporariamente indisponível

- **WHEN** uma leitura sofre `TimeoutError`, falha transitória de transporte, HTTP 429 ou HTTP 5xx
- **THEN** o processo MUST permitir novas leituras somente no prazo e limite de tentativas da fase
- **AND** cada requisição MUST respeitar no máximo 30 segundos e o saldo do deadline monotônico

#### Scenario: Erro permanente ou integridade divergente

- **WHEN** o registry retorna HTTP 4xx permanente, JSON inválido, nome, versão ou hash incompatível
- **THEN** a execução MUST falhar imediatamente, sem tratar a resposta como falha transitória
- **AND** MUST NOT republicar automaticamente nem avançar para criação de tags ou GitHub Release
