## Why
A documentação vigente diverge dos workflows de CI, do comando `validate`, do inventário cross-browser e dos modos de build do admin demo.

## What Changes
- Reconciliar matriz normativa de CI e Pages para Draft/Ready, PR develop/master e push com impacto docs/scoped/full.
- Documentar skips versus execução efetiva e atualização Linux de snapshots.
- Corrigir checklist `test:quality`, inventário E2E e contrato do demo SSR/export estático.
- Harmonizar specs e registrar em CHANGELOG.md.

## Scope
Documentação e OpenSpec apenas. Sem mudanças de APIs públicas, runtime, workflows, snapshots PNG ou dependências. Biblioteca e demo mantêm o comportamento atual. A medição pós-merge continua na #164; registros históricos na #197 e adoção por consumidores na #198.
