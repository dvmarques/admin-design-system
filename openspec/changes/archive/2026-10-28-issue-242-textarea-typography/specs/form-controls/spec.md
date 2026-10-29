# form-controls — delta da issue #242

## ADDED Requirements

### Requirement: Tipografia tokenizada dos controles textuais sem reset externo

AdsInput, AdsTextarea e AdsSelect MUST apresentar seus textos visíveis (incluindo valores digitados, rótulos de opções e placeholders onde aplicáveis) com a família definida pelo token público --ads-typography-font-family quando consumidos com o CSS compilado distribuído, independentemente de a aplicação aplicar preflight/reset CSS. A regra MUST preservar a possibilidade de personalização intencional do token e não modificar tamanho, valor, semântica ou estado dos controles.

#### Scenario: Área de texto sem preflight

- **WHEN** uma aplicação Next.js renderiza AdsTextarea e AdsInput com apenas o CSS publicado do design system, sem reset CSS de elementos nativos
- **THEN** ambos exibem texto digitado e placeholder com a família tipográfica do token, sem diferença provocada pela fonte user-agent do textarea

#### Scenario: Tema claro e escuro

- **WHEN** os controles são exibidos em tema claro ou escuro nos tamanhos sm, md e lg e em estado normal, readonly, inválido ou desabilitado
- **THEN** a família tipográfica permanece consistente e os tamanhos e estados definidos pelo design system são preservados

#### Scenario: Consumidor personaliza família

- **WHEN** uma aplicação altera o token --ads-typography-font-family no escopo do componente
- **THEN** a tipografia de Input, Textarea e Select acompanha esse token sem recompilar a biblioteca

#### Scenario: Personalização explícita de um controle

- **WHEN** um consumidor aplica uma classe de fonte alternativa permitida por className em um controle
- **THEN** a personalização explícita não é bloqueada por uma regra global da demonstração
