## ADDED Requirements

### Requirement: Variantes de altura do skeleton

`AdsSkeleton` MUST aceitar a prop opcional `variant` (`"text"`, `"value"` ou `"block"`), que define a altura pelo token público de skeleton correspondente, e MUST continuar aceitando dimensões próprias por `className`. Sem `variant`, a marcação MUST permanecer a atual.

#### Scenario: Skeleton com variante

- **WHEN** `variant="value"` é informado
- **THEN** o placeholder usa a altura do token de skeleton de valor e mantém a semântica acessível atual

#### Scenario: Skeleton sem variante

- **WHEN** nenhuma variante é informada
- **THEN** a marcação e as classes são as mesmas de antes
