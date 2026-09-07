## Purpose

Fornecer cenários administrativos compostos que permitam avaliar, no admin-demo, o consumo público e a convivência dos componentes do design system.

## ADDED Requirements

### Requirement: Demo apresenta carregamento estruturado e indeterminado

O admin-demo MUST apresentar um cenário de carregamento estruturado com AdsSkeleton e um cenário de espera indeterminada com AdsLoadingIndicator, esclarecendo visualmente que o primeiro preserva a estrutura conhecida do conteúdo e o segundo representa trabalho sem duração determinada.

#### Scenario: Conteúdo de resumo está carregando

- **WHEN** uma pessoa visualiza o cenário de carregamento estruturado
- **THEN** placeholders preservam a forma do resumo administrativo e respeitam o tema ativo e a preferência de redução de movimento

### Requirement: Demo cobre estados operacionais de formulário

O admin-demo MUST apresentar controles textuais e de seleção nos estados normal, erro, sucesso, somente leitura e desabilitado, com rótulo, ajuda e mensagem de validação quando aplicável, nos temas claro e escuro.

#### Scenario: Pessoa alterna o tema com um formulário em erro

- **WHEN** o tema é alternado enquanto um campo inválido está visível
- **THEN** erro, foco, rótulo, ajuda e valor permanecem distinguíveis e legíveis

### Requirement: Demo apresenta confirmação destrutiva e feedback de resultado

O admin-demo MUST demonstrar um fluxo controlado de ação destrutiva composto por ação de início, confirmação em diálogo e notificação de resultado. O fluxo MUST preservar foco, teclado e descarte acessível da notificação.

#### Scenario: Pessoa confirma a remoção

- **WHEN** uma pessoa confirma a ação destrutiva pelo diálogo
- **THEN** o diálogo fecha, o foco retorna a um elemento disponível e uma notificação de resultado é apresentada

### Requirement: Cenários usam somente contratos públicos distribuídos

O admin-demo MUST consumir componentes, tipos, tokens e folhas de estilo pelos pontos de entrada públicos dos pacotes, sem importar arquivos-fonte internos ou redefinir a aparência interna de componentes.

#### Scenario: Aplicação é compilada como consumidora externa

- **WHEN** o admin-demo é compilado após os pacotes distribuídos
- **THEN** os cenários adicionais exibem estilos e comportamento sem exigir configuração Tailwind no aplicativo
