## ADDED Requirements

### Requirement: Papéis visuais refinados e compatíveis

O sistema MUST expor tokens públicos semânticos para tipografia, raio, elevação, transição e estados interativos que permitam aos componentes expressar hierarquia visual consistente sem remover ou renomear tokens existentes.

#### Scenario: Consumidor mantém tokens existentes

- **WHEN** uma aplicação consumidora atualiza para a versão com a fundação revisada sem sobrescrever tokens
- **THEN** os nomes públicos existentes permanecem disponíveis e os componentes recebem valores padrão coerentes nos dois temas

### Requirement: Papéis de interação, elevação e camada são explícitos

O sistema MUST disponibilizar tokens semânticos aditivos para superfície de hover, superfície selecionada, borda forte, anel e offset de foco, hover de ações, três níveis de elevação e camadas de overlay. Os tokens MUST ter valores nos dois temas e preservar a possibilidade de sobrescrita por variáveis CSS.

#### Scenario: Consumidor personaliza o foco

- **WHEN** uma aplicação sobrescreve os tokens de anel e offset de foco
- **THEN** os componentes que recebem foco visível refletem a personalização sem exigir mudanças nas classes dos componentes
