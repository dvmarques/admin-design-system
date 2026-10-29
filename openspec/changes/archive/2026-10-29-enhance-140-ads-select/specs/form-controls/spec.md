## ADDED Requirements

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
