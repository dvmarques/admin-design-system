## Context

O typescript-eslint precisa resolver sua raiz mesmo com outras configurações ESLint
em checkouts aninhados. Ignorar só os arquivos não torna essa resolução explícita.

## Goals / Non-Goals

Isolar o lint da raiz e preservar a análise de arquivos próprios. Não alterar regras
ou corrigir código de outros checkouts.

## Decisions

- Usar ignore global `.claude/worktrees/**`: corresponde ao diretório documentado,
  sem excluir indiscriminadamente toda a configuração `.claude` ou outros arquivos.
- Usar `parserOptions.tsconfigRootDir: import.meta.dirname`, disponível no Node 24
  exigido pelo projeto; não depender de `process.cwd()`.
- Criar fixture temporária dentro do repositório, com configuração copiada e imports
  resolvidos pelas dependências instaladas. Verificar lint antes/depois de inserir um
  checkout aninhado com configuração própria e código inválido. Confirmar que erros
  no checkout principal continuam falhando, que o worktree pode executar seu próprio
  lint e que os arquivos aninhados não mudam.
- Incluir a regressão em `test:ci`, já executado por `test:quality` na CI.

## Alternatives

Ignorar toda `.claude` amplia o escopo sem necessidade. Apagar ou mover worktrees
viola a preservação dos dados locais. Apenas fixar a raiz ainda analisa duplicatas.

## Impacts

Sem mudanças em Client/Server Components, acessibilidade, responsividade, temas,
Tailwind, tokens ou distribuição de CSS. Stories e exemplos novos não se aplicam.
Sem dependências novas ou impacto em bundle. Fixtures são removidas em finally.
O prefixo reservado `lint-regression-*` na raiz é ignorado por Git, ESLint e
Prettier: uma interrupção antes do finally não contamina a validação nem o staging.

## Validation

Teste de regressão, lint do checkout, formatação, OpenSpec estrito, build, tipos,
testes de qualidade e E2E. Não atualizar snapshots nesta correção de ferramentas.

## Limitação da regressão

O preset de produção não usa lint com análise de tipos. A regressão verifica
o isolamento observado em `eslint .` e a raiz explícita da configuração, mas
não exercita a inferência de projetos do typescript-eslint em modo type-aware.
A asserção de raiz protege o contrato de configuração independente do cwd; não
deve ser apresentada como cobertura de resolução de projetos TypeScript.
