## ADDED Requirements

### Requirement: Composição de ícones agnóstica ao fornecedor

O sistema MUST fornecer uma API pública tipada que receba um ícone React já renderizado e preserve o elemento recebido, sem dependência obrigatória de catálogo, adaptação por fornecedor ou mutação de props do filho.

#### Scenario: SVG local ou biblioteca React

- **WHEN** o consumidor fornece um SVG local ou um elemento de qualquer biblioteca React ao slot
- **THEN** o elemento é renderizado sem clonagem, registry ou injeção de props
- **AND** sua geometria, atributos SVG e traço são preservados

#### Scenario: Compatibilidade de nomes existentes

- **WHEN** um consumidor usa qualquer um dos 20 nomes de `AdsIcon`
- **THEN** a API nomeada e os desenhos existentes permanecem disponíveis nos mesmos tamanhos e semântica
- **AND** nenhum catálogo externo precisa ser instalado

### Requirement: Semântica e estilo do slot genérico

O slot genérico MUST estabelecer um invólucro visual coerente com tamanhos, cor herdada e alinhamento, sem presumir controle do SVG filho; MUST distinguir uso decorativo de informativo.

#### Scenario: Ícone decorativo

- **WHEN** o slot não recebe rótulo próprio e está acompanhado de informação textual
- **THEN** o invólucro é ocultado da árvore acessível

#### Scenario: Ícone informativo

- **WHEN** o slot recebe `label` não vazio
- **THEN** o invólucro tem nome acessível e papel de imagem
- **AND** o consumidor não depende exclusivamente da cor para comunicar estado

#### Scenario: Variação de tema e tamanho

- **WHEN** a cor herdada muda em tema claro/escuro ou o tamanho do invólucro muda
- **THEN** o slot usa tokens/classes públicos e mantém alinhamento
- **AND** os atributos explícitos do elemento externo não são sobrescritos

### Requirement: Sobrescritas opcionais em componentes com ícones internos

Componentes prioritários MUST aceitar slots opcionais para ícones internos identificados, preservando defaults, funções e acessibilidade quando não houver override.

#### Scenario: Sem override

- **WHEN** o consumidor omite o slot
- **THEN** o componente usa o mesmo ícone interno e mantém o nome acessível, foco e estados

#### Scenario: Com override

- **WHEN** o consumidor fornece um elemento externo ou SVG local em um slot aceito
- **THEN** o componente mostra o elemento sem importá-lo nem alterar suas props
- **AND** ações e estados desabilitados mantêm a acessibilidade

### Requirement: Distribuição enxuta e documentação verificável

O pacote MUST NOT adicionar catálogo de ícones externo como dependency ou peer obrigatório; exemplos, licenças, documentação e verificações de bundle MUST distinguir código distribuído dos exemplos opcionais.

#### Scenario: Consumidor sem biblioteca de ícones

- **WHEN** uma aplicação instala apenas os pacotes ADS necessários
- **THEN** os ícones internos e controles padrão continuam disponíveis

#### Scenario: Consumo seletivo

- **WHEN** uma aplicação importa apenas um ícone de um catálogo escolhido
- **THEN** o ADS não importa o catálogo inteiro em runtime
- **AND** a documentação registra a medição realizada ou identifica explicitamente a validação pendente
