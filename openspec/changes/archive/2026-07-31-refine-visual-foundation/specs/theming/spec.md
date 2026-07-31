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

### Requirement: Overlays portados preservam o tema de origem

Dialog, drawer, toast, tooltip e popover MUST preservar o tema explícito mais próximo do ponto de origem quando forem renderizados fora da subárvore DOM original e MUST acompanhar alterações desse tema enquanto estiverem abertos.

#### Scenario: Overlay nasce em um escopo claro local

- **WHEN** um componente dentro de `[data-theme="light"]` abre um overlay portado para `document.body`
- **THEN** a caixa usa a superfície clara e seus controles resolvem os tokens do tema claro, independentemente da preferência de cor do sistema

#### Scenario: Tema muda com overlay aberto

- **WHEN** o valor de `data-theme` do escopo de origem muda entre claro e escuro
- **THEN** a caixa e o controle de fechar atualizam seus tokens sem fechar ou remontar o overlay

### Requirement: Ícone de fechar possui contraste verificável

O ícone do controle de fechar MUST atingir contraste mínimo de `4.5:1` contra seus fundos padrão e de hover nos temas claro e escuro; o indicador de foco MUST atingir `3:1` contra a superfície adjacente.

#### Scenario: Controle de fechar aparece no tema ativo

- **WHEN** dialog, drawer ou toast apresenta o controle de fechar no tema claro ou escuro
- **THEN** o ícone, o fundo padrão, o hover e o foco atendem aos limites de contraste definidos
