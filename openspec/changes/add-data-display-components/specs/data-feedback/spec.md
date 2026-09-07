## Purpose

Fornece feedback acessível e tematizável para progresso e ausência de dados em interfaces administrativas.

## ADDED Requirements

### Requirement: Progresso determinado expõe valor real

O sistema MUST fornecer `AdsProgress` com modo determinado que exponha valor atual, mínimo e máximo coerentes para tecnologias assistivas e represente visualmente o avanço usando tokens públicos.

#### Scenario: Progresso percentual conhecido

- **WHEN** o consumidor informa um valor dentro do intervalo configurado
- **THEN** a representação visual e os atributos acessíveis comunicam o mesmo progresso

### Requirement: Progresso indeterminado não inventa percentual

`AdsProgress` MUST suportar modo indeterminado para atividades cujo avanço não é mensurável. Nesse modo, o componente MUST comunicar atividade sem anunciar um valor percentual fictício.

#### Scenario: Duração desconhecida

- **WHEN** o consumidor renderiza progresso sem valor conhecido
- **THEN** tecnologias assistivas identificam a operação em andamento sem receber percentual incorreto

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
