# Design — publicação OIDC no merge de master (#298)

## Contexto e ameaça

O workflow de publicação hoje roda em `develop`, fazendo a provenance npm refletir seu commit em vez do merge da release em `master`. O artifact foi criado em `develop` e não deve ser reconstruído; é necessário manter as duas identidades separadas e verificáveis.

## Decisão

1. No início do job `resolve-validate`, rejeitar toda ref que não seja `refs/heads/master`. Resolver a PR merged de `release/X.Y.Z -> master` e exigir `GITHUB_SHA === merge_commit_sha` com comparação exata. O `workflow_dispatch` continua manual.
2. Com checkout confiável do SHA de `master`, resolver a PR de back-merge e exigir que seu SHA pertença ao histórico de `develop`. Fixar `develop_sha` a partir de `origin/develop` nessa verificação. Validar a release e suas notas no merge aprovado, depois validar o changelog e a versão coordenada no `develop_sha` fixado.
3. Nos jobs de download e publicação, usar a lógica do SHA autorizado de `master` e passar `TRUSTED_DEVELOP_SHA` do job de validação para conferir a ancestralidade do commit produtor do artifact. Buscar o histórico de `develop` somente para essa prova. Preservar ID, digest ZIP, SHA-256/SHA-512, plano, manifests e comparação com `RELEASE_SHA`.
4. Manter o `publish-npm` com `id-token: write` e somente leitura de contents/actions; o `publish-github` continua isolado sem OIDC e revalida a identidade de publicação antes de qualquer tag/release. Não adicionar `NODE_AUTH_TOKEN`, `NPM_TOKEN` ou secret permanente.
5. Na próxima publicação efetiva, comparar as quatro páginas de provenance no npm com repositório, workflow `release.yml` e SHA do merge aprovado; conferir integridades, `npm audit signatures` e smoke externo antes do aceite final.

## Alternativas rejeitadas

- Rebuild em `master`: muda os bytes aprovados e quebra a premissa de artifact único.
- Executar em `develop` com metadata adicional: não muda o sujeito OIDC que o npm atesta.
- Validar o produtor do artifact como ancestral de `master`: `develop` não é necessariamente ancestral da linha estável; usar o SHA fixado da linha produtora.
- Aceitar HEAD posterior de `master`: não prova provenance do merge exato desta release.

## Segurança, compatibilidade e riscos

Rejeições devem ocorrer antes de qualquer escrita no npm ou GitHub. A possibilidade de avanço de `develop` depois da captura continua protegida pela revalidação posterior de estado; nenhuma confiança deriva de ref arbitrária fornecida pelo operador. A provenance atesta execução de publicação, não automaticamente a execução do build; essa ligação continua provada pelo plano/hashes.

Rollback do fluxo: reverter a PR antes de iniciar uma próxima release. Uma publicação npm efetivada é imutável, portanto não propor republicação/edição de versão. Nenhuma alteração visual, tema, contrato de app, acessibilidade ou tamanho de bundle é esperada.

## Verificação

Testes de ref permitida/negada e SHA divergente; testes do workflow, da origem do artifact e publicação idempotente. Executar os gates oficiais do projeto (`npm run format`, `npm run validate`, OpenSpec strict, E2E) e revisar CI no SHA final. A verificação real de provenance fica pendente até a próxima release expressamente autorizada.
