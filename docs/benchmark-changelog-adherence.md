# Benchmark de aderência ao CHANGELOG (issue #169)

Este documento registra a repetição do benchmark de implementação da #166 para verificar se a regra de
registro no `CHANGELOG.md` adicionada ao `AGENTS.md` (PR #173) melhora a aderência dos agentes. Os
resultados históricos da #166 permanecem em `openspec/changes/optimize-ai-agent-context/benchmark.md` e não
foram alterados.

## Resultado

| Critério (6 execuções por lado)           | Histórico #166 base | Histórico #166 head | Novo base | Novo head |
| ----------------------------------------- | ------------------: | ------------------: | --------: | --------: |
| Entrada em `CHANGELOG.md`                 |                 5/6 |                 3/6 |   **6/6** |   **6/6** |
| Teste de aceite oculto aprovado           |                 6/6 |                 6/6 |       6/6 |       6/6 |
| Testes existentes sem regressão           |                 5/6 |                 6/6 |       6/6 |       6/6 |
| Typecheck, ESLint, story, teste próprio   |                 6/6 |                 6/6 |       6/6 |       6/6 |
| Sem dependências novas, build dos pacotes |                 6/6 |                 6/6 |       6/6 |       6/6 |
| Prettier nos arquivos alterados           |                 6/6 |                 5/6 |       3/6 |       5/6 |
| `openspec validate --all --strict`        |                 6/6 |                 6/6 |       5/6 |       5/6 |

**Aceite da #169:** a taxa de registro no head (6/6) é maior ou igual à da base (6/6). O critério de
não regressão foi atendido. **O benchmark não demonstra melhora**: a base já registrou em todas as
execuções (efeito teto), então a diferença entre os lados não pode ser distinguida de zero.

Indicador complementar (proxy, não resultado de aceite): o número de chamadas de ferramenta até o primeiro
acesso ao `CHANGELOG.md` teve mediana 7,5 no head (6, 7, 7, 8, 9, 11) contra 17,5 na base (12, 12, 16, 19,
19, 23). Os agentes do head chegaram ao changelog logo no início, coerente com a regra estar escrita no
`AGENTS.md`; um deles a citou explicitamente. Na base, o registro foi inferido do histórico do
repositório e feito mais tarde.

## Metodologia

- **Revisões.** Base: `c2285bc` (`develop`, sem a regra). Head: `67d0075` (branch
  `docs/169-changelog-agent-rule` com `develop` mesclado). A diferença entre os dois é exatamente a da PR
  (`AGENTS.md`, `docs/agent-context-map.md` e a entrada no `CHANGELOG.md`).
- **Tarefas e repetições.** As mesmas três tarefas da #166, duas repetições por tarefa e por lado, 12
  execuções: **A** novo `AdsStatusDot`; **B** prop `fullWidth` em `AdsButton`; **C** `AdsBadge` com
  `dismissible`, `onDismiss` e `dismissLabel`.
- **Agentes.** Subagentes `sonnet` (`claude-sonnet-5-5`) com a mesma configuração, executados em paralelo,
  cada um em um checkout (worktree) isolado e com nome neutro (`w01` a `w12`), sem `node_modules`. O prompt
  era idêntico entre os lados, exceto o caminho: pedia para seguir o `AGENTS.md` do checkout, entregar a
  mudança "como faria para abrir uma PR neste repositório" e declarava o contrato observável. O prompt **não
  menciona o CHANGELOG**. Os agentes foram orientados a não executar comandos (apenas leitura e edição).
- **Avaliação.** Cada diff foi aplicado em um checkout com dependências (`npm ci --ignore-scripts`; pacotes
  construídos a cada execução) e avaliado com: teste de aceite oculto por tarefa (escrito pelo avaliador e
  não exposto aos agentes), suíte `vitest` completa (51 arquivos mais os testes novos), typecheck de
  `@admin-ds/components`, ESLint em `packages/components` e `apps/docs/src`, existência de story e de teste
  próprio, ausência de alterações em `package.json`/lockfile, `prettier --check` nos arquivos alterados,
  `openspec validate --all --strict` e presença de linhas adicionadas ao `CHANGELOG.md`.

## Resultados por execução

| Execução | Lado | Tarefa/rep. | Aceite | Testes | Types | ESLint | Story | Teste | Deps | Prettier | OpenSpec | CHANGELOG | 1º acesso ao CHANGELOG¹ | Tokens² | Duração² |
| -------- | ---- | ----------- | :----: | :----: | :---: | :----: | :---: | :---: | :--: | :------: | :------: | :-------: | ----------------------: | ------: | -------: |
| w02      | base | A / 1       |   ✅   |   ✅   |  ✅   |   ✅   |  ✅   |  ✅   |  ✅  |    ❌    |    ✅    |    ✅     |                      16 |  96.224 |    74,4s |
| w08      | base | A / 2       |   ✅   |   ✅   |  ✅   |   ✅   |  ✅   |  ✅   |  ✅  |    ✅    |    ❌    |    ✅     |                      23 | 126.539 |   118,5s |
| w09      | base | B / 1       |   ✅   |   ✅   |  ✅   |   ✅   |  ✅   |  ✅   |  ✅  |    ❌    |    ✅    |    ✅     |                      19 | 100.366 |    79,5s |
| w01      | base | B / 2       |   ✅   |   ✅   |  ✅   |   ✅   |  ✅   |  ✅   |  ✅  |    ❌    |    ✅    |    ✅     |                      19 |  95.695 |    88,7s |
| w12      | base | C / 1       |   ✅   |   ✅   |  ✅   |   ✅   |  ✅   |  ✅   |  ✅  |    ✅    |    ✅    |    ✅     |                      12 |  77.760 |    57,3s |
| w04      | base | C / 2       |   ✅   |   ✅   |  ✅   |   ✅   |  ✅   |  ✅   |  ✅  |    ✅    |    ✅    |    ✅     |                      12 |  86.423 |    74,1s |
| w05      | head | A / 1       |   ✅   |   ✅   |  ✅   |   ✅   |  ✅   |  ✅   |  ✅  |    ✅    |    ✅    |    ✅     |                      11 | 120.521 |   124,3s |
| w03      | head | A / 2       |   ✅   |   ✅   |  ✅   |   ✅   |  ✅   |  ✅   |  ✅  |    ✅    |    ✅    |    ✅     |                       7 | 114.815 |    94,5s |
| w11      | head | B / 1       |   ✅   |   ✅   |  ✅   |   ✅   |  ✅   |  ✅   |  ✅  |    ✅    |    ✅    |    ✅     |                       7 | 102.168 |    75,3s |
| w10      | head | B / 2       |   ✅   |   ✅   |  ✅   |   ✅   |  ✅   |  ✅   |  ✅  |    ✅    |    ✅    |    ✅     |                       6 |  94.229 |    76,7s |
| w06      | head | C / 1       |   ✅   |   ✅   |  ✅   |   ✅   |  ✅   |  ✅   |  ✅  |    ❌    |    ❌    |    ✅     |                       8 |  99.829 |    77,8s |
| w07      | head | C / 2       |   ✅   |   ✅   |  ✅   |   ✅   |  ✅   |  ✅   |  ✅  |    ✅    |    ✅    |    ✅     |                       9 |  81.825 |    69,8s |

¹ Posição da chamada de ferramenta, no transcrito do agente, que primeiro tocou um caminho com `CHANGELOG`.
² Tokens totais e duração reportados pela ferramenta para cada subagente. Não separam entrada e saída.

Localização e qualidade das entradas: nas 12 execuções a entrada foi adicionada à seção `[0.1.1]` do
`CHANGELOG.md`, em `Added`, identificada pelo id da change OpenSpec criada pelo próprio agente
(`add-status-dot`, `add-button-full-width`, `add-badge-dismissible` ou `add-badge-dismiss`), com descrição
objetiva do efeito e da API. Nenhuma entrada ficou fora da seção da versão em andamento.

Agregados: tokens base 583.007 e head 613.387 (+5,2%), medianas 95.960 e 100.999; duração mediana 76,9s
(base) e 77,3s (head). As diferenças de tokens e duração estão dentro da variação entre repetições.

Diferenças não relacionadas à regra: os `❌` de Prettier e OpenSpec decorrem de os agentes não poderem
executar comandos. Os de OpenSpec foram requisitos com mais de 500 caracteres (w06 e w08, um por lado). Os
de Prettier foram 3 na base (w01, w02, w09) e 1 no head (w06). Nenhum se relaciona ao CHANGELOG.

## Limitações

- **Efeito teto.** Com a base em 6/6 não há margem para medir melhora. O resultado histórico da #166 (base
  5/6, head 3/6) e este (6/6 e 6/6) mostram que a taxa varia entre rodadas de 6 execuções; com amostras
  pequenas, diferenças de 1 a 2 execuções não são estatisticamente distinguíveis.
- **Prompt reconstruído.** Os prompts e os testes de aceite originais da #166 não estão versionados no
  repositório; foram reescritos a partir do contrato descrito no `benchmark.md` histórico. O prompt pede
  entrega "como para abrir uma PR", o que pode induzir a busca por práticas do repositório, inclusive na base.
- **Pistas indiretas na base.** O repositório base já cita changelog na skill `adaptive-ai-workflow` e em
  `docs/ai-development-workflow.md` ("changelog quando aplicável"), e o próprio `CHANGELOG.md` oferece
  precedentes por change. Os agentes da base acessaram o changelog mais tarde, mas chegaram a ele.
- **Uso de ferramentas.** A restrição de não executar comandos foi dada no prompt, sem imposição técnica. O
  agente `w01` reportou ter executado um `ls` uma vez. Não é relevante para o resultado.
- **Um modelo, uma rodada, 6 execuções por lado**, três tarefas de escopo reduzido, subagentes do Claude Code
  apenas (não Cursor nem Codex). As instruções de projeto da sessão que orquestrou o benchmark eram as mesmas
  nos dois lados; a regra nova chegou ao head apenas pela leitura do `AGENTS.md` do checkout, como foi
  instruído, o que aproxima, mas não reproduz, o carregamento automático do arquivo pela ferramenta.
- **Evidências não versionadas.** Diffs, transcritos e testes de aceite ficaram em diretório temporário da
  sessão e não foram incluídos no repositório. Os números acima são os registrados na avaliação.
- **Ambiente de avaliação.** Node 22.22.0 e npm 10.9.4 (o repositório exige Node 24 e npm 11); avisos
  `EBADENGINE` na instalação. A suíte completa passou na base e no head sem execuções de E2E.

## Conclusão

A regra existe em um ponto sempre carregado (`AGENTS.md`), e a taxa de registro no head (6/6) não é menor
que a da base (6/6). Os dados não permitem afirmar que a regra eleva a taxa, apenas que não há regressão e
que os agentes do head chegam ao changelog mais cedo.
