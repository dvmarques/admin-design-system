# Processo de release

Este documento descreve o fluxo operacional de release do Admin Design System. A capability OpenSpec `release-process` define o contrato estável; este arquivo registra branches, checks, rulesets e passos humanos.

## Premissas

- `develop` é a branch de integração e default branch.
- `master` é a linha estável de releases.
- Releases usam somente SemVer estável `X.Y.Z`.
- Branches de release usam `release/X.Y.Z` e tags usam `vX.Y.Z`.
- A versão do produto é coordenada entre raiz, `packages/*`, `apps/*`, dependências internas e lockfile.
- O projeto fixa npm `11.19.1` em `packageManager`; use essa versão na preparação.

## CI de Pull Requests draft

Enquanto um Pull Request estiver em **Draft**, os jobs automáticos de PR ficam skipped: quality, build, E2E, `release-check` e `develop-policy`.

Ao marcar o PR como **Ready for review**, o evento `ready_for_review` dispara uma nova execução completa sobre o commit corrente. `push` para `develop` e `master` continua executando CI normalmente. O workflow independente `pages.yml` executa build estático e E2E Pages nas PRs Ready para `develop` sem publicar; o push para `develop` publica no Pages. Um check concluído com etapas dispensadas por `docs_only` não prova execução de build, E2E ou snapshots. Consulte a matriz normativa em `docs/ci-impact-validation.md`. Se um PR Ready voltar para Draft, não é necessário cancelar retroativamente uma execução que já começou; novos disparos enquanto Draft permanecem skipped.

Os jobs `quality`, `build` e `e2e` rodam em paralelo, sem `needs` entre eles; uma falha em um não interrompe os outros. Um novo commit em uma PR cancela a execução anterior dessa PR; execuções de `push` em `develop` e `master` não são canceladas. Os nomes dos checks exigidos pelos rulesets não mudam.

Em PRs para `develop` cujos arquivos alterados são todos documentação (`openspec/**`, `CHANGELOG.md`, `AGENTS.md`, `CLAUDE.md`, `README.md` e `docs/*.md`), os jobs `build` e `e2e` concluem com sucesso sem instalar dependências, construir nem testar; `quality` e a política de `develop` rodam sempre por completo. PRs que só alteram arquivos de workspaces também dispensam as etapas que o impacto comprovadamente não alcança (build do Storybook ou do demo e E2E quando o demo não é afetado); `build` sempre constrói e inspeciona os pacotes. A decisão é de `scripts/ci-scope.mjs`, com o classificador conservador de `scripts/ci-impact.mjs` (`docs/ci-impact-validation.md`): `docs/integration.md`, `docs/bundle-baseline.*`, `packages/tokens/README.md`, `.github/**`, scripts, `e2e/`, lockfile e configurações globais, qualquer arquivo fora da lista, um diff indeterminado, execuções de `push` e PRs para `master` forçam o fluxo completo.

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
4. Execute uma prévia **sem escrita** das alterações que entrarão nesta versão:

   ```bash
   npm run release:changelog -- X.Y.Z
   ```

5. **Revisão editorial humana obrigatória:** revise a seção `Em andamento` de `CHANGELOG.md`, agrupe entradas do mesmo assunto (incluindo issues repetidas), torne cada item curto e direto (até **300 caracteres**), mantenha links/referências às issues e sinalize de forma explícita breaking changes, migrações e riscos relevantes. Distribua por `Added`, `Changed`, `Fixed`, `Security` e `Removed` conforme aplicável. O comando sugere grupos usando heurísticas e aponta duplicidades/itens longos; **não altera o changelog nem decide equivalências semânticas**. Não reescreva versões fechadas.
6. Após conferir o diff e as fontes, confirme explicitamente a aprovação **na branch de release**:

   ```bash
   npm run release:changelog -- X.Y.Z --approve
   npm run release:changelog -- X.Y.Z --check
   ```

   O `--approve` insere um comentário Markdown invisível com hash SHA-256 do **texto exato** da seção revisada; essa marca fica no commit, mas não entra nas GitHub Release Notes. O `--check` confirma a integridade; qualquer edição posterior invalida a aprovação e exige nova revisão e `--approve`. Duplicidade da mesma issue principal, entradas excessivamente longas, falta de entradas ou de aprovação impedem o fechamento. A revisão humana é responsável por não omitir mudanças.

7. Faça **commit do `CHANGELOG.md` aprovado**, deixe working tree limpa e use npm `11.19.1`.
8. Execute:

   ```bash
   npm run release:prepare -- X.Y.Z
   ```

O comando exige também a aprovação editorial válida do changelog antes de escrever. Ele valida SemVer, changelog e versões coordenadas antes de escrever. Ele prepara manifests/changelog em staging, regenera o lockfile em diretório temporário com npm offline e só aplica o conjunto final após sucesso. Em falha de aplicação, restaura o estado anterior.

O changelog fecha a versão com a data civil de `America/Sao_Paulo` no formato `dd-mmm-aaaa` e abre um placeholder para o próximo patch. O placeholder não obriga que a próxima release seja patch; uma futura preparação pode renomeá-lo para minor ou major preservando o conteúdo acumulado.

## PR para master

Abra PR same-repo `release/X.Y.Z -> master`, aplique o label `release` e atribua-a à pessoa que conduz a operação. Enquanto Draft, a CI de PR fica skipped. Ao tornar Ready, `release-check` valida:

- branch e versão preparada coerentes;
- origem no mesmo repositório;
- versões coordenadas e changelog fechado;
- confirmação editorial com hash válido no changelog fechado (não aceita textos alterados após a aprovação);
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

O comportamento foi verificado em 2026-10-16 com a exclusão automática de head branches habilitada: duas PRs descartáveis foram integradas na mesma base temporária; a branch `release/teste` (alvo do ruleset) sobreviveu ao merge (#77) e a branch comum `test/controle` foi apagada (#78). O teste usou uma base temporária, não o fluxo real de `master` e `develop`. Se em alguma release a exclusão automática remover `release/X.Y.Z` mesmo assim, desfaça a mudança: desabilite a exclusão automática de head branches no repositório e registre o resultado na change `protect-release-branches`.

## Publicação de quatro pacotes npm e GitHub Release (#195)

**Somente após autorização humana da release** e integração de `release/X.Y.Z -> master` por merge commit, seguida do back-merge `release/X.Y.Z -> develop` aprovado e validado, abra **Actions > Publicar release** a partir de `develop` e informe a versão estável `X.Y.Z`. Não dispara em push ou PR. A fila `release-publication` serializa execuções, sem cancelar uma publicação parcialmente concluída.

O identificador da publicação é **sempre a versão coordenada do commit de merge da release em master**, não o HEAD mais recente de master, nem a evolução posterior de develop. Exemplo: `release/0.1.1` aprovada publica exclusivamente `@dvmarques/admin-ds-*@0.1.1`, tag `v0.1.1` e GitHub Release `v0.1.1`. Essa versão é ilustrativa; a primeira ainda será escolhida pelo mantenedor.

O workflow separa cinco jobs:

1. `resolve-validate` (leitura): identifica os dois merges exatos, compara changelog e versões, verifica predecessora, regras de reachability e integridade do estado remoto. Preserva a lógica atual de release.
2. `prepare-npm` (leitura): checkout do commit **aprovado em master**, Node 24, npm 11.19.1, smoke externo `npm run verify:distribution` de Next.js com os quatro tarballs, tipos, CSS e hidratação; mantém esses **mesmos arquivos** no artifact do workflow e registra nomes/versões e hashes SHA-512/SHA-256 em `publication-plan.json`.
3. `publish-npm` (OIDC, sem `contents: write`): verifica hash e identidade de cada artifact, consulta o registry, usa `npm publish <tarball> --access public --provenance` apenas quando a versão não existe, espera confirmação de cada pacote e verifica os quatro novamente. Ordem: **tokens → components → highlighted-code → admin**. Versão existente com `dist.integrity` diferente é erro fatal; não sobrescrever ou apagar. `components` precisa estar confirmado antes de `admin`.
4. `verify-registry` (somente leitura): instala os quatro pacotes **por nome e versão diretamente do npm**, executa `npm audit signatures` e repete o smoke Next.js externo de tipos, CSS e hidratação; falhas bloqueiam a tag.
5. `publish-github` (`contents: write`, sem OIDC): só após sucesso do npm **e do smoke no registry**, revalida estado remoto com lógica confiável, cria/recupera tag anotada `vX.Y.Z` no merge commit **exato** da PR para master, e GitHub Release com notas do changelog fechado. Nunca move tag, altera release divergente ou executa código arbitrário do commit com token de escrita.

`apps/*` e raiz nunca são publicados; somente os quatro pacotes com `private: false` e `publishConfig.access: public`. `highlighted-code` continua opcional e independente, sem contaminar o bundle principal com Shiki. Para a publicação npm são usados `npm@11.19.1` e Node 24 (OIDC suportado), `id-token: write` apenas no job npm e nenhuma credencial npm de longa duração.

### Configuração inicial do Trusted Publisher no npm

O mantenedor deve acessar o npm sob a conta **dvmarques** e conferir o controle dos quatro pacotes. A configuração é individual para cada pacote:

- Provider: **GitHub Actions**.
- Owner/user: `dvmarques`; repository: `admin-design-system`.
- Workflow file: **`release.yml`** (somente filename, sem diretório).
- Environment: deixar vazio enquanto o job não usa GitHub Environment nomeado.
- Allowed actions: habilitar explicitamente **`npm publish`** (não apenas `npm stage publish`); publicação direta foi aprovada.
- Executar no GitHub-hosted runner, não self-hosted. Confirmar `repository.url` dos quatro manifests, conta do registry e ausência de credenciais no workflow.

**Bootstrap da primeira publicação:** se os quatro nomes ainda não existem no npm e não for possível cadastrar Trusted Publishers antes de criá-los, o mantenedor deve primeiro publicar manualmente **os mesmos tarballs aprovados e inspecionados**, após a release ter sido integrada e autorizada, com autenticação pessoal/2FA fora do GitHub Actions. Não publicar versões provisórias nem fazer bootstrap a partir de novos builds: a imutabilidade de nome/versão exigirá identidade SHA-512 exata. Depois, cadastrar e confirmar Trusted Publisher de cada pacote, restringir tokens permanentes no painel npm e executar o workflow para verificar/no-op e criar tag/GitHub Release. Antes de executar o workflow de lançamento pela primeira vez, documentar a decisão de bootstrap aplicável e o mecanismo seguro de acesso aos tarballs daquele **commit exato**. **Nenhum bootstrap é executado na implementação da issue.** A configuração recém-criada deve ter primeiro publish via OIDC em até 48h, conforme a política atual do npm; portanto, planejar a configuração junto à release seguinte se o bootstrap inicial não contar como primeiro uso OIDC.

Documentação oficial: [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/), [npm trust github](https://docs.npmjs.com/cli/v11/commands/npm-trust/) e [provenance](https://docs.npmjs.com/generating-provenance-statements/). Não escrever senhas, códigos 2FA, tokens ou arquivos .npmrc autenticados no Git, CI ou issues.

### Recuperação e idempotência

- **Pacote não existe:** publica o tarball aprovado e confirma no registry `name`, `version` e `dist.integrity`.
- **Pacote/versão existe com hash idêntico:** no-op; o workflow segue para o próximo pacote ausente.
- **Versão existente com hash diferente, pacote privado, artifact adulterado ou OIDC incompatível:** falha, sem tentar sobrescrever. A leitura prévia de **todos** os quatro pacotes busca bloquear divergências antes de publicar qualquer um.
- **Falha após alguns pacotes:** reexecute a mesma release; o script preserva versões confirmadas e retoma apenas as ausentes. Uma falha parcial não é sucesso.
- **Publicação npm completa, mas tag/GitHub Release ausentes:** reexecução valida npm e recupera somente os artefatos GitHub faltantes.
- **Tag ausente e estado válido:** cria tag anotada e GitHub Release. Tag correta + release ausente: preserva tag e cria só a release. Tag lightweight/divergente ou GitHub Release incompatível: falha sem mutações.
- **Indisponibilidade/propagação do registry:** há releituras limitadas; se não confirmar os hashes, falha e exige reconciliação/reexecução, nunca assume sucesso pelo exit code do `npm publish`.

Após publicar, validar `npm view @dvmarques/admin-ds-tokens@X.Y.Z dist.integrity` e os demais, verificar os dados de provenance e executar instalação externa **por nomes do registry** em Next.js (tipos, CSS, React Server/Client e hidratação), já automatizada no job `verify-registry`. A execução de `verify:distribution` com tarballs locais **não substitui** esse último teste. Somente depois de confirmar as quatro versões reais, remover os avisos `RELEASE TODO (#195)` e “antes da primeira publicação” no README/READMEs e `docs/integration.md` em uma PR apropriada; manter Demo/Storybook em workspaces locais sem exigir publicações npm a cada alteração.

Depois de back-merge, npm completo, tag e GitHub Release consistentes e validação externa, a branch `release/X.Y.Z` pode ser removida pelo mantenedor, respeitando o ruleset.

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

## Site demonstrativo

O demo e o Storybook são publicados no GitHub Pages por um workflow próprio, sem relação com as releases e sem publicação no npm. Veja `docs/github-pages.md`.
