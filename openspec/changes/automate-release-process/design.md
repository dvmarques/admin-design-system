## Context

O fluxo de release precisa manter coerentes cinco artefatos observáveis: versão coordenada do monorepo, seção fechada do `CHANGELOG.md`, commit efetivamente liberado, tag Git e GitHub Release. Operacionalmente, `develop` também precisa permanecer pronta para a próxima release.

O estado atual está alinhado em `0.0.1`, existe apenas `0.0.1 - Em andamento` no changelog e ainda não há tag no padrão `vX.Y.Z` nem GitHub Release correspondente. Isso caracteriza o bootstrap da primeira release; `0.0.1` é contexto transitório, não requisito permanente.

A governança atual distingue contratos estáveis de instruções operacionais. A delta spec `release-process` descreve somente comportamentos observáveis da automação. Este design e as fontes operacionais registram como o repositório implementa esse contrato.

## Goals / Non-Goals

**Goals:**

- Automatizar preparação, validações mecânicas, resolução do commit, tag e GitHub Release.
- Preservar decisão humana sobre versão, integração e disparo da publicação.
- Manter manifests, referências internas, lockfile e changelog coordenados.
- Permitir releases estáveis major, minor ou patch escolhidas pelo mantenedor.
- Garantir preparação local recuperável sem depender de API remota.
- Bloquear estado remoto órfão/inconsistente antes da integração.
- Garantir PR de release same-repo e coerente com a versão preparada.
- Resolver o commit exato da release e da predecessora independentemente das tags.
- Tornar tag/release imutáveis e recuperação idempotente.
- Reutilizar quality/build/E2E existentes.
- Aplicar menor privilégio aos tokens da CI/publicação.

**Non-Goals:**

- Publicar automaticamente em push para `master`.
- Inferir major/minor/patch.
- Suportar prerelease/build metadata ou `hotfix/*` neste primeiro fluxo.
- Exigir GitHub API para a preparação local.
- Aceitar releases originadas de forks.
- Versionar/publicar workspaces de forma independente.
- Transformar branch policy/ruleset/checklist humana em requisitos permanentes da capability.

## Decisions

### Contrato estável versus operação

A capability cobre preparação/recuperação, SemVer/changelog, versionamento coordenado, validação remota/predecessora, resolução do commit, tags, GitHub Release e release notes.

Ficam neste design e nas fontes operacionais: branches, PRs, same-repo policy, required checks/ruleset, eventos GitHub, retenção da branch, ref do dispatch, permissões e configuração concreta dos workflows.

### Ciclo operacional

1. criar `release/X.Y.Z` a partir de `develop` no próprio repositório;
2. executar a preparação local;
3. abrir PR `release/X.Y.Z -> master`;
4. integrar somente depois dos checks e da proteção de `master` estarem válidos;
5. após o merge, não introduzir novo delta funcional na release branch;
6. reconciliar `release/X.Y.Z -> develop`;
7. publicar manualmente;
8. remover a branch somente após back-merge e publicação concluídos.

O `release-check` deriva `X.Y.Z` da branch e exige correspondência com manifests/changelog. `release/1.2.3` contendo preparação `1.2.4` falha.

No back-merge, a branch pode incorporar o estado mais recente de `develop` apenas para reconciliação. O diff de retorno deve ficar restrito a `CHANGELOG.md`, `package.json`, `package-lock.json`, `packages/*/package.json` e `apps/*/package.json`. O bloco fechado `X.Y.Z` permanece idêntico ao que entrou em `master`; entradas posteriores ficam na seção `Em andamento`; workspaces novos são coordenados sem perder metadados futuros.

### `master` como linha estável

Uma PR de release válida para `master` deve atender simultaneamente:

- base `master`;
- head no padrão `release/X.Y.Z`;
- `head.repo.full_name == github.repository`;
- versão da branch igual à versão preparada.

PR inválida falha explicitamente no `release-check`. Regras baseadas em metadados de PR não são aplicadas em `push` pós-merge.

O ruleset de `master` deve exigir PR/required checks, bloquear push direto, force push e deleção, com bypass administrativo mínimo/documentado.

#### Bootstrap do primeiro ruleset

Como `master` está atualmente desprotegida e `release-check` ainda não existe:

1. integrar em `develop` o workflow que define `release-check`;
2. abrir a primeira PR de release e deixar o check aparecer/executar;
3. configurar o ruleset exigindo `release-check` e os demais checks necessários;
4. confirmar a proteção ativa;
5. somente então fazer o primeiro merge de release.

### Bootstrap, SemVer e changelog

O fluxo aceita somente versões estáveis `X.Y.Z` e tags `vX.Y.Z`.

Uma seção fechada válida possui SemVer estável e data `dd-mmm-aaaa` com mês PT-BR. A seção `Em andamento` não é fechada.

- última versão fechada = maior SemVer fechada;
- predecessora de `X.Y.Z` = maior SemVer fechada estritamente menor que o alvo.

Versões fechadas devem ser únicas e aparecer em ordem SemVer decrescente.

Bootstrap:

- **local:** sem versão fechada, alvo >= versão coordenada atual; sem GitHub API;
- **pré-integração remota:** para uma release sem predecessora, não pode haver artefato `vX.Y.Z` incompatível com o bootstrap ainda não integrado;
- **pós-integração:** artefatos da versão alvo são avaliados pelas regras normais de idempotência/recuperação, não pela regra de bootstrap pré-integração.

Depois do bootstrap, versão atual = última fechada antes da preparação e novo alvo > ela. O placeholder patch pode ser renomeado para minor/major preservando conteúdo.

### Data determinística

A data do changelog é a data civil em `America/Sao_Paulo`, formato `dd-mmm-aaaa`, meses `jan`, `fev`, `mar`, `abr`, `mai`, `jun`, `jul`, `ago`, `set`, `out`, `nov`, `dez`. O mesmo formato é exigido ao reconhecer seções fechadas.

### Preparação local transacional

`release:prepare` possui três fases lógicas:

1. preflight somente leitura;
2. staging de todos os novos conteúdos, inclusive lockfile;
3. aplicação final apenas após staging completa.

Guardas operacionais locais: branch exatamente `release/X.Y.Z` e working tree limpa. O preflight não consulta GitHub.

Falhas de preflight/staging não alteram arquivos reais; falha de aplicação restaura o estado anterior ou usa substituição atômica equivalente.

### Versionamento coordenado e toolchain

Manifesto raiz, `packages/*`, `apps/*`, referências internas versionadas e lockfile representam uma única versão. A implementação fixa uma versão exata do npm em `packageManager` e usa a mesma versão local/CI. Regenerar o lockfile não deve atualizar dependências externas sem alteração funcional correspondente.

### CI e validação remota

Quality/build/E2E existentes continuam responsáveis por suas verificações. `release-check` adiciona apenas validações de release:

- same-repo + branch/version match;
- consistência da preparação;
- bootstrap remoto sem artefato órfão;
- publicação consistente da predecessora;
- OpenSpec estrito.

A predecessora é validada resolvendo independentemente seu commit integrado pelo mesmo resolvedor da release atual e só depois comparando tag/GitHub Release.

O job `release-check` recebe somente:

- `contents: read`;
- `pull-requests: read`.

Os demais jobs mantêm as permissões atuais. Nenhuma escrita é necessária na CI.

A validação OpenSpec usa versão fixada e launcher multiplataforma, sem `openspec.cmd`/instalação global no Linux.

### Publicação manual com separação de privilégios

`release.yml` usa `workflow_dispatch` com input obrigatório `version`. Operacionalmente aceita somente `github.ref_name == develop`, usa um grupo único de `concurrency` com `queue: max` e não usa `cancel-in-progress: true`.

A publicação é dividida em pelo menos duas fases/jobs:

1. **resolve/validate (read-only)**
   - permissões `contents: read` e `pull-requests: read`;
   - resolve PR/commit, reachability, versão, changelog, notas e estado atual de tag/release;
   - pode fazer checkout do commit liberado e executar scripts de validação;
   - produz somente outputs/artefatos necessários para a fase seguinte.

2. **publish (write)**
   - depende do job read-only ter concluído com sucesso;
   - recebe `contents: write` e somente permissões adicionais estritamente necessárias;
   - revalida imediatamente as pré-condições remotas mutáveis (especialmente tag/release) antes da escrita;
   - cria tag/GitHub Release usando dados validados;
   - não executa scripts arbitrários do commit liberado com token de escrita.

Assim código do commit liberado é validado apenas com token read-only, reduzindo o impacto de qualquer script de repositório executado durante a validação.

A checagem `github.ref_name == develop` protege contra seleção acidental de outro ref na versão revisada do workflow; a confiança na definição do workflow continua dependendo da revisão/proteção das branches que podem alterar `.github/workflows/`.

### Resolver o commit exato

O resolvedor localiza de forma inequívoca a PR merged same-repo `release/X.Y.Z -> master` e usa seu commit efetivamente integrado (`merge_commit_sha` conforme o método de merge).

Antes de publicação, confirma reachability a partir de `master` e valida o checkout explícito desse commit. Nunca usa o HEAD corrente como substituto. O mesmo resolvedor encontra o commit esperado da predecessora.

### Tags e GitHub Release

Tag: sempre anotada `vX.Y.Z`.

- ausente: criar no commit validado;
- anotada no commit correto: preservar/reutilizar;
- lightweight ou commit divergente: falhar sem alteração.

GitHub Release: `tag_name` e nome `vX.Y.Z`, `draft=false`, `prerelease=false`, body vindo exclusivamente da seção fechada no commit liberado.

Release existente só é no-op quando todos os metadados esperados coincidem. Se a tag correta existir e a release não, criar apenas a release. Comparação do body normaliza somente CRLF/LF e newline final.

### Fontes operacionais

- `README.md`: resumo + link;
- `docs/release-process.md`: procedimento completo, recuperação e configuração manual;
- `AGENTS.md`: referência curta para agentes;
- `openspec/config.yaml`: somente orientação útil a futuras changes, sem duplicar o procedimento.

## Risks / Trade-offs

- [Capability vira checklist operacional] → manter política operacional fora da delta spec.
- [Preparação local depende de GitHub] → separar preflight local de validação remota.
- [Artefato alvo de retry é confundido com bootstrap órfão] → bootstrap remoto é pré-integração; pós-integração usa idempotência.
- [Fork usa branch release/*] → exigir same-repo.
- [Branch/version mismatch] → derivar versão da head e comparar com preparação.
- [Ruleset exige check inexistente] → executar check antes de torná-lo required e ativar proteção antes do primeiro merge.
- [CI sem acesso a PRs] → `pull-requests: read` apenas no job que precisa.
- [Tag valida a si própria] → resolver commit esperado independentemente.
- [Código do release roda com token write] → separar job read-only de job de publicação e não executar scripts arbitrários no job write.
- [Mudança remota entre validação e escrita] → job publish revalida tag/release imediatamente antes da mutação; falha/retry permanece idempotente.
- [Master avança após merge] → resolver commit da release, não HEAD.
- [Develop avança durante a release] → back-merge preserva bloco fechado e mudanças futuras separadamente.
