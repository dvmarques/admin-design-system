## ADDED Requirements

### Requirement: Execução reduzida da CI em PRs somente de documentação

A CI de Pull Request MUST dispensar a construção dos artefatos e a execução dos
fluxos no navegador quando todos os arquivos alterados forem documentação sem
consumidores em teste, e MUST executar o fluxo completo quando qualquer arquivo
alterado estiver fora dessa classe, quando a classificação não puder ser
determinada, em execuções de `push` e em PRs para `master`. A verificação de
qualidade MUST executar sempre. Os checks exigidos pelos rulesets MUST ser
reportados como concluídos, sem ficar pendentes, também quando o trabalho for
dispensado.

#### Scenario: PR altera só documentação

- **WHEN** uma PR altera apenas arquivos de documentação ou specs sem consumidores em teste
- **THEN** a verificação de qualidade executa, os checks de artefatos e de fluxos no navegador concluem com sucesso sem construir nem testar, e a PR pode ser integrada

#### Scenario: PR altera documentação lida por testes

- **WHEN** uma PR altera um arquivo de documentação que um teste ou script lê
- **THEN** o fluxo completo executa

#### Scenario: PR mistura documentação e código

- **WHEN** uma PR altera documentação e qualquer arquivo fora da classe de documentação
- **THEN** o fluxo completo executa

#### Scenario: Classificação indeterminada

- **WHEN** a lista de arquivos alterados não pode ser calculada ou está vazia
- **THEN** o fluxo completo executa

#### Scenario: Push e PR de release

- **WHEN** ocorre um `push` em `develop` ou `master`, ou uma PR tem `master` como base
- **THEN** o fluxo completo executa, qualquer que seja o conteúdo alterado
