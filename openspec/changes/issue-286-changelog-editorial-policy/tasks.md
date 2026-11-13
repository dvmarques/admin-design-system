# Tasks — política editorial de CHANGELOG (#286)

## 1. Análise e desenho

- [x] 1.1 Ler o parser, extração, revisão SHA-256, release process e contrato OpenSpec atual.
- [x] 1.2 Comparar alternativas de cabeçalho, datas, links e arquivamento, registrando trade-offs e preservação do histórico.
- [x] 1.3 Definir critérios de seleção por impacto e política de consolidação, sem filtros automatizados de notas.

## 2. Aplicação documental

- [x] 2.1 Documentar seções, critérios públicos/internos, textos curtos, BREAKING/migração e exemplos no guia de release.
- [x] 2.2 Referenciar a política no guia de contribuição e no preâmbulo do changelog.
- [x] 2.3 Acrescentar entrada apenas na seção em andamento; preservar versões fechadas e hashes existentes.
- [x] 2.4 Criar delta OpenSpec com cenários observáveis, sem alteração em scripts de release.

## 3. Validação e revisão

- [x] 3.1 Conferir por leitura dos contratos existentes que a política preserva parsing, aprovação, extração e back-merge; nenhuma mudança técnica exige testes novos.
- [ ] 3.2 Executar `npm run test:release`, `npm run format`, `npm run validate` (lint, build, typecheck, qualidade, E2E) em checkout executável.
- [ ] 3.3 Executar `npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive`.
- [ ] 3.4 Rever a CI no SHA final e obter validação/revisão humana do desenho editorial antes do aceite.

Não marcar checks indisponíveis como concluídos. Archive/sync e merge são gates externos às tasks e dependem das autorizações e verificações próprias.
