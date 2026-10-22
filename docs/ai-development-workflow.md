# Fluxo adaptativo de desenvolvimento com IA

Esta política complementa `AGENTS.md` e `openspec/config.yaml`; **não** modifica o schema `spec-driven`, os comandos oficiais, nem as exigências de E2E, format, lint, build, tipos, acessibilidade ou revisão.

## Escolha de perfil (maior risco prevalece)

| Perfil | Critérios objetivos | Profundidade de trabalho |
| --- | --- | --- |
| **Fast** | Apenas documentação interna, ajustes mecânicos ou refatoração estritamente localizada **sem** alterar contratos, runtime, estilos públicos ou testes de comportamento | Proposta e tarefas concisas; artefatos exigidos pelo schema continuam obrigatórios. Registrar ausência de delta comportamental quando aplicável. |
| **Standard** | Bug reproduzível ou componente/funcionalidade interna sem mudança de API pública, tema ou arquitetura | Especificar comportamento observável, cenários, testes e consumidores impactados. |
| **Critical** | API pública, exports, tokens, CSS distribuído, acessibilidade transversal, segurança, licenças, arquitetura, compatibilidade, release ou mudança de múltiplos pacotes | Análise de alternativas, compatibilidade, consumidores, riscos, rollback e revisão independente. |

**Promoção:** classifique como Critical diante de qualquer gatilho Critical; de Fast para Standard ao identificar mudança de comportamento; de Standard para Critical ao identificar impacto público. Duas tentativas sem progresso, testes flakey não explicados ou requisitos ambíguos exigem reavaliar risco, ampliar contexto e registrar decisão; não autorizam pular gates.

## Sequência reutilizável

1. **Issue:** confirmar escopo, critérios de aceite, dependências, labels e responsável; não presumir que a issue já está pronta.
2. **Contexto:** ler `AGENTS.md`, `docs/agent-context-map.md` e somente arquivos relevantes. Consultar changes ativas com `openspec.cmd list`.
3. **Branch:** criar branch a partir de `develop`, sem alterar arquivos não relacionados.
4. **OpenSpec:** escolher perfil, registrar justificativa em `proposal.md`, criar artefatos exigidos pelo schema usando `openspec.cmd instructions` e validar com `openspec.cmd validate <change> --strict`.
5. **Revisão de planejamento:** conferir cenários, dependências, compatibilidade, acessibilidade e tarefas verificáveis antes de codificar.
6. **Implementação:** executar tarefas em incrementos; marcar `[x]` somente com evidência, atualizar specs/design quando decisões mudarem.
7. **Verificação:** rodar comandos oficiais do repositório, incluindo `npm run format`, `npm run lint`, `npm run build`, `npm run typecheck`, `npm run test:quality`, `npm run test:e2e` e `openspec.cmd validate --all --strict`; `npm run check:agent-skills` se houver skills. Logs curtos por padrão; não tratar checks pulados como aprovação.
8. **PR:** registrar issue e change, resumo, testes com links para execução, riscos e pendências; usar `develop` como base. Para PR não-release, squash; usar `Closes #N` apenas quando o aceite estiver concluído. Se houver pendências, usar vínculo sem fechamento e manter Draft quando necessário.
9. **CI e revisão:** conferir jobs executados e conclusão real, corrigir falhas, pedir code review e **aguardar aprovação humana para merge**. Arquivar change apenas após tasks e gates concluídos.

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

## Checklist de revisão

- [ ] Perfil e justificativa documentados; gatilhos Critical verificados.
- [ ] Regras obrigatórias de AGENTS.md e config.yaml preservadas.
- [ ] OpenSpec válido, tasks e critérios de aceite alinhados.
- [ ] Evidência real de testes e CI; jobs pulados destacados.
- [ ] PR com issue, changelog quando aplicável, label, responsável e riscos.
- [ ] Nenhum merge, fechamento de issue ou archive prematuro.
