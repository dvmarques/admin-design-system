# Spec Delta

## MODIFIED Requirements

### Requirement: Aplicação de referência

O projeto MUST manter uma aplicação Next.js de referência que consuma os artefatos distribuíveis como uma aplicação externa, organizada em múltiplas rotas com layout compartilhado e validada quanto a renderização no servidor e hidratação em cada rota.

#### Scenario: Contrato público é verificado

- **WHEN** o pipeline valida a aplicação de referência
- **THEN** imports internos ou dependências implícitas do workspace fazem a validação falhar

#### Scenario: Rotas são renderizadas e hidratadas

- **WHEN** cada rota da aplicação de referência é renderizada no servidor e hidratada no navegador
- **THEN** nenhuma divergência de hidratação atribuível ao design system é reportada em nenhuma rota
