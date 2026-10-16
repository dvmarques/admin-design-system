# Processo de release

Este documento descreve o fluxo operacional de release do Admin Design System. A capability OpenSpec `release-process` define o contrato estável; este arquivo registra branches, checks, rulesets e passos humanos.

## Premissas

- `develop` é a branch de integração e default branch.
- `master` é a linha estável de releases.
- Releases usam somente SemVer estável `X.Y.Z` neste primeiro fluxo.
- Branches de release usam `release/X.Y.Z` e tags usam `vX.Y.Z`.
- A versão do produto é coordenada entre raiz, `packages/*`, `apps/*`, dependências internas e lockfile.
- O projeto fixa npm `11.19.1` em `packageManager`; use essa versão na preparação.
- A primeira release prevista no estado atual é `0.0.1`.

## CI de Pull Requests draft

Enquanto um Pull Request estiver em **Draft**, os jobs automáticos de PR ficam skipped: quality, build, E2E, `release-check` e `develop-policy`.

Ao marcar o PR como **Ready for review**, o evento `ready_for_review` dispara uma nova execução completa sobre o commit corrente. `push` para `develop` e `master` continua executando CI normalmente. Se um PR Ready voltar para Draft, não é necessário cancelar retroativamente uma execução que já começou; novos disparos enquanto Draft permanecem skipped.

Os jobs `quality`, `build` e `e2e` rodam em paralelo, sem `needs` entre eles; uma falha em um não interrompe os outros. Um novo commit em uma PR cancela a execução anterior dessa PR; execuções de `push` em `develop` e `master` não são canceladas. Os nomes dos checks exigidos pelos rulesets não mudam.

## Metadados e estratégia de merge

- Toda PR `release/X.Y.Z -> master` e o respectivo back-merge `release/X.Y.Z -> develop` devem usar o label `release` e ter como assignee a pessoa que estiver conduzindo a operação.
- PRs com o label `release` são integradas com **merge commit**; não use squash nem rebase merge para elas.
- As demais PRs com base `develop` são integradas por **squash**.
- PRs sem o label `release` e com base `develop` devem fechar a issue correspondente com uma palavra-chave de fechamento no corpo, como `Closes #123`; como `develop` é a branch padrão, a issue é fechada no merge. PRs de release (`release/X.Y.Z -> master` e o back-merge) não usam palavras-chave de fechamento.
- Para relacionar uma PR a uma issue sem fechá-la, crie o vínculo manualmente pela seção **Development** da issue.
- A exclusão automática de head branches após merge pode permanecer habilitada para as branches de trabalho comuns. A branch `release/X.Y.Z` fica protegida contra remoção por um ruleset de branch (veja [Ruleset de release](#ruleset-de-release)) e só pode ser removida depois do back-merge e da publicação concluídos.

## Preparar uma release

1. Confirme que a release anterior, quando existir, está publicada e reconciliada em `develop`.
2. Escolha `X.Y.Z`.
3. Crie `release/X.Y.Z` a partir de `develop` no próprio repositório.
4. Garanta working tree limpa e npm `11.19.1`.
5. Execute:

```bash
npm run release:prepare -- X.Y.Z
```

O comando valida SemVer, changelog e versões coordenadas antes de escrever. Ele prepara manifests/changelog em staging, regenera o lockfile em diretório temporário com npm offline e só aplica o conjunto final após sucesso. Em falha de aplicação, restaura o estado anterior.

O changelog fecha a versão com a data civil de `America/Sao_Paulo` no formato `dd-mmm-aaaa` e abre um placeholder para o próximo patch. O placeholder não obriga que a próxima release seja patch; uma futura preparação pode renomeá-lo para minor ou major preservando o conteúdo acumulado.

## PR para master

Abra PR same-repo `release/X.Y.Z -> master`, aplique o label `release` e atribua-a à pessoa que conduz a operação. Enquanto Draft, a CI de PR fica skipped. Ao tornar Ready, `release-check` valida:

- branch e versão preparada coerentes;
- origem no mesmo repositório;
- versões coordenadas e changelog fechado;
- ausência de tag/GitHub Release da própria versão antes da integração;
- bootstrap remoto ou publicação consistente da predecessora;
- delta exclusivo da release branch restrito a `CHANGELOG.md`, manifests e lockfile;
- OpenSpec estrito e multiplataforma.

Mudanças funcionais devem entrar primeiro em `develop`; a release branch não pode ser usada para introduzir funcionalidade exclusiva.

## Ruleset de master

Antes do primeiro merge de release, configure proteção de `master` com:

- Pull Request obrigatório;
- checks gerais de CI e `release-check` como required;
- required checks em modo strict/up-to-date;
- bloqueio de push direto;
- bloqueio de force push;
- bloqueio de deleção;
- bypass administrativo no menor escopo possível.

Como um required check precisa existir antes de ser selecionado, deixe `release-check` executar ao menos uma vez em uma PR Ready antes de marcá-lo como required.

## Back-merge para develop

Depois do merge em `master`, mantenha `release/X.Y.Z` e não adicione novo delta funcional. Abra PR `release/X.Y.Z -> develop`, aplique o label `release` e atribua-a à pessoa que conduz a operação.

`develop-policy` distingue PR comum de back-merge. Em PR comum, preserva versão coordenada, uma única seção `Em andamento` e blocos fechados já existentes. Em back-merge, além disso:

- permite somente `CHANGELOG.md`, `package.json`, `package-lock.json`, `packages/*/package.json` e `apps/*/package.json`;
- resolve a PR exata já integrada em `master`;
- compara o bloco fechado `X.Y.Z` com o changelog daquele commit exato;
- preserva entradas posteriores de `develop` na nova seção `Em andamento`;
- mantém workspaces atuais coordenados na versão da release.

Se `develop` avançar durante a release, a branch pode incorporar o estado atual de `develop` apenas para reconciliar o retorno, sem criar novo delta funcional.

## Ruleset de develop

Proteja `develop` com:

- Pull Request obrigatório;
- checks gerais e `develop-policy` como required;
- modo strict/up-to-date;
- bloqueio de push direto, force push e deleção;
- sem restrição para origem das feature branches;
- bypass administrativo mínimo e documentado.

A proteção deve estar ativa antes de `develop` ser tratada como fonte confiável do workflow manual de publicação.

## Ruleset de release

A exclusão automática de head branches é uma opção do repositório e não filtra por nome. Para preservar `release/X.Y.Z` até o back-merge e a publicação sem desabilitá-la para as demais branches, proteja `release/*` com um ruleset de branch:

- alvo: `release/*`;
- regra: somente **Restrict deletions**; criação e push continuam livres, então `release:prepare` e as PRs não são afetados;
- bypass administrativo no menor escopo possível.

Branch protegida contra remoção não é apagada pela exclusão automática após o merge, como já acontece com `master` e `develop`.

Na primeira release após criar o ruleset, confirme que `release/X.Y.Z` continua existindo depois do merge da PR para `master` e depois do back-merge. Se a exclusão automática a remover, desfaça a mudança: desabilite a exclusão automática de head branches no repositório e registre o resultado na change `protect-release-branches`.

## Publicar

Após o back-merge estar merged e `develop` validada, abra **Actions > Publicar release** e execute o workflow a partir de `develop`, informando `X.Y.Z`.

O workflow usa fila serial `release-publication` e separa privilégios:

1. `resolve-validate` usa apenas leitura, resolve PR/commit da release, back-merge e predecessora, verifica reachability, valida o checkout exato e o estado atual de `develop`.
2. `publish` recebe `contents: write`, re-resolve os dados independentemente com lógica do próprio workflow e não executa scripts do commit liberado.

A tag é sempre anotada `vX.Y.Z` e aponta para o `merge_commit_sha` da PR `release/X.Y.Z -> master`, mesmo se `master` já tiver avançado.

## Recuperação e idempotência

- Tag inexistente + estado válido: cria tag anotada e depois GitHub Release.
- Tag anotada no commit correto + release ausente: preserva a tag e cria somente a release.
- Tag lightweight ou tag em commit divergente: falha sem alterar nada.
- GitHub Release já existente: só retorna sucesso/no-op quando nome, tag, commit, `draft=false`, `prerelease=false` e body estiverem consistentes com o changelog; qualquer divergência falha.
- O corpo da release vem exclusivamente da seção fechada da versão no changelog do commit liberado.

Depois de back-merge e publicação concluídos, a branch `release/X.Y.Z` pode ser removida. Como o [ruleset de release](#ruleset-de-release) bloqueia a remoção, quem tem bypass administrativo a remove, ou a regra é suspensa por um momento. A próxima release só deve começar quando esse estado estiver reconciliado e publicado.

## Validação local útil

```bash
npm run test:release
npm run release:validate -- X.Y.Z
npm run release:notes -- X.Y.Z
```

A validação completa do projeto continua sendo:

```bash
npm run validate
```
