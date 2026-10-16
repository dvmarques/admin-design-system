## ADDED Requirements

### Requirement: Retenção da branch de release até a conclusão

O processo MUST manter a branch `release/X.Y.Z` no repositório desde a preparação até que o
back-merge para `develop` e a publicação da mesma versão estejam concluídos. A
proteção contra remoção dessa branch MUST valer para a exclusão automática após
merge e para a exclusão manual sem permissão administrativa, mantendo a exclusão automática das demais
branches de trabalho livre de restrição.

#### Scenario: Merge da PR de release para master

- **WHEN** a PR `release/X.Y.Z -> master` é integrada
- **THEN** a branch `release/X.Y.Z` continua existindo no repositório remoto

#### Scenario: Merge do back-merge para develop

- **WHEN** a PR `release/X.Y.Z -> develop` é integrada e a publicação ainda não ocorreu
- **THEN** a branch `release/X.Y.Z` continua existindo no repositório remoto

#### Scenario: Branch de trabalho comum

- **WHEN** uma PR de uma branch que não segue `release/**` é integrada
- **THEN** a exclusão automática de head branches pode remover essa branch

#### Scenario: Remoção após a conclusão

- **WHEN** o back-merge e a publicação da versão estão concluídos
- **THEN** a branch `release/X.Y.Z` pode ser removida por quem tem permissão administrativa
