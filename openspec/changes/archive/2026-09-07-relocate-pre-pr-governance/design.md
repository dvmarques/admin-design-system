## Context

O repositório já possui três destinos apropriados para instruções de processo: `AGENTS.md` para execução por agentes, `openspec/config.yaml` para critérios e orientações do fluxo OpenSpec e `docs/quality.md` para quem contribui. O spec principal `pre-pr-validation` replica essas orientações, enquanto `quality-assurance` já define o comportamento verificável do comando de validação.

Consulte `proposal.md` para a motivação e a delta spec para a retirada da capability.

## Goals / Non-Goals

**Goals:**

- Separar o contrato estável de qualidade das instruções operacionais do repositório.
- Preservar uma fonte de orientação adequada para cada público: agentes, changes e contribuidores.
- Retirar o spec operacional sem perder o histórico da decisão arquivada.

**Non-Goals:**

- Alterar scripts, comandos de validação ou cobertura de testes.
- Remover o requisito de `quality-assurance` que obriga a validação principal a incluir E2E.
- Reescrever ou apagar o histórico arquivado de `strengthen-pre-pr-validation`.

## Decisions

### Retirar a capability operacional

O spec principal `pre-pr-validation` será removido por completo com a marcação explícita de retirada da capability. Seus requisitos descrevem como trabalhar no repositório, e não um comportamento estável entregue pelo design system.

Alternativa considerada: manter o spec como documentação de governança. Isso duplica regras já presentes em fontes mais adequadas e torna mudanças de processo dependentes de sincronização de specs.

### Manter o contrato mínimo em quality-assurance

O spec `quality-assurance` continua responsável pelo contrato verificável: a validação principal inclui E2E e falha se uma etapa falhar. Detalhes como checklist, atualização de snapshots, seletores e modo silencioso ou verboso permanecem nas fontes operacionais.

Alternativa considerada: remover também esse requisito. Isso enfraqueceria o contrato do repositório que consumidores internos podem verificar pelo comando de validação.

### Distribuir orientação pelo público-alvo

`AGENTS.md` será a instrução prescritiva para agentes; `openspec/config.yaml` estabelecerá requisitos e orientações para changes; `docs/quality.md` explicará os comandos e o checklist para contribuidores. As três fontes devem apontar para os mesmos comandos sem introduzir APIs ou dependências.

## Risks / Trade-offs

- [Regras de processo divergirem entre arquivos] → Revisar os comandos e as responsabilidades em conjunto na implementação.
- [Remoção do spec ocultar a exigência de E2E] → Preservar e validar o requisito correspondente em `quality-assurance`.
- [Histórico parecer perdido] → Manter intacta a change arquivada que originou a capability retirada.

## Migration Plan

1. Atualizar `AGENTS.md`, `openspec/config.yaml` e `docs/quality.md` com as orientações operacionais existentes.
2. Retirar `openspec/specs/pre-pr-validation/spec.md` por meio da delta spec desta change.
3. Validar todos os specs e o conjunto OpenSpec antes do arquivamento.
