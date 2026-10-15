# Spec Delta

## ADDED Requirements

### Requirement: Links de AdsNav sem sublinhado nativo

Os itens de `AdsNav` renderizados como link MUST NOT exibir o sublinhado padrão do navegador, em nenhum estado, e MUST comunicar o item atual por `aria-current`, borda e superfície.

#### Scenario: Item de navegação com href

- **WHEN** um `AdsNav` com itens que possuem `href` é renderizado
- **THEN** o CSS distribuído remove o sublinhado dos links e o item atual mantém `aria-current="page"`
