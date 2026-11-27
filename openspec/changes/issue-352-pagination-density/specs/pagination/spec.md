## ADDED Requirements

### Requirement: Densidade visual opcional da paginação

AdsPagination MUST aceitar density comfortable ou compact, com comfortable como padrão e sem alteração das dimensões anteriores. Compact MUST reduzir as dimensões e espaçamento dos itens numéricos, reticências e navegação, mantendo tipografia, alvos de pelo menos 24 × 24 CSS px com tokens padrão, foco visível e temas claro e escuro. MUST aplicar a mesma apresentação a botões e links fornecidos pelo consumidor e recalcular a capacidade responsiva ao mudar a densidade. A altura MUST respeitar o token de controle pequeno na variante compacta.

#### Scenario: Densidade padrão

- **WHEN** density é omitida ou comfortable
- **THEN** a paginação mantém suas dimensões e comportamento anteriores.

#### Scenario: Tabela administrativa densa

- **WHEN** uma aplicação Next.js usa compact abaixo de uma tabela compacta
- **THEN** os controles são menores, preservam a fonte, o alvo acessível, as páginas obrigatórias e o foco nos dois temas, sem CSS do consumidor.

#### Scenario: Links e mudança de densidade

- **WHEN** o consumidor fornece renderPageLink e alterna a densidade
- **THEN** links e botões preservam aparência equivalente, nomes acessíveis, página atual, limites e comportamento de loading, e a capacidade acompanha as dimensões efetivas.
