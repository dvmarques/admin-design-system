# Comandos úteis do OpenSpec

Este projeto utiliza `openspec.cmd` porque a execução do wrapper
`openspec.ps1` pode ser bloqueada pela política de execução do PowerShell.
Execute os comandos na raiz do repositório.

### Inicialização e atualização

```powershell
# Inicializar o OpenSpec e configurar a integração com o Codex
openspec.cmd init . --tools codex

# Atualizar instruções e skills após atualizar o CLI
openspec.cmd update .

# Exibir a versão instalada
openspec.cmd --version
```

### Criação de changes

```powershell
# Criar uma change
openspec.cmd new change add-button-components

# Criar com descrição, objetivo e schema explícito
openspec.cmd new change add-button-components `
  --description "Adicionar a família de componentes de botão" `
  --goal "Disponibilizar botões acessíveis e reutilizáveis" `
  --schema spec-driven
```

Use nomes em kebab-case, como `add-button-components`,
`add-form-components` e `improve-theme-accessibility`.

### Listagem e acompanhamento

```powershell
# Listar changes ativas
openspec.cmd list

# Listar changes em JSON
openspec.cmd list --json

# Listar specs principais
openspec.cmd list --specs

# Consultar o progresso dos artefatos de uma change
openspec.cmd status --change establish-design-system-foundation

# Consultar status detalhado para scripts ou ferramentas de IA
openspec.cmd status `
  --change establish-design-system-foundation `
  --json
```

### Instruções dos artefatos

Consulte as instruções antes de criar ou atualizar cada artefato:

```powershell
openspec.cmd instructions proposal `
  --change establish-design-system-foundation

openspec.cmd instructions specs `
  --change establish-design-system-foundation

openspec.cmd instructions design `
  --change establish-design-system-foundation

openspec.cmd instructions tasks `
  --change establish-design-system-foundation

# Instruções para implementar a change
openspec.cmd instructions apply `
  --change establish-design-system-foundation

# Instruções para arquivar a change
openspec.cmd instructions archive `
  --change establish-design-system-foundation

# Adicione --json quando a saída for consumida por scripts ou IA
openspec.cmd instructions apply `
  --change establish-design-system-foundation `
  --json
```

### Exibição de changes e specs

```powershell
# Exibir uma change
openspec.cmd show establish-design-system-foundation

# Informar explicitamente o tipo
openspec.cmd show establish-design-system-foundation --type change

# Exibir em JSON
openspec.cmd show establish-design-system-foundation `
  --type change `
  --json

# Exibir somente os deltas de requisitos
openspec.cmd show establish-design-system-foundation `
  --type change `
  --deltas-only `
  --json

# Exibir uma spec principal
openspec.cmd show design-tokens --type spec
```

### Validação

```powershell
# Validar uma change em modo estrito
openspec.cmd validate establish-design-system-foundation --strict

# Validar todas as changes
openspec.cmd validate --changes --strict

# Validar todas as specs principais
openspec.cmd validate --specs --strict

# Validar todo o repositório
openspec.cmd validate --all --strict

# Gerar resultado apropriado para automação e CI
openspec.cmd validate --all --strict --json
```

Execute a validação depois de alterar artefatos, antes da implementação e
antes de arquivar uma change.

### Implementação e testes

O OpenSpec mantém o planejamento e o progresso no `tasks.md`. Marque cada
tarefa concluída com `- [x]` e consulte as instruções de aplicação:

```powershell
openspec.cmd instructions apply `
  --change establish-design-system-foundation

openspec.cmd status `
  --change establish-design-system-foundation

openspec.cmd validate establish-design-system-foundation --strict
```

A validação do OpenSpec não substitui as verificações do código:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
```

No Codex, a implementação pode ser iniciada com:

```text
Use openspec-apply-change para implementar a change
establish-design-system-foundation.
```

### Gerenciamento de specs principais

```powershell
# Listar specs
openspec.cmd spec list

# Exibir uma spec
openspec.cmd spec show design-tokens

# Validar uma spec
openspec.cmd spec validate design-tokens

# Formas equivalentes com os comandos modernos
openspec.cmd show design-tokens --type spec
openspec.cmd validate design-tokens --type spec --strict
```

### Diagnóstico e contexto

```powershell
# Diagnosticar estrutura e relacionamentos
openspec.cmd doctor

# Diagnóstico em JSON
openspec.cmd doctor --json

# Exibir o contexto resolvido a partir do config.yaml
openspec.cmd context

# Abrir o painel interativo de changes e specs
openspec.cmd view
```

### Schemas, templates e ajuda

```powershell
# Listar workflows disponíveis
openspec.cmd schemas

# Exibir os templates resolvidos pelo schema
openspec.cmd templates

# Exibir ajuda geral ou de um comando
openspec.cmd --help
openspec.cmd validate --help
openspec.cmd archive --help
```

Os comandos `store` e `workset` são recursos avançados para,
respectivamente, repositórios OpenSpec independentes e visões pessoais
locais. Eles não são necessários no fluxo inicial deste projeto.

### Arquivamento

Depois que todas as tarefas, testes e validações forem concluídos:

```powershell
# Validar e arquivar, incorporando os deltas às specs principais
openspec.cmd archive establish-design-system-foundation

# Confirmar automaticamente, útil em automação
openspec.cmd archive establish-design-system-foundation --yes
```

Evite `--no-validate`. Use `--skip-specs` somente em changes que realmente
não modificam comportamento, como documentação, tooling ou refatoração:

```powershell
openspec.cmd archive nome-da-change --skip-specs
```

Não use `--skip-specs` em `establish-design-system-foundation`, pois essa
change possui delta specs que devem ser incorporadas.

### Fluxo resumido por funcionalidade

```powershell
# 1. Criar
openspec.cmd new change add-button-components

# 2. Elaborar e acompanhar os artefatos
openspec.cmd status --change add-button-components
openspec.cmd instructions proposal --change add-button-components
openspec.cmd instructions specs --change add-button-components
openspec.cmd instructions design --change add-button-components
openspec.cmd instructions tasks --change add-button-components

# 3. Validar o planejamento
openspec.cmd validate add-button-components --strict

# 4. Implementar e testar
openspec.cmd instructions apply --change add-button-components
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build

# 5. Validar e arquivar
openspec.cmd validate add-button-components --strict
openspec.cmd archive add-button-components
```
