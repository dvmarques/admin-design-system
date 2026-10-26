# Ciclo de vida de changes OpenSpec

Este guia é operacional. As políticas obrigatórias estão em [AGENTS.md](../AGENTS.md), as regras de artefatos em [config.yaml](../openspec/config.yaml) e os perfis de risco em [ai-development-workflow.md](ai-development-workflow.md). Para releases, prevalece [release-process.md](release-process.md).

## Sequência para PR comum
1. **Issue e contexto:** confirmar critérios, dependências, riscos, perfil Fast/Standard/Critical, changes ativas e autorização do escopo.
2. **Branch em develop:** propor change com proposal/design/specs/tasks exigidos pelo schema. Revisar o planejamento antes de Apply.
3. **Apply e Verify:** executar tarefas verificáveis, atualizar evidências, testes, changelog e documentação. Rodar verificações oficiais e revisar o diff.
4. **PR e CI:** abrir PR para `develop`, tornar Ready após validação local (Draft não dispara CI automática), verificar checks efetivamente executados no SHA atual e obter code review.
5. **Encerramento da change:** após **todas** as tasks cumpridas e evidenciadas, revisão e autorizações aplicáveis, sincronizar specs e arquivar OpenSpec **na própria branch da PR**. O archive não substitui teste nem aprovação; não usar skip de specs para ocultar deltas válidos.
6. **Nova verificação:** revisar diff final incluindo archive/specs, executar validações pertinentes e confirmar CI verde no SHA final. Com revisão/aprovação humana e autorização de merge, integrar por **squash**.

As tarefas da change são entregas concluíveis **antes** do archive: código, documentação, testes e revisão verificável. Não criar tarefas de “executar archive”, “fazer merge” ou “fechar issue” no `tasks.md`: são gates e ações operacionais da PR; uma tarefa dependente de seu próprio archive cria um ciclo impossível.

## Comandos e checkpoints operacionais

Execute na raiz do repositório e use a CLI OpenSpec instalada no ambiente. No Windows, o comando `openspec.cmd` é o utilizado nas regras deste projeto; nos demais sistemas, use `openspec`. Os comandos abaixo **não autorizam** archive ou merge por si mesmos.

```sh
openspec list
openspec status --change <change-id>
openspec validate --all --strict
npm run format
npm run validate
```

Antes do archive: confira todas as tasks e evidências, complete revisões/CI exigidos, obtenha autorização e consulte as instruções da versão instalada:

```sh
openspec instructions archive --change <change-id>
openspec archive <change-id>
openspec validate --all --strict
npm run format
npm run validate
```

O comando `archive` sincroniza as specs por padrão no fluxo suportado; revise `openspec/specs` e `openspec/changes/archive` no diff. Se a CLI instalada divergir, consulte `openspec --help` e as instruções geradas em vez de presumir opções. Execute archive **na branch da PR comum**, não diretamente em `develop`. Faça commit das specs/archive, confira o SHA final e exija novo CI verde após tornar a PR Ready. O squash só ocorre com revisão humana e autorização; release segue outro fluxo. Não marque como concluídas verificações não executadas.

## Exceção — dependência real de integração prévia
Somente se uma validação/delivery depender concretamente de código já integrado, documentar na PR e no design a restrição, evidência, tarefas pendentes, base de destino e PR de acompanhamento, com aprovação específica **antes** da integração. Integrar a PR comum por squash mantendo a change ativa; realizar e comprovar tarefas restantes; só então sincronizar e arquivar em PR de acompanhamento, também sujeita a revisão, CI e squash. Conveniência não é exceção. Nunca arquivar tasks incompletas.

## Release não é PR comum
Releases `release/X.Y.Z → master` e back-merges `release/X.Y.Z → develop` recebem label `release` e assignee responsável, usam **merge commit** e mantêm as condições próprias de publicação, proteção e versionamento. Não usar instruções de squash/Closes da PR comum em releases. Consulte sempre [release-process.md](release-process.md).

## Retomada e diagnósticos
Em nova sessão/agente: ler AGENTS.md, mapa de contexto, issue e PR, identificar branch/head SHA, conferir `openspec list`, change e tasks, validar logs e checks reais. Corrigir falhas antes de marcar tarefas como feitas. Omitir uma validação deve ser declarado explicitamente com causa; skipped não significa sucesso.
