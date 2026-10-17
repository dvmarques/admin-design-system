## MODIFIED Requirements

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
