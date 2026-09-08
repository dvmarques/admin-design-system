## ADDED Requirements

### Requirement: Navegação com hierarquia de estado refinada

Breadcrumb, nav e tabs MUST tornar o destino atual, o foco e a interação apontada distinguíveis por tokens semânticos e feedback visual consistente, inclusive em layouts de alta densidade.

#### Scenario: Pessoa navega por tabs com teclado

- **WHEN** uma tab recebe foco sem estar ativa
- **THEN** foco e estado ativo continuam visualmente distintos e legíveis nos dois temas

### Requirement: Seleção de navegação é estrutural e responsiva

Tabs e navegação persistente MUST comunicar seleção por indicador, borda ou superfície suave, mantendo o foco visível distinto. Em largura reduzida, os destinos MUST permanecer acessíveis por rolagem horizontal ou quebra controlada, sem truncar ou ocultar itens interativos.

#### Scenario: Conjunto de tabs excede a largura disponível

- **WHEN** tabs não cabem na largura do contêiner
- **THEN** todos os destinos continuam alcançáveis e a tab ativa permanece identificável sem assumir aparência de botão de chamada principal
