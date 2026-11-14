## ADDED Requirements

### Requirement: Inventário rastreável de inspeção visual

O projeto MUST manter uma matriz de inspeção por export visual, ligada ao catálogo e às stories, diferenciando cobertura cadastrada de inspeção comprovada e preservando as evidências existentes.

#### Scenario: Export ou referência de Storybook é modificado

- **WHEN** o inventário é verificado após alteração nas fontes
- **THEN** a verificação falha se nomes, grupos, rotas ou stories divergirem, sem marcar automaticamente a inspeção como concluída

#### Scenario: Inspeção recebe status não pendente

- **WHEN** uma pessoa indica análise, ausência de divergência, defeito ou não aplicabilidade
- **THEN** a verificação exige evidência/justificativa e não sobrescreve outros registros

#### Scenario: Novo modelo é solicitado

- **WHEN** o comando de impressão do inventário é executado
- **THEN** ele produz uma matriz pendente sem modificar arquivos existentes

### Requirement: Triagem visual automatizada com evidências

O projeto MUST oferecer execução opcional de auditoria no navegador para os exports documentados, nos temas claro/escuro e larguras mobile/desktop, produzindo capturas e um relatório que diferencie sinais automatizados de problemas confirmados e declare amostras faltantes.

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
