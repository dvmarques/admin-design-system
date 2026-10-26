## Problema e entrega
<!-- O que muda e por quê? -->

## Escopo e referências
- Issue: <!-- Closes #N apenas com aceite integral; caso parcial, vínculo manual em Development -->
- Change OpenSpec:
- Fora do escopo:
- Pacotes/APIs públicas/consumidores impactados:

## Evidências e riscos
<!-- Testes executados com comandos, resultados e links de CI no SHA atual; riscos, migrações e limitações. -->

## Validação
- [ ] Planejamento OpenSpec revisado; perfil Fast/Standard/Critical justificado.
- [ ] Critérios de aceite atendidos; diff revisado, testes e documentação atualizados.
- [ ] `npm run validate` e `openspec.cmd validate --all --strict` executados quando aplicáveis; resultados ou limites registrados.
- [ ] Temas, responsividade, acessibilidade, Storybook, API pública e apps consumidores verificados quando aplicável.
- [ ] Changelog atualizado, ou ausência justificada.
- [ ] PR tornada Ready para disparar CI; jobs pulados/skip não tratados como sucesso.
- [ ] CI verificada no SHA atual antes da solicitação de code review.

## Conclusão de change (PR comum para develop)
- [ ] Todas as tasks OpenSpec efetivamente concluídas, com evidências.
- [ ] Archive/sync autorizados, aplicados nesta branch conforme [ciclo OpenSpec](../docs/openspec-lifecycle.md); ou exceção documentada e aprovada.
- [ ] Diff final das specs/archive revisado, validações reexecutadas e CI verde no SHA final.
- [ ] Revisão humana e autorização de merge obtidas; integrar PR comum em `develop` por squash.

**Exceção archive após integração:** N/A <!-- Ou: restrição técnica comprovada, tarefas dependentes, aprovação, branch e PR de acompanhamento. -->

## Releases
<!-- Somente se for PR de release: seguir docs/release-process.md, label release, assignee, merge commit. Não aplicar squash nem fechamento de issue de PR comum. -->
