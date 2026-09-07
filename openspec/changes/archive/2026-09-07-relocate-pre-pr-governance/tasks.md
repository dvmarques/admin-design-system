## 1. Orientações operacionais

- [x] 1.1 Atualizar `AGENTS.md` com as regras de execução pré-PR, incluindo E2E, snapshots, seletores estáveis e modos conciso e verboso; verificar que as instruções não descrevem APIs públicas nem duplicam requisitos de specs.
- [x] 1.2 Revisar `openspec/config.yaml` para concentrar os requisitos de tasks e apply relativos à validação pré-PR; verificar que novas changes recebem orientação de E2E, snapshots e diagnóstico verboso.
- [x] 1.3 Ajustar `docs/quality.md` como referência humana única para checklist e comandos de validação; verificar que os comandos documentados correspondem aos scripts raiz atuais.

## 2. Organização dos specs

- [x] 2.1 Remover `openspec/specs/pre-pr-validation/spec.md` conforme a delta de retirada da capability; verificar que o histórico arquivado de `strengthen-pre-pr-validation` permanece intacto.
- [x] 2.2 Confirmar que `openspec/specs/quality-assurance/spec.md` preserva o requisito de validação obrigatória com E2E; verificar que nenhum detalhe operacional foi migrado para o spec.

## 3. Validação final

- [x] 3.1 Executar `npx.cmd prettier --write` nos arquivos alterados e `npm run format`; verificar que a formatação do repositório passa.
- [x] 3.2 Executar `npm run test:e2e` e confirmar que a suíte não falha antes do commit; atualizar snapshots somente se houver mudança visual intencional.
- [x] 3.3 Executar `openspec.cmd validate --all --strict`; verificar que a retirada da capability e os specs restantes são válidos.
