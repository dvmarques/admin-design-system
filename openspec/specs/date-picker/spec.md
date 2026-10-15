# date-picker Specification

## Purpose

Permite selecionar uma data ou um intervalo de datas por digitação ou por calendário acessível, em formulários e filtros administrativos.

## Requirements

### Requirement: Seleção de data única

O sistema MUST fornecer `AdsDatePicker` que permita selecionar uma data única, digitando-a ou escolhendo-a em um calendário aberto em `AdsPopover`. O valor MUST ser representado como string ISO `AAAA-MM-DD`, sem fuso horário, ou `null` quando vazio.

#### Scenario: Escolher uma data no calendário

- **WHEN** a pessoa abre o calendário e ativa um dia
- **THEN** o valor é atualizado, o calendário fecha e o foco retorna ao acionador

#### Scenario: Digitar uma data válida

- **WHEN** a pessoa digita uma data válida no formato do locale e confirma com `Enter` ou saindo do campo
- **THEN** o valor é atualizado e o texto é normalizado ao formato do locale

#### Scenario: Digitar uma data inválida

- **WHEN** a pessoa digita um texto que não é uma data válida, ou uma data fora dos limites ou desabilitada
- **THEN** o valor não é alterado e a entrada é marcada como inválida

#### Scenario: Estado vazio

- **WHEN** não há valor
- **THEN** a entrada exibe o placeholder do formato e `onValueChange` recebe `null` ao limpar o texto

### Requirement: Seleção de intervalo

`AdsDatePicker` com `mode="range"` MUST permitir selecionar uma data inicial e uma final, representadas por `{ start, end }`. O sistema MUST ordenar as extremidades quando a segunda data escolhida for anterior à primeira. No calendário, a primeira data ativada MUST ficar apenas pendente, sem alterar o valor, até a segunda; fechar o calendário antes MUST manter o valor anterior. A data pendente MUST ser anunciada por uma região `aria-live="polite"` visualmente oculta, com texto configurável em `labels.pendingStart`, e digitar uma data MUST descartá-la.

#### Scenario: Escolher um intervalo no calendário

- **WHEN** a pessoa ativa uma data inicial e depois uma data final
- **THEN** o intervalo só é atualizado na segunda data, o período fica destacado e o calendário fecha

#### Scenario: Fechar antes da segunda data

- **WHEN** a pessoa ativa uma data e fecha o calendário antes de ativar a segunda
- **THEN** o valor não muda e o intervalo anterior continua destacado ao reabrir

#### Scenario: Anúncio da data pendente

- **WHEN** a pessoa ativa a primeira data do intervalo
- **THEN** leitores de tela anunciam, sem mover o foco, a data inicial escolhida e que falta a data final

#### Scenario: Digitar com data pendente

- **WHEN** há uma data pendente no calendário e a pessoa confirma uma data digitada
- **THEN** a data pendente é descartada e o próximo clique começa um novo intervalo

#### Scenario: Extremidades invertidas

- **WHEN** a segunda data escolhida é anterior à primeira
- **THEN** a data anterior vira o início do intervalo

#### Scenario: Início digitado depois do fim

- **WHEN** a pessoa digita uma data inicial posterior à data final atual
- **THEN** o valor não é alterado e a entrada é marcada como inválida

### Requirement: Valor controlado e não controlado

O componente MUST aceitar `value` com `onValueChange` (controlado) ou `defaultValue` (não controlado), sem manter estado concorrente no modo controlado.

#### Scenario: Valor controlado

- **WHEN** o consumidor altera `value`
- **THEN** a entrada e o calendário refletem o novo valor

#### Scenario: Valor não controlado

- **WHEN** o consumidor informa apenas `defaultValue`
- **THEN** o componente mantém o estado interno e notifica `onValueChange`

### Requirement: Limites e datas desabilitadas

O componente MUST aceitar `min`, `max` e `isDateDisabled`. Datas fora dos limites ou desabilitadas MUST NOT ser selecionáveis por calendário nem por digitação e MUST ser anunciadas como desabilitadas.

#### Scenario: Data abaixo do mínimo

- **WHEN** a pessoa tenta selecionar uma data anterior a `min`
- **THEN** a seleção é ignorada e o dia expõe `aria-disabled="true"`

### Requirement: Locale configurável

O componente MUST aceitar `locale`, com `pt-BR` como padrão, que define nomes de meses e dias, formato da data, placeholder e primeiro dia da semana. O consumidor MAY sobrescrever `firstDayOfWeek` e os textos de interface (`labels`). O sistema MUST NOT adicionar dependência de runtime para datas.

#### Scenario: Locale padrão

- **WHEN** nenhum `locale` é informado
- **THEN** meses e dias aparecem em português, a data usa `dd/mm/aaaa` e a semana começa no domingo

#### Scenario: Outro locale

- **WHEN** `locale="en-US"` é informado
- **THEN** nomes e formato seguem o locale informado

### Requirement: Acessibilidade e teclado

O calendário MUST ser uma grade (`role="grid"`) nomeada pelo mês exibido, com um único tab stop, foco visível e navegação por setas, `Home`, `End`, `PageUp`, `PageDown` (e `Shift` para anos), além de seleção com `Enter` ou `Espaço`. A navegação por teclado MUST NOT levar o foco para fora de `min` e `max`, e os botões de mês indisponíveis MUST parecer desabilitados. O acionador e as entradas MUST ter nome acessível, e `Escape` MUST fechar o calendário.

#### Scenario: Navegação por teclado

- **WHEN** o foco está em um dia e a pessoa pressiona `ArrowRight` e `PageDown`
- **THEN** o foco avança um dia e depois um mês, e o título do mês é atualizado

#### Scenario: Navegação limitada por min e max

- **WHEN** há `min` ou `max` e a pessoa pressiona uma tecla que levaria o foco além do limite
- **THEN** o foco para na data limite

#### Scenario: Verificação automatizada

- **WHEN** o componente é verificado com `axe-core` fechado e aberto
- **THEN** não há violações

### Requirement: Integração com formulários

`AdsDatePicker` MUST funcionar dentro de `AdsField`, herdando `id`, `aria-describedby` e `validationState`, e MUST suportar `disabled` e `validationState="error"`. Quando `name` (data única) ou `startName`/`endName` (intervalo) forem informados, o componente MUST expor o valor ISO em campos ocultos para envio de formulário.

#### Scenario: Dentro de AdsField

- **WHEN** o componente é filho de `AdsField` com rótulo e erro
- **THEN** o rótulo nomeia a entrada (no intervalo, a entrada final é anunciada como o rótulo seguido de "Data final") e a mensagem de erro é associada por `aria-describedby`

#### Scenario: Desabilitado

- **WHEN** `disabled` é verdadeiro
- **THEN** entradas, campos ocultos e acionador ficam desabilitados, o calendário não abre e o formulário não envia o valor

### Requirement: Aparência, temas e hidratação

O componente MUST usar classes `ads-date-picker*`, variáveis `--ads-*` e tokens existentes, funcionar nos temas claro e escuro e em telas estreitas, sem expor Tailwind. A renderização inicial MUST ser determinística entre servidor e cliente.

#### Scenario: Renderização no servidor

- **WHEN** o componente é renderizado no servidor com o mesmo valor inicial do cliente
- **THEN** o HTML é idêntico e a data atual só é lida ao abrir o calendário
