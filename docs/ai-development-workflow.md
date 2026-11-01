# Fluxo adaptativo de desenvolvimento com IA

Esta política complementa `AGENTS.md` e `openspec/config.yaml`; **não** modifica o schema `spec-driven`, os comandos oficiais, nem as exigências de E2E, format, lint, build, tipos, acessibilidade ou revisão.

## Escolha de perfil (maior risco prevalece)

| Perfil       | Critérios objetivos                                                                                                                                                   | Profundidade de trabalho                                                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Fast**     | Apenas documentação interna, ajustes mecânicos ou refatoração estritamente localizada **sem** alterar contratos, runtime, estilos públicos ou testes de comportamento | Proposta e tarefas concisas; artefatos exigidos pelo schema continuam obrigatórios. Registrar ausência de delta comportamental quando aplicável. |
| **Standard** | Bug reproduzível ou componente/funcionalidade interna sem mudança de API pública, tema ou arquitetura                                                                 | Especificar comportamento observável, cenários, testes e consumidores impactados.                                                                |
| **Critical** | API pública, exports, tokens, CSS distribuído, acessibilidade transversal, segurança, licenças, arquitetura, compatibilidade, release ou mudança de múltiplos pacotes | Análise de alternativas, compatibilidade, consumidores, riscos, rollback e revisão independente.                                                 |

**Promoção:** classifique como Critical diante de qualquer gatilho Critical; de Fast para Standard ao identificar mudança de comportamento; de Standard para Critical ao identificar impacto público. Duas tentativas sem progresso, testes flakey não explicados ou requisitos ambíguos exigem reavaliar risco, ampliar contexto e registrar decisão; não autorizam pular gates.

## Sequência reutilizável

1. **Issue:** confirmar escopo, critérios de aceite, dependências, labels e responsável; não presumir que a issue já está pronta.
2. **Contexto:** ler `AGENTS.md`, `docs/agent-context-map.md` e somente arquivos relevantes. Consultar changes ativas com `openspec.cmd list`.
3. **Branch:** criar branch a partir de `develop`; ao continuar uma PR, usar sua branch existente. Preservar arquivos não relacionados.
4. **OpenSpec:** escolher perfil, registrar justificativa em `proposal.md`, criar artefatos exigidos pelo schema usando `openspec.cmd instructions` e validar com `openspec.cmd validate <change> --strict`.
5. **Revisão de planejamento:** conferir cenários, dependências, compatibilidade, acessibilidade e tarefas verificáveis antes de codificar.
6. **Implementação:** executar tarefas em incrementos; marcar `[x]` somente com evidência, atualizar specs/design quando decisões mudarem.
7. **Verificação:** rodar comandos oficiais do repositório, incluindo `npm run format`, `npm run lint`, `npm run build`, `npm run typecheck`, `npm run test:quality`, `npm run test:e2e` e `openspec.cmd validate --all --strict`; `npm run check:agent-skills` se houver skills. Logs curtos por padrão; não tratar checks pulados como aprovação.
8. **PR:** registrar issue e change, resumo, testes com links para execução, riscos e pendências; usar `develop` como base. Para PR não-release, squash; usar `Closes #N` apenas quando o aceite estiver concluído. Durante a implementação, manter Draft. Quando a implementação e as validações locais estiverem concluídas, marcar Ready for review para disparar a CI: PRs em Draft não a executam. Ready habilita validação e revisão; não significa aprovação ou autorização de merge. Se houver critérios de aceite pendentes, não usar palavra-chave de fechamento; seguir a política de vínculo em Development de `AGENTS.md`.
9. **CI e revisão:** conferir jobs executados e conclusão real no SHA atual, corrigir falhas, pedir code review e **aguardar aprovação humana para merge**. Arquivar change apenas após tasks e gates concluídos.

## Conclusão da change

Siga [ciclo OpenSpec](openspec-lifecycle.md): para PR comum, apenas após todas as tasks verificáveis concluídas, revisão e autorização cabíveis, sincronizar specs e arquivar na própria branch da PR; revisar e validar novamente o diff, confirmar CI verde no SHA final e aguardar autorização humana para squash. Exceção de integração prévia exige restrição técnica documentada e aprovação; releases preservam o procedimento separado de [release-process.md](release-process.md). Não introduzir archive/merge administrativo como tarefa da change.

## Exemplos de classificação

### Fast — corrigir documentação de instalação

- Arquivos: `docs/integration.md` e links de README; sem alterar APIs ou comandos de build.
- Artefatos: proposta curta, design justificando ausência de mudança arquitetural, tasks e specs apenas se houver requisito observável real exigido pelo schema.
- Evidência: links revisados, OpenSpec validado, format/lint/build/tipos/quality/E2E conforme política; PR documental pode ter E2E pulado por `docs_only`, o que **não** comprova execução. Registrar run válido quando exigido.

### Standard — corrigir estado vazio de componente interno

- Arquivos: componente, teste unitário e story; API pública permanece igual.
- Artefatos: cenários de estado vazio, foco/ARIA e temas aplicáveis; testes unitários e Storybook.
- Evidência: consumo e E2E, além das verificações gerais.
- **Promoção:** se for necessário alterar prop exportada, passa a Critical.

### Critical — alterar token de cor semântico público

- Arquivos: `packages/tokens`, estilos de `packages/components` e consumidores.
- Artefatos: contratos anteriores e novos, compatibilidade, acessibilidade WCAG 2.2 AA, temas, CSS distribuído, alternativas e migração.
- Evidência: geração de tokens, snapshots visuais revisados, apps consumidores, E2E, validação completa e revisão humana.

## Ensaio reproduzível dos perfis

Em Codex, Cursor ou Claude Code, invoque a skill `adaptive-ai-workflow` com cada entrada abaixo e peça somente classificação e planejamento, sem editar arquivos. Compare a resposta com o resultado esperado; não é necessário implementar uma mudança fictícia. Registre ferramenta, entrada, perfil, justificativa, promoção e gates observados. Este ensaio valida instruções; não comprova execução de testes nem redução de tokens.

| Entrada do ensaio                                                   | Resultado esperado                                                                      | Checkpoint                                                                            |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Corrigir um link interno em docs, sem alterar comandos ou contratos | Fast; artefatos concisos exigidos pelo schema                                           | Preservar OpenSpec e todas as validações obrigatórias                                 |
| Corrigir estado vazio de componente interno, preservando API        | Standard; cenários observáveis e testes de estado vazio                                 | Se surgir alteração de prop exportada, promover para Critical                         |
| Alterar token semântico público de cor                              | Critical; consumidores, contraste, compatibilidade e rollback                           | Exigir revisão aprofundada e aprovação humana para merge                              |
| Após duas tentativas, a correção interna continua falhando          | Reavaliar risco, registrar hipótese e ampliar contexto/modelo conforme `docs/models.md` | Não repetir sem diagnóstico nem pular gates                                           |
| Implementação e testes locais concluídos, PR ainda em Draft         | Marcar Ready for review e conferir CI no SHA atual                                      | Falha ou job pulado não comprova validação; merge continua sujeito à aprovação humana |

## Checklist de revisão

- [ ] Perfil e justificativa documentados; gatilhos Critical verificados.
- [ ] Regras obrigatórias de AGENTS.md e config.yaml preservadas.
- [ ] OpenSpec válido, tasks e critérios de aceite alinhados.
- [ ] Evidência real de testes e CI; jobs pulados destacados.
- [ ] PR com issue, changelog quando aplicável, label, responsável e riscos.
- [ ] Nenhum merge, fechamento de issue ou archive prematuro.
