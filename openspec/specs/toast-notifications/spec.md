# toast-notifications Specification

## Purpose

Disponibilizar toasts acessíveis e tematizáveis para comunicar resultados e informações transitórias sem interromper a tarefa administrativa em andamento.

## Requirements

### Requirement: Toasts não bloqueantes e composicionáveis

O sistema MUST exportar um toast público prefixado por `Ads` com área de conteúdo composicionável, variantes semânticas de informação, sucesso, aviso e erro, e opção de controle de fechamento fornecido pela aplicação.

#### Scenario: Aplicação informa uma operação concluída

- **WHEN** uma aplicação apresenta um toast de sucesso
- **THEN** o usuário visualiza uma mensagem distinguível sem perder o foco nem a capacidade de continuar a tarefa atual

### Requirement: Anúncio acessível de notificações

O toast MUST fornecer uma região de anúncio com urgência compatível com a sua variante e MUST ter nome ou conteúdo textual acessível para tecnologias assistivas.

#### Scenario: Erro é comunicado por toast

- **WHEN** uma aplicação apresenta um toast de erro
- **THEN** a mensagem é disponibilizada a tecnologias assistivas com a urgência apropriada sem mover o foco automaticamente

### Requirement: Fechamento operável por teclado

Quando um toast permitir descarte manual, o seu controle de fechar MUST possuir nome acessível e ser alcançável por teclado; seu acionamento MUST solicitar a remoção do toast à aplicação.

#### Scenario: Usuário descarta uma notificação

- **WHEN** o usuário ativa pelo teclado o controle de fechar de um toast descartável
- **THEN** a aplicação recebe a solicitação de fechamento e o toast deixa de ser apresentado quando seu estado é atualizado

### Requirement: Temas, tokens e layout responsivo

Toasts MUST usar tokens semânticos públicos para cor, borda, raio, elevação e variantes de estado, mantendo contraste nos temas claro e escuro e permanecendo dentro da largura disponível em telas estreitas.

#### Scenario: Toast é exibido em tela estreita no tema escuro

- **WHEN** uma aplicação mostra um toast em uma viewport estreita com o tema escuro ativo
- **THEN** a mensagem, a variante e o controle de fechar permanecem legíveis e utilizáveis sem overflow horizontal
