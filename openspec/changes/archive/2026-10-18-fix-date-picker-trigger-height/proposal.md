# Proposal

## Why

Na revisão de geometria do Storybook, o campo "Criado em" do `AdsFilterBar`
ficou 2px mais baixo que os campos vizinhos "Busca" e "Status" (topo em 95px
contra 93px). A causa está no `AdsDatePicker`: o gatilho do calendário é um
`AdsButton` com o mesmo `size` do campo, mas o botão usa os tokens de altura de
controle (`--ads-dimension-control-sm/md/lg`: 32, 36 e 40px) e o `AdsInput` usa os
tokens de altura de campo (`--ads-dimension-field-sm/md/lg`: 28, 32 e 36px). O
gatilho fica 4px mais alto que o campo e, com `items-center` na linha, o campo é
centralizado em relação a ele e desce 2px.

Além do desalinhamento com os vizinhos, o botão visivelmente mais alto que o
campo ao lado quebra a aparência de um único controle.

## What Changes

**Biblioteca reutilizável (`packages/components`)**

- `AdsDatePicker`: o gatilho do calendário passa a ter a altura do campo do mesmo
  `size`, esticando-se até a altura da linha (que é a do campo), em vez de usar a
  altura mínima do botão. O campo volta a alinhar com os campos vizinhos.
- Testes de classes por tamanho, de CSS distribuído e de geometria no navegador
  (altura do gatilho igual à do campo e topo alinhado ao vizinho).

**Aplicações de demonstração e documentação**

- Nenhuma mudança de código no admin demo; ele apenas confirma que o resultado
  visual muda só na altura do gatilho do calendário.
- `CHANGELOG.md`.

## Objetivos e fora do escopo

Objetivos: gatilho do calendário com a altura do campo, em `sm`, `md` e `lg`;
campo do `AdsDatePicker` alinhado aos vizinhos em uma grade; nenhuma mudança de
API pública.

Fora do escopo: alterar os tokens `--ads-dimension-*`; criar prop ou tamanho novo
em `AdsButton`; auditar outros pares de `AdsButton` ao lado de `AdsInput`, que
podem ter a mesma diferença de 4px e ficam para uma change própria se o problema
for confirmado.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `date-picker`: adiciona o requisito de que o gatilho do calendário tenha a altura
  do campo e de que o campo alinhe com os controles vizinhos.

## Impact

- **Pacotes e APIs públicas**: `@admin-ds/components`, `AdsDatePicker`. Nenhuma
  prop, tipo, export, classe `ads-*` ou variável `--ads-*` muda; compatibilidade
  retroativa preservada. A aparência muda de forma intencional: o gatilho do
  calendário fica 4px mais baixo, igual ao campo.
- **Dependências**: nenhuma.
- **Consumidores**: o `AdsDatePicker` alinha com campos vizinhos e o gatilho tem a
  altura do campo, sem configuração adicional. Snapshots visuais que incluem o
  gatilho do calendário podem mudar.
