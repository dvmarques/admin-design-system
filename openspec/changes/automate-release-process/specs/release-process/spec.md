## Purpose

Definir o contrato observável da automação de release do Admin Design System, garantindo preparação consistente, versionamento coordenado, changelog determinístico, rastreabilidade do commit liberado e publicação recuperável sem alterar artefatos já publicados de forma incompatível.

## ADDED Requirements

### Requirement: Preparação local consistente e recuperável
O projeto MUST disponibilizar um comando local de preparação de release que receba uma versão estável `X.Y.Z`, valide o estado versionado necessário e produza as alterações de release sem deixar estado parcial em caso de falha.

#### Scenario: Rejeitar versão fora do formato estável
- **WHEN** o alvo contiver prerelease ou build metadata, como `1.0.0-rc.1` ou `1.0.0+build.1`
- **THEN** a preparação MUST falhar
- **AND** MUST NOT alterar os arquivos versionados

#### Scenario: Bootstrap local da primeira release
- **WHEN** não existir nenhuma versão fechada no changelog
- **AND** os manifests coordenados declararem uma única versão atual `A.B.C`
- **THEN** o alvo da primeira release MUST ser uma SemVer maior ou igual a `A.B.C`
- **AND** downgrade MUST NOT ser permitido
- **AND** a preparação local MUST NOT depender de consulta à API do GitHub para concluir seu preflight

#### Scenario: Preparar uma versão após o bootstrap
- **WHEN** existir ao menos uma versão fechada anterior
- **THEN** a versão coordenada atual MUST corresponder à última versão fechada antes da preparação
- **AND** a versão alvo MUST ser estritamente superior a ela

#### Scenario: Falha antes da conclusão
- **WHEN** ocorrer erro de validação, geração do lockfile ou aplicação dos arquivos
- **THEN** a preparação MUST terminar sem deixar os arquivos versionados em estado parcial
- **AND** uma nova execução MUST partir de um estado coerente

### Requirement: Escolha explícita da próxima versão
A automação MUST permitir que a próxima release estável seja patch, minor ou major, independentemente do valor usado como placeholder na seção aberta do changelog.

#### Scenario: Placeholder diferente da versão escolhida
- **WHEN** existir uma única seção `A.B.C - Em andamento`
- **AND** o mantenedor preparar uma versão estável válida `X.Y.Z` diferente de `A.B.C`
- **THEN** o conteúdo acumulado MUST ser preservado
- **AND** a seção MUST ser fechada como `X.Y.Z`

### Requirement: Changelog versionado de forma inequívoca
A automação MUST interpretar as versões fechadas do `CHANGELOG.md` por SemVer e data oficial, sem depender somente da posição textual do arquivo.

#### Scenario: Determinar última versão fechada
- **WHEN** existirem uma ou mais seções fechadas válidas
- **THEN** cada seção fechada MUST usar SemVer estável e data no formato `dd-mmm-aaaa` com o mês PT-BR definido nesta capability
- **AND** a última versão fechada MUST ser a maior SemVer entre essas seções
- **AND** a seção `Em andamento` MUST NOT ser considerada versão fechada

#### Scenario: Determinar predecessora do alvo
- **WHEN** uma release alvo `X.Y.Z` for validada
- **THEN** a predecessora MUST ser a maior SemVer fechada estritamente menor que `X.Y.Z`
- **AND** a própria seção fechada `X.Y.Z` MUST NOT ser considerada sua predecessora

#### Scenario: Changelog inconsistente
- **WHEN** houver versão fechada com data inválida, versões fechadas duplicadas, fora de ordem SemVer decrescente, zero ou múltiplas seções `Em andamento` ou conflito com a versão alvo
- **THEN** a validação MUST falhar antes de considerar a release preparada

### Requirement: Data de fechamento determinística
A data gravada ao fechar uma versão MUST ser independente da timezone da máquina que executa a preparação.

#### Scenario: Formatar data da release
- **WHEN** uma versão for fechada no changelog
- **THEN** a data MUST corresponder à data civil em `America/Sao_Paulo`
- **AND** MUST usar o formato `dd-mmm-aaaa`
- **AND** o mês MUST usar uma das abreviações minúsculas `jan`, `fev`, `mar`, `abr`, `mai`, `jun`, `jul`, `ago`, `set`, `out`, `nov`, `dez`

### Requirement: Versionamento coordenado do monorepo
Uma release preparada MUST representar uma única versão coordenada no manifesto raiz, workspaces, referências internas versionadas e lockfile.

#### Scenario: Preparação coordenada
- **WHEN** `X.Y.Z` tiver sido preparada com sucesso
- **THEN** o manifesto raiz MUST declarar `X.Y.Z`
- **AND** todos os manifests existentes em `packages/*` e `apps/*` MUST declarar `X.Y.Z`
- **AND** referências internas versionadas aplicáveis MUST permanecer coerentes com `X.Y.Z`
- **AND** o lockfile MUST refletir os manifests preparados

#### Scenario: Dependência externa não relacionada
- **WHEN** a preparação regenerar o lockfile sem alteração funcional de dependências externas
- **THEN** versões de dependências externas MUST NOT ser atualizadas apenas como efeito colateral da preparação

### Requirement: Validação reutilizável da release
O projeto MUST disponibilizar uma validação automatizável que determine se uma release preparada e seu estado remoto estão consistentes para a etapa em que a validação é executada.

#### Scenario: Release preparada consistente
- **WHEN** a validação for executada para `X.Y.Z`
- **THEN** MUST confirmar a versão coordenada dos manifests e lockfile
- **AND** MUST confirmar a seção fechada correspondente no changelog
- **AND** MUST rejeitar divergências entre esses artefatos

#### Scenario: Bootstrap remoto antes da integração
- **WHEN** a validação pré-integração for executada para uma release sem predecessora
- **THEN** MUST confirmar que não existe tag nem GitHub Release no padrão estável `vX.Y.Z` incompatível com o bootstrap ainda não integrado
- **AND** MUST considerar uma tag/release da própria versão alvo como órfã enquanto ainda não existir o commit integrado esperado daquela release
- **AND** MUST falhar se existir artefato remoto órfão dentro desse padrão

#### Scenario: Recuperação depois da integração
- **WHEN** a publicação for reexecutada depois de o commit da release já ter sido integrado
- **THEN** a existência da tag/release da versão alvo MUST ser avaliada pelos requisitos de idempotência desta capability
- **AND** MUST NOT ser rejeitada apenas por a release não possuir predecessora

#### Scenario: Predecessora necessária
- **WHEN** existir uma predecessora para `X.Y.Z`
- **THEN** a automação MUST resolver de forma independente o commit efetivamente integrado da predecessora usando o mesmo contrato de resolução de commit aplicado à release atual
- **AND** MUST confirmar que a tag anotada da predecessora dereferencia para esse commit esperado
- **AND** MUST confirmar que a GitHub Release da predecessora atende aos critérios definidos nesta capability
- **AND** MUST falhar quando qualquer parte da publicação precedente estiver ausente ou divergente

### Requirement: Publicação no commit exato da release
A publicação de `X.Y.Z` MUST resolver e validar o commit exato correspondente à integração daquela release antes de criar artefatos remotos.

#### Scenario: Resolver commit da release
- **WHEN** a publicação de `X.Y.Z` for solicitada
- **THEN** a automação MUST resolver de forma inequívoca o commit efetivamente integrado para essa versão
- **AND** MUST confirmar que esse commit continua alcançável a partir de `master`
- **AND** MUST validar nesse commit a versão coordenada e o changelog fechado
- **AND** MUST NOT substituir o commit resolvido pelo HEAD corrente de `master`

#### Scenario: Commit não resolvido ou ambíguo
- **WHEN** não for possível determinar de forma inequívoca o commit da release
- **THEN** a publicação MUST falhar
- **AND** MUST NOT criar ou alterar tag ou GitHub Release

### Requirement: Tags de release anotadas e imutáveis
A automação MUST usar tags anotadas `vX.Y.Z` e MUST preservar qualquer tag existente sem movê-la, sobrescrevê-la ou recriá-la.

#### Scenario: Tag inexistente
- **WHEN** `vX.Y.Z` não existir e todas as validações passarem
- **THEN** a automação MUST criar uma tag anotada apontando para o commit validado da release

#### Scenario: Tag anotada existente no commit correto
- **WHEN** `vX.Y.Z` existir como tag anotada
- **AND** seu commit dereferenciado for exatamente o commit validado
- **THEN** a automação MAY reutilizar a tag sem alteração

#### Scenario: Tag incompatível
- **WHEN** `vX.Y.Z` existir como lightweight tag ou apontar para outro commit após dereference
- **THEN** a publicação MUST falhar
- **AND** MUST NOT alterar ou substituir a tag existente

### Requirement: GitHub Release consistente e idempotente
A GitHub Release `vX.Y.Z` MUST representar a tag e o commit validados e MUST permitir recuperação segura quando a tag correta já existir mas a release ainda não tiver sido criada.

#### Scenario: Criar GitHub Release
- **WHEN** a tag anotada correta existir e a GitHub Release correspondente não existir
- **THEN** a automação MUST criar a GitHub Release com `tag_name` e nome iguais a `vX.Y.Z`
- **AND** MUST usar somente as notas da seção fechada `X.Y.Z` do changelog do commit liberado
- **AND** MUST publicar a release com `draft=false` e `prerelease=false`

#### Scenario: GitHub Release existente e consistente
- **WHEN** a GitHub Release `vX.Y.Z` já existir
- **AND** `tag_name`, nome, commit, `draft`, `prerelease` e body corresponderem ao estado definido nesta capability
- **THEN** a publicação MUST encerrar como sucesso/no-op explícito
- **AND** MUST NOT modificar tag ou release

#### Scenario: GitHub Release existente divergente
- **WHEN** qualquer metadado validado divergir do estado esperado
- **THEN** a publicação MUST falhar
- **AND** MUST NOT alterar tag ou release

### Requirement: Notas derivadas exclusivamente do changelog
As notas publicadas para `X.Y.Z` MUST ser derivadas exclusivamente da seção fechada correspondente no `CHANGELOG.md` do commit liberado.

#### Scenario: Extrair notas
- **WHEN** as notas de `X.Y.Z` forem extraídas
- **THEN** o resultado MUST conter somente o conteúdo daquela seção fechada
- **AND** uma comparação de idempotência MAY normalizar apenas diferenças entre CRLF/LF e newline final
