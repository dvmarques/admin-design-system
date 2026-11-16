## ADDED Requirements

### Requirement: Cabeçalhos e separadores não interativos de dropdown

O AdsDropdown MUST oferecer `Header` e `Divider` composáveis no Content, mantendo a API e os mecanismos existentes de menu, posicionamento e portal. Header e Divider MUST permanecer fora da navegação por itens ativáveis e MUST permitir agrupamento acessível com semântica nativa de grupo e rótulo.

#### Scenario: Menu com agrupamento

- **WHEN** o consumidor coloca Header com id e grupos `role=group` com `aria-labelledby`, intercalando Divider e Item
- **THEN** leitores de tela encontram os grupos identificados e separadores, enquanto somente Items habilitados recebem foco na navegação por setas, Home e End

#### Scenario: Fechamento e retorno de foco

- **WHEN** o usuário navega por teclado e pressiona Escape, Tab ou Shift+Tab
- **THEN** Escape fecha e devolve foco ao gatilho, enquanto Tab fecha e prossegue para a parada de foco anterior ou seguinte ao gatilho sem aprisionamento no portal

#### Scenario: Tab com foco no gatilho

- **WHEN** o menu está aberto e o foco permanece no gatilho após clique ou por não existir item habilitado
- **THEN** Tab e Shift+Tab fecham o menu e preservam a navegação nativa a partir do gatilho

#### Scenario: Regressão de menu

- **WHEN** Tab ou Shift+Tab chega ao limite da sequência do documento com o menu portado aberto
- **THEN** o menu fecha e permite a tabulação nativa a partir do gatilho, inclusive a saída do documento quando não existe outra parada nesse sentido

#### Scenario: Evento de teclado cancelado pelo consumidor

- **WHEN** um descendente ou o handler público do Content cancela o evento de teclado
- **THEN** o dropdown preserva o estado e o foco, sem executar sua navegação ou fechamento internos

#### Scenario: Regressão de itens

- **WHEN** o consumidor usa Items normais, desabilitados, menus vazios ou valores radio em telas pequenas ou portais aninhados
- **THEN** os novos elementos não recebem foco nem ativação e fechamento, layering e posicionamento existentes continuam funcionando
