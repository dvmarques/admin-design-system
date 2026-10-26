## Context
Admin DS integra PRs comuns em develop por squash, mas releases com label release usam merge commit e back-merge próprio. Riffando oferece referências úteis de templates e ciclo de archive; copiar suas regras literalmente quebraria esta distinção.

## Goals / Non-Goals
Facilitar contribuições e tornar explícitos gates auditáveis. Não alterar software, releases, permissões de GitHub nem automações existentes.

## Decisions
1. Formulários YAML separados para as labels já existentes bug/enhancement/documentation. Alternative: issue em texto livre; rejeitada pela inconsistência.
2. CONTRIBUTING como porta de entrada; AGENTS fonte das regras, config para artefatos, lifecycle para operação; evitar duplicações.
3. Archive com sync na branch de PR comum só depois de todas as tasks e revisão, com validação/CI final antes de squash. Exceção documentada para integração prévia indispensável; preservar procedimentos de release existentes.
4. Template de PR separa requisitos comuns de release. Perfil Standard por mudança de governança; não há impacto nos bundles, CSS, Server/Client Components, ARIA ou API pública.

## Risks / Mitigations
Divergência documental: referências cruzadas e revisão. Regras conflitantes sobre archive/release: precedência explícita de release-process e AGENTS. CI incompleta pela impossibilidade de execução em Draft: registrar e validar ao marcar Ready.

## Migration
Novas issues/PRs seguem templates; não reformatar retroativamente issues ou PRs existentes. Sem rollback operacional, remover templates em PR revisada se necessário.
