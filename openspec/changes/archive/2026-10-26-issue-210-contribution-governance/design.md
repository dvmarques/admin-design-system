## Context

Admin DS integra PRs comuns em develop por squash, mas releases com label release usam merge commit e back-merge próprio. O repositório Riffando serve de referência para templates e ciclo de archive, mas copiar suas regras literalmente apagaria essa distinção e as políticas já maduras do Admin DS.

## Goals / Non-Goals

Facilitar contribuições e tornar explícitos gates auditáveis. Não alterar software, releases, permissões de GitHub nem automações existentes.

## Decisions

1. Formulários YAML separados para as labels já existentes bug/enhancement/documentation. Alternativa: issue em texto livre, rejeitada pela inconsistência dos relatos.
2. CONTRIBUTING como porta de entrada; AGENTS fonte das regras, config para artefatos, lifecycle para operação; evitar duplicações.
3. Archive com sync na branch de PR comum só depois de todas as tasks e revisão, com validação/CI final antes de squash. `openspec archive` sem `--skip-specs`, pois esta change possui delta spec a sincronizar. Exceção documentada para integração prévia indispensável; preservar procedimentos de release existentes. Alternativa: arquivar após o merge, rejeitada por exigir PR extra e deixar `develop` com change concluída ainda ativa.
4. Template de PR separa requisitos comuns de release. Perfil Standard por mudança de governança; não há impacto nos bundles, CSS, Server/Client Components, ARIA ou API pública.

## Risks / Mitigations

Divergência documental: referências cruzadas e revisão. Regras conflitantes sobre archive/release: precedência explícita de release-process e AGENTS. CI incompleta pela impossibilidade de execução em Draft: registrar e validar ao marcar Ready.

## Migration

Novas issues/PRs seguem templates; não reformatar retroativamente issues ou PRs existentes. Sem rollback operacional, remover templates em PR revisada se necessário.
