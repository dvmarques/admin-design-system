## ADDED Requirements

### Requirement: Lint isolado por checkout

O lint da raiz MUST analisar o checkout corrente sem incluir arquivos de checkouts
aninhados em `.claude/worktrees`, preservando seus arquivos e configurações.
A raiz da configuração TypeScript MUST ser determinada pela configuração do checkout,
independentemente do diretório de execução e de configurações aninhadas.

#### Scenario: Checkout sem worktree aninhado

- **WHEN** o lint executa em um checkout sem worktrees aninhados
- **THEN** os arquivos próprios são analisados pelas regras existentes

#### Scenario: Checkout com worktree aninhado

- **WHEN** existe um checkout em `.claude/worktrees` com configuração ESLint e TypeScript própria
- **THEN** o lint da raiz ignora esse checkout sem erro de inferência da raiz TypeScript e sem modificar seus arquivos

#### Scenario: Erro no checkout corrente

- **WHEN** um arquivo próprio viola uma regra e existe um worktree aninhado
- **THEN** o lint falha e identifica o erro do arquivo próprio

#### Scenario: Diretório de execução diferente

- **WHEN** a configuração é carregada a partir de outro diretório de execução
- **THEN** a raiz TypeScript continua apontando para o diretório da configuração
