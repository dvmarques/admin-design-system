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
- Manter protegidas as branches que definem a linha estável e a lógica revisada dos workflows de release.
- Manter invariantes de versão/changelog em `develop` para todas as mudanças, não apenas no back-merge.
- Tornar verificável o back-merge de release para `develop` e exigir sua conclusão antes da publicação.

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
7. publicar manualmente, somente depois de o back-merge estar integrado e validado;
8. remover a branch somente após back-merge e publicação concluídos.

O `release-check` deriva `X.Y.Z` da branch e exige correspondência com manifests/changelog. `release/1.2.3` contendo preparação `1.2.4` falha.

No back-merge, a branch pode incorporar o estado mais recente de `develop` apenas para reconciliação. O diff de retorno deve ficar restrito a `CHANGELOG.md`, `package.json`, `package-lock.json`, `packages/*/package.json` e `apps/*/package.json`. O bloco fechado `X.Y.Z` permanece idêntico ao que entrou no commit exato da release em `master`; entradas posteriores ficam na seção `Em andamento`; workspaces novos são coordenados sem perder metadados futuros.

### `master` como linha estável

Uma PR de release válida para `master` deve atender simultaneamente:

- base `master`;
- head no padrão `release/X.Y.Z`;
- `head.repo.full_name == github.repository`;
- versão da branch igual à versão preparada.

PR inválida falha explicitamente no `release-check`. Regras baseadas em metadados de PR não são aplicadas em `push` pós-merge.

Antes de qualquer merge de `release/X.Y.Z`, `release-check` deve confirmar que não existe tag `vX.Y.Z` nem GitHub Release correspondente. Uma versão ainda não integrada não pode possuir artefato remoto de publicação válido.

Quando não houver predecessora fechada, o bootstrap remoto é mais estrito: além da ausência de artefatos da própria versão alvo, qualquer tag/GitHub Release de release incompatível com a ausência de histórico fechado deve bloquear a primeira integração.

O ruleset de `master` deve exigir PR/required checks, bloquear push direto, force push e deleção, com bypass administrativo mínimo/documentado.

#### Bootstrap do primeiro ruleset de `master`

Como `master` está atualmente desprotegida e `release-check` ainda não existe:

1. integrar em `develop` o workflow que define `release-check`;
2. abrir a primeira PR de release e deixar o check aparecer/executar;
3. configurar o ruleset exigindo `release-check` e os demais checks necessários;
4. confirmar a proteção ativa;
5. somente então fazer o primeiro merge de release.

### `develop` como fonte confiável da operação

`develop` é a default branch, recebe o back-merge e contém a definição revisada de `.github/workflows/release.yml` usada pelo `workflow_dispatch`. Por isso, a restrição operacional `github.ref_name == develop` só oferece a garantia esperada se alterações em `develop` também passarem por revisão e CI.

O ruleset mínimo de `develop` deve:

- exigir Pull Request para integração;
- exigir os checks gerais de CI aplicáveis à branch;
- exigir um check `develop-policy` sempre presente em PRs para `develop`;
- bloquear push direto;
- bloquear force push;
- bloquear deleção;
- manter bypass administrativo no menor escopo possível e documentado.

`develop-policy` não é um no-op completo para PRs comuns. Em toda PR para `develop`, ele deve preservar as invariantes operacionais do estado de release:

- exatamente uma seção `Em andamento`;
- seções fechadas válidas, únicas e em ordem SemVer decrescente;
- blocos fechados já existentes na base não podem ser alterados/removidos por PR comum;
- todos os manifests existentes no head permanecem coordenados em uma única versão;
- PR comum não pode alterar a versão coordenada já existente; workspace novo deve nascer com essa mesma versão.

Quando a head é same-repo `release/X.Y.Z`, o check entra no modo de back-merge e permite a transição de estado da release, validando adicionalmente:

- formato/coerência da versão da branch;
- diff restrito aos arquivos de preparação/reconciliação permitidos;
- resolução independente do commit exato da release `X.Y.Z` já integrada;
- bloco fechado `X.Y.Z` idêntico ao bloco desse commit exato, nunca ao HEAD corrente de `master`;
- entradas pós-corte permanecendo na seção `Em andamento`;
- todos os manifests existentes em `develop` coordenados na versão `X.Y.Z` sem perda de metadados futuros.

Diferentemente de `master`, `develop` não restringe a origem das PRs a `release/*`; feature branches continuam válidas desde que preservem as invariantes acima.

A proteção de `develop` deve estar ativa antes de ela ser tratada como fonte confiável do workflow de publicação. O novo check deve aparecer/executar antes de ser marcado como required, pela mesma estratégia de bootstrap adotada para novos status checks.

### Bootstrap, SemVer e changelog

O fluxo aceita somente versões estáveis `X.Y.Z` e tags `vX.Y.Z`.

Uma seção fechada válida possui SemVer estável e data `dd-mmm-aaaa` com mês PT-BR. A seção `Em andamento` não é fechada.

- última versão fechada = maior SemVer fechada;
- predecessora de `X.Y.Z` = maior SemVer fechada estritamente menor que o alvo.

Versões fechadas devem ser únicas e aparecer em ordem SemVer decrescente.

Validação remota pré-integração:

- **todas as releases:** a própria versão alvo não pode possuir tag `vX.Y.Z` nem GitHub Release antes de ser integrada;
- **bootstrap sem predecessora:** além disso, não pode existir histórico remoto de releases no padrão `vA.B.C` incompatível com a ausência de versões fechadas no changelog;
- **pós-integração:** artefatos da versão alvo são avaliados pelas regras normais de idempotência/recuperação, não pela regra de ausência pré-integração.

Bootstrap local permanece offline: sem versão fechada, alvo >= versão coordenada atual. Depois do bootstrap, versão atual = última fechada antes da preparação e novo alvo > ela. O placeholder patch pode ser renomeado para minor/major preservando conteúdo.

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

Quality/build/E2E existentes continuam responsáveis por suas verificações. `release-check` adiciona somente validações de release:

- same-repo + branch/version match;
- consistência da preparação;
- ausência de tag/GitHub Release da própria versão alvo antes da integração;
- no bootstrap, ausência de histórico remoto incompatível;
- publicação consistente da predecessora;
- OpenSpec estrito.

A predecessora é validada resolvendo independentemente seu commit integrado pelo mesmo resolvedor da release atual e só depois comparando tag/GitHub Release. A GitHub Release da predecessora deve satisfazer as mesmas invariantes de identidade, estado e notas exigidas da publicação atual.

O job `release-check` recebe somente:

- `contents: read`;
- `pull-requests: read`.

Os demais jobs mantêm as permissões atuais. Nenhuma escrita é necessária na CI.

A validação OpenSpec usa versão fixada e launcher multiplataforma, sem `openspec.cmd`/instalação global no Linux.

### Publicação manual com separação de privilégios

`release.yml` usa `workflow_dispatch` com input obrigatório `version`. Operacionalmente aceita somente `github.ref_name == develop`, usa um grupo único de `concurrency` com `queue: max` e não usa `cancel-in-progress: true`.

Antes de avaliar tag/release, a publicação deve resolver e validar o back-merge da mesma versão:

- deve existir uma PR merged same-repo `release/X.Y.Z -> develop` correspondente;
- o estado atual de `develop` deve conter o bloco fechado `X.Y.Z` idêntico ao commit exato liberado e preservar uma única seção `Em andamento` válida;
- os manifests atuais em `develop` devem permanecer coordenados em `X.Y.Z`;
- se a predecessora existir, sua publicação deve ser revalidada como consistente também no momento da publicação atual.

Assim o workflow não permite publicar antes de concluir a continuidade pós-release em `develop`, e não depende apenas da ordem documentada dos passos humanos.

A publicação é dividida em pelo menos duas fases/jobs:

1. **resolve/validate (read-only)**
   - permissões `contents: read` e `pull-requests: read`;
   - resolve PR/commit da release, back-merge, predecessora, reachability, versão, changelog, notas e estado atual de tag/release;
   - pode fazer checkout do commit liberado e executar scripts de validação;
   - produz evidência diagnóstica e outputs que podem ser usados como comparação pela fase seguinte, mas não como fonte de verdade privilegiada.

2. **publish (write)**
   - depende do job read-only ter concluído com sucesso;
   - recebe `contents: write` e somente permissões adicionais estritamente necessárias;
   - re-resolve independentemente PR/commit da release e back-merge e reobtém versão/changelog/notas por operações confiáveis do próprio workflow, sem executar scripts do commit liberado;
   - revalida a predecessora quando existir;
   - compara o resultado independente com a evidência do job read-only e falha em qualquer divergência;
   - revalida imediatamente estado atual de `develop`, tag/release e reachability antes da escrita;
   - cria tag/GitHub Release somente a partir dos dados rederivados no job privilegiado.

O job privilegiado não deve confiar em commit SHA, release notes ou outro conteúdo arbitrário produzido pelo job read-only sem rederivação/verificação. Para ler o commit liberado, pode usar operações não executáveis como checkout sem scripts, `git show` ou API GitHub; parâmetros derivados de arquivos devem ser tratados como dados, nunca interpolados em comandos avaliados dinamicamente.

Assim código do commit liberado é validado apenas com token read-only, enquanto o job com token de escrita toma decisões a partir de dados rederivados por lógica confiável do workflow.

A checagem `github.ref_name == develop` protege contra seleção acidental de outro ref na versão revisada do workflow; a proteção e `develop-policy` garantem que essa definição e o estado de continuidade não sejam alterados fora do processo revisado.

### Resolver o commit exato

O resolvedor localiza de forma inequívoca a PR merged same-repo `release/X.Y.Z -> master` e usa seu commit efetivamente integrado (`merge_commit_sha` conforme o método de merge).

Antes de publicação, confirma reachability a partir de `master` e valida o checkout explícito desse commit. Nunca usa o HEAD corrente como substituto. O mesmo resolvedor encontra o commit esperado da predecessora e o baseline exato usado nas comparações do back-merge.

A identidade da PR merged é mantida pelo GitHub mesmo após a remoção da branch, portanto a validação de releases anteriores não depende de manter indefinidamente as branches já publicadas. O resolvedor deve falhar em caso de zero ou múltiplas PRs candidatas compatíveis, em vez de escolher silenciosamente uma delas.

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
- [Artefato da versão alvo existe antes do merge] → bloquear qualquer tag/release `vX.Y.Z` pré-integração; pós-integração usa idempotência.
- [Bootstrap local contradiz histórico remoto] → no primeiro release, validar também ausência de artefatos remotos de release incompatíveis com changelog sem versões fechadas.
- [Fork usa branch release/*] → exigir same-repo.
- [Branch/version mismatch] → derivar versão da head e comparar com preparação.
- [Ruleset exige check inexistente] → executar novos checks antes de torná-los required.
- [Develop permite alterar workflow por push direto] → exigir PR + CI, `develop-policy` e bloquear push direto/force push/deleção.
- [Feature altera histórico/versionamento pós-release] → `develop-policy` preserva blocos fechados e versão coordenada em toda PR comum.
- [Back-merge depende de convenção humana] → `develop-policy` entra em modo estrito para `release/X.Y.Z`.
- [Publicação ocorre antes do back-merge] → workflow resolve PR de retorno e valida estado atual de `develop` antes de qualquer publicação.
- [Back-merge compara contra master avançada] → resolver o commit exato de `X.Y.Z` e usar esse commit como baseline imutável.
- [CI sem acesso a PRs] → `pull-requests: read` apenas no job que precisa.
- [Tag valida a si própria] → resolver commit esperado independentemente.
- [Código do release influencia job privilegiado via outputs] → job write rederiva commit/notas/estado por lógica confiável e usa outputs read-only apenas como evidência comparativa.
- [Código do release roda com token write] → não executar scripts do commit liberado no job privilegiado.
- [Predecessora muda após release-check] → revalidar sua tag/release durante a publicação da versão atual.
- [Mudança remota entre validação e escrita] → job publish revalida predecessora, develop, tag/release e reachability imediatamente antes da mutação.
- [Master avança após merge] → resolver commit da release, não HEAD.
- [Develop avança durante a release] → back-merge preserva bloco fechado e mudanças futuras separadamente; PRs posteriores continuam sujeitos a `develop-policy`.
