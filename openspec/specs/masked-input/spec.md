# masked-input Specification

## Purpose

Disponibilizar um campo de texto com máscara, em subpath opcional e com motor de máscara como peer opcional, para que aplicações administrativas formatem dados como documentos e telefones preservando a semântica nativa do input, a acessibilidade e a integração com formulários.

## Requirements

### Requirement: AdsMaskedInput público com máscara opt-in

O sistema MUST disponibilizar `AdsMaskedInput` e tipos no subpath público opcional `@dvmarques/admin-ds-components/masked-input`, aceitando máscaras estáticas e dinâmicas configuráveis, sem regras de negócio fixas. Com `mask` ausente, MUST comportar-se como entrada textual convencional.

#### Scenario: Máscara estática e dinâmica

- **WHEN** uma aplicação fornece máscara estática ou dinâmica válida e a pessoa digita, apaga ou cola
- **THEN** o valor exibido segue a formatação configurada, sem mover incorretamente o caret ou perder caracteres elegíveis

#### Scenario: Campo sem máscara

- **WHEN** o consumidor não fornece `mask`
- **THEN** o controle mantém edição textual e atributos nativos compatíveis com `AdsInput`

### Requirement: Valores bruto e formatado têm contrato distinto de eventos

`AdsMaskedInput` MUST usar `value`/`defaultValue` para representar o texto exibido e MUST fornecer `onValueChange` com `maskedValue`, `unmaskedValue`, `typedValue` quando aplicável e indicação `complete`. O handler `onChange` MUST preservar a semântica de evento DOM, sem equivalência garantida com o aceite da máscara; alterações mascaradas MUST ser notificadas por `onValueChange` baseado em `onAccept`.

#### Scenario: Alteração do usuário e campo controlado

- **WHEN** a pessoa edita um campo mascarado controlado
- **THEN** `onValueChange` informa valores bruto/formatado coerentes mesmo se o evento nativo `onChange` não ocorrer, enquanto o valor exibido segue a prop controlada até o consumidor atualizá-la

#### Scenario: Campo não controlado e sincronização externa

- **WHEN** o campo usa `defaultValue` ou a aplicação altera `value` externamente
- **THEN** o texto exibido e a posição do caret são atualizados de maneira previsível sem gerar mudanças sintéticas repetidas nem loops de callbacks

#### Scenario: Tecla rejeitada e redefinição de formulário

- **WHEN** a pessoa digita um caractere que a máscara rejeita, ou o formulário que contém o campo é redefinido
- **THEN** a tecla rejeitada não notifica `onValueChange`, e a redefinição restaura o `defaultValue` formatado (campo não controlado, notificando se o texto mudou) ou reaplica `value` sem notificar (campo controlado)

#### Scenario: Formulário nativo

- **WHEN** um formulário com `name` é submetido
- **THEN** o campo envia seu valor formatado, respeita `disabled` e `required` nativos e não envia automaticamente outro campo com valor bruto

### Requirement: Entrada mascarada é acessível e preserva edição

O componente MUST preservar referência ao input nativo (`ref` e `inputRef`), associação via `AdsField`, estados `disabled`/`readOnly`/erro, navegação por teclado e rótulos/descrições ARIA.

#### Scenario: Edição complexa e IME

- **WHEN** a pessoa edita no meio do texto, usa seleção, colagem ou composição IME
- **THEN** o input mantém foco e caret utilizáveis, sem perder a composição ou descartar conteúdo válido

#### Scenario: Rótulo e erro

- **WHEN** o componente é filho de `AdsField` com descrição ou erro
- **THEN** o input tem associação correta com label, `aria-describedby`, `aria-invalid` e foco visível

#### Scenario: Mobile, temas e zoom

- **WHEN** usado com teclado móvel, viewport 390px, zoom 200%, forced-colors ou temas claro/escuro
- **THEN** o campo permanece legível, operável e responsivo com CSS compilado do DS

### Requirement: Subpath opcional preserva distribuição principal

O sistema MUST manter `react-imask` fora do runtime e do entrypoint raiz de `@dvmarques/admin-ds-components`. Uma aplicação que não importa o subpath MUST continuar instalando e construindo componentes existentes sem depender de IMask.

#### Scenario: Consumidor importa apenas o pacote raiz

- **WHEN** uma aplicação importa `AdsInput` ou outro componente do entrypoint raiz, sem instalar a dependência opcional de máscara
- **THEN** instalação, resolução de tipos, bundle e execução não exigem `react-imask`

#### Scenario: Consumidor importa subpath

- **WHEN** a aplicação instala a dependência opcional compatível e importa `@dvmarques/admin-ds-components/masked-input`
- **THEN** JavaScript, tipos e CSS distribuído resolvem sem caminhos privados e sem exigir Tailwind no consumidor

#### Scenario: Hidratação e StrictMode

- **WHEN** o componente é renderizado em Next.js App Router e hidratado em React StrictMode
- **THEN** não acessa o DOM durante SSR, não produz divergência e libera listeners/instâncias ao desmontar

### Requirement: Entrega demonstrável e migração documentada

O sistema MUST incluir exemplo funcional no Admin Demo e Storybook com dados fictícios, além de documentação de migração de wrappers IMask/bibliotecas visuais de terceiros, limites de validação e semântica de eventos.

#### Scenario: Demonstração de formulário

- **WHEN** a pessoa acessa o catálogo e experimenta digitação, colagem, erro e envio
- **THEN** observa máscara, valor bruto e formatado, estado controlado e não controlado sem backend ou dados reais
