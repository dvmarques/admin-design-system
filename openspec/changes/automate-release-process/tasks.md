## 1. Preparação de release

- [ ] 1.1 Criar `scripts/prepare-release.mjs` com validação de SemVer e do estado do `CHANGELOG.md`.
- [ ] 1.2 Fechar a seção `X.Y.Z - Em andamento` usando data `dd-mmm-aaaa` em português.
- [ ] 1.3 Criar acima a próxima seção patch `X.Y.(Z+1) - Em andamento`.
- [ ] 1.4 Atualizar a versão canônica no `package.json` raiz e regenerar o lockfile quando aplicável.
- [ ] 1.5 Expor o comando como `npm run release:prepare -- X.Y.Z`.

## 2. Extração e validação

- [ ] 2.1 Criar `scripts/extract-release-notes.mjs` para extrair somente a seção fechada da versão solicitada.
- [ ] 2.2 Adicionar validação de consistência entre `package.json` raiz e `CHANGELOG.md`.
- [ ] 2.3 Integrar as validações de release à CI antes do merge em `master`.
- [ ] 2.4 Garantir execução de `npm run validate` e `openspec.cmd validate --all --strict` no fluxo aplicável.

## 3. Publicação da release

- [ ] 3.1 Criar `.github/workflows/release.yml` com `workflow_dispatch` e input obrigatório `version`.
- [ ] 3.2 Validar que a versão informada corresponde ao commit/estado atual de `master`.
- [ ] 3.3 Validar que a seção da versão está fechada no changelog e que as release notes podem ser extraídas.
- [ ] 3.4 Verificar no remoto que `vX.Y.Z` ainda não existe e falhar sem sobrescrever tags.
- [ ] 3.5 Criar e enviar tag anotada `vX.Y.Z` apontando para o commit validado em `master`.
- [ ] 3.6 Criar a GitHub Release `vX.Y.Z` usando somente as notas extraídas do `CHANGELOG.md`.
- [ ] 3.7 Tratar de forma segura o caso em que a tag foi criada, mas a criação da GitHub Release falhou.

## 4. Testes

- [ ] 4.1 Testar parsing e validação de SemVer.
- [ ] 4.2 Testar formato de data em português.
- [ ] 4.3 Testar fechamento da versão e criação da próxima seção `Em andamento`.
- [ ] 4.4 Testar falha com zero ou múltiplas seções `Em andamento` quando o estado não for válido.
- [ ] 4.5 Testar extração isolada das release notes.
- [ ] 4.6 Testar prevenção de publicação quando a tag já existir.

## 5. Documentação

- [ ] 5.1 Criar `docs/release-process.md` com pré-condições, passo a passo e recuperação de falhas.
- [ ] 5.2 Documentar claramente no arquivo dedicado o que é responsabilidade do mantenedor e o que é executado automaticamente.
- [ ] 5.3 Adicionar ao `README.md` um resumo do processo de release e link para `docs/release-process.md`.

## 6. Validação final

- [ ] 6.1 Executar a suíte de testes e validações do projeto.
- [ ] 6.2 Executar `openspec.cmd validate automate-release-process --strict`.
- [ ] 6.3 Revisar o fluxo completo em cenário de preparação, PR, merge e publicação manual sem efetuar uma release real indevida.
