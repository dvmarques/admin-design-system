## ADDED Requirements

### Requirement: Validação recorrente e verificável de segurança

O repositório MUST analisar JavaScript/TypeScript com SAST, dependências de produção e desenvolvimento com SCA e possíveis segredos versionados, preservando resultados consultáveis e falhas não mascaradas.

#### Scenario: PR pronta contém vulnerabilidade alta

- **WHEN** uma PR não Draft contém vulnerabilidade high/critical não formalmente aceita
- **THEN** o gate responsável falha e exibe evidência suficiente para triagem sem revelar segredos

#### Scenario: Dependência possui alerta moderado

- **WHEN** npm audit identifica apenas avisos low/moderate
- **THEN** os alertas são registrados e o gate de severidade high/critical não falha por esse motivo

#### Scenario: Erro no scanner

- **WHEN** uma ferramenta falha operacionalmente ou produz relatório inválido
- **THEN** o job falha sem anunciar zero vulnerabilidades

### Requirement: Exclusão de PRs Draft e cobertura independente

Os jobs de segurança MUST NOT executar para Pull Requests Draft e MUST executar ao marcar Ready for Review, a cada novo commit enquanto Ready, em pushes para develop/master e em agenda semanal da branch padrão.

#### Scenario: PR Draft recebe commits

- **WHEN** a PR está Draft ao ser aberta ou sincronizada
- **THEN** jobs de segurança são skipped e não ficam pendentes por falta de workflow

#### Scenario: PR torna-se Ready

- **WHEN** a PR é marcada Ready for Review
- **THEN** os três gates de segurança são executados sobre a revisão da PR

#### Scenario: Branch integrada ou agenda semanal

- **WHEN** ocorre push em develop/master ou chega a agenda semanal
- **THEN** os gates executam sem depender de uma PR

### Requirement: Isolamento de privilégios e triagem

A análise de código não confiável MUST utilizar permissões mínimas, não disponibilizar segredos de escrita para PR de fork e registrar exceções de auditoria por advisory com justificativa, responsável e revisão temporal.

#### Scenario: PR de fork não confiável

- **WHEN** uma PR de um fork inicia validações
- **THEN** nenhum job utiliza pull_request_target, credenciais secretas do repositório ou token com escrita em contents

#### Scenario: Exceção perde validade

- **WHEN** uma exceção de risco expira ou está incompleta
- **THEN** o gate bloqueia um finding de severidade alta que corresponda à exceção inválida

### Requirement: Impacto de performance rastreável

O projeto MUST medir e documentar custo temporal dos novos jobs e impacto na latência da CI, usando medições reais vinculadas a execuções.

#### Scenario: Segurança é integrada

- **WHEN** ao menos uma execução completa da nova CI conclui
- **THEN** o mantenedor pode consultar duração individual dos scanners, latência total e links de evidência na issue

#### Scenario: Baseline não comparável

- **WHEN** não há amostra comparável suficiente antes/depois
- **THEN** a documentação informa a limitação sem inventar diferença de duração
