# Spec Delta

## MODIFIED Requirements

### Requirement: Somente leitura é distinguível de indisponibilidade

AdsInput, AdsTextarea e AdsSelect MUST comunicar visualmente somente leitura de forma distinta de indisponibilidade, preservando a legibilidade e o comportamento nativo aplicável. Hover e foco MUST ser perceptíveis apenas quando a interação for permitida. O estilo somente leitura MUST aplicar-se somente ao atributo `readonly` (ou equivalente nativo) e MUST NOT usar a pseudo-classe `:read-only` no CSS distribuído.

#### Scenario: Valor somente leitura é exibido

- **WHEN** uma aplicação renderiza um controle textual somente leitura ao lado de um controle desabilitado
- **THEN** ambos são distinguíveis visualmente e o valor somente leitura continua legível para cópia ou seleção quando o elemento nativo permitir

#### Scenario: Select editável mantém borda de controle

- **WHEN** `AdsSelect` é renderizado sem atributo `readonly` em estado editável
- **THEN** seu limite usa o papel `borderControl` e permanece visível, inclusive quando o elemento nativo `select` é tecnicamente somente leitura pelo navegador; o CSS distribuído não usa `:read-only`, que também casaria com `select` nativo e removeria esse limite
