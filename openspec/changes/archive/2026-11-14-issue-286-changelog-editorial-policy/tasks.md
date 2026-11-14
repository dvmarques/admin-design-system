# Tasks — política editorial de CHANGELOG (#286)

## 1. Análise e desenho

- [x] 1.1 Ler o parser, extração, revisão SHA-256, release process e contrato OpenSpec atual.
- [x] 1.2 Comparar alternativas de cabeçalho, datas, links e arquivamento, registrando trade-offs e preservação do histórico.
- [x] 1.3 Definir critérios de seleção por impacto e política de consolidação, sem filtros automatizados de notas.

## 2. Aplicação documental

- [x] 2.1 Documentar seções, critérios públicos/internos, textos curtos, BREAKING/migração e exemplos no guia de release.
- [x] 2.2 Referenciar a política no guia de contribuição e no preâmbulo do changelog.
- [x] 2.3 Atualizar somente o preâmbulo do CHANGELOG; não publicar entrada autorreferente de manutenção (#286); preservar a seção aberta, versões fechadas e hashes existentes.
- [x] 2.4 Criar delta OpenSpec com cenários observáveis, sem alteração em scripts de release.
- [x] 2.5 Reconciliar a exigência de CHANGELOG em `AGENTS.md` com a política por impacto e justificar a ausência de nota pública na PR.

## 3. Validação e revisão

- [x] 3.1 Conferir por leitura dos contratos existentes que a política preserva parsing, aprovação, extração e back-merge; nenhuma mudança técnica exige testes novos.
- [x] 3.2 Verificar na CI o sucesso de `npm run test:release`, `npm run format`, lint, build, typecheck, qualidade e E2E (CI #43529306068, SHA `47ef607`; o comando agregado `npm run validate` não foi executado literalmente).
- [x] 3.3 Validar OpenSpec com `npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive` (job Política de develop, CI #43529306068).
- [x] 3.4 Revisar CI, Pages e Security no SHA `47ef607`: todos os workflows concluíram com sucesso.
- [x] 3.5a Revisão técnica da documentação, do delta e do changelog: alegações conferidas contra `scripts/release-changelog.mjs` e `release-utils.mjs`; formatação corrigida na entrada do changelog; local: `test:release` (62 ok), Prettier e OpenSpec strict (70 ok).
- [x] 3.5 Obter revisão/aprovação humana do desenho editorial antes do aceite (aprovado pelo mantenedor na PR #309 em 2026-11-14). A CI do SHA final é verificada como gate da PR, após o archive.

Não marcar checks indisponíveis como concluídos. Archive/sync e merge são gates externos às tasks e dependem das autorizações e verificações próprias.
