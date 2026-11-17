# Spec Delta

## ADDED Requirements

### Requirement: Confirmação temporizada e comprovada após publicação npm

O sistema MUST confirmar a publicação por releituras limitadas do registry, sem presumir sucesso a partir do código de saída do npm publish.

#### Scenario: Propagação superior à janela anterior

- **WHEN** npm publish termina com sucesso, mas a versão só aparece após mais de 30 segundos
- **THEN** a publicação MUST continuar consultando por até 150 segundos e 20 leituras por pacote
- **AND** MUST verificar `name`, `version` e `dist.integrity` antes de avançar

#### Scenario: Janela de propagação esgotada

- **WHEN** a versão não aparece até o deadline ou máximo de tentativas
- **THEN** a execução MUST falhar com pacote, versão e orientação de reconciliação/reexecução
- **AND** MUST NOT publicar o próximo pacote nem declarar sucesso

#### Scenario: Registry retorna versão com integridade divergente

- **WHEN** nome, versão ou `dist.integrity` diverge do artifact aprovado
- **THEN** o processo MUST falhar imediatamente
- **AND** MUST NOT tratar a divergência como atraso transitório

#### Scenario: Limites de tempo e supply chain preservados

- **WHEN** o registry responde lentamente
- **THEN** cada consulta MUST respeitar o timeout por requisição e o tempo restante do deadline
- **AND** o job npm MUST ter timeout finito com margem para os quatro pacotes
- **AND** MUST preservar OIDC, provenance, ausência de tokens npm persistentes e recuperação idempotente

### Requirement: Reconciliação final resiliente e estritamente somente leitura

A verificação final MUST reconfirmar cada pacote com integridade aprovada sem emitir novo `npm publish` e tolerar leituras transitórias, mantendo deadline e tentativas explícitas.

#### Scenario: Registry alterna 200, 404 e 200

- **WHEN** um pacote foi confirmado com HTTP 200, mas a primeira releitura final responde 404 e a seguinte retorna a mesma versão
- **THEN** a verificação final MUST concluir após reconfirmar `name`, `version` e `dist.integrity`
- **AND** MUST NOT publicar novamente qualquer pacote

#### Scenario: Verificação final esgotada

- **WHEN** o pacote não é reconfirmado dentro de 60 segundos ou 12 leituras finais
- **THEN** a execução MUST falhar com nome, versão, fase, quantidade de consultas e último motivo registrado
- **AND** MUST NOT declarar a publicação completa nem publicar novos pacotes

### Requirement: Falhas HTTP transitórias durante a confirmação

A confirmação pós-publicação e a verificação final MUST tolerar indisponibilidade transitória reconhecida sem afrouxar a validação de integridade ou os limites temporais.

#### Scenario: Timeout ou resposta temporariamente indisponível

- **WHEN** uma leitura sofre `TimeoutError`, falha transitória de transporte, HTTP 429 ou HTTP 5xx
- **THEN** o processo MUST permitir novas leituras somente no prazo e limite de tentativas da fase
- **AND** cada requisição MUST respeitar no máximo 30 segundos e o saldo do deadline monotônico

#### Scenario: Erro permanente ou integridade divergente

- **WHEN** o registry retorna HTTP 4xx permanente, JSON inválido, nome, versão ou hash incompatível
- **THEN** a execução MUST falhar imediatamente, sem tratar a resposta como falha transitória
- **AND** MUST NOT republicar automaticamente nem avançar para criação de tags ou GitHub Release
