## ADDED Requirements

### Requirement: Aparência do botão do menu

`AdsThemeControl` MUST aceitar `triggerVariant` para o botão do `variant="menu"`, com o padrão `secondary` (com borda) preservado, de modo que a aplicação possa usar `ghost` (sem borda) no cabeçalho.

#### Scenario: Padrão preservado

- **WHEN** `triggerVariant` não é informado
- **THEN** o botão mantém o aspecto com borda de antes

#### Scenario: Botão sem borda

- **WHEN** `triggerVariant="ghost"` é informado
- **THEN** o botão não tem borda nem fundo em repouso
