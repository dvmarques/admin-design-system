## ADDED Requirements

### Requirement: Notificação transitória hierarquizada

`AdsToast` MUST diferenciar variante, conteúdo, ação de descarte e superfície de fundo com contraste e espaçamento adequados para leitura rápida em ambos os temas.

#### Scenario: Toast de erro possui conteúdo longo

- **WHEN** uma aplicação apresenta uma mensagem de erro com mais de uma linha
- **THEN** a mensagem e o controle de fechar permanecem legíveis, acessíveis e sem sobreposição em largura reduzida

### Requirement: Toast responde ao contexto compacto

AdsToast MUST usar superfície e camada semânticas e MUST adaptar espaçamento e ações em largura reduzida, preservando leitura rápida e alvo de toque do descarte.

#### Scenario: Toast é exibido em tela estreita

- **WHEN** uma notificação possui mensagem e ação de descarte em largura reduzida
- **THEN** a mensagem quebra sem sobrepor o descarte e ambos permanecem visualmente distinguíveis
