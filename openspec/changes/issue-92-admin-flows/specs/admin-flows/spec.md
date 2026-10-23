# Delta de especificação: admin-flows

## ADDED Requirements

### Requirement: Papel do diálogo de confirmação

`AdsConfirmDialog` MUST usar `role="alertdialog"` quando `destructive` for verdadeiro (padrão) e `role="dialog"` caso contrário, e MUST aceitar `role` explícito, que prevalece sobre essa regra. A mudança de papel MUST NOT alterar foco inicial, `Escape`, retorno de foco nem o estado `pending`.

#### Scenario: Confirmação destrutiva

- **WHEN** `destructive` é verdadeiro ou omitido e o diálogo abre
- **THEN** o painel tem `role="alertdialog"` com nome e descrição acessíveis e o foco está em "Cancelar"

#### Scenario: Confirmação não destrutiva

- **WHEN** `destructive` é falso
- **THEN** o painel tem `role="dialog"`

#### Scenario: Papel explícito

- **WHEN** `role="dialog"` é informado com `destructive` verdadeiro
- **THEN** o painel tem `role="dialog"` e a confirmação mantém a variante de perigo

### Requirement: Navegação pelo indicador de etapas

`AdsStepForm` MUST permitir ativar uma etapa pelo indicador somente quando ela estiver antes da atual ou quando a etapa atual e todas as intermediárias já tiverem sido validadas ao avançar. Etapas não navegáveis MUST NOT ser interativas. A navegação MUST chamar `onActiveStepChange`, MUST NOT guardar dados e MUST NOT validar de novo etapas já válidas. Editar uma etapa MUST exigir nova validação por "Próxima" antes de navegar adiante a partir dela.

#### Scenario: Voltar pelo indicador

- **WHEN** a etapa 2 está ativa e a pessoa aciona a etapa 1 no indicador por teclado
- **THEN** `onActiveStepChange` recebe o id da etapa 1 e os dados são preservados

#### Scenario: Etapa futura ainda não validada

- **WHEN** a etapa 1 está ativa e nunca foi validada
- **THEN** as etapas seguintes não são controles interativos no indicador

#### Scenario: Retornar a etapa já validada

- **WHEN** a pessoa avançou da etapa 1 à 2 e voltou à 1
- **THEN** a etapa 2 pode ser acionada no indicador sem nova validação

#### Scenario: Edição invalida a marca

- **WHEN** a pessoa edita um campo da etapa 1 depois de validá-la
- **THEN** a etapa 2 deixa de ser navegável pelo indicador até a etapa 1 ser validada de novo

#### Scenario: Enviando ou validando

- **WHEN** `submitting` ou uma validação assíncrona está em andamento
- **THEN** os controles do indicador não navegam

### Requirement: Validação assíncrona por etapa

`AdsStepDefinition.validate` MUST aceitar retorno `boolean` ou `Promise<boolean>`, mantendo síncrono o tratamento do retorno síncrono. Enquanto uma Promise está pendente, o formulário MUST sinalizar o carregamento de forma acessível e MUST ignorar novas ações. Resolver `false` ou rejeitar MUST ser tratado como etapa inválida, e resultados obsoletos MUST ser descartados.

#### Scenario: Estado de carregamento acessível

- **WHEN** a validação assíncrona está pendente
- **THEN** o formulário tem `aria-busy="true"`, uma região `role="status"` anuncia o estado, a ação acionada exibe carregamento e as ações ficam com `aria-disabled` sem perder o foco

#### Scenario: Edição durante a validação

- **WHEN** a validação assíncrona está pendente e um campo da etapa é editado
- **THEN** a validação pendente é cancelada, o resultado dela é descartado, a etapa não é marcada como validada e a pessoa precisa acionar "Próxima" de novo; durante a espera os campos da etapa ficam inertes

#### Scenario: Resultado obsoleto

- **WHEN** a etapa ativa muda ou o componente desmonta antes de a Promise resolver
- **THEN** o resultado é descartado e `onActiveStepChange` e `onSubmit` não são chamados por ele

#### Scenario: Avançar com validação assíncrona válida

- **WHEN** `validate` retorna uma Promise que resolve `true` e a pessoa aciona "Próxima"
- **THEN** durante a espera o formulário tem `aria-busy="true"` e `onActiveStepChange` não foi chamado; ao resolver, `onActiveStepChange` recebe a próxima etapa

#### Scenario: Validação assíncrona inválida

- **WHEN** a Promise resolve `false`
- **THEN** a etapa não muda, a mensagem de erro é anunciada e o foco vai ao primeiro campo inválido ou ao título

#### Scenario: Promise rejeitada

- **WHEN** a Promise rejeita
- **THEN** a etapa é tratada como inválida, sem exceção não tratada

#### Scenario: Ações durante a validação

- **WHEN** a validação está pendente e a pessoa aciona "Próxima" de novo
- **THEN** `validate` não é chamado outra vez

#### Scenario: Confirmação final assíncrona

- **WHEN** a última etapa tem `validate` assíncrona que resolve `true`
- **THEN** `onSubmit` é chamado uma vez após a resolução

#### Scenario: Validação síncrona preservada

- **WHEN** `validate` retorna `boolean`
- **THEN** o resultado é aplicado no mesmo evento, sem estado de carregamento
