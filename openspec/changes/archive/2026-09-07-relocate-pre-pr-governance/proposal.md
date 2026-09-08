## Why

O spec `pre-pr-validation` descreve regras operacionais do repositório, como checklist, comandos e preferência de saída dos testes. Esses detalhes não são um contrato público e estável do design system, criando duplicação com a configuração OpenSpec, as instruções de trabalho e a documentação de qualidade.

## What Changes

- Retirar a capability `pre-pr-validation` dos specs principais.
- Preservar em `quality-assurance` apenas o contrato observável de que a validação principal inclui E2E e falha quando alguma etapa falha.
- Consolidar regras operacionais para agentes em `AGENTS.md`, requisitos de changes em `openspec/config.yaml` e instruções para desenvolvedores em `docs/quality.md`.
- Manter o histórico completo da decisão na change arquivada anterior.

## Capabilities

### New Capabilities

- Nenhuma.

### Modified Capabilities

- `pre-pr-validation`: capability retirada porque seu conteúdo é orientação operacional, não especificação de comportamento estável.

## Impact

- Governança e documentação do repositório: `AGENTS.md`, `openspec/config.yaml` e `docs/quality.md`.
- Specs: remoção de `openspec/specs/pre-pr-validation/spec.md`; `quality-assurance` permanece como contrato de validação automatizada.
- Nenhum pacote distribuível, API pública, aplicação de demonstração ou dependência de runtime é afetado.
