# Spec Delta

## MODIFIED Requirements

### Requirement: Responsividade das rotas administrativas

Cada rota administrativa MUST ser utilizável em larguras de celular, tablet e desktop, a partir de 320 px de largura, sem rolagem horizontal da página.

#### Scenario: Rota em largura de celular

- **WHEN** uma rota é aberta em largura de celular
- **THEN** a navegação fica disponível pelo gatilho do shell e o conteúdo se reorganiza sem rolagem horizontal da página; tabelas largas rolam dentro do próprio contêiner

#### Scenario: Rota na largura mínima de 320 px

- **WHEN** qualquer rota administrativa é aberta com 320 px de largura, nos temas claro e escuro
- **THEN** a página não rola na horizontal; conteúdo que não quebra linha, como a paginação, rola dentro do próprio painel
