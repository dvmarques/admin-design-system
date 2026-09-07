## REMOVED Requirements

### Requirement: Checklist pré-PR documentada

**Reason**: A checklist é instrução operacional para quem contribui e não um contrato estável do design system.

**Migration**: Manter e evoluir a checklist em `docs/quality.md` e as regras de execução em `AGENTS.md` e `openspec/config.yaml`.

### Requirement: Aprovação deliberada de snapshots visuais

**Reason**: A política de revisão e atualização de snapshots orienta o processo de entrega, sem expor comportamento de uma capability do produto.

**Migration**: Registrar a política em `docs/quality.md` e exigir sua observância pelas orientações de tasks e apply no `openspec/config.yaml`.

### Requirement: Contratos estáveis nos testes E2E

**Reason**: A escolha de seletores é convenção de autoria de testes, não requisito público do design system.

**Migration**: Documentar a convenção para agentes em `AGENTS.md` e para contribuidores em `docs/quality.md`.

### Requirement: Saída concisa com diagnóstico disponível

**Reason**: A forma de apresentar logs é detalhe do processo de desenvolvimento e dos scripts internos.

**Migration**: Documentar os comandos concisos e verbosos em `docs/quality.md` e mantê-los como orientação de execução em `AGENTS.md` e `openspec/config.yaml`.
