# Proposal

## Why

A auditoria de botões ao lado de campos, feita com os componentes reais e o CSS
distribuído, encontrou dois pontos que o conteúdo atual do repositório não
mostra, mas que um consumidor encontra:

- **`AdsSelect` e `AdsInput` em `sm` têm alturas diferentes.** Lado a lado, o
  select mede 28px e o input mede 30px. Em `md` (32px) e `lg` (36px) eles
  coincidem. O `AdsInput` tem `line-height` de 20px, então seu conteúdo
  (20px + padding de 8px + borda de 2px = 30px) passa do mínimo
  `--ads-dimension-field-sm` (`1.75rem`, 28px). O `<select>` nativo ignora o
  `line-height` (permanece `normal`, mesmo com `!important`), seu conteúdo fica
  abaixo do mínimo e a altura cai para o piso de 28px.
- **Botão ao lado de campo difere de 2 a 4px, e a biblioteca não orienta.** Os
  botões usam `--ads-dimension-control-*` (32, 36 e 40px) e os campos usam
  `--ads-dimension-field-*` (30, 32 e 36px no input). Em uma linha `items-center`
  o campo desce 1 a 2px. Com um `AdsButton` em `endContent` de `AdsInputGroup`, o
  campo cresce para 34, 38 e 42px, por causa do padding e da borda do adendo.
  Nenhuma documentação explica isso.

## What Changes

**Biblioteca reutilizável**

- `packages/tokens`: `--ads-dimension-field-sm` passa de `1.75rem` para
  `1.875rem` (30px) na fonte (`source/tokens.mjs`), com as saídas geradas. A
  altura mínima do campo pequeno passa a ser a altura real do `AdsInput`, e o
  `AdsSelect` `sm` vai de 28 para 30px. O `AdsInput` e o `AdsTextarea` em `sm` não
  mudam de altura.
- Teste de geometria no navegador: `AdsInput` e `AdsSelect` têm a mesma altura
  em `sm`, `md` e `lg`.
- Storybook: nova story de tamanhos de `AdsInput` e `AdsSelect`, hoje inexistente,
  que mostra `sm`, `md` e `lg` lado a lado e serve de verificação visual.

**Documentação**

- `docs/integration.md`: nova seção sobre botões ao lado de campos, com as alturas
  de cada tamanho, a orientação de alinhamento e o aviso sobre botão em adendo de
  `AdsInputGroup`.
- `CHANGELOG.md`.

**Aplicações de demonstração**

- Nenhuma mudança de código.

## Objetivos e fora do escopo

Objetivos: `AdsSelect` e `AdsInput` com a mesma altura em todos os tamanhos;
consumidor informado sobre a diferença entre altura de botão e de campo.

Fora do escopo: alterar os tokens de controle (`--ads-dimension-control-*`) ou os
demais tokens de campo; alterar a API de `AdsButton` ou `AdsInputGroup`; permitir
botão como adendo sem padding e borda em `AdsInputGroup` (só se houver demanda);
alterar a altura de `AdsInput` em `sm`.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `form-controls`: adiciona o requisito de que controles de mesmo `size` tenham a
  mesma altura, em particular `AdsSelect` e `AdsInput`.
- `component-documentation`: adiciona o requisito de que a documentação de
  integração oriente a composição de botões e campos na mesma linha.

## Impact

- **Pacotes e APIs públicas**: `@admin-ds/tokens` (valor de
  `--ads-dimension-field-sm`) e `@admin-ds/components` (altura de `AdsSelect` em
  `sm`, por consumir o token). Nenhum nome de token, prop, tipo, export ou classe
  muda; compatibilidade retroativa preservada, já que a spec só protege remoção e
  renomeação de tokens. A aparência muda de forma intencional: `AdsSelect` `sm`
  fica 2px mais alto.
- **Dependências**: nenhuma.
- **Consumidores**: quem sobrescreve `--ads-dimension-field-sm` continua com o
  mesmo comportamento; quem usa o valor padrão vê o select pequeno alinhado ao
  input. Snapshots visuais que incluam um `AdsSelect` em `sm` podem mudar.
