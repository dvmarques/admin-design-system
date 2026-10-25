## MODIFIED Requirements

### Requirement: Link opcional para o Storybook

O admin-demo MUST exibir na navegação principal, junto de Catálogo, um link para o Storybook somente quando o endereço do catálogo for configurado no build, sem duplicá-lo no cabeçalho.

#### Scenario: Endereço configurado

- **WHEN** o demo Next.js é construído com o endereço do Storybook configurado
- **THEN** a navegação principal exibe um link acessível para o catálogo, que informa e abre o destino configurado em nova aba

#### Scenario: Endereço ausente

- **WHEN** o demo é construído sem o endereço do Storybook
- **THEN** o link e seu item de navegação não são renderizados

#### Scenario: Navegação responsiva e temas

- **WHEN** a pessoa usa a sidebar expandida, recolhida ou o menu móvel nos temas claro e escuro
- **THEN** Storybook permanece acessível por teclado com nome e foco visível, seguindo os estilos e tokens existentes da navegação
