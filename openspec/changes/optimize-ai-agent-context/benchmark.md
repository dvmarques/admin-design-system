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

## Não medido

Acerto em tarefas representativas, tentativas, retrabalho e tokens por tarefa exigem execução de agentes
em tarefas fixas, base contra head, e não foram realizados. Nenhuma redução de tokens ou melhora de acerto
é declarada. O aceite de medição da issue #162 permanece **parcialmente atendido** até essa execução.

## Preservação das instruções essenciais

Todas as regras obrigatórias de `AGENTS.md` foram mantidas (as únicas alterações são a seção "Leitura de
contexto por demanda" e o item 1 de "Antes de alterar arquivos"). Em `openspec/config.yaml`, as seções
`rules` e `operations` não foram alteradas; apenas o bloco `context` foi condensado, e o conteúdo que deixou
de constar nele (estratégia de estilos, arquitetura, qualidade, licenciamento) está em `AGENTS.md`,
`docs/architecture.md`, `docs/quality.md` e `docs/licensing.md`.
