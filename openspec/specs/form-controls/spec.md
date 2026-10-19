# form-controls Specification

## Purpose

Disponibilizar controles textuais reutilizáveis para que aplicações administrativas coletem dados com semântica nativa, estados previsíveis e aparência consistente.

## Requirements

### Requirement: Controles textuais públicos

O sistema MUST exportar controles `AdsInput`, `AdsTextarea` e `AdsSelect`, juntamente com seus tipos públicos prefixados por `Ads`, que aceitem os atributos HTML nativos aplicáveis e uma `className` para personalização segura.

#### Scenario: Aplicação renderiza um campo textual

- **WHEN** uma aplicação Next.js importa e renderiza `AdsInput` com atributos nativos de formulário
- **THEN** o campo mantém a semântica, o valor e o comportamento nativo esperados pelo navegador sem exigir Tailwind na aplicação consumidora

#### Scenario: Aplicação renderiza uma área de texto ou seleção

- **WHEN** uma aplicação renderiza `AdsTextarea` ou `AdsSelect` com suas opções e atributos nativos
- **THEN** o controle apresenta e altera os dados conforme o elemento HTML correspondente

### Requirement: Estados visuais e operacionais de controles textuais

Os controles textuais MUST suportar estados visualmente distinguíveis de foco, desabilitado, somente leitura quando aplicável, inválido e sucesso, sem que a informação de estado dependa somente da cor.

#### Scenario: Campo inválido recebe foco

- **WHEN** um consumidor informa que um controle está inválido e a pessoa o focaliza pelo teclado
- **THEN** o estado inválido e o indicador de foco permanecem distinguíveis nos temas claro e escuro

#### Scenario: Campo desabilitado ou somente leitura

- **WHEN** um consumidor aplica os atributos nativos `disabled` ou `readOnly` quando suportado
- **THEN** o controle respeita o comportamento nativo e comunica visualmente sua indisponibilidade ou somente leitura

### Requirement: Temas e tokens dos controles textuais

Os controles textuais MUST responder aos tokens semânticos documentados de fundo,
texto, borda e estados, incluindo valores para tema claro e escuro, e MUST
permitir que o consumidor altere esses tokens sem recompilar a biblioteca. Os
limites interativos dos controles MUST usar o papel `borderControl` para atender
ao contraste mínimo de 3:1, reservando `border` a usos decorativos.

#### Scenario: Consumidor personaliza o tema do campo

- **WHEN** uma aplicação redefine um token de formulário suportado no escopo de seu tema
- **THEN** os controles refletem a personalização por meio do CSS público distribuído

#### Scenario: CSS é consumido externamente

- **WHEN** uma aplicação importa o CSS publicado do pacote de componentes sem configurar Tailwind
- **THEN** os controles exibem seus estilos e estados documentados

### Requirement: Somente leitura é distinguível de indisponibilidade

AdsInput, AdsTextarea e AdsSelect MUST comunicar visualmente somente leitura de
forma distinta de indisponibilidade, preservando a legibilidade e o comportamento
nativo aplicável. Estados de hover e foco MUST ser perceptíveis apenas quando a
interação for permitida. O estilo somente leitura MUST aplicar-se somente ao
atributo `readonly` (ou equivalente nativo), e MUST NOT usar a pseudo-classe
`:read-only` no CSS distribuído, pois ela também casa com elementos `select`
nativos e removeria o limite de controle de `AdsSelect`.

#### Scenario: Valor somente leitura é exibido

- **WHEN** uma aplicação renderiza um controle textual somente leitura ao lado de um controle desabilitado
- **THEN** ambos são distinguíveis visualmente e o valor somente leitura continua legível para cópia ou seleção quando o elemento nativo permitir

#### Scenario: Select editável mantém borda de controle

- **WHEN** `AdsSelect` é renderizado sem atributo `readonly` em estado editável
- **THEN** seu limite usa o papel `borderControl` e permanece visível, inclusive
  quando o elemento nativo `select` é tecnicamente somente leitura pelo navegador

### Requirement: Controles textuais respeitam a largura do contêiner

Controles textuais públicos de largura total MUST ocupar no máximo a largura do campo ou da coluna que os contém, contando padding e borda, independentemente de a aplicação consumidora definir um reset de `box-sizing`.

#### Scenario: Campo de texto em uma coluna de filtros

- **WHEN** um controle textual é renderizado em uma coluna de uma grade ao lado de um seletor, sem reset global de `box-sizing` na aplicação
- **THEN** a borda direita do controle não ultrapassa a borda da coluna e não sobrepõe o controle vizinho

#### Scenario: Largura reduzida

- **WHEN** a viewport tem 390px de largura e o controle textual está em um campo de largura total
- **THEN** o controle permanece dentro do campo, sem causar rolagem horizontal na página

#### Scenario: Temas e estados

- **WHEN** o controle está nos temas claro ou escuro, ou em estado de erro, sucesso ou desabilitado
- **THEN** a largura ocupada é a mesma do estado padrão

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

### Requirement: Vários botões no mesmo adendo ficam contíguos

Quando o conteúdo inicial ou final de `AdsInputGroup` contém mais de um `AdsButton` como filhos diretos, os botões MUST ficar contíguos, com a altura do campo, sem fresta entre eles, e somente a quina externa do conjunto MUST ser arredondada. Um adendo com um só botão MUST NOT mudar.

#### Scenario: Dois botões no fim do grupo

- **WHEN** um `AdsInputGroup` com dois `AdsButton` em `endContent` é renderizado em `sm`, `md` ou `lg`
- **THEN** os dois botões têm a altura e o topo do campo, a junção entre eles se sobrepõe em 1px e somente a quina direita do segundo botão é arredondada

#### Scenario: Dois botões no início do grupo

- **WHEN** um `AdsInputGroup` com dois `AdsButton` em `startContent` é renderizado em qualquer tamanho
- **THEN** somente a quina esquerda do primeiro botão é arredondada e a junção entre os botões e a junção com o campo não somam bordas duplas

#### Scenario: Ponteiro e teclado

- **WHEN** o ponteiro passa sobre um dos botões ou ele recebe foco por teclado
- **THEN** o botão não se desloca, o foco é visível e cada botão continua acessível por `Tab` na ordem visual

#### Scenario: Um só botão

- **WHEN** o adendo contém um único botão
- **THEN** a aparência e as medidas são as do requisito de botão no adendo
