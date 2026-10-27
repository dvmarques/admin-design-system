## ADDED Requirements

### Requirement: Fluxo de autenticação contido na viewport

As rotas demonstrativas de autenticação MUST ocupar a viewport sem rolagem da página nem crescimento causado pela decoração. O login MUST caber sem rolagem nas dimensões de referência com fonte padrão e ambos os temas. Quando o conteúdo exceder a altura disponível, MUST permitir rolagem interna acessível, mantendo o cabeçalho visível e a personalização por tokens.

#### Scenario: Login em desktop e celular

- **WHEN** a pessoa abre o login do demo Next.js em 1920×915, 1280×720, 768×600, 390×667 e 320×568, nos temas claro e escuro
- **THEN** título, campos, botão e recuperação estão na viewport sem rolagem da página nem do formulário, com painel à direita somente a partir de 48rem

#### Scenario: Conteúdo excede altura disponível

- **WHEN** uma rota de autenticação apresenta erros ou é aberta em uma viewport muito baixa ou com zoom
- **THEN** a página permanece contida e a rolagem interna permite alcançar o início, o fim e todos os controles por teclado, sem recortar conteúdo funcional

#### Scenario: Redimensionamento

- **WHEN** a viewport muda de largura ou altura
- **THEN** a composição acompanha a nova área disponível sem altura excedente imposta pela decoração
