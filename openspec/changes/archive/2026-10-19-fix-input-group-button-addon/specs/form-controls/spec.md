# Spec Delta

## ADDED Requirements

### Requirement: Botão no adendo do grupo de entrada acompanha o campo

Quando o conteúdo inicial ou final de `AdsInputGroup` é um `AdsButton`, o grupo MUST ter a mesma altura de um grupo com adendo de texto do mesmo `size` do campo, o botão MUST ocupar toda a altura do grupo e ficar rente ao campo, sem a moldura (borda, fundo e padding) do adendo, e MUST NOT mudar de posição ao receber o ponteiro. Adendos de texto MUST NOT mudar.

#### Scenario: Botão no fim do grupo

- **WHEN** um `AdsInputGroup` com `AdsButton` em `endContent` é renderizado em `sm`, `md` ou `lg`
- **THEN** o grupo, o campo e o botão têm a mesma altura e o mesmo topo, iguais aos de um grupo com adendo de texto do mesmo tamanho

#### Scenario: Botão no início do grupo

- **WHEN** um `AdsInputGroup` com `AdsButton` em `startContent` é renderizado em qualquer tamanho
- **THEN** o botão ocupa toda a altura do grupo, encosta no campo sem fresta e sem a moldura do adendo

#### Scenario: Tamanho do botão diferente do tamanho do campo

- **WHEN** o `size` do botão difere do `size` do campo
- **THEN** a altura do grupo continua sendo a do campo, e o botão não a aumenta

#### Scenario: Ponteiro sobre o botão

- **WHEN** o ponteiro passa sobre o botão do adendo
- **THEN** o botão não se desloca e continua alinhado ao campo

#### Scenario: Teclado e temas

- **WHEN** o botão do adendo recebe foco por teclado nos temas claro e escuro
- **THEN** o foco é visível e o texto do botão mantém contraste legível

#### Scenario: Adendo de texto

- **WHEN** o adendo contém apenas texto
- **THEN** a moldura, o padding e a altura do adendo não mudam
