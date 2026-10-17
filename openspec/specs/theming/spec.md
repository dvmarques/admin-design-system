# theming Specification

## Purpose

Fornecer temas claro e escuro consistentes e personalizáveis, preservando acessibilidade e evitando que consumidores precisem recompilar a biblioteca.

## Requirements

### Requirement: Temas claro e escuro

O sistema MUST fornecer conjuntos completos de valores semânticos para os temas claro e escuro.

#### Scenario: Tema claro é aplicado

- **WHEN** a aplicação seleciona o tema claro
- **THEN** os tokens semânticos resolvem para os valores definidos para o tema claro

#### Scenario: Tema escuro é aplicado

- **WHEN** a aplicação seleciona o tema escuro
- **THEN** os tokens semânticos resolvem para os valores definidos para o tema escuro

### Requirement: Seleção explícita de tema

O sistema MUST permitir que a aplicação consumidora selecione o tema por meio de um contrato público baseado em atributo ou classe no elemento raiz documentado.

#### Scenario: Tema muda em tempo de execução

- **WHEN** a aplicação altera o seletor público de tema no elemento raiz
- **THEN** os componentes passam a usar o novo tema sem recarregar a página

### Requirement: Preferência do sistema operacional

O sistema MUST oferecer uma estratégia documentada para adotar a preferência de cores do sistema operacional quando a aplicação não tiver selecionado um tema explícito.

#### Scenario: Usuário prefere esquema escuro

- **WHEN** não existe seleção explícita e o sistema operacional informa preferência por esquema escuro
- **THEN** a aplicação pode apresentar o tema escuro usando apenas os estilos públicos do design system

### Requirement: Contraste acessível

Os pares de cores padrão usados para conteúdo e controles essenciais MUST atender aos critérios de contraste aplicáveis do WCAG 2.2 nível AA nos dois temas.

#### Scenario: Texto padrão sobre superfície padrão

- **WHEN** o texto e a superfície usam os tokens padrão correspondentes em qualquer tema
- **THEN** o par de cores atende ao contraste mínimo aplicável do WCAG 2.2 nível AA

### Requirement: Personalização preservada entre temas

O sistema MUST permitir a sobrescrita independente de tokens para cada tema.

#### Scenario: Marca define cores diferentes por tema

- **WHEN** uma aplicação sobrescreve o token primário nos escopos claro e escuro
- **THEN** cada tema utiliza sua respectiva sobrescrita sem recompilar os componentes

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

### Requirement: Sobrescrita de tokens documentada alcança overlays portados

A documentação pública de sobrescrita de tokens MUST indicar seletores que alcancem tanto o documento quanto overlays portados (dialog, drawer e toast), e MUST NOT recomendar `:root[data-theme=…]` para esse fim.

#### Scenario: Sobrescrita aplicada ao tema escuro

- **WHEN** uma aplicação sobrescreve `--ads-color-primary` em `[data-theme='dark']` depois do CSS de tokens
- **THEN** o documento e um overlay portado no tema escuro resolvem o novo valor

#### Scenario: Orientação consistente entre documentos

- **WHEN** o README de `@admin-ds/tokens` e `docs/integration.md` descrevem a sobrescrita de tokens
- **THEN** ambos indicam `[data-theme='light']` e `[data-theme='dark']` e nenhum recomenda `:root[data-theme=…]`

### Requirement: Movimento reduzido

Componentes públicos MUST NOT apresentar transições nem animações relevantes quando o usuário prefere movimento reduzido. Animações contínuas, como indicadores de carregamento e esqueletos, MUST ser desativadas e a informação de estado MUST permanecer disponível por texto ou semântica.

#### Scenario: Usuário prefere movimento reduzido

- **WHEN** o sistema operacional indica `prefers-reduced-motion: reduce` e o usuário interage com um componente com transição
- **THEN** a mudança de estado ocorre sem transição de duração perceptível e sem deslocamento animado

#### Scenario: Indicador de carregamento com movimento reduzido

- **WHEN** um indicador de carregamento ou esqueleto é exibido com movimento reduzido
- **THEN** não há animação contínua e o estado de carregamento continua exposto ao usuário

### Requirement: Cores forçadas

Em `forced-colors: active`, foco, bordas, estados selecionados, Button, campos de formulário e Badge MUST permanecer distinguíveis usando as cores do sistema, sem depender de sombras ou de cores de fundo personalizadas.

#### Scenario: Foco visível em cores forçadas

- **WHEN** um controle interativo recebe foco por teclado com cores forçadas ativas
- **THEN** há indicador de foco visível com cor de sistema

#### Scenario: Seleção distinguível em cores forçadas

- **WHEN** uma linha de tabela, item de navegação ou dia do calendário está selecionado com cores forçadas ativas
- **THEN** ele se distingue dos não selecionados por contorno ou borda e não apenas por cor de fundo

#### Scenario: Limites de campos e botões em cores forçadas

- **WHEN** um Button, um campo de formulário ou um Badge é exibido com cores forçadas ativas
- **THEN** seus limites permanecem visíveis

### Requirement: Preferência por maior contraste

Quando o usuário prefere `prefers-contrast: more`, os temas claro e escuro MUST aumentar o contraste de bordas, texto secundário e indicador de foco, mantendo o tema ativo e as sobrescritas explícitas da aplicação.

#### Scenario: Usuário prefere maior contraste

- **WHEN** o sistema operacional indica `prefers-contrast: more` em qualquer tema
- **THEN** bordas, texto secundário e foco usam valores mais fortes que os padrões do tema

#### Scenario: Aplicação personaliza um token

- **WHEN** a aplicação sobrescreve um token de cor e o usuário prefere maior contraste
- **THEN** a sobrescrita explícita da aplicação continua prevalecendo
