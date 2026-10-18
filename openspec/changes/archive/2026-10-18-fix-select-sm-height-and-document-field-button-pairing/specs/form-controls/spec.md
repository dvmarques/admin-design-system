# Spec Delta

## ADDED Requirements

### Requirement: Controles textuais de mesmo tamanho têm a mesma altura

`AdsInput` e `AdsSelect` MUST ter a mesma altura quando renderizados com o mesmo `size` (`sm`, `md` ou `lg`), de modo que posicionados lado a lado permaneçam alinhados.

#### Scenario: Input e select em sm

- **WHEN** um `AdsInput` e um `AdsSelect` com `size="sm"` são renderizados lado a lado
- **THEN** os dois têm a mesma altura e o mesmo topo

#### Scenario: Input e select em md e lg

- **WHEN** um `AdsInput` e um `AdsSelect` com `size="md"` ou `size="lg"` são renderizados lado a lado
- **THEN** os dois têm a mesma altura e o mesmo topo

#### Scenario: Personalização por tokens

- **WHEN** o consumidor sobrescreve o token público de altura mínima de campo de um tamanho em um escopo de tema
- **THEN** a altura mínima do campo reflete o novo valor sem recompilar a biblioteca
