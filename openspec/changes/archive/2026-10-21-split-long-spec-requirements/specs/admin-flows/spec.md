# Spec Delta

## MODIFIED Requirements

### Requirement: Confirmação de ação destrutiva

`AdsConfirmDialog` MUST usar `AdsDialog` com título e descrição associados e oferecer "Cancelar" e "Confirmar", sem fechar nem confirmar por conta própria: `onConfirm` e `onOpenChange` notificam o consumidor. O foco inicial MUST ir a "Cancelar", `Escape` MUST cancelar e o foco MUST voltar ao elemento que abriu o diálogo ao fechar. Com `destructive`, a confirmação MUST usar a variante de perigo. Com `pending`, as ações MUST ficar indisponíveis, como descrito no cenário Pendente.

#### Scenario: Foco e nome acessível

- **WHEN** o diálogo abre
- **THEN** ele tem nome e descrição acessíveis e o foco está em "Cancelar"

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
