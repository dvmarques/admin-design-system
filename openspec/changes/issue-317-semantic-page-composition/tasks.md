# Tarefas — #317

- [x] 1. Auditar AdsTypography/Surface/Card/AdminShell, Demo/Storybook, base develop e conflitos; registrar decisão crítica e API mínima.
- [x] 2. Criar/validar proposal, design, specs e tasks; revisar acessibilidade, ausência de AdsSection e compatibilidade antes de implementar.
- [x] 3. Implementar AdsPageHeader sem estado, estilos existentes/tokenizados, export e tipos públicos; adicionar testes de slots, SSR/hidratação, headings, foco e tema.
- [x] 4. Registrar novo export no catálogo e referência, regenerar snippets pela fonte TSX, produzir story autodocs e documentação de uso.
- [x] 5. Implementar os três exemplos independentes no Admin Demo (consulta/filtros/tabela, formulário/validação, dashboard/cards) e stories correspondentes; manter um H1 por página.
- [x] 6a. (automação) Cobrir interação, axe, responsividade 320/390/768/desktop, reflow equivalente a zoom 200% (viewport 195px), temas claro/escuro e regressão E2E/unitária conforme `e2e/page-composition.spec.ts` e testes do componente; não aceitar snapshots automaticamente.
- [ ] 6b. (revisão humana) Leitor de tela NVDA/VoiceOver, zoom **nativo** 200% no navegador e aprovação visual das capturas da auditoria — depende de revisão humana do Daniel; sem evidência nesta sessão.
- [x] 7. Atualizar CHANGELOG e índice de componentes, medir impacto da API/estilos/distribuição e documentar riscos e alternativas.
- [x] 8. Formatar arquivos alterados; executar npm run format, lint, build, typecheck, test:quality, test:e2e e validação OpenSpec estrita; registrar resultados efetivos ou limitações sem marcar gates não executados.
- [x] 9. Revisar PR final e checks CI/Security/Pages no SHA real, corrigir falhas e conciliar checklist/evidências da issue #317. Sem merge, fechamento ou archive.

## Evidências verificadas (15/11/2026)

- A change foi aceita em `Política de develop` com `npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive`, no job da CI [#43722404330](https://github.com/dvmarques/admin-design-system/actions/runs/43722404330).
- O diff é aditivo; AdsTypography, AdsSurface, AdsCard e AdsAdminShell não foram alterados.
- PR [#326](https://github.com/dvmarques/admin-design-system/pull/326), sem merge. Novas rotas encontram-se no catálogo, sem mudar a sidebar nem os snapshots existentes.
- Orçamento de distribuição medido na CI: `components` JS/CSS publicado 304.271 bytes, gzip 91.461 bytes; limites reajustados a 305.000/92.000 bytes, demais limites preservados.
- `AdsPageHeader` incluído na matriz da auditoria visual com `review: Pendente` e planos para 320/390/768/1440; inclusão não equivale a captura/inspeção aprovada.
- Revisão manual de zoom nativo 200%, leitores de tela e aprovação das capturas novas permanece pendente (item 6b).

### Gates locais — R1 (agente, 15/11/2026)

| Comando                                                                    | Resultado                                                          |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `npm run lint`                                                             | exit 0                                                             |
| `npm run build`                                                            | exit 0                                                             |
| `npm run typecheck` (após build)                                           | exit 0                                                             |
| `npm run test:quality`                                                     | exit 0 (Vitest 86 files / 1582 tests; `test:ci` 131 pass, 18 skip) |
| `npx @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive` | exit 0 (70/70)                                                     |
| `npx playwright test e2e/page-composition.spec.ts`                         | exit 0, **11/11** (2 execuções consecutivas)                       |

**CI/Security/Pages — SHA `0cb82ff43aefc6810c658d021f58169710d716be`:** [CI #43728609693](https://github.com/dvmarques/admin-design-system/actions/runs/43728609693) success; [Security #43728609656](https://github.com/dvmarques/admin-design-system/actions/runs/43728609656) success; [Pages #43728609715](https://github.com/dvmarques/admin-design-system/actions/runs/43728609715) success.
