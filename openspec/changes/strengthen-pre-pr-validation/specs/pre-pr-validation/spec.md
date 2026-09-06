## Purpose

Definir uma validação pré-PR reproduzível que encontre localmente regressões de integração e apresentação antes do envio para revisão.

## ADDED Requirements

### Requirement: Checklist pré-PR documentada

O projeto MUST documentar uma checklist pré-PR que exija a execução bem-sucedida de formatação, lint, verificação de tipos, testes, build e testes E2E antes do envio para revisão.

#### Scenario: Pessoa prepara uma alteração para revisão

- **WHEN** a pessoa consulta a documentação de contribuição ou qualidade antes de abrir um PR
- **THEN** ela encontra os comandos obrigatórios de validação pré-PR, incluindo a execução de E2E

### Requirement: Aprovação deliberada de snapshots visuais

O projeto MUST instruir que snapshots visuais sejam atualizados somente quando a mudança de aparência for intencional e revisada, e que divergências não aprovadas façam a validação E2E falhar.

#### Scenario: Alteração modifica uma aparência coberta

- **WHEN** a suíte E2E detecta diferença em um snapshot visual
- **THEN** a alteração permanece falhando até que a aparência seja corrigida ou o snapshot seja atualizado deliberadamente

### Requirement: Contratos estáveis nos testes E2E

Os testes E2E MUST localizar os elementos necessários por contratos de interface estáveis, priorizando funções e nomes acessíveis, identificadores semânticos ou headings de seção estáveis quando disponíveis, em vez de conteúdo editorial incidental.

#### Scenario: Conteúdo editorial é revisado

- **WHEN** um texto descritivo não contratual é alterado sem mudar o fluxo público coberto
- **THEN** os testes E2E continuam localizando os controles e regiões estáveis necessários para validar o fluxo

