## Context

O fluxo de release precisa manter coerentes cinco artefatos observáveis: versão coordenada do monorepo, seção fechada do `CHANGELOG.md`, commit efetivamente liberado, tag Git e GitHub Release. Operacionalmente, também é necessário manter `develop` pronta para a próxima release.

O estado atual está alinhado em `0.0.1`, existe apenas `0.0.1 - Em andamento` no changelog e ainda não há tag no padrão `vX.Y.Z` nem GitHub Release correspondente. Isso caracteriza o bootstrap da primeira release; `0.0.1` é contexto transitório, não requisito permanente.

A governança atual do repositório distingue contratos estáveis de instruções operacionais. A delta spec de `release-process` descreve somente comportamentos observáveis da automação. Este design, `docs/release-process.md`, `AGENTS.md` e a configuração OpenSpec registram como o repositório opera esse contrato.

## Goals / Non-Goals

**Goals:**

- Automatizar preparação, validações mecânicas, resolução do commit, tag e GitHub Release.
- Preservar decisão humana sobre versão, integração e disparo da publicação.
- Manter raiz, workspaces privados, dependências internas, lockfile e changelog coordenados.
- Permitir releases estáveis major, minor ou patch escolhidas pelo mantenedor.
- Garantir preparação local recuperável sem depender de API remota.
- Garantir que validações remotas bloqueiem tags/releases órfãs ou inconsistentes.
- Garantir que a tag aponte para o commit exato da release, e não para o HEAD corrente de `master`.
- Tornar publicação idempotente e recuperável sem mover ou recriar tags existentes.
- Reutilizar a CI existente, sem duplicar quality/build/E2E.
- Manter o processo operacional de branches e retorno para `develop` documentado e verificável.

**Non-Goals:**

- Publicar automaticamente em todo push para `master`.
- Inferir automaticamente major/minor/patch.
- Suportar prerelease ou build metadata neste primeiro fluxo.
- Exigir autenticação/API GitHub para executar a preparação local.
- Suportar `hotfix/*` neste primeiro desenho.
- Versionar/publicar cada workspace de forma independente.
- Transformar política de branches, ruleset ou checklist humana em requisitos permanentes da capability.

## Decisions

### Separar contrato estável de operação

A capability `release-process` cobre apenas comportamentos observáveis da automação:

- preparação e recuperação;
- SemVer e changelog;
- versionamento coordenado;
- validação remota/bootstrap e da predecessora;
- resolução do commit liberado;
- tags anotadas e imutáveis;
- GitHub Release idempotente;
- release notes derivadas do changelog.

As decisões de operação ficam neste design e na documentação do repositório:

- branch `release/X.Y.Z`;
- PRs para `master` e `develop`;
- required checks/ruleset;
- eventos `pull_request`/`push`;
- retenção da release branch;
- ref usada no `workflow_dispatch`;
- permissões e configuração concreta do GitHub Actions.

Isso segue a governança em que specs representam contratos estáveis, enquanto instruções de contribuição e execução vivem em `AGENTS.md`, `openspec/config.yaml` e `docs/`.

### Ciclo operacional de branches

O ciclo será:

1. `release/X.Y.Z` nasce de `develop`;
2. a preparação local ocorre nessa branch;
3. PR `release/X.Y.Z -> master` integra a release depois das validações locais/remotas;
4. após o merge, a branch não recebe novo delta funcional;
5. a mesma branch é reconciliada com `develop` por PR;
6. depois da sincronização com `develop`, a publicação é disparada manualmente;
7. a branch só é removida depois do back-merge e da publicação concluída.

A release branch pode incorporar o estado mais recente de `develop` apenas para resolver o back-merge. O PR de retorno não pode introduzir mudança funcional nova da release.

O diff operacional de retorno deve ficar restrito aos arquivos preparados pela release: `CHANGELOG.md`, `package.json`, `package-lock.json`, `packages/*/package.json` e `apps/*/package.json`. Se `develop` avançou depois do corte:

- o bloco fechado `X.Y.Z` permanece idêntico ao que entrou em `master`;
- entradas posteriores continuam na nova seção `Em andamento`;
- workspaces criados depois do corte são coordenados em `X.Y.Z` sem perder dependências/metadados futuros.

### `master` como linha estável

`master` será operada como linha estável de releases. O `release-check` será aplicado em PRs para `master` e validará a preparação e o estado remoto. A política operacional inicial aceita somente head `release/*`; outras heads falham explicitamente.

Em eventos `push` pós-merge, a regra baseada em `github.head_ref` não é aplicada. Os checks gerais existentes podem continuar executando normalmente.

A proteção/ruleset de `master` deverá, no mínimo:

- exigir pull request;
- exigir os checks definidos;
- bloquear push direto fora do fluxo;
- bloquear force push;
- bloquear deleção;
- manter bypass administrativo no menor escopo possível e documentado.

Essa configuração é operacional e será documentada; não faz parte do contrato permanente da capability.

### Bootstrap, SemVer e changelog

O fluxo inicial aceita somente versões estáveis `X.Y.Z` e tags correspondentes `vX.Y.Z`.

O parser considera fechada apenas uma seção com SemVer estável e data no formato oficial `dd-mmm-aaaa`, usando os meses PT-BR definidos abaixo. A seção `Em andamento` não é uma versão fechada.

- **última versão fechada**: maior SemVer entre as seções fechadas;
- **predecessora de `X.Y.Z`**: maior SemVer fechada estritamente menor que o alvo.

As versões fechadas devem ser únicas e aparecer em ordem SemVer decrescente no arquivo.

O bootstrap é dividido em duas camadas:

- **local:** sem versão fechada no changelog, o alvo pode ser igual ou superior à versão coordenada atual; o preflight não consulta API GitHub;
- **remota:** antes da integração/publicação, `release-check` confirma que não existe tag ou GitHub Release no padrão `vX.Y.Z` incompatível com a ausência de histórico fechado.

Tags/releases fora desse padrão não participam da detecção. Um artefato órfão dentro do padrão bloqueia a release na validação remota até correção explícita.

Depois do bootstrap, a versão atual deve coincidir com a última versão fechada e o próximo alvo deve ser estritamente maior.

O placeholder aberto depois de cada release usa a próxima patch apenas como valor de trabalho. Ele pode ser renomeado para uma versão minor ou major escolhida depois, preservando seu conteúdo.

### Data determinística

A data que fecha o changelog será calculada como data civil em `America/Sao_Paulo`, independentemente da timezone do processo.

Formato: `dd-mmm-aaaa`, com meses `jan`, `fev`, `mar`, `abr`, `mai`, `jun`, `jul`, `ago`, `set`, `out`, `nov`, `dez`.

O mesmo formato é exigido para reconhecer seções fechadas como válidas.

### Preparação transacional

`release:prepare` terá três fases lógicas:

1. **preflight** somente leitura de estado local/versionado;
2. **staging** de todos os conteúdos novos, inclusive lockfile;
3. **aplicação final** apenas depois de a staging estar completa.

Como guardas operacionais, o preflight local exige branch atual exatamente `release/X.Y.Z` e working tree limpa antes da primeira escrita. Ele não depende de autenticação ou consulta à API do GitHub.

Falhas de validação local não alteram arquivos. Falhas durante staging não alteram os arquivos reais. Se a aplicação final falhar, o estado anterior deve ser restaurado ou uma estratégia de substituição atômica equivalente deve evitar resultado parcial.

### Versionamento coordenado e toolchain

O produto usa uma única versão entre manifesto raiz, `packages/*`, `apps/*`, referências internas versionadas e lockfile.

A implementação fixará uma versão exata do npm em `packageManager` e usará a mesma versão na preparação/CI. A regeneração do lockfile não deve atualizar dependências externas sem alteração funcional correspondente e será validada com instalação reproduzível.

Fixar o npm é uma decisão de implementação para satisfazer o requisito estável de lockfile reproduzível; o mecanismo exato não precisa permanecer na capability.

### Validação de release na CI

A CI atual continua responsável por quality/build/E2E. Um check específico de release executará somente as validações adicionais necessárias, evitando repetir `npm run validate` ou reinstalar browsers sem necessidade.

O `release-check` reúne as validações que dependem do GitHub remoto:

- bootstrap sem tag/GitHub Release órfã no padrão `vX.Y.Z`;
- publicação consistente da predecessora quando ela existir;
- consistência entre versão preparada e changelog.

A preparação local continua utilizável sem essas consultas remotas; a PR não pode ser integrada enquanto o `release-check` remoto não estiver verde.

A validação OpenSpec da CI deverá usar uma versão fixada e um launcher multiplataforma, sem depender de `openspec.cmd` ou instalação global no runner Linux.

### Publicação manual e serialização

`.github/workflows/release.yml` terá `workflow_dispatch` com input obrigatório `version`.

Operacionalmente:

- o dispatch é aceito apenas quando executado com `github.ref_name == develop`;
- outro ref falha antes de efeitos remotos;
- publicações usam um único grupo de `concurrency` com `queue: max` e sem `cancel-in-progress: true`;
- permissões serão mínimas, incluindo `contents: write` e `pull-requests: read`.

A restrição ao ref `develop`, a sintaxe de concorrência e as permissões pertencem à operação do workflow, não à capability permanente.

### Resolver o commit exato

O workflow localizará de forma inequívoca a PR merged `release/X.Y.Z -> master` e usará o commit efetivamente integrado (`merge_commit_sha` conforme o método de merge utilizado pelo GitHub).

Antes de qualquer escrita remota:

- confirmar que o commit continua alcançável a partir de `master`;
- fazer checkout explícito dele;
- validar nesse checkout a versão coordenada, o changelog e as notas;
- nunca substituir esse commit pelo HEAD corrente de `master`.

A capability exige a resolução inequívoca do commit; a dependência concreta de PR/`merge_commit_sha` é decisão desta implementação.

### Tags anotadas e recuperação

A tag de release é `vX.Y.Z` e sempre anotada.

- inexistente: criar no commit validado;
- anotada existente no mesmo commit: preservar e reutilizar;
- lightweight: falhar;
- anotada em outro commit: falhar.

Nenhum caminho permitido move, sobrescreve ou recria uma tag existente.

### GitHub Release e notas

A GitHub Release usa `tag_name` e nome `vX.Y.Z`, `draft=false`, `prerelease=false` e notas extraídas exclusivamente da seção fechada `X.Y.Z` do changelog do commit liberado.

Se a release já existir, o workflow valida tag, commit, nome, `draft`, `prerelease` e body. O body só pode ser normalizado quanto a CRLF/LF e newline final para a comparação.

Se a tag correta existir mas a GitHub Release não, a reexecução preserva a tag e cria somente a release.

### Fontes operacionais

- `README.md`: resumo do fluxo e link.
- `docs/release-process.md`: procedimento completo, recuperação e configuração manual.
- `AGENTS.md`: referência curta para agentes sobre onde encontrar e como seguir o processo.
- `openspec/config.yaml`: orientação curta para changes que alterarem a automação de release, evitando duplicação do procedimento.

## Risks / Trade-offs

- [Capability virar checklist operacional] → manter políticas de branch/workflow fora da delta spec e nas fontes operacionais.
- [Preparação local depender de GitHub] → separar preflight local de validações remotas da CI/publicação.
- [Primeira release com artefato remoto órfão] → `release-check` remoto bloqueia artefato no padrão `vX.Y.Z`.
- [Tag não relacionada começa com v] → detecção considera somente o padrão estável `vX.Y.Z`.
- [Prerelease entra sem política] → aceitar somente `X.Y.Z` estável neste fluxo.
- [Data varia por timezone] → calcular em `America/Sao_Paulo` com mapa fixo de meses e validar o mesmo formato em seções fechadas.
- [Changelog fora de ordem] → validar unicidade e ordem SemVer decrescente.
- [Release atual confundida com predecessora] → predecessora é sempre a maior SemVer fechada menor que o alvo.
- [Preparação executada em branch/working tree incorretos] → preflight operacional exige `release/X.Y.Z` e árvore limpa.
- [Preparação deixa arquivos parciais] → preflight + staging + rollback/substituição atômica.
- [npm diferente altera lockfile] → pin de npm compartilhado entre local/CI.
- [Release seguinte integra antes da anterior ser publicada] → release-check valida a predecessora pelos mesmos critérios da publicação.
- [Master avança depois do merge] → publicação resolve o commit da release e não usa HEAD.
- [Tag criada e GitHub Release falha] → reexecução reutiliza apenas tag anotada no commit esperado.
- [Develop avança durante a release] → back-merge preserva bloco fechado e mudanças futuras separadamente.
