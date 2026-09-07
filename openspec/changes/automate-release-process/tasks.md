## 1. Preparação e utilitários de release

- [ ] 1.1 Criar utilitários reutilizáveis para parsing de SemVer estável, changelog, workspaces e comparação de versões.
- [ ] 1.2 Criar `scripts/prepare-release.mjs` com preflight somente leitura, staging completa e aplicação final recuperável.
- [ ] 1.3 Validar como guardas operacionais branch atual exatamente `release/X.Y.Z` e working tree limpa antes da primeira escrita.
- [ ] 1.4 Rejeitar prerelease/build metadata e validar bootstrap local, downgrade e ordenação da versão alvo.
- [ ] 1.5 Garantir que o preflight local não dependa de autenticação ou consulta à API do GitHub.
- [ ] 1.6 Validar uma única seção `Em andamento`, formato oficial de data das seções fechadas, unicidade/ordem SemVer decrescente e ausência de conflito com o alvo.
- [ ] 1.7 Permitir renomear o placeholder `Em andamento` para patch/minor/major escolhido, preservando conteúdo.
- [ ] 1.8 Fechar a versão usando data civil em `America/Sao_Paulo`, formato `dd-mmm-aaaa` e abreviações PT-BR fixas.
- [ ] 1.9 Criar acima o próximo patch apenas como placeholder `Em andamento`.
- [ ] 1.10 Atualizar de forma coordenada raiz, `packages/*`, `apps/*` e referências internas versionadas para `X.Y.Z`.
- [ ] 1.11 Fixar uma versão exata do npm em `packageManager` e garantir uso da mesma versão na preparação e na CI.
- [ ] 1.12 Regenerar `package-lock.json` sem atualizar dependências externas como efeito colateral e validar o resultado com instalação reproduzível.
- [ ] 1.13 Implementar rollback/restauração ou substituição atômica equivalente para impedir estado parcial em falha de aplicação.
- [ ] 1.14 Expor o comando como `npm run release:prepare -- X.Y.Z`.

## 2. Validação e release notes

- [ ] 2.1 Criar `scripts/extract-release-notes.mjs` para extrair somente a seção fechada solicitada.
- [ ] 2.2 Criar validação reutilizável de consistência entre versão, manifests, dependências internas, lockfile e `CHANGELOG.md`.
- [ ] 2.3 Reutilizar a mesma lógica para calcular última versão fechada e predecessora do alvo.
- [ ] 2.4 Em qualquer validação remota pré-integração, rejeitar tag/GitHub Release já existente para a própria versão alvo `vX.Y.Z`; no bootstrap sem predecessora, rejeitar também histórico remoto de releases incompatível com a ausência de versões fechadas.
- [ ] 2.5 Não aplicar a proibição pré-integração ao retry pós-integração da própria versão alvo; nesse caso usar as regras normais de idempotência/recuperação.
- [ ] 2.6 Criar um resolvedor reutilizável do commit efetivamente integrado de uma versão e usá-lo para a release atual, a predecessora e as comparações do back-merge.
- [ ] 2.7 Validar a predecessora comparando tag anotada e GitHub Release contra o commit esperado resolvido independentemente e reutilizando todas as invariantes de publicação consistente.
- [ ] 2.8 Implementar comparação de release notes normalizando somente CRLF/LF e newline final.

## 3. CI e política operacional de branches

- [ ] 3.1 Integrar um `release-check` à CI sem duplicar quality/build/E2E já existentes.
- [ ] 3.2 Em PR para `master`, exigir head no padrão estável `release/X.Y.Z`, derivar a versão da branch e validar que ela coincide com manifests/changelog preparados.
- [ ] 3.3 Exigir que a PR de release tenha `head.repo.full_name == github.repository`; rejeitar forks mesmo que possuam branch homônima `release/*`.
- [ ] 3.4 Em PR `release/* -> master` válida, executar a validação reutilizável da preparação, ausência de artefatos remotos da versão alvo, bootstrap remoto/predecessora e changelog.
- [ ] 3.5 Para qualquer head não-release ou release de origem inválida em PR para `master`, fazer `release-check` falhar explicitamente.
- [ ] 3.6 Garantir que a política baseada em metadados de PR seja aplicada somente a `pull_request` para `master` e não quebre execuções de `push` pós-merge.
- [ ] 3.7 Conceder ao job `release-check` somente `contents: read` e `pull-requests: read`, preservando as permissões atuais dos demais jobs e sem conceder escrita à CI.
- [ ] 3.8 Criar `develop-policy` sempre presente em PRs para `develop`.
- [ ] 3.9 Em PR comum para `develop`, validar exatamente uma seção `Em andamento`, integridade/imutabilidade das seções fechadas existentes, coordenação de todos os manifests e proibir mudança da versão coordenada atual; workspace novo deve nascer com a mesma versão.
- [ ] 3.10 Em back-merge same-repo `release/X.Y.Z -> develop`, permitir a transição de release e validar branch/versão, conjunto de arquivos permitido, commit exato da release, bloco fechado idêntico a esse commit, entradas futuras em `Em andamento` e coordenação de todos os manifests atuais.
- [ ] 3.11 Definir forma versionada e multiplataforma de disponibilizar OpenSpec no runner Linux e executar validação estrita sem depender de `openspec.cmd`/instalação global.
- [ ] 3.12 Na primeira implantação, deixar novos checks aparecerem/executarem antes de configurá-los como required nos respectivos rulesets.
- [ ] 3.13 Configurar/documentar ruleset de `master` exigindo PR, `release-check` e demais checks necessários e bloqueando push direto, force push e deleção; confirmar proteção ativa antes do primeiro merge e manter bypass no menor escopo necessário.
- [ ] 3.14 Configurar/documentar ruleset mínimo de `develop` exigindo PR, checks gerais e `develop-policy`, bloqueando push direto, force push e deleção sem restringir as branches de origem; confirmar proteção ativa antes de usar `develop` como fonte confiável do workflow de publicação.

## 4. Publicação da release

- [ ] 4.1 Criar `.github/workflows/release.yml` com `workflow_dispatch` e input obrigatório `version`.
- [ ] 4.2 Restringir operacionalmente o dispatch ao ref `develop`, falhando antes de efeitos remotos quando outro ref for selecionado.
- [ ] 4.3 Serializar publicações com um único grupo de `concurrency`, `queue: max` e sem `cancel-in-progress: true`.
- [ ] 4.4 Criar job `resolve/validate` com somente `contents: read` e `pull-requests: read`.
- [ ] 4.5 No job read-only, resolver de forma inequívoca a PR merged same-repo `release/X.Y.Z -> master`, o commit exato liberado e a PR merged same-repo `release/X.Y.Z -> develop` de back-merge.
- [ ] 4.6 Antes de qualquer publicação, validar que o back-merge está concluído, que o estado atual de `develop` contém o bloco fechado `X.Y.Z` idêntico ao commit liberado, mantém uma única seção `Em andamento` válida e possui manifests coordenados em `X.Y.Z`.
- [ ] 4.7 Quando houver predecessora, revalidar sua tag/GitHub Release consistente também durante a publicação atual, não apenas no `release-check` pré-merge.
- [ ] 4.8 Validar no job read-only reachability, checkout explícito do commit liberado, versão coordenada, changelog, release notes e estado atual de tag/release.
- [ ] 4.9 Garantir que scripts do commit liberado sejam executados somente no job read-only e nunca com `contents: write`.
- [ ] 4.10 Produzir no job read-only somente evidências/outputs diagnósticos que possam ser comparados depois, sem tratá-los como fonte de verdade privilegiada.
- [ ] 4.11 Criar job `publish` dependente do sucesso de `resolve/validate`, com `contents: write` e somente permissões adicionais estritamente necessárias.
- [ ] 4.12 No job privilegiado, re-resolver independentemente PR/commit da release e do back-merge e reobter versão/changelog/release notes por lógica confiável do workflow, sem executar scripts do commit liberado.
- [ ] 4.13 Revalidar no job privilegiado estado atual de `develop`, predecessora quando existir, reachability, tag e GitHub Release imediatamente antes da escrita.
- [ ] 4.14 Comparar os dados rederivados no job privilegiado com a evidência read-only e falhar em qualquer divergência.
- [ ] 4.15 Tratar dados vindos do repositório como dados, evitando interpolação/eval em comandos; usar operações não executáveis como API GitHub, checkout sem scripts ou `git show` para leitura.
- [ ] 4.16 Verificar `vX.Y.Z`, distinguindo tag anotada de lightweight e dereferenciando até o commit esperado.
- [ ] 4.17 Criar tag anotada somente quando inexistente; reutilizar apenas tag anotada no commit correto; falhar para tag incompatível.
- [ ] 4.18 Criar GitHub Release com `tag_name` e nome `vX.Y.Z`, `draft=false`, `prerelease=false` e notas extraídas do changelog rederivado.
- [ ] 4.19 Tratar tag válida existente + release ausente como recuperação, criando somente a GitHub Release.
- [ ] 4.20 Quando a release já existir, validar tag, commit, nome, draft, prerelease e body antes de sucesso/no-op; falhar sem alteração para divergência.
- [ ] 4.21 Garantir que o job com `contents: write` não execute scripts arbitrários do checkout da release; usar apenas operações de publicação necessárias.

## 5. Fluxo operacional e back-merge

- [ ] 5.1 Manter `release/X.Y.Z` após o merge em `master` até concluir back-merge para `develop` e publicação.
- [ ] 5.2 Proibir novo delta funcional na release branch após o merge em `master`; permitir incorporar `develop` somente para reconciliar o retorno.
- [ ] 5.3 Padronizar PR `release/X.Y.Z -> develop` como caminho de retorno da preparação.
- [ ] 5.4 Fazer `develop-policy` rejeitar arquivos fora de `CHANGELOG.md`, `package.json`, `package-lock.json`, `packages/*/package.json` e `apps/*/package.json` no modo back-merge.
- [ ] 5.5 Comparar o bloco fechado `X.Y.Z` com o conteúdo do commit exato da release resolvido pelo histórico da PR, nunca com o HEAD corrente de `master`.
- [ ] 5.6 Manter entradas pós-corte na nova seção `Em andamento` e recoordenar workspaces criados em `develop` após o corte sem perder dependências/metadados futuros.
- [ ] 5.7 Validar novamente versões/changelog e ausência de delta funcional novo antes do merge de retorno.
- [ ] 5.8 Garantir resolução explícita de conflitos sem force update de refs.
- [ ] 5.9 Na primeira implantação, garantir que `release.yml` esteja em `develop` e que a proteção mínima de `develop`, incluindo `develop-policy`, esteja ativa antes do primeiro dispatch manual.
- [ ] 5.10 Bloquear a publicação no workflow enquanto o back-merge da mesma versão não estiver merged e o estado atual de `develop` não satisfizer as invariantes esperadas.
- [ ] 5.11 Bloquear início operacional da próxima release enquanto o estado anterior não estiver reconciliado em `develop` e publicado consistentemente.

## 6. Testes automatizados

- [ ] 6.1 Testar aceitação de `X.Y.Z` estável e rejeição de prerelease/build metadata.
- [ ] 6.2 Testar branch divergente e working tree suja, confirmando falha antes de qualquer escrita.
- [ ] 6.3 Testar bootstrap local com alvo igual/maior à versão atual e rejeição de downgrade sem acesso à API GitHub.
- [ ] 6.4 Testar rejeição pré-integração de tag/release já existente para a própria versão alvo em release inicial e subsequente.
- [ ] 6.5 Testar bootstrap remoto sem predecessora com outro artefato `vA.B.C` incompatível com ausência de histórico e retry pós-integração com tag alvo correta.
- [ ] 6.6 Testar maior SemVer fechada, predecessora, data fechada inválida, duplicidade, ordem inválida e estados inválidos de `Em andamento`.
- [ ] 6.7 Testar renomeação do placeholder para patch/minor/major preservando conteúdo.
- [ ] 6.8 Testar data em `America/Sao_Paulo`, inclusive processo em outra timezone e fronteira de mudança de dia.
- [ ] 6.9 Testar falhas de preflight, staging, lockfile e aplicação final sem estado parcial.
- [ ] 6.10 Testar versionamento coordenado e ausência de atualização externa não relacionada no lockfile.
- [ ] 6.11 Testar extração e comparação normalizada das release notes.
- [ ] 6.12 Testar resolução independente do commit da predecessora e rejeitar tag/release que divirjam das invariantes completas esperadas.
- [ ] 6.13 Testar PR para `master` com branch/version mismatch, fork com branch `release/*` e PR same-repo válida.
- [ ] 6.14 Testar comportamento distinto em `push` pós-merge, sem aplicar regras dependentes de metadados da PR.
- [ ] 6.15 Validar estaticamente as permissões mínimas do `release-check`: `contents: read`, `pull-requests: read` e nenhuma escrita.
- [ ] 6.16 Testar `develop-policy` em PR comum: alteração de bloco fechado, mudança da versão coordenada, workspace novo com versão divergente e changelog inválido devem falhar; mudança comum válida deve passar.
- [ ] 6.17 Testar `develop-policy` no back-merge, incluindo comparação contra o commit exato liberado mesmo se `master` tiver avançado.
- [ ] 6.18 Testar resolução por `merge_commit_sha` com `master` avançado e falha para commit não alcançável/ambíguo.
- [ ] 6.19 Testar publicação antes do back-merge, back-merge ausente/ambíguo e `develop` divergente; todos devem falhar sem criar tag/release.
- [ ] 6.20 Testar revalidação da predecessora na publicação quando ela for removida/divergir após o `release-check` pré-merge.
- [ ] 6.21 Testar tag inexistente, anotada correta, lightweight e anotada em outro commit.
- [ ] 6.22 Testar recuperação tag válida + release ausente.
- [ ] 6.23 Testar release existente consistente e divergências em nome, draft, prerelease, tag, commit ou body.
- [ ] 6.24 Validar `queue: max`, ausência de `cancel-in-progress: true` e rejeição operacional de dispatch em ref diferente de `develop`.
- [ ] 6.25 Validar separação de privilégios: job read-only executa validações/scripts; job write rederiva dados por lógica confiável e não executa scripts arbitrários do commit liberado.
- [ ] 6.26 Testar adulteração/divergência dos outputs do job read-only e confirmar que o job privilegiado detecta a diferença pela rederivação independente.
- [ ] 6.27 Testar mudança concorrente de `develop`, predecessora, tag/release entre os jobs e confirmar revalidação/falha segura no job de publicação.
- [ ] 6.28 Testar back-merge com novas entradas de changelog após o corte e com workspace novo, preservando metadados futuros.

## 7. Documentação e governança operacional

- [ ] 7.1 Criar `docs/release-process.md` com pré-condições, bootstrap local/remoto, escolha de versão, preparação, CI, branches, rulesets, back-merge, publicação e recuperação.
- [ ] 7.2 Documentar claramente o que é responsabilidade humana e o que é responsabilidade da automação.
- [ ] 7.3 Documentar que `release:prepare` é local/offline quanto à API GitHub e que validações remotas ocorrem no `release-check`/publicação.
- [ ] 7.4 Documentar `0.0.1` apenas como contexto da primeira implantação atual.
- [ ] 7.5 Documentar que o fluxo inicial não suporta prerelease/build metadata, `hotfix/*` nem releases vindas de forks.
- [ ] 7.6 Documentar padrão de branch/tag `release/X.Y.Z`/`vX.Y.Z`, coerência entre nome da branch e versão preparada, timezone/formato do changelog e definição da última versão fechada/predecessora.
- [ ] 7.7 Documentar guardas locais de `release:prepare`: branch `release/X.Y.Z` e working tree limpa.
- [ ] 7.8 Documentar política de `master`, same-repo head, ausência de artefato da versão alvo antes do merge, permissões mínimas do `release-check`, comportamento distinto entre `pull_request` e `push` e sequência inicial para ativar o check como required.
- [ ] 7.9 Documentar proteção mínima de `develop` e invariantes de `develop-policy` para PR comum e back-merge.
- [ ] 7.10 Documentar que comparações do back-merge usam o commit exato resolvido da release, não o HEAD de `master`, além do bloco fechado imutável, workspaces novos e retenção da branch.
- [ ] 7.11 Documentar que `Publicar release` exige back-merge concluído e estado atual de `develop` consistente antes de qualquer tag/release.
- [ ] 7.12 Documentar separação de privilégios do workflow, rederivação independente no job write e revalidação de `develop`, predecessora e estado remoto antes da mutação.
- [ ] 7.13 Documentar resolução independente do commit atual/predecessora, tags anotadas, GitHub Release e recuperação idempotente.
- [ ] 7.14 Adicionar ao `README.md` resumo do processo e link para `docs/release-process.md`.
- [ ] 7.15 Adicionar em `AGENTS.md` referência operacional curta para agentes, apontando para `docs/release-process.md` sem duplicar o procedimento.
- [ ] 7.16 Revisar `openspec/config.yaml`; adicionar apenas orientação release-specific que seja útil a futuras changes e não duplique a documentação. Registrar no PR se nenhuma mudança for necessária.

## 8. Validação final

- [ ] 8.1 Executar os checks oficiais do projeto conforme `AGENTS.md`/`docs/quality.md`, incluindo `npm run test:e2e` antes do commit final.
- [ ] 8.2 Formatar todos os arquivos alterados e confirmar `npm run format` sem falhas.
- [ ] 8.3 Executar validação OpenSpec estrita da change e de todas as specs com o CLI multiplataforma adotado.
- [ ] 8.4 Revisar o fluxo completo de bootstrap, integração, proteção de `develop`, ativação do ruleset de `master`, back-merge obrigatório, publicação e próxima release sem efetuar publicação real indevida.
- [ ] 8.5 Revisar cenários de recuperação e confirmar que nenhum detalhe puramente operacional foi reintroduzido como requisito permanente da capability.
