# data-feedback Specification

## Purpose

Fornece feedback acessível e tematizável para progresso e ausência de dados em interfaces administrativas.

## Requirements

### Requirement: Progresso determinado expõe valor real

O sistema MUST fornecer `AdsProgress` com modo determinado que exponha valor atual, mínimo e máximo coerentes para tecnologias assistivas e represente visualmente o avanço usando tokens públicos. O intervalo MUST exigir `max > min`; quando `value` estiver abaixo de `min` ou acima de `max`, o componente MUST normalizar o valor para o limite válido mais próximo antes de calcular a representação visual e os atributos acessíveis.

#### Scenario: Progresso percentual conhecido

- **WHEN** o consumidor informa um valor dentro do intervalo configurado
- **THEN** a representação visual e os atributos acessíveis comunicam o mesmo progresso

#### Scenario: Valor determinado excede os limites

- **WHEN** o consumidor informa `value` abaixo de `min` ou acima de `max`
- **THEN** `AdsProgress` usa respectivamente `min` ou `max` como valor efetivo para a representação visual e acessível

#### Scenario: Intervalo determinado é inválido

- **WHEN** o consumidor configura `max` menor ou igual a `min`
- **THEN** o componente rejeita a configuração inválida de forma determinística em vez de anunciar um progresso incoerente

### Requirement: Progresso indeterminado não inventa percentual

`AdsProgress` MUST suportar modo indeterminado para atividades cujo avanço não é mensurável. Nesse modo, o componente MUST comunicar atividade sem anunciar um valor percentual fictício. Qualquer animação decorativa MUST respeitar a preferência `prefers-reduced-motion: reduce`, substituindo ou removendo movimento contínuo sem eliminar a indicação visual de atividade.

#### Scenario: Duração desconhecida

- **WHEN** o consumidor renderiza progresso sem valor conhecido
- **THEN** tecnologias assistivas identificam a operação em andamento sem receber percentual incorreto

#### Scenario: Usuário prefere movimento reduzido

- **WHEN** o ambiente informa `prefers-reduced-motion: reduce`
- **THEN** o progresso indeterminado mantém indicação visual de atividade sem animação contínua incompatível com essa preferência

### Requirement: Estado vazio comunica ausência sem assumir erro

O sistema MUST fornecer `AdsEmptyState` para representar ausência de dados, conteúdo ou resultados. A API MUST aceitar título, descrição, conteúdo visual opcional e ações fornecidas pelo consumidor, e MUST NOT usar semântica de alerta por padrão.

#### Scenario: Busca sem resultados

- **WHEN** uma aplicação não encontra registros para os filtros atuais
- **THEN** `AdsEmptyState` apresenta a mensagem e ações fornecidas sem anunciar a situação como erro automaticamente

#### Scenario: Estado vazio com ação principal

- **WHEN** o consumidor fornece uma ação para criar ou recuperar conteúdo
- **THEN** a ação permanece alcançável por teclado, com rótulo e foco visível definidos pelo componente de ação utilizado

### Requirement: Feedback respeita temas e CSS público

`AdsProgress` e `AdsEmptyState` MUST funcionar nos temas claro e escuro, utilizar tokens públicos e manter estilos quando consumidos apenas pelo CSS distribuído do design system.

#### Scenario: Troca de tema

- **WHEN** o tema público muda entre claro e escuro
- **THEN** progresso e estado vazio atualizam superfície, texto e indicadores sem recompilação da biblioteca
