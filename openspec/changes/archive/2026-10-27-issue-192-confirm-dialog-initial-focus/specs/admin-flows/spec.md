## MODIFIED Requirements

### Requirement: Confirmação de ação destrutiva

`AdsConfirmDialog` MUST usar `AdsDialog` com título e descrição associados e oferecer "Cancelar" e "Confirmar", sem fechar nem confirmar por conta própria: `onConfirm` e `onOpenChange` notificam o consumidor. O foco inicial MUST ir ao primeiro controle interativo elegível do conteúdo adicional (`children`), isto é, não desabilitado, visível e não inerte, e, sem esse controle, a "Cancelar"; o foco inicial MUST NOT ser forçado em "Cancelar" quando houver esse controle. `Escape` MUST cancelar e o foco MUST voltar ao elemento que abriu o diálogo ao fechar. Com `destructive`, a confirmação MUST usar a variante de perigo. Com `pending`, as ações MUST ficar indisponíveis, como descrito no cenário Pendente.

#### Scenario: Foco e nome acessível

- **WHEN** o diálogo abre sem controles interativos em `children`
- **THEN** ele tem nome e descrição acessíveis e o foco está em "Cancelar"

#### Scenario: Foco no primeiro controle do conteúdo

- **WHEN** o diálogo abre com um controle interativo elegível em `children`
- **THEN** o foco está nesse primeiro controle, e não em "Cancelar"

#### Scenario: Controles inelegíveis são ignorados

- **WHEN** o diálogo abre e os controles de `children` estão desabilitados, ocultos ou inertes
- **THEN** o foco está em "Cancelar"

#### Scenario: Cancelar com Escape

- **WHEN** a pessoa pressiona `Escape`
- **THEN** `onOpenChange(false)` é chamado e `onConfirm` não

#### Scenario: Confirmar

- **WHEN** a pessoa aciona "Confirmar"
- **THEN** `onConfirm` é chamado e o diálogo permanece aberto até o consumidor fechá-lo

#### Scenario: Pendente

- **WHEN** `pending` é verdadeiro, inclusive com `closeOnEscape` e `closeOnBackdrop` informados, e o foco está em "Confirmar"
- **THEN** "Cancelar" e "Confirmar" ficam com `aria-disabled="true"` e não respondem ao clique, "Confirmar" exibe indicador de carregamento, `Escape` e o clique fora não cancelam e o foco permanece em "Confirmar", durante e depois do `pending`

#### Scenario: Variante de perigo

- **WHEN** `destructive` é verdadeiro
- **THEN** a confirmação usa a variante de perigo

#### Scenario: Retorno do foco

- **WHEN** o diálogo fecha
- **THEN** o foco volta ao elemento que o abriu
