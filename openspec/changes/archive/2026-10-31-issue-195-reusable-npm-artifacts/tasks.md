## 1. Preparação e origem

- [x] 1.1 Separar workflow manual de preparação sem publicação e registrar identidade no plano/artifact.
- [x] 1.2 Validar origem, expiração, digest ZIP e conteúdo antes de reutilizar ID explícito sem rebuild.
- [x] 1.3 Preservar OIDC, hashes, dependências e retomada parcial sem escritas divergentes.

## 2. Evidências e documentação

- [x] 2.1 Testar reexecução, parcial, hashes, origem inválida, expiração e extração segura.
- [x] 2.2 Documentar bootstrap, retenção e interrupção após expiração; atualizar somente changelog em andamento.
- [x] 2.3 Revisar independentemente arquitetura e implementação e corrigir achados.
- [x] 2.4 Executar as validações locais disponíveis e registrar cada limitação sem declarar gates bloqueados como aprovados; conferir no SHA final da PR os gates equivalentes executados pela CI.

## Evidências locais

- Ambiente local: Node v24.21.0; npm 11.19.1 executado via `npx` conforme o pin do projeto. Testes de release: 56/56; lint, typecheck, format e OpenSpec estrito 66/66 aprovados.
- Revisão independente do Claude: sem bloqueadores. Corrigidos consulta da tentativa original, preservação do destino, fixture de versão, validação de `run.path` e ref da API, timeouts, limites de download, extração isolada e inventário exato do diretório de artifacts.
- Sem mudanças visuais ou de componentes; acessibilidade, temas, responsividade e Storybook não recebem novas APIs. O smoke Next.js existente é preservado na preparação.
- Integração real dos workflows entre execuções e primeiro publish OIDC continuam pendentes de merge/autorização e não são simulados como concluídos.

- `npm run validate`: format, lint, builds do Storybook/demo, saída Storybook, peer opcional, typecheck e 1.500 testes unitários passaram; `test:ci` parou em falha de caminho Windows (`C:\C:\...`) em teste de transferência de baseline. E2E local: 495/507 passaram; 10 falhas por snapshots `win32` ausentes e 1 falha de hidratação WebKit. PNGs temporários foram removidos; nenhuma baseline foi alterada.
- Na revisão, o CI executou com sucesso no SHA de código anterior `ace1cdf23e884601548df36f02149f824302ba55`: CI #41263123346 (qualidade, builds e E2E Chromium/Firefox/WebKit), Security Gate #41263123334, Pages #41263123325. `Validação de release`/`release-check` ficou skipped por a base ser `develop`. Os checks serão repetidos após este registro OpenSpec.
- OpenSpec estrito: 66/66; inventário de permissões de workflows: 11/11. Nenhuma baseline foi atualizada.
