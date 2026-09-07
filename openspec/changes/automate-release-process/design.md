## Context

O fluxo de release precisa manter coerentes seis elementos: commit liberado em `master`, versão coordenada do monorepo, seção fechada do `CHANGELOG.md`, tag Git, GitHub Release e estado de continuidade em `develop`. O processo deve reduzir operações manuais sem transformar qualquer alteração em `master` em publicação automática.

O estado atual está alinhado em `0.0.1`, existe apenas `0.0.1 - Em andamento` no changelog e ainda não há tag `v*` nem GitHub Release. Isso caracteriza o bootstrap da primeira release; `0.0.1` é contexto transitório, não requisito permanente.

## Goals / Non-Goals

**Goals:**

- Automatizar preparação, validações mecânicas, tag e GitHub Release.
- Preservar decisão humana sobre versão, merge e publicação.
- Manter raiz, workspaces privados, dependências internas, lockfile e changelog coordenados.
- Permitir major, minor ou patch escolhidos pelo mantenedor.
- Garantir preparação transacional sem estado parcial.
- Tornar `master` exclusiva para releases e protegida contra integração fora do fluxo.
- Garantir que releases sejam integradas/publicadas em sequência, sem empilhamento sobre versão anterior ainda não publicada.
- Garantir que a tag aponte para o commit exato da PR de release e que esse commit continue pertencendo ao histórico de `master`.
- Tornar publicação recuperável sem mover ou recriar tags.
- Manter `develop` sincronizada por um caminho normativo único e sem incorporar à release mudanças que entraram em `develop` depois do corte.
- Reutilizar CI existente e executar OpenSpec de forma reproduzível e multiplataforma.

**Non-Goals:**

- Publicar automaticamente em todo push para `master`.
- Inferir automaticamente major/minor/patch.
- Permitir feature branches diretamente em `master`.
- Suportar `hotfix/*` neste primeiro desenho; se necessário, será definido explicitamente depois.
- Versionar/publicar cada workspace de forma independente.

## Decisions

### Ciclo normativo de branches

O ciclo será:

1. `release/X.Y.Z` nasce de `develop`;
2. a preparação ocorre nessa branch;
3. PR `release/X.Y.Z -> master` integra a release;
4. após o merge, a branch de release fica congelada para novas mudanças funcionais;
5. a mesma branch abre PR `release/X.Y.Z -> develop`;
6. o retorno deve representar o estado de preparação já integrado em `master`; somente ajustes estritamente necessários para reconciliar mudanças posteriores de `develop` podem ser adicionados;
7. depois da sincronização com `develop`, a publicação é disparada manualmente;
8. a branch `release/X.Y.Z` só pode ser removida depois que sincronização com `develop` e publicação da GitHub Release tiverem sido concluídas com sucesso.

Esse caminho evita trazer para `develop` artefatos de histórico específicos de `master` e preserva mudanças que tenham entrado em `develop` após a criação da release branch.

Como a release branch nasceu de `develop` e a preparação altera somente arquivos de versionamento/release, o PR de retorno deve ter escopo restrito a `CHANGELOG.md`, `package.json`, `package-lock.json`, `packages/*/package.json` e `apps/*/package.json`. Alteração fora desse conjunto indica nova mudança não liberada e deve bloquear o back-merge.

O back-merge deve preservar duas invariantes semânticas:

- o bloco fechado `X.Y.Z` do `CHANGELOG.md` deve permanecer exatamente igual ao bloco liberado em `master`; entradas adicionadas em `develop` depois do corte da release devem permanecer/migrar para a nova seção `Em andamento`, nunca para a versão já fechada;
- depois do back-merge, todos os manifests existentes em `develop`, inclusive workspaces criados depois do corte da release, devem declarar a versão coordenada `X.Y.Z` e usar referências internas coerentes, preservando outras mudanças de dependências/metadados que pertencem ao desenvolvimento futuro.

O PR de retorno só pode ser considerado concluído depois de validar novamente a coordenação de versões e a imutabilidade do bloco fechado da release.

Como `develop` é a default branch, o fluxo deve garantir que `release.yml` esteja presente nela antes do `workflow_dispatch`. Na primeira implantação isso torna o back-merge obrigatório antes da primeira publicação.

### `master` exclusiva e protegida

`master` representa a linha estável de releases e deve aceitar somente PRs cuja head seja `release/*` neste fluxo inicial.

O job `release-check` aplica essa política somente em eventos `pull_request` destinados a `master`:

- head `release/*`: executar validações de release;
- qualquer outra head branch: falhar explicitamente informando que `master` aceita somente releases.

Em eventos `push` pós-merge, o job não deve aplicar a regra baseada em `github.head_ref`; os checks gerais podem continuar executando normalmente.

Além do check de CI, `master` deve ser protegida por branch protection/ruleset que, no mínimo:

- exija pull request antes de merge;
- exija os status checks necessários;
- bloqueie force push;
- bloqueie deleção da branch;
- não permita push direto fora do fluxo;
- mantenha bypass administrativo no menor escopo possível e documentado.

### Bootstrap e definição das versões fechadas

O parser do changelog deve tratar como versões fechadas somente seções com SemVer explícita e data, excluindo a seção `Em andamento`.

A **última versão fechada** é a maior SemVer entre todas as seções fechadas. O changelog deve manter versões fechadas únicas e ordenadas de forma SemVer decrescente; duplicidade ou ordem inválida causa falha de validação.

Para uma release alvo `X.Y.Z`, a **release anterior** é definida como a maior SemVer fechada estritamente menor que `X.Y.Z`. Essa é a versão cuja publicação deve ser validada antes da integração de uma nova release. A própria `X.Y.Z`, já fechada na branch de preparação, nunca deve ser confundida com sua predecessora.

O preflight diferencia dois estados:

**Bootstrap:** não existe versão fechada no changelog nem tag `v*`/GitHub Release anterior. Nesse caso:

- os manifests coordenados devem declarar uma única versão atual;
- o alvo `X.Y.Z` deve ser SemVer maior ou igual à versão coordenada atual;
- downgrade é proibido;
- a única seção `Em andamento` pode ser renomeada para o alvo escolhido quando necessário.

**Fluxo normal:** existe ao menos uma versão fechada. Nesse caso:

- a versão coordenada atual dos manifests deve corresponder à última versão fechada antes da preparação;
- a versão alvo `X.Y.Z` deve ser estritamente superior à última versão fechada antes da preparação;
- a release anterior a `X.Y.Z` deve já estar publicada de forma consistente antes que a nova PR possa ser integrada em `master`.

### Escolha de versão independente do placeholder

Depois de cada release, o changelog abre automaticamente a próxima patch apenas como placeholder. A próxima versão real pode ser patch, minor ou major. A única seção `Em andamento` é renomeada para a versão escolhida, preservando seu conteúdo, desde que não exista conflito e as regras de bootstrap/ordenação sejam atendidas.

### Preparação transacional

`release:prepare` terá três fases:

1. **preflight:** somente leitura;
2. **staging:** produzir todos os novos conteúdos em memória ou diretório temporário, incluindo lockfile;
3. **aplicação final:** substituir arquivos reais apenas depois que toda a staging estiver pronta.

Se staging falhar, nenhum arquivo real é alterado. Se a aplicação final falhar, o script deve restaurar integralmente o estado anterior ou usar substituição atômica equivalente.

### Versionamento coordenado e npm reproduzível

`package.json` raiz, todos os manifests `packages/*`/`apps/*`, referências internas e lockfile representam uma única versão do produto.

A implementação deve adicionar `packageManager` com uma versão exata de npm e configurar CI/preparação para usar essa mesma versão. A regeneração deve evitar atualização de dependências externas e ser validada com instalação reproduzível (`npm ci` ou equivalente adequado ao fluxo adotado).

### CI e serialização entre releases

A CI atual continua responsável por quality/build/E2E. `release-check` adiciona somente regras de release.

Para `release/* -> master`, além de versão/changelog/OpenSpec, o check deve determinar a release anterior como a maior SemVer fechada menor que o alvo e, quando ela existir, verificar:

- tag anotada válida;
- commit esperado;
- GitHub Release consistente.

Assim uma nova release pode ser preparada localmente, mas não integrada enquanto a predecessora não tiver sido publicada corretamente.

### OpenSpec reprodutível

A CI deve disponibilizar uma versão fixada do OpenSpec por mecanismo multiplataforma e não depender de `openspec.cmd` nem de instalação global preexistente no runner Linux.

### Publicação manual e fila de concorrência

`release.yml` usa `workflow_dispatch` e declara um único grupo de `concurrency` para publicação de releases com `queue: max`. Não deve usar `cancel-in-progress: true`, para que uma publicação em andamento nunca seja substituída por outra.

Permissões mínimas explícitas:

- `contents: write`;
- `pull-requests: read`.

### Resolver e validar o commit exato

O workflow localiza de forma inequívoca a PR merged `release/X.Y.Z -> master` e usa seu `merge_commit_sha`.

Antes de qualquer escrita remota:

- validar que o SHA continua alcançável a partir do `master` atual;
- fazer checkout explícito desse SHA;
- validar nesse checkout versão coordenada, changelog e release notes;
- nunca validar o checkout implícito do `workflow_dispatch` como substituto do commit liberado.

Se o SHA não pertencer mais ao histórico de `master`, a publicação falha.

### Tags anotadas e recuperação

A tag de release é sempre anotada `vX.Y.Z`.

- inexistente: criar no `merge_commit_sha` validado;
- anotada existente: dereferenciar até commit e reutilizar somente se for exatamente o esperado;
- lightweight: falhar;
- anotada em outro commit: falhar.

Nunca mover, sobrescrever ou recriar tag existente.

### GitHub Release existente

Antes de considerar uma release existente como sucesso/no-op, validar:

- `tag_name == vX.Y.Z`;
- nome/caption da release igual a `vX.Y.Z`;
- `draft == false`;
- `prerelease == false`;
- tag anotada dereferenciando para o commit esperado;
- body equivalente às notas extraídas.

A equivalência do body normaliza apenas `CRLF`/`LF` e newline final. Qualquer outra diferença de conteúdo é divergência e causa falha sem alteração.

Se a tag estiver correta e a GitHub Release não existir, criar somente a release.

### Documentação

`README.md` terá resumo e link. `docs/release-process.md` documentará bootstrap, definição da última versão fechada e predecessora, versão, preparação transacional, política/proteção exclusiva de `master`, comportamento distinto entre `pull_request` e `push`, sequência entre releases, congelamento/escopo e semântica do PR de retorno para `develop`, retenção da branch até publicação, publicação, recuperação e configuração manual de proteção/ruleset.

## Risks / Trade-offs

- [Primeira release sem versão fechada] → bootstrap permite alvo maior ou igual ao estado coordenado atual e bloqueia downgrade.
- [Changelog fora de ordem ou duplicado] → parser valida unicidade e ordenação SemVer decrescente e calcula a maior versão fechada.
- [Release atual confundida com a anterior] → predecessora é definida como a maior SemVer fechada estritamente menor que o alvo.
- [Feature ou push direto entra em master] → `release-check` bloqueia PR não-release e ruleset bloqueia push direto/force push/deleção.
- [release-check falha no push pós-merge por falta de head_ref] → política de origem é aplicada somente a `pull_request` para `master`.
- [Release seguinte integrada antes da anterior ser publicada] → `release-check` valida publicação consistente da predecessora.
- [Publicações simultâneas ou pendentes substituídas] → `concurrency` usa grupo único com `queue: max` e sem cancelamento da execução em andamento.
- [npm diferente altera lockfile] → `packageManager` fixa versão exata usada também pela CI.
- [Workflow manual não aparece na primeira implantação] → sincronizar `release/X.Y.Z -> develop` antes do primeiro disparo.
- [Mudanças novas de develop entram na versão já fechada] → manter o bloco `X.Y.Z` idêntico ao de `master` e direcionar conteúdo pós-corte para a nova seção `Em andamento`.
- [Workspace criado após o corte fica em versão antiga] → validar todos os manifests existentes em `develop` após o back-merge e coordená-los em `X.Y.Z` sem perder metadados futuros.
- [Release branch recebe mudança nova depois de master] → congelar mudanças funcionais e limitar o PR de retorno aos arquivos de preparação/conflito permitidos.
- [Branch removida antes de o workflow localizar a release] → manter `release/X.Y.Z` até back-merge e publicação concluírem.
- [Commit da PR deixa histórico de master] → validar reachability antes de tag/release.
- [Release existente com metadata incorreta] → validar tag, nome, draft, prerelease e body antes do no-op.
