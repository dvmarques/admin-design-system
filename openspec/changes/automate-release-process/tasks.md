## 1. Preparação de release

- [ ] 1.1 Criar `scripts/prepare-release.mjs` com três fases: preflight somente leitura, staging completa e aplicação final atômica.
- [ ] 1.2 Implementar bootstrap da primeira release: quando não houver versão fechada/tag `v*`/GitHub Release anterior, permitir como alvo a versão coordenada atual.
- [ ] 1.3 Após o bootstrap, validar que a versão coordenada atual corresponde à última versão fechada e que o alvo é SemVer estritamente superior.
- [ ] 1.4 Validar branch `release/X.Y.Z`, working tree limpa, exatamente uma seção `Em andamento`, ausência de conflito e consistência das versões atuais.
- [ ] 1.5 Permitir renomear a única seção `Em andamento` do placeholder para patch/minor/major escolhido, preservando conteúdo.
- [ ] 1.6 Fechar a seção escolhida usando data `dd-mmm-aaaa` em português e criar acima o próximo patch apenas como placeholder.
- [ ] 1.7 Atualizar de forma coordenada raiz, `packages/*`, `apps/*` e referências internas para `X.Y.Z`.
- [ ] 1.8 Adicionar `packageManager` com versão exata do npm ao projeto e garantir uso da mesma versão localmente e na CI.
- [ ] 1.9 Regenerar `package-lock.json` na staging sem atualizar dependências externas e validar o resultado com instalação reproduzível.
- [ ] 1.10 Aplicar as mudanças reais somente após staging completa; implementar rollback/restauração integral ou substituição atômica equivalente.
- [ ] 1.11 Expor o comando como `npm run release:prepare -- X.Y.Z`.

## 2. Extração e validação reutilizável

- [ ] 2.1 Criar `scripts/extract-release-notes.mjs` para extrair somente a seção fechada solicitada.
- [ ] 2.2 Criar validação reutilizável de consistência entre versão, manifests, dependências internas, lockfile e `CHANGELOG.md`.
- [ ] 2.3 Implementar comparação de release notes normalizando somente CRLF/LF e newline final.
- [ ] 2.4 Definir forma versionada e multiplataforma de disponibilizar OpenSpec no runner Linux e executar validação estrita sem `openspec.cmd`/instalação global.

## 3. CI e política de master

- [ ] 3.1 Integrar `release-check` ao workflow de PRs destinadas a `master` sem duplicar quality/build/E2E.
- [ ] 3.2 Para head `release/*`, validar versão coordenada, changelog, estrutura da preparação e OpenSpec estrito.
- [ ] 3.3 Para qualquer head que não seja `release/*`, fazer `release-check` falhar explicitamente informando que `master` aceita somente releases.
- [ ] 3.4 No bootstrap, não exigir publicação anterior.
- [ ] 3.5 Nas releases seguintes, validar que a última versão fechada anterior possui tag anotada e GitHub Release consistentes antes de permitir merge.
- [ ] 3.6 Configurar/documentar proteção ou ruleset de `master` exigindo `release-check` e demais checks necessários.

## 4. Publicação da release

- [ ] 4.1 Criar `.github/workflows/release.yml` com `workflow_dispatch`, input obrigatório `version`, permissões `contents: write` e `pull-requests: read`.
- [ ] 4.2 Adicionar `concurrency` único para publicação de releases, com `cancel-in-progress: false`.
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

- [ ] 5.1 Manter `release/X.Y.Z` após o merge em `master` até concluir sincronização com `develop`.
- [ ] 5.2 Padronizar PR `release/X.Y.Z -> develop` como único caminho de retorno pós-release.
- [ ] 5.3 Garantir resolução explícita de conflitos com mudanças posteriores em `develop` e proibir force update de refs.
- [ ] 5.4 Na primeira implantação, garantir que `release.yml` chegue à default branch `develop` antes do primeiro `workflow_dispatch` quando ainda não existir nela.
- [ ] 5.5 Documentar/validar que a branch de release só pode ser removida após o retorno para `develop`.
- [ ] 5.6 Documentar/validar que uma nova release não deve começar enquanto `develop` não contiver o estado pós-release anterior.

## 6. Testes

- [ ] 6.1 Testar bootstrap sem release anterior usando a versão coordenada atual.
- [ ] 6.2 Testar rejeição de downgrade/mesma versão após existir release fechada e aceitação de SemVer superior.
- [ ] 6.3 Testar branch `release/X.Y.Z`, working tree limpa e estados inválidos do changelog.
- [ ] 6.4 Testar renomeação do placeholder para patch/minor/major preservando conteúdo.
- [ ] 6.5 Testar data em português, fechamento da versão e criação do próximo placeholder.
- [ ] 6.6 Testar falha de preflight antes de qualquer escrita.
- [ ] 6.7 Testar falha durante lockfile/staging e durante aplicação final, comprovando restauração integral.
- [ ] 6.8 Testar versionamento coordenado e uso da versão exata de npm na geração/validação do lockfile.
- [ ] 6.9 Testar extração e comparação normalizada das release notes.
- [ ] 6.10 Testar que PR não-release para `master` falha no `release-check`.
- [ ] 6.11 Testar bootstrap sem publicação anterior e bloqueio da próxima release quando a anterior não estiver publicada consistentemente.
- [ ] 6.12 Testar resolução por `merge_commit_sha` para métodos de merge suportados e com `master` avançado.
- [ ] 6.13 Testar falha quando o commit liberado não estiver mais alcançável em `master`.
- [ ] 6.14 Testar tag inexistente, anotada correta, lightweight e anotada em outro commit.
- [ ] 6.15 Testar recuperação tag válida + release ausente.
- [ ] 6.16 Testar release existente consistente e divergências em nome, draft, prerelease, tag, commit ou body.
- [ ] 6.17 Testar/validar serialização de publicações pelo grupo de concurrency.
- [ ] 6.18 Testar/validar o fluxo de PR `release/X.Y.Z -> develop` e a preservação de mudanças concorrentes em `develop`.

## 7. Documentação

- [ ] 7.1 Criar `docs/release-process.md` com bootstrap, escolha de versão, preparação transacional, toolchain, CI, política exclusiva de `master`, serialização, publicação e recuperação.
- [ ] 7.2 Documentar o ciclo normativo `develop -> release/X.Y.Z -> master` e retorno `release/X.Y.Z -> develop` antes de remover a branch.
- [ ] 7.3 Explicar que `0.0.1` é apenas contexto da primeira implantação atual, não regra permanente.
- [ ] 7.4 Documentar required checks/ruleset de `master` e que `hotfix/*` não faz parte do fluxo inicial.
- [ ] 7.5 Documentar `merge_commit_sha`, reachability em `master`, checkout explícito, tags anotadas e recuperação idempotente.
- [ ] 7.6 Documentar os metadados exigidos da GitHub Release e a normalização permitida no body.
- [ ] 7.7 Adicionar ao `README.md` resumo do processo e link para `docs/release-process.md`.

## 8. Validação final

- [ ] 8.1 Executar suíte de testes e checks existentes do projeto.
- [ ] 8.2 Executar validação OpenSpec estrita da change e de todas as specs com o CLI multiplataforma adotado.
- [ ] 8.3 Revisar fluxo de bootstrap `0.0.1`, publicação, retorno para `develop` e release seguinte sem efetuar publicação real indevida.
- [ ] 8.4 Revisar cenários de falha/recuperação: atomicidade local, release anterior ausente, publicação concorrente, commit não alcançável, lightweight tag e release preexistente divergente.
