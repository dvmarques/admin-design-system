## Problema e entrega

<!-- Descreva o resultado e o comportamento antes/depois. -->

## Escopo e referências

- Issue: <!-- Closes #N somente quando todos os critérios forem atendidos; caso parcial, vínculo manual em Development -->
- Change OpenSpec:
- Fora do escopo:
- Pacotes, APIs públicas e consumidores afetados:

## Evidências e riscos

<!-- Comandos e resultados reais, links de CI no SHA atual, limitações, compatibilidade e migrações. -->

## Verificação aplicável a qualquer PR

- [ ] Perfil Fast/Standard/Critical justificado e planejamento revisado.
- [ ] Critérios de aceite, testes e documentação verificados; diff revisado.
- [ ] `npm run validate` e `openspec.cmd validate --all --strict` executados, ou limitações justificadas.
- [ ] Acessibilidade, temas, responsividade, Storybook e consumidores revisados quando aplicável.
- [ ] CHANGELOG atualizado ou ausência de alteração registrável justificada.
- [ ] PR marcada Ready for review e CI efetivamente executada no SHA atual; skipped não equivale a sucesso.

## PR comum → develop (squash)

<!-- Preencher somente para PR sem label release. -->

- [ ] Tasks OpenSpec efetivamente concluídas, com evidências e revisão.
- [ ] Archive/sync autorizado realizado na branch desta PR, ou exceção técnica aprovada e documentada.
- [ ] Diff final de archive/specs revisado, verificações refeitas e CI verde no SHA final.
- [ ] Code review e autorização humana obtidos antes do squash.
- Exceção por integração prévia: N/A <!-- Ou registrar restrição concreta, evidências, tarefas dependentes e PR de acompanhamento. -->

## PR de release (merge commit)

<!-- Preencher SOMENTE para PR com label release. A seção de PR comum NÃO se aplica. -->

- [ ] Label `release`, assignee e destino corretos.
- [ ] Verificações específicas de release e back-merge atendidas.
- [ ] Revisão e autorização aplicáveis registradas; integrar por **merge commit**, nunca por squash.
- [Processo de release](https://github.com/dvmarques/admin-design-system/blob/develop/docs/release-process.md)

## Referências operacionais

- [Ciclo OpenSpec](https://github.com/dvmarques/admin-design-system/blob/develop/docs/openspec-lifecycle.md)
- [Regras do repositório](https://github.com/dvmarques/admin-design-system/blob/develop/AGENTS.md)
