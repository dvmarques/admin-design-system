## Why

O lint da raiz inclui checkouts em `.claude/worktrees` e pode falhar ao inferir
uma raiz TypeScript entre múltiplas configurações (#128). O checkout corrente
deve continuar verificável sem remover nem modificar worktrees locais.

## What Changes

- Excluir worktrees aninhados do lint da raiz.
- Resolver a raiz TypeScript pela localização da configuração, independentemente do cwd.
- Testar isolamento, preservação dos arquivos e detecção de erros no checkout corrente.
- Documentar o limite da análise e executar a regressão na validação de qualidade da CI.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `quality-assurance`: lint isolado por checkout e raiz de configuração determinística.

## Impact

Configuração ESLint, testes de ferramentas, script de qualidade, documentação e changelog.
Nenhuma alteração nos pacotes públicos, APIs, dependências, CSS ou bundles. A biblioteca,
a demo Next.js e o Storybook preservam comportamento e aparência.

## Fora do escopo

Alterar worktrees existentes, estilos, componentes, snapshots ou a issue #91.
