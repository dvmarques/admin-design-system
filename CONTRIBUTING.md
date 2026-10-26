# Como contribuir com o Admin Design System

O Admin DS distribui bibliotecas React reutilizáveis e mantém uma demo Next.js e um catálogo Storybook. Antes de contribuir, leia [AGENTS.md](AGENTS.md) (políticas obrigatórias), [README.md](README.md), [mapa de contexto](docs/agent-context-map.md) e [processo com IA](docs/ai-development-workflow.md).

## Preparar o ambiente
Use a versão de Node indicada em `.nvmrc`; instale dependências com `npm ci`. Consulte os scripts oficiais em `package.json`. Use `npm run validate` para validação completa; `openspec.cmd validate --all --strict` para OpenSpec em Windows. Em outras plataformas, use o comando equivalente `openspec` disponível no ambiente. Não substitua verificações por aprovação presumida.

## Issue, branch e OpenSpec
1. Procure issues/changes existentes antes de criar trabalho duplicado. Escolha os formulários bug, enhancement ou documentation.
2. Confirme escopo, critérios de aceite, dependências, riscos, consumidores afetados e aprovações; leia apenas o contexto relevante usando o mapa.
3. Parta de `develop` para uma branch de trabalho (`feat/`, `fix/`, `docs/` ou `chore/` e número da issue). Continue a branch existente quando já houver PR.
4. Use OpenSpec para mudanças relevantes, proponha, revise e só então implemente. Escolha Fast, Standard ou Critical pela política em [docs/ai-development-workflow.md](docs/ai-development-workflow.md); Fast não elimina artefatos exigidos nem gates.
5. Execute testes de unidade, tipos, build, Storybook/consumidores, acessibilidade, temas e E2E aplicáveis. Documente evidências e limitações reais. Atualize `CHANGELOG.md` ou justifique a ausência.
6. Abra PR para `develop` usando o template. PR em Draft não executa os jobs automáticos de PR; marque Ready for review quando validações locais estiverem concluídas, confira CI no SHA atual e obtenha revisão humana.
7. Conclua a change com o procedimento de [ciclo OpenSpec](docs/openspec-lifecycle.md). PRs comuns usam squash; PRs de release seguem [processo de release](docs/release-process.md), com merge commit.

Não exponha credenciais, dados pessoais ou material de terceiros sem licença compatível. Respeite os contratos públicos `Ads*`, `ads-` e `--ads-`; mudanças públicas exigem verificação de compatibilidade. Use o procedimento de disclosure privado caso encontre vulnerabilidade.

## Referências
- [Workflow adaptativo](docs/ai-development-workflow.md)
- [Ciclo de changes OpenSpec](docs/openspec-lifecycle.md)
- [Release](docs/release-process.md)
- [Configuração OpenSpec](openspec/config.yaml)
