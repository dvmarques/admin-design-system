## ADDED Requirements

### Requirement: Papéis de cor semânticos completos
O sistema MUST fornecer, nos temas claro e escuro, valores semânticos para canvas, superfícies, conteúdo primário e secundário, bordas, foco, ação primária e estados informativo, sucesso, aviso e erro. Cada estado MUST incluir valores adequados para conteúdo, superfície e interação quando aplicável.

#### Scenario: Componente apresenta um estado semântico
- **WHEN** um componente existente usa um estado informativo, sucesso, aviso ou erro
- **THEN** sua aparência é resolvida pelos tokens semânticos correspondentes ao tema ativo

#### Scenario: Tema é alternado
- **WHEN** a aplicação troca o seletor público entre tema claro e escuro
- **THEN** todos os papéis de cor semânticos são atualizados sem recarregar a página

### Requirement: Contraste verificável dos estados visuais
Os pares padrão de texto e superfície, conteúdo de controles, indicadores de foco e estados semânticos MUST atender aos critérios aplicáveis do WCAG 2.2 nível AA nos dois temas.

#### Scenario: Usuário visualiza uma mensagem de erro
- **WHEN** uma mensagem ou controle existente usa os tokens de erro no tema claro ou escuro
- **THEN** o conteúdo essencial e seu fundo atingem o contraste mínimo aplicável do WCAG 2.2 nível AA

