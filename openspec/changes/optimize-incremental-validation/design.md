## Context

`ci-changed-paths.mjs` só distinguia documentação, e os jobs repetem builds. Em runs reais (Qualidade rápida 97–99 s; Artefatos 52 s; E2E Chromium 133–140 s, Firefox 78 s, WebKit 78–86 s) os custos dominantes são a instalação (10–21 s por job), a inicialização do container (26–39 s) e a execução dos testes. Os builds de aplicações são curtos (Storybook ≈ 4 s, demo ≈ 8 s).

## Decisions

1. **Classificação.** Arquivo em workspace entra no conjunto afetado (exceto `package.json` do workspace, que implica `full`); documentação segundo `isDocsFile`; qualquer outro caminho, caminho inseguro, lista vazia, manifesto inválido, nomes ou diretórios duplicados e ciclos implicam `full`. O fecho considera `dependencies`, `devDependencies`, `peerDependencies`, `optionalDependencies` e as dependências implícitas `components → tokens` e `admin → tokens`. `findUndeclaredReferences` varre nomes de pacote e imports relativos e o teste falha se surgir outra referência entre workspaces.
2. **Escopo da CI só reduz trabalho pesado.** `Qualidade rápida` (format, lint, build, typecheck, `test:quality`) e `Política de develop` sempre executam por completo, porque testes de conteúdo leem documentação e scripts. Em PRs para `develop`: `docs` dispensa builds de apps e E2E; `scoped` dispensa o build do Storybook quando `apps/docs` não é afetado, o build do demo e o E2E quando `apps/admin-demo` não é afetado. Builds de pacotes, geração/verificação de tokens e `inspect:packages` não são dispensados.
3. **Equivalência do E2E.** O Playwright serve e testa apenas `apps/admin-demo` (teste guarda `playwright.config.ts` e `e2e/`). Se o demo não está no fecho de impacto, as entradas do E2E são as mesmas da base, validada pelo push completo em `develop`. Mudanças em `e2e/`, configurações globais e `.github/` são `full`.
4. **Fail-open nos jobs.** Condições usam `!= 'false'`; saída ausente executa tudo. O script nunca depende de arquivos alterados para decidir o que executar (não executa nada vindo do diff).
5. **Etapas e não jobs.** A dispensa é por etapa, nunca por `if` de job, para preservar os nomes dos checks obrigatórios (um job de matriz pulado não reporta os nomes `Fluxos no navegador (...)`). O custo é a inicialização do container (≈ 30 s por job de E2E).
6. **Detecção do diff.** Checkout com `fetch-depth: 0`; em PRs o `HEAD` é o commit de merge e o primeiro pai é a base. Qualquer outra forma (checkout raso, sem dois pais, revisão ausente) é `full`. `git diff -z --no-renames`.
7. **Comandos locais** comparam a árvore de trabalho (incluindo não rastreados) com o ancestral comum de `develop`; `typecheck` e testes constroem antes os pacotes em ordem topológica.
8. **Cache e artefatos: não adotados.** Compartilhar `dist` entre jobs economizaria ≈ 16 s por job de E2E (tokens 1 s, components 4 s, admin 2 s, demo 9 s) ao custo de upload/download e de serializar jobs hoje paralelos, sem reduzir a duração da execução. `node_modules` já usa o cache do `setup-node` (`~/.npm`). O único build/verificação duplicado comprovável (`generate` e `check:generated` em Qualidade e Artefatos) custa menos de 1 s e é mantido por clareza dos gates.
9. **Métricas.** Duração por job (início a fim, sem fila), tempo total, falhas e reruns da API do Actions; tokens e custo são `não disponível`. Projeções são rotuladas como tal e nunca como medição.

## Risks

- Grafo incompleto: mitigado pelo teste de referências, pelo fallback `full` e pela CI completa em `develop`.
- Uma PR `scoped` verde pode degradar `develop` se a base já estava vermelha; a CI completa no push a revela.
- Dispensar etapas só em PRs para `develop`; PRs de release e pushes executam tudo.

## Validation

Testes Node do classificador (grafo, tokens, componentes, admin, apps, globais, desconhecidos, inseguros, git real com renomeações e checkout raso), da decisão de escopo (incluindo equivalência com a regra legada de documentação), do plano de comandos, das métricas e da estrutura do workflow; format, lint, build, typecheck, `test:quality` e E2E completos.
