## Context

O fluxo de release precisa manter coerentes seis elementos: commit liberado em `master`, versão coordenada do monorepo, seção fechada do `CHANGELOG.md`, tag Git, GitHub Release e estado de continuidade em `develop`. O processo deve reduzir operações manuais sem transformar qualquer merge em `master` em publicação automática.

O estado atual está alinhado em `0.0.1`, existe apenas `0.0.1 - Em andamento` no changelog e ainda não há tag `v*` nem GitHub Release. Isso caracteriza o bootstrap da primeira release; `0.0.1` é contexto transitório, não requisito permanente.

## Goals / Non-Goals

**Goals:**

- Automatizar preparação, validações mecânicas, tag e GitHub Release.
- Preservar decisão humana sobre versão, merge e publicação.
- Manter raiz, workspaces privados, dependências internas, lockfile e changelog coordenados.
- Permitir major, minor ou patch escolhidos pelo mantenedor.
- Garantir preparação transacional sem estado parcial.
- Tornar `master` exclusiva para releases neste fluxo inicial.
- Garantir que releases sejam integradas/publicadas em sequência, sem empilhamento de uma nova versão sobre uma anterior ainda não publicada.
- Garantir que a tag aponte para o commit exato da PR de release e que esse commit continue pertencendo ao histórico de `master`.
- Tornar publicação recuperável sem mover ou recriar tags.
- Manter `develop` sincronizada por um caminho normativo único.
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
4. depois do merge em `master`, a mesma branch `release/X.Y.Z` deve permanecer disponível e abrir PR `release/X.Y.Z -> develop`;
5. somente após a sincronização com `develop` a branch pode ser removida;
6. a publicação é disparada manualmente.

Esse caminho evita trazer para `develop` artefatos de histórico específicos de `master` e preserva mudanças que tenham entrado em `develop` após a criação da release branch. Conflitos no PR de retorno devem ser resolvidos explicitamente, sem force update de refs.

Como `develop` é a default branch, o fluxo inicial deve garantir que o workflow `release.yml` já esteja presente nela antes do primeiro `workflow_dispatch`. Por isso, na primeira implantação, a sincronização de volta para `develop` deve ocorrer antes do disparo de publicação se o workflow ainda não existir na default branch.

### `master` exclusiva para `release/*`

O job `release-check` fará parte do workflow que atende PRs para `master`.

- head `release/*`: executar validações de release;
- qualquer outra head branch: falhar explicitamente informando que `master` aceita somente releases neste fluxo.

A proteção/ruleset de `master` deve exigir esse check junto com os checks gerais necessários.

### Bootstrap da primeira release

O preflight diferencia dois estados:

**Bootstrap:** não existe versão fechada no changelog nem tag `v*`/GitHub Release anterior. Nesse caso, o alvo pode ser igual à versão coordenada atual dos manifests, desde que corresponda à única seção `Em andamento` ou que essa seção possa ser renomeada para o mesmo alvo sem conflito.

**Fluxo normal:** existe ao menos uma versão fechada. Nesse caso:

- a versão coordenada atual dos manifests deve corresponder à última versão fechada;
- a versão alvo `X.Y.Z` deve ser estritamente superior à última versão fechada;
- a última versão fechada anterior deve já estar publicada de forma consistente antes que uma nova PR de release possa ser integrada.

Essa regra impede downgrade e também releases empilhadas não publicadas.

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

A implementação deve adicionar `packageManager` com uma versão exata de npm e configurar CI/preparação para usar essa mesma versão. Assim, a regeneração do lockfile deixa de depender da versão implícita do npm disponível na máquina.

A regeneração deve evitar atualização de dependências externas e ser validada com instalação reproduzível (`npm ci` ou equivalente adequado ao fluxo adotado).

### CI e serialização entre releases

A CI atual continua responsável por quality/build/E2E. `release-check` adiciona somente regras de release.

Para `release/* -> master`, além de versão/changelog/OpenSpec, o check deve verificar que a release fechada imediatamente anterior, quando existir, já possui:

- tag anotada válida;
- commit esperado;
- GitHub Release consistente.

Assim uma nova release pode ser preparada localmente, mas não integrada enquanto a anterior não tiver sido publicada corretamente.

### OpenSpec reprodutível

A CI deve disponibilizar uma versão fixada do OpenSpec por mecanismo multiplataforma e não depender de `openspec.cmd` nem de instalação global preexistente no runner Linux.

### Publicação manual e concorrência

`release.yml` usa `workflow_dispatch` e declara `concurrency` com um grupo único de publicação de releases, sem `cancel-in-progress`, para que duas publicações não sejam processadas simultaneamente.

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

`README.md` terá resumo e link. `docs/release-process.md` documentará bootstrap, versão, preparação transacional, política exclusiva de `master`, sequência entre releases, PR de retorno para `develop`, publicação, recuperação e configuração manual de proteção/ruleset.

## Risks / Trade-offs

- [Primeira release sem versão fechada] → regra explícita de bootstrap permite o estado coordenado atual.
- [Feature entra direto em master] → `release-check` falha para qualquer head que não seja `release/*`.
- [Release seguinte integrada antes da anterior ser publicada] → `release-check` valida publicação consistente da última versão fechada anterior.
- [Publicações simultâneas] → `concurrency` serializa `release.yml`.
- [npm diferente altera lockfile] → `packageManager` fixa versão exata usada também pela CI.
- [Workflow manual não aparece na primeira implantação] → sincronizar `release/X.Y.Z -> develop` antes do primeiro disparo quando necessário.
- [Commit da PR deixa histórico de master] → validar reachability antes de tag/release.
- [Release existente com metadata incorreta] → validar tag, nome, draft, prerelease e body antes do no-op.
- [Develop diverge durante a release] → retorno sempre via PR da própria release branch e resolução explícita de conflitos.
