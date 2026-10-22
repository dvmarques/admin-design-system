---
name: adaptive-ai-workflow
description: Orquestra issues com OpenSpec adaptativo (Fast, Standard, Critical), implementação, validação, PR, CI e entrega para revisão humana.
---

# Adaptive AI Workflow

Siga sempre `AGENTS.md`, `openspec/config.yaml` e `docs/ai-development-workflow.md`. Esta skill não substitui comandos oficiais, aprovações humanas ou as skills geradas pelo OpenSpec.

1. Leia a issue e seus critérios de aceite; consulte changes ativas, mapa de contexto e dependências relevantes.
2. Classifique o risco pelo maior gatilho: **Fast** somente docs/mecânico sem alteração de comportamento; **Standard** para comportamento interno; **Critical** para API pública, tokens, CSS, arquitetura, acessibilidade transversal, segurança, licenças ou release. Registre perfil e justificativa no proposal.
3. Abra branch a partir de develop ou continue na branch da PR existente. Crie/atualize a change com os artefatos que o schema `spec-driven` exigir; Fast permite concisão, não omissão arbitrária. Use `openspec.cmd instructions` e `openspec.cmd validate <change> --strict`.
4. Revise planejamento e riscos; implemente cada task, valide e marque `[x]` somente quando houver evidência. Promova o perfil diante de novos riscos, ambiguidade ou falhas recorrentes.
5. Execute formatação, lint, build, typecheck, quality, E2E e validação OpenSpec conforme `AGENTS.md`; se não puder executar, registre como pendente e não declare aprovação. Verifique `npm run check:agent-skills` quando aplicável.
6. Abra PR para develop, com changelog quando aplicável, label, assignee, issue, change, evidência de testes e riscos. Mantenha Draft durante a implementação; após validações locais, marque Ready for review para disparar a CI (Draft não executa CI). Ready não significa aprovação. Confira o SHA atual; checks skipped não comprovam E2E. Só use `Closes #N` quando todos os critérios de aceite estiverem satisfeitos; para vínculo sem fechamento, siga Development conforme AGENTS.md.
7. Confira CI e revisão, corrija findings, solicite code review. Não faça merge, archive nem feche issue sem os gates e a aprovação humana exigidos.

## Exemplos

- Fast: corrigir links de documentação, sem modificar contratos.
- Standard: corrigir comportamento interno de componente sem mudar API pública.
- Critical: alterar token semântico ou prop exportada, com validação de consumidores e compatibilidade.

Se faltar acesso a CI, ao checkout ou a ferramentas, descreva a limitação e entregue o próximo passo executável, sem simular execução.
