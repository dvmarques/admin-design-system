## 1. Preparação de release

- [ ] 1.1 Criar `scripts/prepare-release.mjs` com validação de SemVer e três fases lógicas: preflight sem escrita, staging completa e aplicação final atômica.
- [ ] 1.2 Validar no preflight a branch `release/X.Y.Z`, working tree limpa, exatamente uma seção `Em andamento`, ausência de conflito para `X.Y.Z`, consistência das versões atuais do monorepo e que `X.Y.Z` é superior à última release fechada.
- [ ] 1.3 Permitir que a única seção `Em andamento` seja renomeada do placeholder atual para a versão SemVer escolhida pelo mantenedor, preservando seu conteúdo.
- [ ] 1.4 Fechar a seção escolhida usando data `dd-mmm-aaaa` em português.
- [ ] 1.5 Criar acima a próxima seção patch `X.Y.(Z+1) - Em andamento` apenas como placeholder.
- [ ] 1.6 Atualizar de forma coordenada para `X.Y.Z` o `package.json` raiz, todos os manifests de `packages/*` e `apps/*` e referências internas versionadas aplicáveis.
- [ ] 1.7 Regenerar `package-lock.json` sem atualizar dependências externas dentro da fase de staging e validar que não restaram versões divergentes nos workspaces.
- [ ] 1.8 Aplicar as mudanças reais somente após staging completa; implementar restauração/rollback ou substituição atômica para impedir estado parcial se a aplicação final falhar.
- [ ] 1.9 Expor o comando como `npm run release:prepare -- X.Y.Z`.

## 2. Extração e validação

- [ ] 2.1 Criar `scripts/extract-release-notes.mjs` para extrair somente a seção fechada da versão solicitada.
- [ ] 2.2 Criar validação reutilizável de consistência entre versão informada, manifesto raiz, manifests dos workspaces, dependências internas, lockfile e `CHANGELOG.md`.
- [ ] 2.3 Integrar um job/check `release-check` ao workflow de PRs para `master`, reutilizando os jobs atuais de qualidade, build e E2E em vez de duplicar `npm run validate`.
- [ ] 2.4 Fazer `release-check` executar as validações específicas somente quando `github.head_ref` começar por `release/` e concluir com sucesso nas demais PRs para `master`, permitindo configurá-lo como required check sem estados pendentes.
- [ ] 2.5 Definir forma reproduzível e versionada de disponibilizar o OpenSpec no runner Linux e executar a validação estrita com launcher multiplataforma, sem depender de `openspec.cmd` ou instalação global.
- [ ] 2.6 Garantir que a proteção/ruleset de `master` exija os checks necessários para bloquear merge de uma preparação de release inconsistente; documentar qualquer configuração manual necessária no GitHub.

## 3. Publicação da release

- [ ] 3.1 Criar `.github/workflows/release.yml` com `workflow_dispatch`, input obrigatório `version` e permissões mínimas explícitas `contents: write` e `pull-requests: read`.
- [ ] 3.2 Resolver de forma inequívoca a PR merged `release/X.Y.Z -> master` e usar seu `merge_commit_sha` como commit efetivamente liberado.
- [ ] 3.3 Validar a versão coordenada e a seção fechada do changelog no `merge_commit_sha`, sem assumir que o HEAD atual de `master` é o commit da release.
- [ ] 3.4 Extrair as release notes a partir do `CHANGELOG.md` do commit liberado.
- [ ] 3.5 Verificar o estado remoto de `vX.Y.Z`, distinguindo tag anotada de lightweight tag e dereferenciando a tag anotada até o commit alvo.
- [ ] 3.6 Criar e enviar tag anotada `vX.Y.Z` no `merge_commit_sha` somente se a tag não existir.
- [ ] 3.7 Reutilizar tag existente somente se for anotada e dereferenciar exatamente para o commit liberado; falhar sem alteração para lightweight tag ou commit divergente.
- [ ] 3.8 Criar a GitHub Release `vX.Y.Z` usando somente as notas extraídas do changelog daquele commit.
- [ ] 3.9 Tratar de forma idempotente o caso tag válida criada + GitHub Release ausente, preservando a tag e concluindo somente a release.
- [ ] 3.10 Quando a GitHub Release já existir, validar tag, commit e corpo das notas antes de concluir como sucesso/no-op; falhar sem alteração se qualquer item divergir.

## 4. Sincronização pós-release

- [ ] 4.1 Definir e documentar o mecanismo para sincronizar as alterações da release de volta para `develop` após o merge em `master`, preferencialmente por PR/merge sem force update de refs.
- [ ] 4.2 Garantir que a sincronização preserve mudanças que tenham entrado em `develop` após a criação da branch de release e exija resolução explícita de conflitos quando necessário.
- [ ] 4.3 Validar/documentar que uma nova branch `release/*` não deve ser criada enquanto `develop` não contiver o estado pós-release anterior.

## 5. Testes

- [ ] 5.1 Testar parsing e validação de SemVer, incluindo rejeição de versão não superior à última release fechada.
- [ ] 5.2 Testar validação da branch `release/X.Y.Z` e working tree limpa.
- [ ] 5.3 Testar renomeação do placeholder `Em andamento` para uma versão major/minor/patch escolhida, preservando o conteúdo.
- [ ] 5.4 Testar formato de data em português e fechamento da versão.
- [ ] 5.5 Testar criação da próxima seção patch apenas como placeholder.
- [ ] 5.6 Testar falha com zero ou múltiplas seções `Em andamento`, versão conflitante e divergência de versões entre workspaces.
- [ ] 5.7 Testar que falhas de preflight ocorrem antes de qualquer alteração produzida pelo script.
- [ ] 5.8 Testar falha durante geração do lockfile/staging e durante aplicação final, confirmando restauração integral do estado anterior.
- [ ] 5.9 Testar atualização coordenada do manifesto raiz, workspaces, dependências internas e lockfile.
- [ ] 5.10 Testar extração isolada das release notes.
- [ ] 5.11 Testar resolução pelo `merge_commit_sha` quando `master` já tiver avançado após o merge da release e para métodos de merge suportados pelo repositório.
- [ ] 5.12 Testar tag inexistente, tag anotada no mesmo commit, lightweight tag e tag anotada em outro commit.
- [ ] 5.13 Testar recuperação do cenário tag válida criada + GitHub Release ausente sem mover ou recriar a tag.
- [ ] 5.14 Testar GitHub Release existente consistente como sucesso/no-op e release existente com tag, commit ou notas divergentes como falha.
- [ ] 5.15 Testar/validar que `release-check` termina com sucesso em PRs comuns para `master` e executa validação específica em `release/*`.

## 6. Documentação

- [ ] 6.1 Criar `docs/release-process.md` com pré-condições, escolha de versão, passo a passo, checks obrigatórios, sincronização com `develop` e recuperação de falhas.
- [ ] 6.2 Documentar claramente o que é responsabilidade do mantenedor e o que é executado automaticamente.
- [ ] 6.3 Explicar que o placeholder patch do changelog não limita a próxima SemVer escolhida.
- [ ] 6.4 Explicar que a tag aponta para o `merge_commit_sha` da PR `release/X.Y.Z -> master`, mesmo que `master` tenha avançado.
- [ ] 6.5 Documentar a diferença entre tag anotada e lightweight tag e a regra de dereference para recuperação segura.
- [ ] 6.6 Documentar o comportamento quando uma GitHub Release já existe e a necessidade de validar tag, commit e notas.
- [ ] 6.7 Registrar a estratégia de versionamento coordenado do monorepo e, como contexto inicial da implantação, a primeira release prevista `0.0.1`.
- [ ] 6.8 Adicionar ao `README.md` um resumo do processo de release e link para `docs/release-process.md`.

## 7. Validação final

- [ ] 7.1 Executar a suíte de testes e os checks existentes do projeto.
- [ ] 7.2 Executar a validação OpenSpec estrita da change e validar todas as specs com o CLI multiplataforma adotado.
- [ ] 7.3 Revisar o fluxo completo em cenário de preparação com bump patch e major/minor, PR, merge, avanço posterior de `master`, sincronização de volta a `develop` e publicação manual sem efetuar uma release real indevida.
- [ ] 7.4 Revisar os cenários de recuperação após falha entre criação da tag e GitHub Release, lightweight tag conflitante e GitHub Release preexistente divergente.
