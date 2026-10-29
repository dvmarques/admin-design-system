## 1. Reprodução e decisão de escopo

- [ ] 1.1 Construir teste que demonstre (ou descarte documentadamente) o problema de Tab e Shift+Tab nos dois extremos, para `AdsDialog`, `AdsDrawer` e `AdsConfirmDialog`.
- [ ] 1.2 Confirmar a navegação real com Playwright e registrar antes/depois; se não reproduzir, revisar issue, proposal, specs e tasks antes de alterar runtime.

## 2. Implementação condicionada à reprodução

- [ ] 2.1 Reutilizar um único helper interno de seleção elegível no foco inicial e no trap de Tab, sem mudar props ou exports.
- [ ] 2.2 Regressões: `fieldset disabled`, `hidden`, `display:none`, `visibility:hidden`, `inert`, lista vazia e mudanças de elegibilidade enquanto aberto.
- [ ] 2.3 Testar modais sobrepostos, popup portalled, `pending`, Escape hierárquico, retorno do foco e SSR/StrictMode.

## 3. Evidências e documentação

- [ ] 3.1 Alinhar spec e `docs/integration.md` se o comportamento observável mudar; atualizar exemplos Storybook/Admin Demo quando necessário e registrar decisão de não alterar caso não haja delta.
- [ ] 3.2 Registrar CHANGELOG [0.1.1] descrevendo somente alteração efetivamente entregue, ou justificar ausência de delta na PR.
- [ ] 3.3 Medir pacote JS/CSS (incluindo gzip), registrar diferenças e não elevar orçamento sem justificativa e revisão.

## 4. Gates antes de propor conclusão

- [ ] 4.1 Formatar arquivos alterados com `npx.cmd prettier --write`; executar e aprovar `npm run format`.
- [ ] 4.2 Executar `npm run validate` (format, lint, build, typecheck, quality e E2E), `openspec.cmd validate fix-234-overlay-tab-eligibility --strict` e `openspec.cmd validate --all --strict`, registrando logs, falhas e skipped.
- [ ] 4.3 Revisar impacto em consumidores, snapshots visuais apenas quando intencional e evidências de acessibilidade em navegadores suportados; manter tasks pendentes até validação real.
