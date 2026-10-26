## ADDED Requirements

### Requirement: Formulários de contribuição
O repositório SHALL oferecer formulários para bug, enhancement e documentation, usando os labels existentes e coletando escopo, critérios de aceite, referências e validação.

#### Scenario: Relatar erro
- **WHEN** a pessoa abre uma issue de bug
- **THEN** o formulário solicita reprodução, resultado esperado, evidências e impacto

#### Scenario: Propor documentação
- **WHEN** a pessoa escolhe documentation
- **THEN** o formulário aplica a classificação documentation e solicita fontes, aceitação e validação

### Requirement: Pull requests verificáveis
A PR SHALL fornecer checklist de rastreabilidade, validações efetivamente executadas, riscos, archive/sync e revisão humana, distinguindo integração comum de release.

#### Scenario: Concluir change antes do squash
- **WHEN** todas as tasks da change estão concluídas e o archive autorizado foi feito na branch da PR
- **THEN** as specs sincronizadas e o diff final são novamente revisados e validados antes de permitir squash

#### Scenario: Release
- **WHEN** a PR possui label release e segue o fluxo de release
- **THEN** deve permanecer exigido merge commit e os controles próprios de release, sem aplicar squash de PR comum

### Requirement: Instrução consistente para agentes e contribuidores
O repositório SHALL documentar um fluxo de contribuição que remete à fonte normativa e não obriga atividades administrativas de archive e merge como tarefas implementáveis da change.

#### Scenario: Retomar trabalho
- **WHEN** outro agente assume uma issue com change e PR existentes
- **THEN** encontra links às regras, identifica o SHA e confere tasks e CI antes de agir
