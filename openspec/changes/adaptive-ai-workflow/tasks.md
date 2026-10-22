## 1. Planejamento

- [x] 1.1 Definir matriz objetiva Fast / Standard / Critical e critérios de promoção.
- [x] 1.2 Especificar limites de simplificação sem alterar schema ou gates obrigatórios.

## 2. Implementação

- [x] 2.1 Criar guia com três exemplos completos e checkpoints.
- [x] 2.2 Criar skill reutilizável de orquestração, com passos Issue → PR → CI → code review.
- [x] 2.3 Integrar referência em AGENTS.md e instruções OpenSpec.
- [x] 2.4 Sincronizar skills próprias para Claude e verificar registro em skills-lock.json.

## 3. Revisão e validação

- [x] 3.1 Revisar critérios de classificação e consistência com políticas de release e agentes.
- [x] 3.2 Validar OpenSpec estrito, formatação, lint, build, tipos e check:agent-skills.
- [x] 3.3 Executar E2E completo antes de concluir, registrar evidência e corrigir falhas.
- [x] 3.4 Abrir PR para develop, verificar CI e encaminhar para code review.

## Evidências e limitações

- Skill canônica e cópia Claude com conteúdo idêntico, ambas registradas no lockfile para checagem de sincronia.
- Cenários Fast/Standard/Critical documentados com gatilhos de promoção e gates humanos.
- Validação local: OpenSpec 1.10.0 estrito (45 itens), format, lint, build de todos os workspaces, typecheck e test:quality passaram. Vitest: 49 arquivos e 690 testes aprovados; testes de release: 28; testes de CI: 7; check:agent-skills passou.
- Ensaio de instruções no Codex: link interno → Fast; estado vazio interno → Standard; token público → Critical; prop exportada promove Standard → Critical; duas tentativas sem progresso exigem diagnóstico/contexto ampliado; Draft precisa passar a Ready para executar CI. Os cinco casos foram conferidos contra guia, skill e spec. Não houve execução de Cursor/Claude nem medição de economia de tokens.
- E2E local foi tentado por `npm run validate`, mas o servidor Next.js foi bloqueado pelo ambiente (`uv_interface_addresses`, erro do sistema 1); downloads Playwright falharam nas fontes padrão e alternativa. Não é evidência de sucesso de E2E. A validação foi concluída no CI, conforme evidência abaixo.
- Atualização enviada para permitir validação no runner do GitHub; marcar Ready for review habilita CI e não aprova merge. Nenhum snapshot ou arquivo de runtime foi alterado.

- CI completo do commit `aafc6a17756d5c5e8c77c43b744034489575c4b3`: https://github.com/dvmarques/admin-design-system/actions/runs/39709414957. Qualidade, distribuição e política de develop aprovadas; E2E Chromium: 167 testes, Firefox: 10, WebKit: 10, todos aprovados. Apenas o job de release foi pulado, por não ser uma PR de release.
- Revisão final: guia/skill/spec consistentes, changelog em Unreleased, label enhancement e assignee dvmarques. Nenhum problema relevante de lógica ou segurança pendente; Spring não se aplica. PR #170 encaminhada à revisão humana, sem merge ou archive.
- O commit final apenas atualiza este registro de evidências e as tasks; não altera entradas de build/E2E. A execução completa acima permanece a evidência dos 187 testes de navegador; jobs pulados de execuções documentais posteriores não são contados como novos testes.
