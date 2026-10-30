## ADDED Requirements

### Requirement: Pontas do ciclo de Tab seguem a ordem real de tabulação

Em `AdsDialog` e `AdsDrawer`, incluindo o `AdsConfirmDialog` que os compõe, o sistema MUST determinar o primeiro e o último destino do ciclo de Tab pela ordem real de tabulação do navegador: controles com `tabindex` positivo em ordem crescente, seguidos dos demais em ordem de documento. O sistema MUST tratar cada grupo de rádio (mesmo `name` e mesmo formulário) como uma única parada: a opção marcada ou, sem marcada, a primeira no Tab e a última no Shift+Tab.

#### Scenario: Tabindex positivo define as pontas

- **WHEN** um modal aberto contém controles com `tabindex` positivo e outros sem `tabindex`, e o usuário usa Tab no último controle da ordem real ou Shift+Tab no primeiro
- **THEN** o foco vai à outra ponta da ordem real de tabulação, sem saltar controles nem escapar do modal

#### Scenario: Grupo de rádio na ponta do ciclo

- **WHEN** um grupo de rádio está na última ou na primeira posição do modal e o usuário usa Tab ou Shift+Tab a partir da parada do grupo
- **THEN** o foco dá a volta do ciclo imediatamente, sem passar pelo documento fora do modal

#### Scenario: Rádios que não formam grupo

- **WHEN** rádios têm `name` diferentes, formulários distintos ou não têm `name`
- **THEN** cada um permanece como parada própria

### Requirement: Foco inicial com abertura na montagem em StrictMode

O sistema MUST mover o foco para o primeiro controle elegível, ou para o contêiner, quando um overlay modal é montado já aberto, inclusive sob React StrictMode.

#### Scenario: Montagem aberta em StrictMode

- **WHEN** um `AdsDialog`, `AdsDrawer` ou `AdsConfirmDialog` é renderizado em StrictMode com `open` inicial verdadeiro
- **THEN** `document.activeElement` fica dentro do modal

### Requirement: iframe na ponta do ciclo é limitação documentada

O sistema MUST NOT excluir `iframe` do ciclo de Tab, e a limitação de que o foco transferido ao documento interno não é alcançável pelo ciclo MUST constar em `docs/limitations.md`.

#### Scenario: Documentação da limitação

- **WHEN** um consumidor consulta `docs/limitations.md`
- **THEN** encontra o `iframe` como limitação conhecida e não encontra rádios nem `tabindex` positivo como limitações
