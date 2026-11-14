## MODIFIED Requirements

### Requirement: Triagem visual automatizada com evidências

O projeto MUST oferecer execução opcional de auditoria no navegador para os exports documentados, nos temas claro/escuro e larguras mobile/desktop, produzindo capturas e um relatório que diferencie sinais automatizados de problemas confirmados e declare amostras faltantes. A heurística de truncamento MUST distinguir conteúdo realmente recortado de overflow CSS visível não recortado, sem desativar a medição independente de bordas e viewport.

#### Scenario: Catálogo é auditado em navegador real

- **WHEN** a suíte visual é executada contra um build atual do Admin Demo
- **THEN** captura evidências por export/tema/viewport e registra métricas de overflow, posicionamento e erros do navegador, sem alterar snapshots de regressão

#### Scenario: Amostra falha ou deixa de ser executada

- **WHEN** uma rota falha, uma captura não é produzida ou uma combinação está ausente
- **THEN** o relatório indica explicitamente falha ou ausência, sem tratar a amostra como aprovada

#### Scenario: Sinal geométrico é detectado

- **WHEN** uma medição indica possível divergência
- **THEN** o relatório sinaliza a necessidade de revisão humana, sem classificar automaticamente um defeito como confirmado

#### Scenario: Auditoria opcional é solicitada

- **WHEN** o comando dedicado ou o workflow manual é invocado
- **THEN** são gerados relatórios e PNGs separados do ciclo E2E normal, sem atualização de baselines oficiais

#### Scenario: Controle com overflow CSS visível, mas sem conteúdo recortado

- **WHEN** a área interna de um botão icon-only ultrapassa seu `clientWidth` com `overflow-x: visible`
- **THEN** a heurística de truncamento não sinaliza esse controle como recortado, mantendo ativas as checagens independentes de borda/viewport

#### Scenario: Conteúdo efetivamente recortado

- **WHEN** texto excede `clientWidth` com `overflow-x: hidden` ou `clip`
- **THEN** a heurística de truncamento mantém o sinal de necessidade de revisão humana
