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

## Não medido

Acerto em tarefas representativas, tentativas e retrabalho exigem execuções de implementação com critério
de aceite por tarefa, e não foram realizados. Repetições por tarefa (para mediana) também não.

## Preservação das instruções essenciais

Todas as regras obrigatórias de `AGENTS.md` foram mantidas (as únicas alterações são a seção "Leitura de
contexto por demanda" e o item 1 de "Antes de alterar arquivos"). Em `openspec/config.yaml`, as seções
`rules` e `operations` não foram alteradas; apenas o bloco `context` foi condensado, e o conteúdo que deixou
de constar nele (estratégia de estilos, arquitetura, qualidade, licenciamento) está em `AGENTS.md`,
`docs/architecture.md`, `docs/quality.md` e `docs/licensing.md`.
