## 1. Templates e entrada de contribuição

- [x] 1.1 Adicionar formulários GitHub para bug, enhancement e documentation com labels existentes.
- [x] 1.2 Adicionar template de PR com rastreabilidade, gates e fluxo de release distinto.
- [x] 1.3 Criar CONTRIBUTING.md com referências canônicas.

## 2. Processo de changes

- [x] 2.1 Documentar ciclo OpenSpec, archive/sync e exceção por integração prévia.
- [x] 2.2 Alinhar AGENTS.md, config e workflow adaptativo com o guia operacional.
- [x] 2.3 Registrar a atualização no changelog.

## 3. Validação

- [x] 3.1 Validar YAML, links e coerência documental com revisão crítica do diff (a revisão humana ocorre no code review da PR).
- [x] 3.2 Executar npm run format, npm run validate e validação OpenSpec completa, anotando evidências. Local: format, lint, build, typecheck, test:quality e `openspec validate --all --strict` (CLI 1.10.0) OK; o E2E local não pôde rodar (navegadores do Playwright indisponíveis no sandbox) e foi comprovado pelos jobs de navegador da CI no SHA c96a7cc (Chromium, Firefox e WebKit).
- [x] 3.3 Verificar CI da PR pronta para revisão, revisar diff final e registrar restrições. CI verde no SHA c96a7cc (PR Ready); restrições registradas na descrição da PR.
