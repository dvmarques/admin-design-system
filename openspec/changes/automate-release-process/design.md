## Context

O fluxo de release precisa garantir que seis elementos permaneçam coerentes: commit liberado em `master`, versões coordenadas do monorepo, seção fechada do `CHANGELOG.md`, tag Git, GitHub Release e o estado de continuidade em `develop`. O processo deve reduzir operações manuais sem transformar qualquer merge em `master` em uma publicação automática.

O estado atual está alinhado em `0.0.1` no manifesto raiz, workspaces e lockfile, com `0.0.1 - Em andamento` no changelog. Essa é a primeira release esperada pelo fluxo inicial, mas esse valor é contexto transitório e não um requisito permanente da capability.

## Goals / Non-Goals

**Goals:**

- Automatizar preparação, validações mecânicas, tag e GitHub Release.
- Preservar decisão humana sobre versão, merge e publicação.
- Manter raiz, workspaces privados, dependências internas, lockfile e changelog coordenados na mesma versão.
- Permitir major, minor ou patch escolhidos pelo mantenedor, sem obrigar a próxima release a coincidir com o placeholder patch aberto no changelog.
- Garantir que falhas durante a preparação não deixem arquivos parcialmente modificados pelo processo.
- Garantir que a tag aponte para o commit exato produzido pela PR da release, e não simplesmente para o HEAD corrente de `master`.
- Tornar a publicação recuperável sem nunca mover, sobrescrever ou recriar uma tag existente.
- Validar estado já publicado antes de tratá-lo como sucesso idempotente.
- Manter `develop` sincronizada com o estado pós-release para preparar corretamente a release seguinte.
- Reutilizar a CI existente e adicionar somente validações específicas de release.
- Executar OpenSpec na CI de forma reprodutível e multiplataforma.
- Documentar o fluxo de forma curta no README e completa em documento dedicado.

**Non-Goals:**

- Publicar automaticamente em todo push para `master`.
- Inferir automaticamente se uma mudança é major, minor ou patch.
- Versionar ou publicar cada workspace de forma independente.
- Alterar a estratégia geral de branching do projeto além do ciclo de release `develop -> release/X.Y.Z -> master` com sincronização de volta para `develop`.

## Decisions

### Separar preparação de publicação

A preparação ocorrerá localmente na branch `release/X.Y.Z` criada a partir de `develop`, por meio de `npm run release:prepare -- X.Y.Z`. A publicação acontecerá somente depois do merge em `master`, via `workflow_dispatch`.

Essa separação permite revisar no PR todas as alterações de versão e changelog antes de criar qualquer tag imutável.

### Manter ações humanas explícitas

O mantenedor será responsável por:

1. escolher `X.Y.Z`;
2. criar `release/X.Y.Z` a partir de `develop`;
3. executar o comando de preparação;
4. revisar e abrir PR para `master`;
5. fazer o merge após os checks obrigatórios ficarem verdes;
6. sincronizar as mudanças da release de volta para `develop` por merge/PR ou fluxo automatizado equivalente;
7. disparar manualmente `Publicar release` informando `X.Y.Z`.

A sincronização de `develop` pode ser automatizada futuramente, mas o processo documentado MUST garantir que ela aconteça antes da próxima preparação de release.

### Versionamento coordenado do monorepo

A versão do produto é coordenada entre o `package.json` raiz e todos os manifests em `packages/*` e `apps/*`. O comando de preparação atualizará todos para `X.Y.Z`, ajustará também referências internas versionadas entre workspaces e regenerará o `package-lock.json` sem atualizar dependências externas.

A validação de release falhará se qualquer manifesto ou dependência interna permanecer em uma versão diferente da release preparada.

### Versão escolhida é independente do placeholder

Após uma release, o changelog abre automaticamente `X.Y.(Z+1) - Em andamento` apenas como placeholder de trabalho. Na preparação seguinte, o mantenedor pode escolher qualquer SemVer válida superior à última versão fechada, incluindo major ou minor.

Se a única seção `Em andamento` estiver em uma versão placeholder diferente da escolhida, `release:prepare` a renomeará para `X.Y.Z` antes de fechá-la. O processo falhará se houver mais de uma seção em andamento, se a versão escolhida não for superior à última release fechada ou se houver outra seção conflitante com `X.Y.Z`.

### Preparação transacional

`release:prepare` terá três fases lógicas:

1. **preflight:** somente leitura, validação de branch, working tree, SemVer, changelog e versões atuais;
2. **staging:** calcular e produzir todos os novos conteúdos em memória ou diretório temporário, incluindo a regeneração controlada do lockfile;
3. **commit local das alterações de arquivo:** substituir os arquivos reais somente depois que toda a staging tiver sido concluída com sucesso.

Se qualquer etapa de staging falhar, o script não deve modificar os arquivos de trabalho. Se a aplicação final falhar após ter começado, o script deve restaurar os arquivos afetados ao estado anterior ou usar uma estratégia de substituição atômica que evite estado parcial.

### Fechar e reabrir o changelog automaticamente

A única seção `Em andamento` será associada à versão escolhida, fechada com a data corrente em `dd-mmm-aaaa` em português e preservará seu conteúdo. Acima dela será aberta a próxima versão patch da release recém-preparada como novo placeholder `Em andamento`.

### Extrair release notes por script dedicado

`scripts/extract-release-notes.mjs` receberá uma versão e devolverá somente o corpo daquela seção fechada. O workflow reutilizará esse resultado para criar e validar a GitHub Release.

### Reutilizar a CI existente sem criar required check pendente

A CI atual já executa qualidade, build e E2E em jobs próprios. A implementação não duplicará esse pipeline chamando `npm run validate` novamente dentro de um job de release.

Um job/check `release-check` fará parte do workflow que atende PRs para `master`. Quando `github.head_ref` começar por `release/`, ele executará as validações específicas de release. Para outras PRs destinadas a `master`, o job continuará presente e terminará com sucesso sem executar a validação específica. Assim o mesmo check pode ser configurado como obrigatório sem permanecer pendente por filtros de workflow.

O `release-check` validará:

- versões coordenadas do monorepo;
- changelog fechado corretamente;
- estrutura e consistência da preparação;
- OpenSpec em modo estrito.

A proteção/ruleset de `master` deve exigir os checks necessários para impedir merge de uma preparação inválida.

### OpenSpec reprodutível na CI

Como a CI roda em Linux, o workflow não dependerá de `openspec.cmd` nem de instalação global presente na máquina do desenvolvedor. A implementação deverá fixar uma forma reproduzível de disponibilizar a versão esperada do OpenSpec na CI e executar o CLI multiplataforma correspondente.

### Resolver o commit exato da PR pelo merge_commit_sha

O workflow `Publicar release` localizará de forma inequívoca a PR merged cuja head branch seja `release/X.Y.Z` e cuja base seja `master`. O commit liberado será o `merge_commit_sha` retornado pela PR merged, que representa o commit efetivamente integrado independentemente de o merge ter sido feito por merge commit, squash ou rebase.

O workflow não assumirá que o HEAD atual de `master` ainda é esse commit. O commit resolvido será validado quanto à versão coordenada, changelog e release notes.

### Permissões mínimas explícitas

O workflow de publicação declarará explicitamente as permissões necessárias, no mínimo:

- `contents: write`, para criar tag e GitHub Release;
- `pull-requests: read`, para localizar e inspecionar a PR merged.

Outras permissões permanecerão desabilitadas salvo necessidade comprovada durante a implementação.

### Tags anotadas, imutáveis e corretamente dereferenciadas

A tag de release deve ser uma tag anotada `vX.Y.Z`. Ao avaliar uma tag já existente, o workflow deve distinguir o objeto tag do commit alvo e dereferenciar a tag até o commit (`^{commit}` ou mecanismo equivalente).

Comportamento:

- tag inexistente: criar tag anotada no `merge_commit_sha` validado;
- tag anotada existente e commit dereferenciado igual ao commit validado: pode ser reutilizada;
- tag lightweight existente, mesmo no commit esperado: tratar como inconsistência e falhar;
- tag anotada existente em outro commit: falhar sem alteração.

Nenhum caminho permitido move, sobrescreve ou recria uma tag existente.

### GitHub Release existente só é idempotente se estiver consistente

Antes de tratar uma GitHub Release existente como publicação já concluída, o workflow validará:

- tag da release exatamente `vX.Y.Z`;
- tag anotada resolvendo para o commit esperado;
- release notes equivalentes ao bloco extraído do `CHANGELOG.md` daquele commit.

Se tudo estiver consistente, a execução termina como sucesso/no-op explícito. Se houver qualquer divergência, falha sem modificar a release ou a tag.

Se a tag existir corretamente e a GitHub Release não existir, o workflow cria somente a release, permitindo recuperação da falha parcial anterior.

### Sincronizar de volta para develop

Depois que a PR `release/X.Y.Z -> master` for integrada, as alterações de preparação da release devem ser levadas de volta para `develop`. Isso inclui versão coordenada, seção fechada e novo placeholder `Em andamento`.

A sincronização deve preservar mudanças que possam ter entrado em `develop` depois da criação da branch de release. Por isso, o caminho recomendado é um PR/merge de `master` ou da própria branch de release para `develop`, resolvendo conflitos explicitamente quando existirem, em vez de mover refs à força.

A próxima branch `release/*` não deve ser criada enquanto `develop` não contiver o estado pós-release anterior.

### README como porta de entrada, documento dedicado como referência

O `README.md` terá apenas o fluxo resumido e link para `docs/release-process.md`. O documento dedicado conterá passo a passo, responsabilidades humano/automação, pré-condições, checks obrigatórios, sincronização com `develop` e recuperação de falhas.

## Risks / Trade-offs

- [Operador informa versão errada] → validar SemVer, última versão fechada, branch, manifests e changelog antes de qualquer escrita.
- [Placeholder patch não corresponde à próxima versão real] → permitir renomear a única seção em andamento para a SemVer escolhida pelo mantenedor.
- [Falha após iniciar staging ou aplicação] → produzir tudo antes da substituição final e restaurar estado anterior se uma substituição falhar.
- [Master avança depois do merge da release] → tag usa o `merge_commit_sha` da PR, não o HEAD atual.
- [Tag criada e criação da GitHub Release falha] → reexecução reutiliza somente tag anotada que dereferencia para o mesmo commit validado.
- [Tag lightweight ou tag em commit diferente] → falhar sem modificar o repositório.
- [Release existente divergente] → falhar em vez de considerar a execução idempotente.
- [Develop fica para trás após release] → exigir sincronização de volta antes da próxima preparação.
- [Required check fica pendente em PR comum] → manter o job `release-check` presente para toda PR a `master`, com no-op de sucesso fora de `release/*`.
- [CI duplicada e lenta] → reutilizar jobs existentes e adicionar apenas check específico de release.
- [OpenSpec depende de ambiente local] → fixar instalação/execução multiplataforma e reprodutível no workflow.
