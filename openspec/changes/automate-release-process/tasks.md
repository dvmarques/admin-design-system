## 1. Preparação de release

- [ ] 1.1 Criar `scripts/prepare-release.mjs` com três fases: preflight somente leitura, staging completa e aplicação final atômica.
- [ ] 1.2 Implementar bootstrap da primeira release: sem versão fechada/tag `v*`/GitHub Release anterior, permitir alvo SemVer maior ou igual à versão coordenada atual e rejeitar downgrade.
- [ ] 1.3 Definir a última versão fechada como a maior SemVer entre as seções fechadas do changelog, excluindo `Em andamento`.
- [ ] 1.4 Definir a release anterior ao alvo como a maior SemVer fechada estritamente menor que `X.Y.Z`.
- [ ] 1.5 Validar unicidade e ordem SemVer decrescente das versões fechadas do changelog.
- [ ] 1.6 Após o bootstrap, validar que a versão coordenada atual corresponde à última versão fechada antes da preparação e que o alvo é SemVer estritamente superior.
- [ ] 1.7 Validar branch `release/X.Y.Z`, working tree limpa, exatamente uma seção `Em andamento`, ausência de conflito e consistência das versões atuais.
- [ ] 1.8 Permitir renomear a única seção `Em andamento` do placeholder para patch/minor/major escolhido, preservando conteúdo.
- [ ] 1.9 Fechar a seção escolhida usando data `dd-mmm-aaaa` em português e criar acima o próximo patch apenas como placeholder.
- [ ] 1.10 Atualizar de forma coordenada raiz, `packages/*`, `apps/*` e referências internas para `X.Y.Z`.
- [ ] 1.11 Adicionar `packageManager` com versão exata do npm ao projeto e garantir uso da mesma versão localmente e na CI.
- [ ] 1.12 Regenerar `package-lock.json` na staging sem atualizar dependências externas e validar o resultado com instalação reproduzível.
- [ ] 1.13 Aplicar as mudanças reais somente após staging completa; implementar rollback/restauração integral ou substituição atômica equivalente.
- [ ] 1.14 Expor o comando como `npm run release:prepare -- X.Y.Z`.

## 2. Extração e validação reutilizável

- [ ] 2.1 Criar `scripts/extract-release-notes.mjs` para extrair somente a seção fechada solicitada.
- [ ] 2.2 Criar validação reutilizável de consistência entre versão, manifests, dependências internas, lockfile e `CHANGELOG.md`.
- [ ] 2.3 Reutilizar a mesma lógica de parsing para determinar maior versão fechada, predecessora do alvo, detectar duplicidades e validar ordem SemVer decrescente.
- [ ] 2.4 Implementar comparação de release notes normalizando somente CRLF/LF e newline final.
- [ ] 2.5 Definir forma versionada e multiplataforma de disponibilizar OpenSpec no runner Linux e executar validação estrita sem `openspec.cmd`/instalação global.

## 3. CI e proteção de master

- [ ] 3.1 Integrar `release-check` ao workflow de PRs destinadas a `master` sem duplicar quality/build/E2E.
- [ ] 3.2 Aplicar a política de origem de branch somente quando `github.event_name == pull_request` e a base for `master`.
- [ ] 3.3 Para head `release/*`, validar versão coordenada, changelog, estrutura da preparação e OpenSpec estrito.
- [ ] 3.4 Para qualquer head não-`release/*` em PR para `master`, fazer `release-check` falhar explicitamente.
- [ ] 3.5 Garantir que execuções de `push` em `master` não falhem por ausência/uso indevido de `github.head_ref`; manter apenas checks aplicáveis ao evento.
- [ ] 3.6 No bootstrap, não exigir publicação anterior.
- [ ] 3.7 Nas releases seguintes, determinar a predecessora como a maior SemVer fechada menor que o alvo e validar que ela possui tag anotada e GitHub Release consistentes antes de permitir merge.
- [ ] 3.8 Configurar/documentar proteção ou ruleset de `master` exigindo pull request e os required checks definidos.
- [ ] 3.9 Configurar/documentar bloqueio de push direto, force push e deleção de `master`, mantendo eventual bypass administrativo no menor escopo possível e documentado.

## 4. Publicação da release

- [ ] 4.1 Criar `.github/workflows/release.yml` com `workflow_dispatch`, input obrigatório `version`, permissões `contents: write` e `pull-requests: read`.
- [ ] 4.2 Adicionar `concurrency` com grupo único de publicação e `queue: max`, sem `cancel-in-progress: true`.
- [ ] 4.3 Resolver de forma inequívoca a PR merged `release/X.Y.Z -> master` e obter seu `merge_commit_sha`.
- [ ] 4.4 Validar que o `merge_commit_sha` continua alcançável a partir do `master` atual.
- [ ] 4.5 Fazer checkout explícito do `merge_commit_sha` antes de validar manifests, changelog e release notes.
- [ ] 4.6 Validar versão coordenada e seção fechada no commit liberado.
- [ ] 4.7 Verificar `vX.Y.Z`, distinguindo tag anotada de lightweight e dereferenciando tag anotada até o commit.
- [ ] 4.8 Criar tag anotada `vX.Y.Z` somente se não existir; reutilizar apenas tag anotada no commit correto; falhar para lightweight ou commit divergente.
- [ ] 4.9 Criar GitHub Release com `tag_name = vX.Y.Z`, nome `vX.Y.Z`, `draft=false`, `prerelease=false` e notas extraídas do changelog.
- [ ] 4.10 Tratar tag válida existente + release ausente como recuperação, criando somente a release.
- [ ] 4.11 Quando a release já existir, validar tag, commit, nome, draft, prerelease e body normalizado antes de sucesso/no-op; falhar sem alteração para divergência.

## 5. Sincronização pós-release

- [ ] 5.1 Manter `release/X.Y.Z` após o merge em `master` até concluir sincronização com `develop` e publicação da GitHub Release.
- [ ] 5.2 Congelar a branch após o merge em `master`, proibindo novas mudanças funcionais antes do retorno para `develop`.
- [ ] 5.3 Padronizar PR `release/X.Y.Z -> develop` como único caminho de retorno pós-release.
- [ ] 5.4 Validar que o PR de retorno altera somente `CHANGELOG.md`, `package.json`, `package-lock.json`, `packages/*/package.json` e `apps/*/package.json`.
- [ ] 5.5 Garantir que diferenças nesses arquivos além do estado já integrado em `master` se limitem à resolução necessária de conflitos do back-merge.
- [ ] 5.6 Garantir resolução explícita de conflitos com mudanças posteriores em `develop` e proibir force update de refs.
- [ ] 5.7 Na primeira implantação, garantir que `release.yml` chegue à default branch `develop` antes do primeiro `workflow_dispatch`.
- [ ] 5.8 Documentar/validar que a branch de release só pode ser removida após back-merge e publicação concluídos.
- [ ] 5.9 Documentar/validar que uma nova release não deve começar enquanto `develop` não contiver o estado pós-release anterior e a versão anterior não estiver publicada consistentemente.

## 6. Testes

- [ ] 6.1 Testar bootstrap com alvo igual à versão coordenada atual e com alvo maior; rejeitar downgrade.
- [ ] 6.2 Testar determinação da maior SemVer fechada independentemente da posição textual, cálculo da predecessora do alvo e rejeição de versões fechadas duplicadas ou fora de ordem.
- [ ] 6.3 Testar rejeição de downgrade/mesma versão após existir release fechada e aceitação de SemVer superior.
- [ ] 6.4 Testar branch `release/X.Y.Z`, working tree limpa e estados inválidos do changelog.
- [ ] 6.5 Testar renomeação do placeholder para patch/minor/major preservando conteúdo.
- [ ] 6.6 Testar data em português, fechamento da versão e criação do próximo placeholder.
- [ ] 6.7 Testar falha de preflight antes de qualquer escrita.
- [ ] 6.8 Testar falha durante lockfile/staging e durante aplicação final, comprovando restauração integral.
- [ ] 6.9 Testar versionamento coordenado e uso da versão exata de npm na geração/validação do lockfile.
- [ ] 6.10 Testar extração e comparação normalizada das release notes.
- [ ] 6.11 Testar que PR não-release para `master` falha no `release-check`.
- [ ] 6.12 Testar que `push` pós-merge em `master` não aciona indevidamente a política baseada em head branch.
- [ ] 6.13 Testar bootstrap sem publicação anterior e bloqueio da próxima release quando a predecessora não estiver publicada consistentemente.
- [ ] 6.14 Testar resolução por `merge_commit_sha` para métodos de merge suportados e com `master` avançado.
- [ ] 6.15 Testar falha quando o commit liberado não estiver mais alcançável em `master`.
- [ ] 6.16 Testar tag inexistente, anotada correta, lightweight e anotada em outro commit.
- [ ] 6.17 Testar recuperação tag válida + release ausente.
- [ ] 6.18 Testar release existente consistente e divergências em nome, draft, prerelease, tag, commit ou body.
- [ ] 6.19 Testar/validar que múltiplos `workflow_dispatch` permanecem enfileirados pelo grupo com `queue: max` sem substituir execução pendente.
- [ ] 6.20 Testar/validar o fluxo `release/X.Y.Z -> develop`, incluindo rejeição de nova mudança funcional pós-merge, limite de arquivos permitidos e preservação de mudanças concorrentes em `develop`.
- [ ] 6.21 Testar/validar que a branch não é removida antes de back-merge e publicação concluídos.

## 7. Documentação

- [ ] 7.1 Criar `docs/release-process.md` com bootstrap, definição da última versão fechada e predecessora, escolha de versão, preparação transacional, toolchain, CI, proteção exclusiva de `master`, serialização, publicação e recuperação.
- [ ] 7.2 Documentar o ciclo normativo `develop -> release/X.Y.Z -> master`, retorno `release/X.Y.Z -> develop`, publicação e só então remoção da branch.
- [ ] 7.3 Explicar que `0.0.1` é apenas contexto da primeira implantação atual, não regra permanente.
- [ ] 7.4 Documentar required checks/ruleset de `master`, bloqueio de push direto/force push/deleção e que `hotfix/*` não faz parte do fluxo inicial.
- [ ] 7.5 Documentar que a política de origem de branch vale para `pull_request` a `master`, não para `push` pós-merge.
- [ ] 7.6 Documentar congelamento da release branch após merge em `master`, arquivos permitidos no PR de retorno e retenção da branch até a publicação.
- [ ] 7.7 Documentar `merge_commit_sha`, reachability em `master`, checkout explícito, tags anotadas e recuperação idempotente.
- [ ] 7.8 Documentar `concurrency` com grupo único e `queue: max`.
- [ ] 7.9 Documentar os metadados exigidos da GitHub Release e a normalização permitida no body.
- [ ] 7.10 Adicionar ao `README.md` resumo do processo e link para `docs/release-process.md`.

## 8. Validação final

- [ ] 8.1 Executar suíte de testes e checks existentes do projeto.
- [ ] 8.2 Executar validação OpenSpec estrita da change e de todas as specs com o CLI multiplataforma adotado.
- [ ] 8.3 Revisar fluxo de bootstrap `0.0.1`, back-merge congelado, publicação, remoção da branch e release seguinte sem efetuar publicação real indevida.
- [ ] 8.4 Revisar cenários de falha/recuperação: atomicidade local, changelog inválido, predecessora incorreta, push direto, release anterior ausente, publicação concorrente, commit não alcançável, lightweight tag e release preexistente divergente.
