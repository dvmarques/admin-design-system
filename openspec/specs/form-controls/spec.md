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

AdsInput, AdsTextarea e AdsSelect MUST comunicar visualmente somente leitura de forma distinta de indisponibilidade, preservando a legibilidade e o comportamento nativo aplicável. Hover e foco MUST ser perceptíveis apenas quando a interação for permitida. O estilo somente leitura MUST aplicar-se somente ao atributo `readonly` (ou equivalente nativo) e MUST NOT usar a pseudo-classe `:read-only` no CSS distribuído.

#### Scenario: Valor somente leitura é exibido

- **WHEN** uma aplicação renderiza um controle textual somente leitura ao lado de um controle desabilitado
- **THEN** ambos são distinguíveis visualmente e o valor somente leitura continua legível para cópia ou seleção quando o elemento nativo permitir

#### Scenario: Select editável mantém borda de controle

- **WHEN** `AdsSelect` é renderizado sem atributo `readonly` em estado editável
- **THEN** seu limite usa o papel `borderControl` e permanece visível, inclusive quando o elemento nativo `select` é tecnicamente somente leitura pelo navegador; o CSS distribuído não usa `:read-only`, que também casaria com `select` nativo e removeria esse limite

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

### Requirement: Indicador de abertura do AdsSelect

O `AdsSelect` MUST apresentar indicador de abertura com espaço reservado para o texto e recuo consistente, preservando a interação e semântica nativas.

#### Scenario: Tamanhos e temas

- **WHEN** um consumidor renderiza o select em sm, md ou lg nos temas claro ou escuro
- **THEN** o indicador fica centralizado verticalmente e afastado da borda, sem sobrepor o texto

#### Scenario: Interação e acessibilidade

- **WHEN** a pessoa usa o select por ponteiro ou teclado
- **THEN** o controle mantém comportamento nativo e o indicador decorativo não recebe foco

#### Scenario: Alto contraste

- **WHEN** o sistema usa forced-colors
- **THEN** o indicador nativo permanece visível

### Requirement: Tipografia tokenizada dos controles textuais sem reset externo

AdsInput, AdsTextarea e AdsSelect MUST apresentar seus textos visíveis (incluindo valores digitados, rótulos de opções e placeholders onde aplicáveis) com a família definida pelo token público --ads-typography-font-family quando consumidos com o CSS compilado distribuído, independentemente de a aplicação aplicar preflight/reset CSS. A regra MUST preservar a possibilidade de personalização intencional do token e não modificar tamanho, valor, semântica ou estado dos controles.

#### Scenario: Área de texto sem preflight

- **WHEN** uma aplicação Next.js renderiza AdsTextarea e AdsInput com apenas o CSS publicado do design system, sem reset CSS de elementos nativos
- **THEN** ambos exibem texto digitado e placeholder com a família tipográfica do token, sem diferença provocada pela fonte user-agent do textarea

#### Scenario: Tema claro e escuro

- **WHEN** os controles são exibidos em tema claro ou escuro nos tamanhos sm, md e lg e em estado normal, readonly, inválido ou desabilitado
- **THEN** a família tipográfica permanece consistente e os tamanhos e estados definidos pelo design system são preservados

#### Scenario: Consumidor personaliza família

- **WHEN** uma aplicação altera o token --ads-typography-font-family no escopo do componente
- **THEN** a tipografia de Input, Textarea e Select acompanha esse token sem recompilar a biblioteca

#### Scenario: Personalização explícita de um controle

- **WHEN** um consumidor aplica uma classe de fonte alternativa permitida por className em um controle
- **THEN** a personalização explícita não é bloqueada por uma regra global da demonstração

### Requirement: AdsSelect oferece ausência de escolha distinta de valor vazio válido

O `AdsSelect` MUST aceitar `placeholder` opcional em seleção simples, sem alterar consumidores que não o informam. Com placeholder opt-in, ausência de escolha (`value` ou `defaultValue` igual a `null`) MUST ser distinguível de uma opção real de valor `""`. O componente MUST preservar `children`, atributos nativos, `onChange` para seleções reais e semântica do formulário.

#### Scenario: Placeholder é opcional e não quebra um select existente

- **WHEN** um consumidor renderiza `AdsSelect` sem `placeholder`
- **THEN** as opções e os valores controlados ou não controlados comportam-se como no `select` nativo anterior

#### Scenario: Ausência e valor vazio legítimo

- **WHEN** um select simples com `placeholder` recebe `value={null}` ou `defaultValue={null}`
- **THEN** o texto indicativo é exibido como ausência, sem selecionar um valor legítimo
- **WHEN** o consumidor define `value=""` ou `defaultValue=""` e existe uma opção real de valor `""`
- **THEN** a opção real fica selecionada, e não o placeholder

#### Scenario: Validação nativa e envio

- **WHEN** um `AdsSelect` com placeholder está sem escolha e é `required`
- **THEN** `checkValidity()` e `reportValidity()` consideram o campo inválido, o placeholder não é submetido e nenhum identificador interno aparece em eventos ou `FormData`
- **WHEN** uma opção real de valor `""` é selecionada, se permitida pelo formulário
- **THEN** ela continua sendo opção válida para `required` e é serializada corretamente em `FormData`, sem ser confundida com placeholder

#### Scenario: Valores externos, reset e desabilitado

- **WHEN** o valor controlado muda ou o formulário não controlado é reiniciado
- **THEN** placeholder, valor selecionado, validade e callback permanecem coerentes, sem emitir `onChange` sintético indevido
- **WHEN** o select está `disabled`
- **THEN** é retirado da validação e do envio de acordo com o HTML nativo

#### Scenario: Select múltiplo ou de lista

- **WHEN** `multiple` ou `size` de lista é usado
- **THEN** o modo de seleção nativo continua sem transformação para placeholder de select simples

### Requirement: AdsSelect mantém texto longo legível e estados acessíveis

O `AdsSelect` MUST manter o texto selecionado dentro do espaço do controle, sem sobrepor o indicador de abertura ou ultrapassar o contêiner, e MUST conservar rótulos integrais acessíveis e os estados de validação quando composto com `AdsField`.

#### Scenario: Largura pequena e zoom

- **WHEN** uma opção possui rótulo longo com viewport de 390px ou zoom de 200%
- **THEN** o texto é visualmente contido/truncado sem overflow horizontal, e o nome/valor integral continua acessível pela semântica nativa

#### Scenario: Tamanho, estados e campo composto

- **WHEN** o select usa `sm`, `md` ou `lg` nos estados default, success, error, focus ou disabled, dentro de `AdsField`
- **THEN** altura, foco, nome, descrição e erro continuam consistentes, sem duplicar mensagens

#### Scenario: Temas, RTL e alto contraste

- **WHEN** o select é exibido nos temas claro/escuro, RTL e forced-colors
- **THEN** o indicador e o texto permanecem legíveis e a semântica nativa é preservada

#### Scenario: Estilos são isolados

- **WHEN** outra família de campos usa `formControlClasses()` e importa o CSS distribuído
- **THEN** alterações específicas de `AdsSelect` não modificam padding, seta, truncamento ou comportamento dos demais controles
