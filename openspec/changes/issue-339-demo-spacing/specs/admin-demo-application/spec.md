## ADDED Requirements

### Requirement: Densidade consistente no Demo administrativo

As páginas administrativas do Demo MUST usar a Visão geral como referência de alinhamento, padding e ritmo entre cabeçalho e seções, preservando espaçamentos internos e funcionalidades próprias.

#### Scenario: Pessoa compara páginas

- **WHEN** a pessoa abre Visão geral, Clientes, Novo cliente, Preferências e exemplos administrativos na mesma viewport
- **THEN** o conteúdo mantém alinhamento e ritmo vertical coerentes, sem grandes vazios ou divisórias decorativas desnecessárias

#### Scenario: Viewport e tema variam

- **WHEN** a pessoa usa as páginas nos temas claro e escuro em celular, tablet ou desktop
- **THEN** controles e conteúdo permanecem legíveis, navegáveis e sem overflow horizontal da página

#### Scenario: Estados da listagem

- **WHEN** a listagem apresenta dados, carregamento, vazio ou erro
- **THEN** seus controles e mensagens continuam funcionais e acessíveis
