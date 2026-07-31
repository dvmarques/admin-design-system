## ADDED Requirements

### Requirement: Regressão visual da fundação revisada

O projeto MUST manter histórias e snapshots visuais atualizados para os componentes existentes afetados por tokens globais, incluindo estados representativos nos temas claro e escuro.

#### Scenario: Token global altera a aparência compartilhada

- **WHEN** uma alteração modifica a fundação tipográfica ou de cores
- **THEN** a validação visual compara os componentes existentes afetados nos temas claro e escuro e sinaliza regressões não aprovadas

### Requirement: Evidência automatizada de contraste

O projeto MUST verificar automaticamente os pares críticos de cores da fundação visual contra os critérios aplicáveis do WCAG 2.2 nível AA.

#### Scenario: Um token reduz o contraste de conteúdo essencial

- **WHEN** a validação executa para os temas claro e escuro
- **THEN** ela falha se um par crítico de conteúdo, superfície, controle ou foco não atingir o contraste mínimo aplicável

### Requirement: Tema e contraste dos overlays possuem cobertura automatizada

O projeto MUST verificar o tema computado de overlays portados, a troca de tema com o overlay aberto e o contraste dos controles de fechar de dialog, drawer e toast nos estados padrão, hover e foco.

#### Scenario: Validação executa para controles de fechar

- **WHEN** os testes renderizam dialog, drawer e toast em escopos locais claro e escuro
- **THEN** as cores computadas correspondem aos tokens do tema de origem e os pares de contraste atendem aos critérios definidos
