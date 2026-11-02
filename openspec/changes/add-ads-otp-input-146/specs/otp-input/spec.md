# OTP input

## ADDED Requirements

### Requirement: Entrada OTP reutilizável

O sistema SHALL disponibilizar `AdsOTPInput` por export público tipado, com quantidade configurável de dígitos e valor textual preservando zeros à esquerda, sem integração obrigatória com backend.

#### Scenario: Tamanho e estado inicial

- **WHEN** uma aplicação renderiza o campo com 4, 6 ou mais posições e `defaultValue`
- **THEN** a interface exibe a quantidade solicitada, com o código inicial normalizado e editável

#### Scenario: Estado controlado

- **WHEN** uma aplicação define `value` e `onChange`
- **THEN** o valor exibido segue a prop, e `onChange` recebe o código digitado como string, sem alteração imperativa do estado do consumidor

### Requirement: Edição por teclado, colagem e autofill

O sistema SHALL aceitar somente dígitos, inclusive zero inicial, permitir colar códigos completos e preservar edição natural com Backspace, Delete e setas.

#### Scenario: Digitação e navegação

- **WHEN** a pessoa digita, navega com setas ou remove caracteres com Backspace
- **THEN** o cursor e os segmentos visuais acompanham a edição sem foco perdido

#### Scenario: Colagem e preenchimento automático

- **WHEN** a pessoa cola um código inteiro ou o navegador oferece código de uso único
- **THEN** o campo aceita os dígitos até o comprimento configurado e usa `autocomplete="one-time-code"` quando não substituído

#### Scenario: Completar por edição

- **WHEN** uma edição humana faz o código atingir a quantidade solicitada
- **THEN** `onChange` recebe o novo código e `onComplete` é chamado uma vez para essa transição, não na montagem ou atualização externa

### Requirement: Formulários e acessibilidade

O sistema SHALL expor uma única entrada nativa nomeável por `AdsField`, tabulável, associada a ajuda/erro e apta a formulários HTML.

#### Scenario: Tecnologias assistivas e formulário

- **WHEN** a aplicação associa um rótulo, mensagem, `name` e `required`
- **THEN** um único campo acessível participa do formulário e anuncia corretamente rótulo, descrição e erro, sem duplicar as caixas de apresentação

#### Scenario: Estados

- **WHEN** o campo está desabilitado, somente leitura ou inválido
- **THEN** respeita a restrição e expõe estado de validação sem depender apenas da cor

### Requirement: Temas, responsividade e consumidores

O sistema SHALL oferecer tamanhos compatíveis com os tokens, temas claro/escuro e CSS compilado, sem exigir Tailwind no projeto consumidor.

#### Scenario: Dispositivo móvel

- **WHEN** o código possui seis ou mais posições em largura móvel
- **THEN** os segmentos cabem no contêiner sem exigir rolagem horizontal para preenchimento

#### Scenario: Catálogo e documentação

- **WHEN** alguém abre o Admin Demo ou o Storybook
- **THEN** encontra demonstrações operacionais para valor, 4/6 dígitos, erro e desabilitado com orientações de integração

#### Scenario: Next.js

- **WHEN** um app Next.js importa o componente pelo pacote e seu CSS público
- **THEN** a entrada funciona em Client Components sem configuração Tailwind externa
