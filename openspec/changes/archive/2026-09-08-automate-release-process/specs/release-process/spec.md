## Purpose

Define comportamentos observáveis para preparar, validar e publicar releases do Admin Design System com versionamento coordenado, changelog inequívoco, commit rastreável, tags imutáveis e GitHub Releases recuperáveis.

## ADDED Requirements

### Requirement: Preparação explícita e recuperável de release

O sistema MUST fornecer um comando de preparação que receba uma versão estável `X.Y.Z`, valide o estado versionado necessário e produza os arquivos da release sem depender de autenticação ou consulta à API do GitHub.

#### Scenario: Rejeitar versão fora do formato estável

- **WHEN** o alvo contiver prerelease ou build metadata, como `1.0.0-rc.1` ou `1.0.0+build.1`
- **THEN** o comando MUST falhar
- **AND** MUST NOT alterar arquivos

#### Scenario: Bootstrap local da primeira release

- **WHEN** não existir versão fechada no changelog
- **AND** os manifests coordenados declararem uma única versão atual `A.B.C`
- **THEN** o alvo da primeira release MUST ser uma SemVer maior ou igual a `A.B.C`
- **AND** downgrade MUST NOT ser permitido

#### Scenario: Preflight após a primeira release

- **WHEN** existir ao menos uma versão fechada antes da preparação
- **THEN** a versão coordenada atual dos manifests MUST corresponder à última versão fechada antes da preparação
- **AND** a versão alvo MUST ser estritamente superior a ela

#### Scenario: Preparar uma versão válida

- **WHEN** as validações e a geração de todos os novos conteúdos forem concluídas com sucesso
- **THEN** o sistema MUST associar a única seção `Em andamento` à versão `X.Y.Z`, renomeando seu placeholder quando necessário
- **AND** MUST preservar o conteúdo acumulado nessa seção
- **AND** MUST fechar essa seção usando a data civil corrente em `America/Sao_Paulo`
- **AND** MUST atualizar para `X.Y.Z` o `package.json` raiz, todos os manifests de `packages/*` e `apps/*` e referências internas versionadas aplicáveis
- **AND** MUST regenerar o lockfile sem atualizar dependências externas apenas como efeito colateral da preparação
- **AND** MUST criar acima uma nova seção `Em andamento` para a próxima versão patch apenas como placeholder

#### Scenario: Estado inválido antes da preparação

- **WHEN** o changelog tiver formato inválido, houver zero ou múltiplas seções `Em andamento`, existir seção conflitante para `X.Y.Z`, as versões atuais estiverem divergentes, a regra de bootstrap não for satisfeita ou a versão alvo não respeitar a ordenação exigida
- **THEN** o comando MUST falhar antes de aplicar alterações reais

#### Scenario: Falha durante geração ou aplicação

- **WHEN** ocorrer falha durante geração do lockfile, preparação dos conteúdos ou substituição final dos arquivos
- **THEN** o sistema MUST terminar sem deixar os arquivos de trabalho em estado parcial
- **AND** MUST restaurar integralmente o estado anterior ou utilizar estratégia de substituição atômica equivalente

### Requirement: Data de release determinística

A data gravada no `CHANGELOG.md` MUST ser independente da timezone da máquina que executa a preparação.

#### Scenario: Formatar data da release

- **WHEN** uma seção for fechada
- **THEN** a data MUST ser calculada na timezone `America/Sao_Paulo`
- **AND** MUST usar o formato `dd-mmm-aaaa`
- **AND** o mês MUST usar uma das abreviações minúsculas `jan`, `fev`, `mar`, `abr`, `mai`, `jun`, `jul`, `ago`, `set`, `out`, `nov`, `dez`

### Requirement: Changelog versionado de forma inequívoca

O processo MUST identificar versões fechadas por SemVer estável e data no formato oficial, sem depender apenas da posição textual do arquivo.

#### Scenario: Determinar última versão fechada

- **WHEN** existirem uma ou mais seções fechadas válidas no `CHANGELOG.md`
- **THEN** a última versão fechada MUST ser a maior SemVer entre essas seções
- **AND** a seção `Em andamento` MUST NOT ser considerada versão fechada

#### Scenario: Determinar release anterior ao alvo

- **WHEN** uma release alvo `X.Y.Z` estiver sendo validada
- **THEN** a release anterior MUST ser a maior SemVer fechada estritamente menor que `X.Y.Z`
- **AND** a própria seção fechada `X.Y.Z` MUST NOT ser considerada sua predecessora

#### Scenario: Validar integridade das versões fechadas

- **WHEN** o changelog for validado
- **THEN** versões fechadas MUST ser únicas
- **AND** MUST usar o formato de data oficial
- **AND** MUST aparecer em ordem SemVer decrescente
- **AND** duplicidade, data inválida ou ordem inválida MUST causar falha de validação

### Requirement: Escolha explícita da próxima versão

A próxima release MUST ser escolhida explicitamente e não MUST ser limitada ao placeholder patch aberto pelo processo anterior.

#### Scenario: Placeholder diferente da versão escolhida

- **WHEN** existir uma única seção `A.B.C - Em andamento` e for preparada uma SemVer estável válida `X.Y.Z` diferente de `A.B.C`
- **THEN** o processo MUST preservar o conteúdo da seção
- **AND** MUST tratá-la como `X.Y.Z` durante a preparação

### Requirement: Versionamento coordenado e toolchain reproduzível

Todos os manifests versionados do produto, dependências internas e lockfile MUST representar a mesma versão preparada, e a regeneração/validação do lockfile MUST usar uma versão exata e compartilhada do npm.

#### Scenario: Release coordenada

- **WHEN** `X.Y.Z` tiver sido preparada
- **THEN** o manifesto raiz MUST declarar `X.Y.Z`
- **AND** todos os manifests em `packages/*` e `apps/*` MUST declarar `X.Y.Z`
- **AND** referências internas versionadas MUST usar a versão coordenada aplicável
- **AND** o lockfile MUST refletir esses manifests

#### Scenario: npm reproduzível

- **WHEN** a preparação ou validação regenerar/verificar o lockfile
- **THEN** o projeto MUST declarar uma versão exata do npm
- **AND** a mesma versão MUST ser usada nos ambientes automatizados do processo

### Requirement: Validação remota consistente

O processo automatizado MUST validar o estado remoto relevante antes de considerar uma release integrável ou publicável.

#### Scenario: Artefato da versão alvo antes da integração

- **WHEN** a versão alvo `X.Y.Z` ainda não tiver sido integrada ao histórico estável esperado
- **AND** já existir tag `vX.Y.Z` ou GitHub Release correspondente
- **THEN** a validação pré-integração MUST falhar
- **AND** MUST NOT tratar esse artefato como publicação válida da versão ainda não integrada

#### Scenario: Bootstrap remoto com histórico incompatível

- **WHEN** uma release alvo não possuir predecessora fechada
- **AND** a validação ocorrer antes da integração da release alvo
- **AND** existir artefato de release no padrão `vA.B.C` incompatível com a ausência de histórico fechado
- **THEN** a validação MUST falhar

#### Scenario: Retry pós-integração da versão alvo

- **WHEN** a versão alvo já tiver sido integrada e sua publicação estiver sendo executada ou recuperada
- **THEN** os artefatos da própria versão alvo MUST ser avaliados pelas regras de idempotência e recuperação
- **AND** MUST NOT ser rejeitados apenas por existirem

#### Scenario: Release anterior publicada

- **WHEN** existir uma predecessora da versão alvo
- **THEN** o processo MUST resolver independentemente o commit esperado dessa predecessora
- **AND** MUST validar a tag anotada e a GitHub Release da predecessora contra esse commit esperado
- **AND** a GitHub Release da predecessora MUST satisfazer as mesmas invariantes de identidade, estado e notas exigidas para uma publicação consistente
- **AND** MUST falhar se a publicação anterior estiver ausente ou divergente

### Requirement: OpenSpec reproduzível na CI

A validação OpenSpec automatizada MUST usar uma forma versionada e multiplataforma de disponibilizar o CLI.

#### Scenario: Ambiente Linux

- **WHEN** a validação OpenSpec executar em Linux
- **THEN** MUST usar o launcher multiplataforma apropriado
- **AND** MUST NOT depender de `openspec.cmd` ou instalação global preexistente

### Requirement: Publicação no commit exato da release

A publicação MUST resolver de forma inequívoca o commit efetivamente integrado para a versão informada e MUST validar os artefatos da release nesse commit.

#### Scenario: Resolver commit da release

- **WHEN** a publicação for solicitada para `X.Y.Z`
- **THEN** o processo MUST resolver o commit efetivamente integrado para essa versão
- **AND** MUST verificar que o commit continua pertencendo ao histórico estável esperado da release
- **AND** MUST validar versão, changelog e notas nesse commit
- **AND** MUST NOT assumir que o HEAD corrente da linha estável é o commit da release

#### Scenario: Commit não pertence mais ao histórico esperado

- **WHEN** o commit resolvido não pertencer mais ao histórico estável esperado
- **THEN** a publicação MUST falhar sem criar ou alterar tag/release

### Requirement: Tags anotadas imutáveis e recuperação idempotente

O processo MUST usar apenas tags anotadas de release e MUST nunca mover, sobrescrever ou recriar uma tag existente.

#### Scenario: Tag inexistente

- **WHEN** `vX.Y.Z` não existir e todas as validações passarem
- **THEN** o processo MUST criar uma tag anotada no commit validado antes da GitHub Release

#### Scenario: Tag anotada existente no mesmo commit

- **WHEN** `vX.Y.Z` existir como tag anotada e seu commit dereferenciado for o commit validado
- **THEN** a tag MAY ser reutilizada sem alteração

#### Scenario: Tag lightweight

- **WHEN** `vX.Y.Z` existir como lightweight tag
- **THEN** a publicação MUST falhar
- **AND** MUST NOT substituir ou recriar a tag

#### Scenario: Tag anotada em outro commit

- **WHEN** o commit dereferenciado da tag divergir do commit validado
- **THEN** a publicação MUST falhar sem alterar a tag

### Requirement: GitHub Release consistente e idempotente

Uma GitHub Release existente MUST ser tratada como publicação concluída somente quando todos os metadados relevantes corresponderem ao estado esperado.

#### Scenario: GitHub Release existente e consistente

- **WHEN** a GitHub Release `vX.Y.Z` já existir
- **AND** `tag_name` for `vX.Y.Z`
- **AND** o nome da release for `vX.Y.Z`
- **AND** `draft` for `false`
- **AND** `prerelease` for `false`
- **AND** a tag anotada dereferenciar para o commit validado
- **AND** o body for equivalente às notas extraídas após normalizar somente CRLF/LF e newline final
- **THEN** a publicação MUST encerrar como sucesso/no-op explícito
- **AND** MUST NOT modificar tag ou release

#### Scenario: GitHub Release existente divergente

- **WHEN** qualquer um desses metadados divergir
- **THEN** a publicação MUST falhar
- **AND** MUST NOT alterar tag ou release

#### Scenario: Recuperação após criação da tag

- **WHEN** a tag anotada válida existir no commit esperado e a GitHub Release não existir
- **THEN** a publicação MUST preservar a tag
- **AND** MUST criar somente a GitHub Release

### Requirement: Notas derivadas do changelog

As notas da GitHub Release MUST vir somente da seção fechada da versão correspondente no `CHANGELOG.md` do commit liberado.

#### Scenario: Extrair notas

- **WHEN** a release `X.Y.Z` for publicada ou recuperada
- **THEN** o corpo MUST conter apenas o conteúdo pertencente à seção fechada `X.Y.Z` daquele commit
