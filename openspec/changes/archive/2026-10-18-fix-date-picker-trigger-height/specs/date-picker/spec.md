# Spec Delta

## ADDED Requirements

### Requirement: Gatilho do calendário tem a altura do campo

O gatilho do calendário de `AdsDatePicker` MUST ter a mesma altura do campo de texto do mesmo `size` (`sm`, `md` ou `lg`), de modo que o campo permaneça alinhado ao topo dos controles vizinhos de mesmo `size` quando o seletor é posicionado em uma linha ou grade.

#### Scenario: Gatilho e campo com a mesma altura

- **WHEN** um `AdsDatePicker` de seleção única é renderizado em `sm`, `md` ou `lg`
- **THEN** a altura do gatilho do calendário é igual à do campo de data

#### Scenario: Intervalo de datas

- **WHEN** um `AdsDatePicker` de intervalo é renderizado
- **THEN** os dois campos e o gatilho têm a mesma altura e o mesmo topo

#### Scenario: Alinhamento com campos vizinhos

- **WHEN** um `AdsDatePicker` é colocado em uma grade ao lado de outro campo de texto do mesmo `size`
- **THEN** o topo do campo de data coincide com o topo do campo vizinho

#### Scenario: Estados e temas

- **WHEN** o seletor está desabilitado, em estado de erro ou em tema claro ou escuro
- **THEN** a altura do gatilho continua igual à do campo
