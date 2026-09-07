## 1. Preparação de release

- [ ] 1.1 Criar `scripts/prepare-release.mjs` com validação de SemVer e duas fases lógicas: preflight sem escrita e aplicação das mudanças somente após sucesso completo.
- [ ] 1.2 Validar no preflight a branch `release/X.Y.Z`, working tree limpa, exatamente uma seção `Em andamento`, ausência de versão já fechada e consistência das versões atuais do monorepo.
- [ ] 1.3 Fechar a seção `X.Y.Z - Em andamento` usando data `dd-mmm-aaaa` em português.
- [ ] 1.4 Criar acima a próxima seção patch `X.Y.(Z+1) - Em andamento`.
- [ ] 1.5 Atualizar de forma coordenada para `X.Y.Z` o `package.json` raiz, todos os manifests de `packages/*` e `apps/*` e referências internas versionadas aplicáveis.
- [ ] 1.6 Regenerar `package-lock.json` sem atualizar dependências externas e validar que não restaram versões divergentes nos workspaces.
- [ ] 1.7 Expor o comando como `npm run release:prepare -- X.Y.Z`.

## 2. Extração e validação

- [ ] 2.1 Criar `scripts/extract-release-notes.mjs` para extrair somente a seção fechada da versão solicitada.
- [ ] 2.2 Criar validação reutilizável de consistência entre versão informada, manifesto raiz, manifests dos workspaces, dependências internas, lockfile e `CHANGELOG.md`.
- [ ] 2.3 Integrar um check específico de release à CI apenas para PRs `release/* -> master`, reutilizando os jobs atuais de qualidade, build e E2E em vez de duplicar `npm run validate`.
- [ ] 2.4 Definir forma reproduzível e versionada de disponibilizar o OpenSpec no runner Linux e executar a validação estrita com launcher multiplataforma, sem depender de `openspec.cmd` ou instalação global.
- [ ] 2.5 Garantir que a proteção/ruleset de `master` exija os checks necessários para bloquear merge de uma preparação de release inconsistente; documentar qualquer configuração manual necessária no GitHub.

## 3. Publicação da release

- [ ] 3.1 Criar `.github/workflows/release.yml` com `workflow_dispatch` e input obrigatório `version`.
- [ ] 3.2 Resolver de forma inequívoca a PR merged `release/X.Y.Z -> master` e obter o commit resultante efetivamente integrado.
- [ ] 3.3 Validar a versão coordenada e a seção fechada do changelog no commit resolvido da PR, sem assumir que o HEAD atual de `master` é o commit da release.
- [ ] 3.4 Extrair as release notes a partir do `CHANGELOG.md` do commit liberado.
- [ ] 3.5 Verificar o estado remoto de `vX.Y.Z`: criar somente se não existir; reutilizar somente se já apontar para o mesmo commit; falhar se apontar para outro commit.
- [ ] 3.6 Criar e enviar tag anotada `vX.Y.Z` apontando para o commit exato da PR quando a tag ainda não existir.
- [ ] 3.7 Criar a GitHub Release `vX.Y.Z` usando somente as notas extraídas do changelog daquele commit.
- [ ] 3.8 Tratar de forma idempotente o caso em que a tag foi criada, mas a GitHub Release falhou: preservar a tag e concluir somente a release na reexecução.
- [ ] 3.9 Detectar GitHub Release já existente e encerrar de forma explícita sem recriação silenciosa.

## 4. Testes

- [ ] 4.1 Testar parsing e validação de SemVer.
- [ ] 4.2 Testar validação da branch `release/X.Y.Z` e working tree limpa.
- [ ] 4.3 Testar formato de data em português.
- [ ] 4.4 Testar fechamento da versão e criação da próxima seção `Em andamento`.
- [ ] 4.5 Testar falha com zero ou múltiplas seções `Em andamento`, versão já fechada e divergência de versões entre workspaces.
- [ ] 4.6 Testar que falhas de preflight ocorrem antes de qualquer alteração produzida pelo script.
- [ ] 4.7 Testar atualização coordenada do manifesto raiz, workspaces, dependências internas e lockfile.
- [ ] 4.8 Testar extração isolada das release notes.
- [ ] 4.9 Testar resolução do commit exato da PR quando `master` já tiver avançado após o merge da release.
- [ ] 4.10 Testar tag inexistente, tag existente no mesmo commit, tag existente em outro commit e GitHub Release já existente.
- [ ] 4.11 Testar recuperação do cenário tag criada + GitHub Release ausente sem mover ou recriar a tag.

## 5. Documentação

- [ ] 5.1 Criar `docs/release-process.md` com pré-condições, passo a passo, checks obrigatórios e recuperação de falhas.
- [ ] 5.2 Documentar claramente no arquivo dedicado o que é responsabilidade do mantenedor e o que é executado automaticamente.
- [ ] 5.3 Explicar que a tag aponta para o commit exato integrado pela PR `release/X.Y.Z -> master`, mesmo que `master` tenha avançado.
- [ ] 5.4 Documentar a recuperação idempotente quando a tag existe no mesmo commit, mas a GitHub Release não existe.
- [ ] 5.5 Registrar a estratégia de versionamento coordenado do monorepo e a primeira release prevista `0.0.1`.
- [ ] 5.6 Adicionar ao `README.md` um resumo do processo de release e link para `docs/release-process.md`.

## 6. Validação final

- [ ] 6.1 Executar a suíte de testes e os checks existentes do projeto.
- [ ] 6.2 Executar a validação OpenSpec estrita da change e validar todas as specs com o CLI multiplataforma adotado.
- [ ] 6.3 Revisar o fluxo completo em cenário de preparação, PR, merge, avanço posterior de `master` e publicação manual sem efetuar uma release real indevida.
- [ ] 6.4 Revisar o cenário de recuperação após falha entre criação da tag e criação da GitHub Release.
