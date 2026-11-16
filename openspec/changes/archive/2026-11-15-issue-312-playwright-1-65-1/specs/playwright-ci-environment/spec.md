## ADDED Requirements

### Requirement: Baselines visuais preservados em atualizações de navegador

O processo de upgrade Playwright MUST preservar os baselines Linux existentes
até uma revisão explícita determinar que uma alteração visual é intencional.

#### Scenario: Nova versão altera pixels sem mudança de produto

- **WHEN** a atualização de browser causa falha nos snapshots
- **THEN** a revisão investiga e apresenta o diff visual, sem atualizar
  automaticamente as imagens ou aumentar tolerâncias para passar na CI

#### Scenario: Diff visual é intencional e aprovado

- **WHEN** a revisão confirma que o novo baseline representa uma mudança
  deliberada e aceitável
- **THEN** o workflow Linux pode publicar somente PNGs revisáveis na branch
  de trabalho, preservando os gates de Chromium, Firefox e WebKit
