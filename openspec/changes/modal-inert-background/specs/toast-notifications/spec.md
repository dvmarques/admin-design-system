## ADDED Requirements

### Requirement: Toast permanece disponível com um modal aberto

Um toast MUST NOT ficar inerte nem sair da árvore de acessibilidade por causa de um modal aberto, para que o anúncio e o controle de fechar continuem disponíveis.

#### Scenario: Toast exibido com um diálogo aberto

- **WHEN** um toast está visível enquanto um diálogo está aberto
- **THEN** o toast continua anunciado a tecnologias assistivas e o seu controle de fechar continua operável
