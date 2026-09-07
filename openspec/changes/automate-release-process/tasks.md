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
- [ ] 2.4 No bootstrap remoto, detectar tag/GitHub Release órfã no padrão `vX.Y.Z` e falhar sem exigir essa consulta de `release:prepare` local.
- [ ] 2.5 Criar um resolvedor reutilizável do commit efetivamente integrado de uma versão e usá-lo tanto para a release atual quanto para a predecessora.
- [ ] 2.6 Validar a predecessora comparando tag anotada e GitHub Release contra o commit esperado resolvido independentemente, sem usar a própria tag como fonte de verdade.
- [ ] 2.7 Implementar comparação de release notes normalizando somente CRLF/LF e newline final.

## 3. CI e política operacional de master

- [ ] 3.1 Integrar um `release-check` à CI sem duplicar quality/build/E2E já existentes.
- [ ] 3.2 Em PR para `master`, exigir head no padrão estável `release/X.Y.Z`, derivar a versão da branch e validar que ela coincide com manifests/changelog preparados.
- [ ] 3.3 Exigir que a PR de release tenha `head.repo.full_name == github.repository`; rejeitar forks mesmo que possuam branch homônima `release/*`.
- [ ] 3.4 Em PR `release/* -> master` válida, executar a validação reutilizável da preparação, bootstrap remoto/predecessora e changelog.
- [ ] 3.5 Para qualquer head não-release ou release de origem inválida em PR para `master`, fazer `release-check` falhar explicitamente.
- [ ] 3.6 Garantir que a política baseada em metadados de PR seja aplicada somente a `pull_request` para `master` e não quebre execuções de `push` pós-merge.
- [ ] 3.7 Definir forma versionada e multiplataforma de disponibilizar OpenSpec no runner Linux e executar validação estrita sem depender de `openspec.cmd`/instalação global.
- [ ] 3.8 Na primeira implantação, abrir a PR de release e confirmar que `release-check` já executou/apareceu antes de configurá-lo como required check.
- [ ] 3.9 Configurar/documentar ruleset de `master` exigindo PR, `release-check` e demais checks necessários e bloqueando push direto, force push e deleção; confirmar proteção ativa antes do primeiro merge e manter bypass no menor escopo necessário.

## 4. Publicação da release

- [ ] 4.1 Criar `.github/workflows/release.yml` com `workflow_dispatch` e input obrigatório `version`.
- [ ] 4.2 Declarar permissões mínimas necessárias, incluindo `contents: write` e `pull-requests: read`.
- [ ] 4.3 Restringir operacionalmente o dispatch ao ref `develop`, falhando antes de efeitos remotos quando outro ref for selecionado.
- [ ] 4.4 Serializar publicações com um único grupo de `concurrency`, `queue: max` e sem `cancel-in-progress: true`.
- [ ] 4.5 Resolver de forma inequívoca a PR merged same-repo `release/X.Y.Z -> master` e obter o `merge_commit_sha` efetivamente integrado.
- [ ] 4.6 Validar que o commit resolvido continua alcançável a partir de `master` e fazer checkout explícito dele.
- [ ] 4.7 Validar versão coordenada, seção fechada e release notes no commit liberado.
- [ ] 4.8 Verificar `vX.Y.Z`, distinguindo tag anotada de lightweight e dereferenciando até o commit.
- [ ] 4.9 Criar tag anotada somente quando inexistente; reutilizar apenas tag anotada no commit correto; falhar para tag incompatível.
- [ ] 4.10 Criar GitHub Release com `tag_name` e nome `vX.Y.Z`, `draft=false`, `prerelease=false` e notas extraídas do changelog.
- [ ] 4.11 Tratar tag válida existente + release ausente como recuperação, criando somente a GitHub Release.
- [ ] 4.12 Quando a release já existir, validar tag, commit, nome, draft, prerelease e body antes de sucesso/no-op; falhar sem alteração para divergência.

## 5. Fluxo operacional e back-merge

- [ ] 5.1 Manter `release/X.Y.Z` após o merge em `master` até concluir back-merge para `develop` e publicação.
- [ ] 5.2 Proibir novo delta funcional na release branch após o merge em `master`; permitir incorporar `develop` somente para reconciliar o retorno.
- [ ] 5.3 Padronizar PR `release/X.Y.Z -> develop` como caminho de retorno da preparação.
- [ ] 5.4 Validar que o diff de retorno fique restrito a `CHANGELOG.md`, `package.json`, `package-lock.json`, `packages/*/package.json` e `apps/*/package.json`.
- [ ] 5.5 Preservar o bloco fechado `X.Y.Z` idêntico ao liberado em `master` e manter entradas pós-corte na nova seção `Em andamento`.
- [ ] 5.6 Recoordenar workspaces criados em `develop` após o corte sem perder dependências/metadados futuros.
- [ ] 5.7 Validar novamente versões/changelog e ausência de delta funcional novo antes do merge de retorno.
- [ ] 5.8 Garantir resolução explícita de conflitos sem force update de refs.
- [ ] 5.9 Na primeira implantação, garantir que `release.yml` esteja em `develop` antes do primeiro dispatch manual.
- [ ] 5.10 Bloquear início operacional da próxima release enquanto o estado anterior não estiver reconciliado em `develop` e publicado consistentemente.

## 6. Testes automatizados

- [ ] 6.1 Testar aceitação de `X.Y.Z` estável e rejeição de prerelease/build metadata.
- [ ] 6.2 Testar branch divergente e working tree suja, confirmando falha antes de qualquer escrita.
- [ ] 6.3 Testar bootstrap local com alvo igual/maior à versão atual e rejeição de downgrade sem acesso à API GitHub.
- [ ] 6.4 Testar validação remota de bootstrap com tag/GitHub Release órfã no padrão `vX.Y.Z` e confirmar que artefatos fora desse padrão não interferem.
- [ ] 6.5 Testar maior SemVer fechada, predecessora, data fechada inválida, duplicidade, ordem inválida e estados inválidos de `Em andamento`.
- [ ] 6.6 Testar renomeação do placeholder para patch/minor/major preservando conteúdo.
- [ ] 6.7 Testar data em `America/Sao_Paulo`, inclusive processo em outra timezone e fronteira de mudança de dia.
- [ ] 6.8 Testar falhas de preflight, staging, lockfile e aplicação final sem estado parcial.
- [ ] 6.9 Testar versionamento coordenado e ausência de atualização externa não relacionada no lockfile.
- [ ] 6.10 Testar extração e comparação normalizada das release notes.
- [ ] 6.11 Testar resolução independente do commit da predecessora e rejeitar caso a tag aponte para commit diferente do esperado.
- [ ] 6.12 Testar PR para `master` com branch/version mismatch, fork com branch `release/*` e PR same-repo válida.
- [ ] 6.13 Testar comportamento distinto em `push` pós-merge, sem aplicar regras dependentes de metadados da PR.
- [ ] 6.14 Testar resolução por `merge_commit_sha` com `master` avançado e falha para commit não alcançável/ambíguo.
- [ ] 6.15 Testar tag inexistente, anotada correta, lightweight e anotada em outro commit.
- [ ] 6.16 Testar recuperação tag válida + release ausente.
- [ ] 6.17 Testar release existente consistente e divergências em nome, draft, prerelease, tag, commit ou body.
- [ ] 6.18 Validar `queue: max`, ausência de `cancel-in-progress: true` e rejeição operacional de dispatch em ref diferente de `develop`.
- [ ] 6.19 Testar back-merge com novas entradas de changelog após o corte.
- [ ] 6.20 Testar back-merge com workspace novo após o corte, preservando metadados futuros.
- [ ] 6.21 Testar rejeição de delta funcional/arquivo fora do escopo permitido no PR de retorno.

## 7. Documentação e governança operacional

- [ ] 7.1 Criar `docs/release-process.md` com pré-condições, bootstrap local/remoto, escolha de versão, preparação, CI, branches, ruleset, back-merge, publicação e recuperação.
- [ ] 7.2 Documentar claramente o que é responsabilidade humana e o que é responsabilidade da automação.
- [ ] 7.3 Documentar que `release:prepare` é local/offline quanto à API GitHub e que validações remotas ocorrem no `release-check`/publicação.
- [ ] 7.4 Documentar `0.0.1` apenas como contexto da primeira implantação atual.
- [ ] 7.5 Documentar que o fluxo inicial não suporta prerelease/build metadata, `hotfix/*` nem releases vindas de forks.
- [ ] 7.6 Documentar padrão de branch/tag `release/X.Y.Z`/`vX.Y.Z`, coerência entre nome da branch e versão preparada, timezone/formato do changelog e definição da última versão fechada/predecessora.
- [ ] 7.7 Documentar guardas locais de `release:prepare`: branch `release/X.Y.Z` e working tree limpa.
- [ ] 7.8 Documentar política de `master`, same-repo head, comportamento distinto entre `pull_request` e `push` e sequência inicial para ativar `release-check` como required antes do primeiro merge.
- [ ] 7.9 Documentar back-merge, bloco fechado imutável, workspaces novos e retenção da branch.
- [ ] 7.10 Documentar resolução independente do commit atual/predecessora, tags anotadas, GitHub Release e recuperação idempotente.
- [ ] 7.11 Adicionar ao `README.md` resumo do processo e link para `docs/release-process.md`.
- [ ] 7.12 Adicionar em `AGENTS.md` referência operacional curta para agentes, apontando para `docs/release-process.md` sem duplicar o procedimento.
- [ ] 7.13 Revisar `openspec/config.yaml`; adicionar apenas orientação release-specific que seja útil a futuras changes e não duplique a documentação. Registrar no PR se nenhuma mudança for necessária.

## 8. Validação final

- [ ] 8.1 Executar os checks oficiais do projeto conforme `AGENTS.md`/`docs/quality.md`, incluindo `npm run test:e2e` antes do commit final.
- [ ] 8.2 Formatar todos os arquivos alterados e confirmar `npm run format` sem falhas.
- [ ] 8.3 Executar validação OpenSpec estrita da change e de todas as specs com o CLI multiplataforma adotado.
- [ ] 8.4 Revisar o fluxo completo de bootstrap, integração, ativação do ruleset, back-merge, publicação e próxima release sem efetuar publicação real indevida.
- [ ] 8.5 Revisar cenários de recuperação e confirmar que nenhum detalhe puramente operacional foi reintroduzido como requisito permanente da capability.
