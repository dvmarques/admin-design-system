## 1. Rastreabilidade e planejamento

- [x] 1.1 Confirmar fonte oficial `Building06Icon` e a licença MIT de `@hugeicons/core-free-icons`.
- [x] 1.2 Registrar alteração de escopo aprovada na issue #257 e criar a change antes do Apply.

## 2. Troca e licença

- [ ] 2.1 Substituir somente `iconPaths.building` pelo SVG oficial (quatro paths), preservando `AdsIcon`, a API e o comportamento.
- [ ] 2.2 Preservar licença e copyright integral Hugeicons no aviso de terceiros, com fonte/URL; atualizar auditoria e `docs/licensing.md`.
- [ ] 2.3 Atualizar `CHANGELOG.md` no item da issue #257.

## 3. Testes e revisão

- [ ] 3.1 Incluir teste pontual dos paths e acessibilidade/tamanho para prevenir regressão.
- [ ] 3.2 Conferir visual no Storybook/demo, temas claro/escuro e tamanho pequeno, e revisar quaisquer baselines visuais afetados antes de regenerar.
- [ ] 3.3 Rodar formatação dos arquivos alterados, `npm run format`, lint, tipos, build, testes unitários e `npm run test:e2e`.
- [ ] 3.4 Rodar `openspec validate --all --strict`; revisar diff e CI atual, sem fazer merge ou arquivar sem os gates aplicáveis.
