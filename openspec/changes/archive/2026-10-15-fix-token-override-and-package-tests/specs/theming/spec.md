# Spec Delta

## ADDED Requirements

### Requirement: Sobrescrita de tokens documentada alcança overlays portados

A documentação pública de sobrescrita de tokens MUST indicar seletores que alcancem tanto o documento quanto overlays portados (dialog, drawer e toast), e MUST NOT recomendar `:root[data-theme=…]` para esse fim.

#### Scenario: Sobrescrita aplicada ao tema escuro

- **WHEN** uma aplicação sobrescreve `--ads-color-primary` em `[data-theme='dark']` depois do CSS de tokens
- **THEN** o documento e um overlay portado no tema escuro resolvem o novo valor

#### Scenario: Orientação consistente entre documentos

- **WHEN** o README de `@admin-ds/tokens` e `docs/integration.md` descrevem a sobrescrita de tokens
- **THEN** ambos indicam `[data-theme='light']` e `[data-theme='dark']` e nenhum recomenda `:root[data-theme=…]`
