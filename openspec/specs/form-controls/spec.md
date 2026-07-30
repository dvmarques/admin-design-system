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

Os controles textuais MUST responder aos tokens semânticos documentados de fundo, texto, borda e estados, incluindo valores para tema claro e escuro, e MUST permitir que o consumidor altere esses tokens sem recompilar a biblioteca.

#### Scenario: Consumidor personaliza o tema do campo

- **WHEN** uma aplicação redefine um token de formulário suportado no escopo de seu tema
- **THEN** os controles refletem a personalização por meio do CSS público distribuído

#### Scenario: CSS é consumido externamente

- **WHEN** uma aplicação importa o CSS publicado do pacote de componentes sem configurar Tailwind
- **THEN** os controles exibem seus estilos e estados documentados
