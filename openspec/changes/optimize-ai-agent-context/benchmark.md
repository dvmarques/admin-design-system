# Medição de contexto inicial

Comparação entre a base (`develop`, `a4e90e0`) e o head desta change. Contagem reproduzível: tamanho em
bytes dos arquivos de instrução carregados no início de uma tarefa
(`git show <rev>:<arquivo> | wc -c`).

**Tokenizer:** indisponível neste ambiente (a codificação do `tiktoken` não pôde ser baixada), portanto
não há contagem de tokens. Bytes são um indicador proporcional, não uma medição de tokens. Consumo total
de entrada/saída por tarefa não é exposto pela ferramenta: **não disponível**.

## Contexto inicial obrigatório

| Arquivo                         | Base (bytes) | Head (bytes) |
| ------------------------------- | -----------: | -----------: |
| `AGENTS.md`                     |        8.223 |        8.679 |
| `openspec/config.yaml`          |        8.387 |        4.683 |
| **Subtotal (sempre carregado)** |   **16.610** |   **13.362** |
| `docs/agent-context-map.md`     |            — |        3.569 |
| **Com o mapa**                  |   **16.610** |   **16.931** |

- Sem o mapa, o contexto obrigatório cai 19,6% (−3.248 bytes). Com o mapa, fica 1,9% maior.
- Na base, `AGENTS.md` mandava ler toda a documentação relevante em `docs/`; no head, a leitura passa a ser
  seletiva. O ganho real depende de quantos documentos deixam de ser abertos por tarefa, o que **não foi
  medido**.
- `docs/models.md`: 2.695 → 3.290 bytes. Não faz parte do contexto inicial obrigatório.

## Leitura por tarefa (base contra head)

Executado depois do merge da #165. Base: `4680650` (`develop` antes da change); head: `e1c8bba`.
Quatro tarefas fixas de **planejamento** (sem edição), cada uma executada uma vez em checkouts isolados
da base e do head por um subagente de menor capacidade, orientado a seguir o `AGENTS.md` do checkout e a
listar os arquivos que abriria. Tokens contados com o tokenizer `o200k_base` (`gpt-tokenizer`), uma
**aproximação** do tokenizer do modelo, aplicada ao conteúdo de cada arquivo na respectiva revisão.

| Tarefa                                      | Arquivos base | Tokens base | Arquivos head | Tokens head |          Δ |
| ------------------------------------------- | ------------: | ----------: | ------------: | ----------: | ---------: |
| T1 `loading` em `AdsButton`                 |            17 |      16.742 |            15 |      12.565 |     −24,9% |
| T2 token de superfície no tema escuro       |            13 |      16.036 |            12 |      14.128 |     −11,9% |
| T3 redação em `docs/quality.md` e CHANGELOG |             6 |      15.641 |             7 |      15.793 |      +1,0% |
| T4 preparar release 0.1.1                   |            14 |      21.744 |            10 |      17.931 |     −17,5% |
| **Total**                                   |        **50** |  **70.163** |        **44** |  **60.417** | **−13,9%** |

Consumo total dos subagentes (tokens reportados pela ferramenta, inclui o prompt e a conversa):
base 392.403 e head 345.432 (−12,0%).

**Leitura:** a redução vem de o agente deixar de abrir documentação e specs não relacionadas (T1, T2,
T4). Em T3, tarefa pequena de documentação, o mapa soma uma leitura e não há economia (+1,0%). Os dois
resultados concordam em direção e magnitude (−13,9% e −12,0%).

**Limitações:** uma execução por tarefa e por lado, sem repetição, então a variância entre execuções é
desconhecida; a escolha de arquivos é comportamento do modelo e pode variar. As tarefas foram apenas
planejadas, sem implementação, de modo que **acerto, tentativas e retrabalho continuam não medidos**. O
head T1 abriu a `proposal.md` desta change, o que adiciona ruído. O tokenizer é aproximado. O aceite de
acerto em tarefas representativas da #162 permanece **pendente**.

## Implementação: acerto e retrabalho (base contra head)

Segunda rodada, com tarefas de **implementação** de componente público, três tarefas fixas e duas
repetições por tarefa e por lado (12 execuções, subagentes `sonnet` em checkouts isolados, sem
`node_modules`, sem poder rodar testes nem comandos). Cada resultado foi verificado depois, aplicando o
diff em um checkout com dependências. Tarefas: **A** novo `AdsStatusDot`; **B** prop `fullWidth` em
`AdsButton`; **C** `AdsBadge` com `dismissible`, `onDismiss` e `dismissLabel`. O contrato observável de
cada tarefa estava no prompt; o teste de aceite (oculto aos agentes) cobre esse contrato.

| Critério (6 execuções por lado)                        | Base | Head |
| ------------------------------------------------------ | ---: | ---: |
| Teste de aceite oculto aprovado                        |  6/6 |  6/6 |
| Testes existentes sem regressão                        |  5/6 |  6/6 |
| Typecheck do pacote                                    |  6/6 |  6/6 |
| ESLint (`packages/components`, `apps/docs/src`)        |  6/6 |  6/6 |
| Story do Storybook criada ou alterada                  |  6/6 |  6/6 |
| Teste próprio adicionado                               |  6/6 |  6/6 |
| Sem dependências novas                                 |  6/6 |  6/6 |
| Prettier nos arquivos alterados                        |  6/6 |  5/6 |
| `openspec validate --all --strict` com a change criada |  6/6 |  6/6 |
| Entrada em `CHANGELOG.md`                              |  5/6 |  3/6 |

Tokens totais dos subagentes (reportados pela ferramenta): base 452.630, head 437.123 (−3,4%).
Tentativas: uma por execução (os agentes não podiam executar nada), então retrabalho por iteração não
se aplica.

**Leitura:**

- **Acerto:** nenhuma perda no contrato observável (12/12 no teste de aceite) nem nas verificações
  automáticas. A única regressão foi na base (`base-C-1`, um teste próprio do agente que falha); o único
  Prettier reprovado foi no head (`head-A-1`). Com 6 execuções por lado, essas diferenças não são
  estatisticamente distinguíveis.
- **CHANGELOG:** o head registrou a entrada em 3 de 6 execuções, contra 5 de 6 na base. A obrigação de
  registrar no CHANGELOG não está escrita em `AGENTS.md`, nem no mapa, nem em `openspec/config.yaml`; os
  agentes a inferem do histórico do repositório. Trata-se de uma lacuna de descoberta que já existia, mas
  vale registrar a regra explicitamente em um acompanhamento.
- **Custo:** a redução de tokens na implementação (−3,4%) é bem menor que no planejamento (−13,9%),
  porque a leitura do código-alvo domina o custo.

**Limitações:** amostra pequena (6 por lado), um modelo, tarefas de escopo reduzido e agentes sem
execução de comandos. Resultados indicam ausência de perda de acerto, não equivalência comprovada.

## Não medido

Mediana de tempo e de tokens com mais repetições, o tokenizer real do modelo (a contagem usa uma
aproximação) e tarefas transversais maiores (vários pacotes) não foram medidos.

## Preservação das instruções essenciais

Todas as regras obrigatórias de `AGENTS.md` foram mantidas (as únicas alterações são a seção "Leitura de
contexto por demanda" e o item 1 de "Antes de alterar arquivos"). Em `openspec/config.yaml`, as seções
`rules` e `operations` não foram alteradas; apenas o bloco `context` foi condensado, e o conteúdo que deixou
de constar nele (estratégia de estilos, arquitetura, qualidade, licenciamento) está em `AGENTS.md`,
`docs/architecture.md`, `docs/quality.md` e `docs/licensing.md`.
