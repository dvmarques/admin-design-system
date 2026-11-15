## ADDED Requirements

### Requirement: Cobertura visual por estado com evidências verificáveis

A auditoria MUST planejar cenários por aplicabilidade, associar amostras ao export, estado, tema e viewport e distinguir execuções aprovadas por verificações objetivas de inspeções visuais humanas.

#### Scenario: Cenário aplicável ainda não executado

- **WHEN** a matriz declara um estado aplicável sem manifesto de execução
- **THEN** o relatório o apresenta como pendente e não como aprovado ou não aplicável

#### Scenario: Execução e revisão têm significados distintos

- **WHEN** uma captura é produzida e verificações de foco ou de estado passam sem sinais
- **THEN** o relatório registra execução objetiva aprovada e revisão visual humana ainda pendente

#### Scenario: Falha ou evidência perdida

- **WHEN** a ação falha, screenshot não é encontrado ou um manifesto está ilegível
- **THEN** o relatório registra falha ou ausência, sem sucesso presumido

#### Scenario: Auditoria manual opt-in

- **WHEN** o workflow de auditoria visual é disparado manualmente
- **THEN** os cenários seletivos são executados fora da CI regular, gerando evidências sem atualizar snapshots oficiais

#### Scenario: Acessibilidade e responsividade selecionadas por risco

- **WHEN** controles interativos, overlays e superfícies de dados são auditados
- **THEN** a suíte testa estados pertinentes, foco/teclado, temas, viewports e emulação de mídia conforme a matriz, sem inferir aprovação de WCAG ou zoom nativo não executado
