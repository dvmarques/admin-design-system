## ADDED Requirements

### Requirement: Histórias atualizadas para a fundação visual

O catálogo visual MUST atualizar as histórias dos componentes existentes afetados para demonstrar a tipografia, os papéis de cor e os estados semânticos revisados, sem introduzir componentes novos.

#### Scenario: Desenvolvedor revisa um componente existente no catálogo

- **WHEN** o desenvolvedor abre uma história afetada pela fundação visual
- **THEN** ele pode verificar seus estados representativos nos temas claro e escuro com os tokens revisados

### Requirement: Catálogo demonstra overlays e controles de fechar nos dois temas

As histórias de dialog, drawer e toast MUST permitir verificar a superfície da caixa e os estados padrão, hover e foco do controle de fechar nos temas claro e escuro.

#### Scenario: Desenvolvedor alterna o tema de uma história de overlay

- **WHEN** o tema da história muda entre claro e escuro com o overlay aberto
- **THEN** a caixa e o controle de fechar refletem imediatamente o novo tema com contraste verificável
