## Purpose

Disponibilizar configuração Codex reproduzível por projeto, com ferramentas de revisão e cuidados de edição compatíveis com as políticas dos demais agentes.

## ADDED Requirements

### Requirement: Configuração Codex compartilhada

O repositório MUST fornecer configuração de MCP do Codex com os mesmos servidores e versões de Claude/Cursor, sem caminhos de máquina, credenciais ou escolhas pessoais de modelo. As skills MUST permanecer em `.agents/skills`.

#### Scenario: Nova worktree confiável

- **WHEN** o Codex carrega a configuração de uma worktree confiável
- **THEN** os MCPs do projeto e os revisores ficam disponíveis sem copiar arquivos do checkout principal

### Requirement: Revisores especializados

O projeto MUST disponibilizar revisores Codex de acessibilidade e contratos públicos com instruções de análise sem edição e referência a `AGENTS.md`. Os revisores MUST considerar o diff da branch e as alterações locais.

#### Scenario: Revisão de uma branch commitada

- **WHEN** um revisor é invocado sem alterações locais pendentes
- **THEN** ele analisa o diff contra a base da PR em vez de concluir que não há alterações

### Requirement: Proteção de arquivos gerados em patches

O hook pré-edição MUST examinar todos os caminhos de `apply_patch`, incluindo origem e destino de movimentações, e negar edição manual de lockfile, tokens gerados, distribuição de tokens e baselines visuais. A detecção MUST normalizar caminhos relativos ao diretório da chamada.

#### Scenario: Patch misto e movimentação

- **WHEN** um patch inclui um arquivo comum e um caminho protegido, na origem ou no destino
- **THEN** o hook nega a chamada inteira e informa como atualizar o artefato pela ferramenta adequada

#### Scenario: Subdiretórios e caminhos normalizados

- **WHEN** a edição usa caminho absoluto ou segmentos relativos a partir de um subdiretório
- **THEN** a mesma política é aplicada ao arquivo resolvido na worktree atual

### Requirement: Formatação focal após patches

O hook pós-edição MUST executar o Prettier local apenas nos arquivos existentes afetados pelo patch, sem shell para interpolar nomes de arquivo. Remoções e arquivos gerados MUST ser excluídos. Falhas ou dependências ausentes MUST ser comunicadas sem desfazer a edição.

#### Scenario: Edição e remoção no mesmo patch

- **WHEN** um patch altera código e remove outro arquivo
- **THEN** somente os arquivos finais existentes e elegíveis são enviados ao Prettier

### Requirement: Ativação explícita e limites documentados

A documentação MUST explicar confiança dos hooks e do projeto, descoberta em novas sessões e a ausência de cobertura de escritas por shell ou outras ferramentas. Os hooks MUST funcionar em Windows e Linux a partir de subdiretórios, com caminhos de repositório contendo espaços.

#### Scenario: Hooks ainda não confiáveis

- **WHEN** uma pessoa abre um clone novo e os hooks precisam de revisão
- **THEN** as instruções orientam revisar e confiar na definição usando os controles do Codex, sem desabilitar a verificação de confiança
