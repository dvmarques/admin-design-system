# Spec Delta

## ADDED Requirements

### Requirement: Grupo de seleção sem moldura nativa

O `fieldset` e a `legend` de `AdsSelectionGroup` MUST NOT exibir a borda, a margem ou o recuo padrão do navegador, nos temas claro e escuro. A aparência do grupo MUST vir apenas dos estilos da biblioteca.

#### Scenario: Grupo de seleção no tema escuro

- **WHEN** um `AdsSelectionGroup` com legenda é renderizado no tema escuro
- **THEN** nem o `fieldset` nem a `legend` mostram a moldura ou o recuo nativos do navegador
