# Tarefas — #317

- [x] 1. Auditar AdsTypography/Surface/Card/AdminShell, Demo/Storybook, base develop e conflitos; registrar decisão crítica e API mínima.
- [x] 2. Criar/validar proposal, design, specs e tasks; revisar acessibilidade, ausência de AdsSection e compatibilidade antes de implementar.
- [x] 3. Implementar AdsPageHeader sem estado, estilos existentes/tokenizados, export e tipos públicos; adicionar testes de slots, SSR/hidratação, headings, foco e tema.
- [x] 4. Registrar novo export no catálogo e referência, regenerar snippets pela fonte TSX, produzir story autodocs e documentação de uso.
- [x] 5. Implementar os três exemplos independentes no Admin Demo (consulta/filtros/tabela, formulário/validação, dashboard/cards) e stories correspondentes; manter um H1 por página.
- [x] 6a. (automação) Cobrir interação, axe, responsividade 320/390/768/desktop, reflow equivalente a zoom 200% (viewport 195px), temas claro/escuro e regressão E2E/unitária conforme `e2e/page-composition.spec.ts` e testes do componente; não aceitar snapshots automaticamente.
- [x] 6b. (revisão humana) Leitor de tela NVDA/VoiceOver, zoom **nativo** 200% no navegador e aprovação visual das capturas da auditoria — aprovado pelo Daniel em 15/11/2026 (revisão humana).
- [x] 7. Atualizar CHANGELOG e índice de componentes, medir impacto da API/estilos/distribuição e documentar riscos e alternativas.
- [x] 8. Formatar arquivos alterados; executar npm run format, lint, build, typecheck, test:quality, test:e2e e validação OpenSpec estrita; registrar resultados efetivos ou limitações sem marcar gates não executados.
- [x] 9. Revisar PR final e checks CI/Security/Pages no SHA real, corrigir falhas e conciliar checklist/evidências da issue #317. Sem merge, fechamento ou archive.

## Evidências verificadas (15/11/2026)

- A change foi aceita em `Política de develop` com `npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive`, no job da CI [#43722404330](https://github.com/dvmarques/admin-design-system/actions/runs/43722404330).
- O diff é aditivo; AdsTypography, AdsSurface, AdsCard e AdsAdminShell não foram alterados.
- PR [#326](https://github.com/dvmarques/admin-design-system/pull/326), sem merge. Novas rotas encontram-se no catálogo, sem mudar a sidebar nem os snapshots existentes.
- Orçamento de distribuição medido na CI: `components` JS/CSS publicado 304.271 bytes, gzip 91.461 bytes; limites reajustados a 305.000/92.000 bytes, demais limites preservados.
- `AdsPageHeader` na matriz da auditoria visual com `review: Aprovado (Daniel, 15/11/2026)` após inspeção humana da change #317.
- Revisão humana do item 6b registrada com aprovação do Daniel em 15/11/2026.

### Gates locais — R1 (agente, 15/11/2026)

| Comando                                                                    | Resultado                                                          |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `npm run lint`                                                             | exit 0                                                             |
| `npm run build`                                                            | exit 0                                                             |
| `npm run typecheck` (após build)                                           | exit 0                                                             |
| `npm run test:quality`                                                     | exit 0 (Vitest 86 files / 1582 tests; `test:ci` 131 pass, 18 skip) |
| `npx @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive` | exit 0 (70/70)                                                     |
| `npx playwright test e2e/page-composition.spec.ts` (R1)                    | exit 0, **11/11** (2 execuções consecutivas)                       |

### Gates locais — R2 (agente, 15/11/2026)

| Comando                                                                    | Resultado                                                                |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `npm run format`, `lint`, `build`, `typecheck`, `test:quality`             | exit 0 (Vitest `test:ci` 131 pass, 18 skip; quality 70/70)               |
| `npx @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive` | exit 0 (70/70)                                                           |
| `npx playwright test e2e/page-composition.spec.ts`                         | exit 0, **17/17** (2 execuções; **12** cenários de reflow = 3×2×2 temas) |

**Último SHA com código (E2E reflow claro/escuro):** `89a8bd723ba76e8d32ff6fa6224ea75d258f1009`.

**CI/Security/Pages nesse SHA:** [CI #43731545901](https://github.com/dvmarques/admin-design-system/actions/runs/43731545901) success; [Security #43731545920](https://github.com/dvmarques/admin-design-system/actions/runs/43731545920) success; [Pages #43731545900](https://github.com/dvmarques/admin-design-system/actions/runs/43731545900) success.

### Gates locais — R3 (agente, 15/11/2026, review Daniel)

| Ação / comando                                                        | Resultado                                                                                  |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Revert `39dc790` (`git revert`, sem force push)                       | change `issue-317-semantic-page-composition` reativada; sync em `openspec/specs/` desfeito |
| `openspec validate --all --strict --no-interactive` + `openspec list` | exit 0 (70/70); change **ativa** (não arquivada — archive **pós-merge**)                   |
| Validador compartilhado `scripts/visual-audit-human-review.mjs`       | formato `Aprovado (revisor, DD/MM/AAAA)` com data válida; testes em `test:ci`              |
| `npm run format`, `lint`, `build`, `typecheck`, `test:quality`        | exit 0                                                                                     |
| `npx playwright test e2e/page-composition.spec.ts`                    | exit 0, **17/17**                                                                          |

**Último SHA com código (R3 — validadores + revert OpenSpec):** `5e9670e94698c5cb590336c6659db2e6ca1da408`.

**SHA com código de feature/E2E (inalterado na R3):** `89a8bd723ba76e8d32ff6fa6224ea75d258f1009`.

**CI/Security/Pages no SHA R3 `5e9670e`:** [CI #43737585537](https://github.com/dvmarques/admin-design-system/actions/runs/43737585537) success; [Security #43737585568](https://github.com/dvmarques/admin-design-system/actions/runs/43737585568) success; [Pages #43737585599](https://github.com/dvmarques/admin-design-system/actions/runs/43737585599) success.

**SHA final (HEAD):** `4dfdea33ef520e515dc728b17741b6724392d1cb` (este commit em `tasks.md`).

**CI/Security/Pages no HEAD:** [CI #43738235610](https://github.com/dvmarques/admin-design-system/actions/runs/43738235610) success; [Security #43738235633](https://github.com/dvmarques/admin-design-system/actions/runs/43738235633) success; [Pages #43738235620](https://github.com/dvmarques/admin-design-system/actions/runs/43738235620) success.

Archive/sync OpenSpec permanece **proibido** até merge autorizado (task 9).
