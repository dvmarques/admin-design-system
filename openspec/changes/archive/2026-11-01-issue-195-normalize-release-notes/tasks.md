# Tasks

## 1. Extração canônica e regressão

- [x] 1.1 Usar a extração/hash canônicos nas notas e preservar validação estrutural estrita em `develop` e predecessoras; verificado na revisão do publisher e teste de workflow.
- [x] 1.2 Testar que o hash SHA-256 cobre as notas extraídas sem marcador e confirmar os usos compartilhados pelo publisher; `npm run test:release` passou 56/56.

## 2. Registro e integração

- [x] 2.1 Registrar a correção em `[0.1.2] - Em andamento`; o diff confirma que `[0.1.1]` permanece intacta.
- [x] 2.2 Formatar arquivos alterados e executar os gates locais; resultados e limitações estão registrados abaixo.

## Evidências e limitações

- `npm run test:release`: 56/56; `npm run lint`: passou; `npm run build`: passou; `npm run typecheck`: passou; `openspec.cmd validate --all --strict --no-interactive`: 66/66; Prettier nos arquivos alterados: passou; `git diff --check`: passou.
- `npm run validate` foi executado, mas parou no `npm run format` porque o artifact local preexistente `npm-release-artifacts/publication-plan.json` não está formatado. Ele foi preservado; os arquivos alterados foram verificados individualmente com Prettier.
- `npm run test:quality` executou 79 arquivos e 1.500 testes unitários aprovados, além da suíte release; falhou em `test:ci` por composição duplicada de caminho Windows (`C:\\C:\\...`) no teste preexistente de transferência de snapshots.
- `npm run test:e2e`: 497 passaram, 9 falharam por snapshots `*-win32.png` inexistentes no runner Windows; 1 foi skipped. Nenhum snapshot foi atualizado; o workflow Linux da PR é a validação oficial dos baselines.
- Build e testes que exigem junction, loopback ou operações temporárias passaram quando executados fora da restrição do sandbox.
- Revisão Claude Code, segunda rodada: sem achados médios ou altos. Duas observações baixas sobre comparação do marcador editorial e validação de predecessora foram consideradas não bloqueantes porque os commits de `release` e `develop` já passam `release:validate`; isso está documentado no publisher.
