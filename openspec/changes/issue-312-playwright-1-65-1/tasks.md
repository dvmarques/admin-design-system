## 1. Análise e planejamento

- [x] 1.1 Conferir issue #312, #303, regras do repositório, perfil Critical e quatro workflows aplicáveis.
- [x] 1.2 Verificar versão 1.65.1 e digest de índice OCI no registro oficial Microsoft.
- [ ] 1.3 Revisar artefatos OpenSpec e validar a change em modo estrito.

## 2. Atualização coordenada

- [ ] 2.1 Fixar versões e hashes íntegros em `package.json` e `package-lock.json`.
- [ ] 2.2 Atualizar digest e tag nos quatro workflows, incluindo `visual-audit.yml`.
- [ ] 2.3 Alinhar checks de versão e supply chain, preservando o fail-fast.
- [ ] 2.4 Documentar versão, proveniência do digest e procedimento seguro de snapshots.
- [ ] 2.5 Avaliar CHANGELOG e registrar motivo para não adicionar nota de consumidor.

## 3. Testes, revisão e entrega

- [ ] 3.1 Executar testes de supply chain, `npm run validate`, e OpenSpec `--all --strict`.
- [ ] 3.2 Confirmar E2E Chromium, Firefox e WebKit na CI e testes Pages no SHA final.
- [ ] 3.3 Inspecionar resultados de baseline; ajustar somente regressões comprovadas.
- [ ] 3.4 Executar formatação dos arquivos alterados e `npm run format`.
- [ ] 3.5 Revisar diff, abrir PR contra `develop`, verificar CI/Pages/Security e revisar eventuais achados.

Não incluir archive, merge ou fechamento administrativo como tarefas.
