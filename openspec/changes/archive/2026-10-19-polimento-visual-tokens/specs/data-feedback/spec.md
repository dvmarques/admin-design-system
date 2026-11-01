## ADDED Requirements

### Requirement: Tamanho compacto do estado vazio

`AdsEmptyState` MUST aceitar a prop opcional `size` (`"md"` ou `"compact"`). `"compact"` MUST reduzir o espaçamento e a tipografia para áreas pequenas, como cards e painéis, sem alterar a semântica; com `size` ausente ou `"md"`, a marcação e as classes MUST permanecer as atuais.

#### Scenario: Estado vazio compacto

- **WHEN** `size="compact"` é informado
- **THEN** o estado vazio usa o espaçamento reduzido, mantém título e descrição e não usa `role="alert"`

#### Scenario: Tamanho padrão

- **WHEN** `size` não é informado
- **THEN** a marcação é a mesma de antes
