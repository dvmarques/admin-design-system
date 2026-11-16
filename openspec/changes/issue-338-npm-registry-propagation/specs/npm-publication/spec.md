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
