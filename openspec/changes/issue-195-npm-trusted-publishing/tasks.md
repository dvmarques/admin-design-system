## 1. Planejamento

- [x] 1.1 Conferir #191, #192, #193, #194, #198, #267, #268, manifests e o workflow existente; preservar aprovação humana e publicação direta.
- [x] 1.2 Criar branch própria e change OpenSpec antes da implementação.
- [ ] 1.3 Validar a change com OpenSpec estrito e reconciliar qualquer regra divergente.

## 2. Implementação

- [ ] 2.1 Persistir os mesmos quatro tarballs do smoke externo, validar inventário, manifests e hashes.
- [ ] 2.2 Implementar registro npm, pré-verificação de identidade, publicação OIDC, reconsulta e recuperação idempotente.
- [ ] 2.3 Separar jobs: preflight/empacotamento (read-only), publicação npm (id-token), tag/release (contents write).
- [ ] 2.4 Atualizar contrato OpenSpec e CHANGELOG; documentar npm Trusted Publisher, bootstrap e recuperação.

## 3. Testes e entrega

- [ ] 3.1 Cobrir pacote privado/ausente, versão divergente, hash divergente, OIDC, dependência indisponível, publicação parcial e reexecução.
- [ ] 3.2 Executar `npm run validate` e OpenSpec estrito com Node/npm compatíveis; registrar evidências e limitações.
- [ ] 3.3 Rever segurança e abrir PR Draft em develop; aguardar validação CI, revisão e aprovação antes de merge.
- [ ] 3.4 **Após** aprovação explícita da primeira release (fora desta PR): configurar trusted publishers, publicar os quatro pacotes e testar Next.js externo pelo registry. Atualizar avisos pré-publicação somente depois.

## Não executado nesta change

- Nenhum `npm publish`, tag, GitHub Release ou seleção de versão inicial.
