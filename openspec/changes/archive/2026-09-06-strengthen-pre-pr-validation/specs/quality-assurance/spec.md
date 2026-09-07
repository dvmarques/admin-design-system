## MODIFIED Requirements

### Requirement: Verificação obrigatória da base

O projeto MUST disponibilizar um comando principal de validação que execute formatação, lint, tipos, testes, build e testes end-to-end para os pacotes e aplicações afetados. O projeto MUST disponibilizar também um comando dedicado para executar a suíte E2E localmente, incluindo a aplicação de referência e os artefatos que ela consome.

#### Scenario: Alteração viola uma verificação obrigatória

- **WHEN** uma alteração introduz erro de lint, tipo, teste, build ou fluxo E2E
- **THEN** a verificação automatizada termina com falha

#### Scenario: Pessoa executa a validação principal localmente

- **WHEN** a pessoa executa o comando principal de validação antes de enviar um PR
- **THEN** a suíte E2E é executada após as verificações de qualidade e build necessárias
