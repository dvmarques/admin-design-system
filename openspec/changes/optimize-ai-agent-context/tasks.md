## 1. Contexto

- [x] 1.1 Identificar duplicações e regras que não podem ser removidas.
- [x] 1.2 Criar mapa conciso de pacotes e documentos com gatilhos de leitura.
- [x] 1.3 Reduzir o contexto descritivo do OpenSpec sem remover regras operacionais.
- [x] 1.4 Atualizar AGENTS.md para leitura direcionada, preservando contratos e compatibilidade entre agentes.

## 2. Modelos

- [x] 2.1 Substituir recomendação fixa por matriz por complexidade e custo efetivo.
- [x] 2.2 Definir política de escalonamento e limites de contexto.

## 3. Verificação

- [x] 3.1 Documentar benchmark reproduzível e critérios de regressão.
- [x] 3.2 Revisar instruções cruzadas e ajustar inconsistências.
- [x] 3.3 Executar `openspec validate --all --strict`, `npm run check:agent-skills` e `npm run format` em checkout com dependências instaladas; registrar resultados.
  - `openspec validate --all --strict` (CLI 1.14.3): 44 aprovados, 0 falhas.
  - `npm run check:agent-skills`: sem divergências. `npm run format`: sem problemas. `npm run build`: concluído.
- [x] 3.4 Executar `npm run test:e2e` antes do merge, conforme a política vigente do OpenSpec; registrar resultados.
  - CI com execução completa forçada (commit temporário `c40c28b`, depois revertido, pois o classificador `docs_only` pula o E2E em PRs só de documentação): Chromium 167 aprovados; Firefox, WebKit, Qualidade rápida, Artefatos de distribuição e Política de develop com sucesso (run 39694690322).
  - Localmente (Chromium do ambiente) havia 7 falhas de snapshot por diferença de navegador; não se repetiram na CI. Snapshots não foram atualizados.
- [ ] 3.5 Executar o benchmark base/head com tokenizer e tarefas fixas (acompanhado na issue #166); contexto inicial em bytes já registrado em `benchmark.md`.

## Revisão

- Contratos de API, acessibilidade, release e regras de artefatos foram mantidos; o bloco descritivo duplicado de contexto foi condensado.
- Benchmark antes/depois com medições reais não foi executado; nenhuma redução percentual é declarada.
