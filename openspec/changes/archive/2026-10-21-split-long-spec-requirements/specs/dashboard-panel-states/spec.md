# Spec Delta

## MODIFIED Requirements

### Requirement: Painel cobre carregamento, vazio e erro

`AdsDashboardPanel` MUST suportar os estados de carregamento, vazio e erro, com prioridade carregamento, erro, vazio e conteúdo, e MUST NOT buscar dados. `error` MUST aceitar nós React. `empty` MUST aceitar `string`, `number` ou nós React, e texto ou número MUST renderizar `AdsEmptyState` compacto com o valor como título. `null`, `undefined`, `false` e string vazia, mas não `0`, MUST contar como ausência de `empty` e renderizar os filhos.

#### Scenario: Carregamento

- **WHEN** `loading` é verdadeiro
- **THEN** o painel apresenta placeholders `AdsSkeleton` anunciados por um status com rótulo, marca `aria-busy` e não renderiza o conteúdo

#### Scenario: Erro

- **WHEN** `error` é informado e o painel não está carregando
- **THEN** a mensagem é apresentada com `role="alert"`, junto das ações opcionais de recuperação

#### Scenario: Erro com conteúdo em bloco

- **WHEN** `error` contém elementos de bloco, como uma lista
- **THEN** o painel e o card produzem HTML válido e a hidratação não emite avisos

#### Scenario: Vazio

- **WHEN** `empty` é um nó React, como um `AdsEmptyState` com título e descrição, e não há carregamento nem erro
- **THEN** o painel apresenta o conteúdo de vazio informado no lugar dos filhos

#### Scenario: Vazio textual

- **WHEN** `empty` é `string` ou `number` e não há carregamento nem erro
- **THEN** o painel apresenta `AdsEmptyState` compacto com o texto como título, no lugar dos filhos

#### Scenario: Vazio numérico zero

- **WHEN** `empty` é `0` e não há carregamento nem erro
- **THEN** o painel apresenta `AdsEmptyState` compacto com o título `0`, no lugar dos filhos

#### Scenario: String vazia não é vazio

- **WHEN** `empty` é `""` e não há carregamento nem erro
- **THEN** o painel renderiza seus filhos, como quando `empty` não é informado

#### Scenario: Conteúdo

- **WHEN** nenhum estado especial é informado
- **THEN** o painel renderiza seus filhos
