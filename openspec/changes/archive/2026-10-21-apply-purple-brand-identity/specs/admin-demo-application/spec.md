# Spec Delta

## ADDED Requirements

### Requirement: Cabeçalho do demo exibe a marca

O admin-demo MUST exibir o logotipo do projeto no cabeçalho do shell, ao lado do nome "Admin Design System", em todas as rotas administrativas e nos temas claro e escuro, e MUST usar o favicon da marca. O logotipo MUST carregar tanto no demo servido na raiz quanto no demo publicado sob um subcaminho.

#### Scenario: Pessoa abre uma rota do demo

- **WHEN** uma pessoa abre qualquer rota administrativa do demo
- **THEN** o cabeçalho exibe o logotipo carregado ao lado do nome do projeto, e o logotipo não é anunciado como conteúdo separado por leitores de tela

#### Scenario: Pessoa alterna o tema

- **WHEN** a pessoa alterna entre os temas claro e escuro
- **THEN** o logotipo permanece visível e legível no cabeçalho

#### Scenario: Pessoa abre o demo em tela estreita

- **WHEN** uma pessoa abre o demo em uma tela de até 480 pixels de largura
- **THEN** o logotipo substitui o título visível, o cabeçalho não ganha altura e o nome "Admin Design System" continua disponível para tecnologias assistivas
