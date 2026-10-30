## Contexto e decisão

O workspace usa npm 11.19.1, Node 24 em .nvmrc/CI e engines.node >=24.0.0. O package-lock.json, e não a faixa mínima de package.json, define as versões instaladas por npm ci.

### Plano

1. Preservar a estrutura dos manifests, alterando somente as versões de bibliotecas externas incluídas no primeiro lote; repetir o mesmo valor em todos os workspaces que declaram o pacote.
2. Regenerar o lockfile com npm 11.19.1 em Node 24, usando o registro npm e npm ci para provar resolução. Não editar entradas transitivas manualmente.
3. Verificar npm ls/peerDependencies, npm run format, lint, typecheck, build, test:quality, distribuição npm, Storybook e admin-demo, além de E2E Chromium/Firefox/WebKit na CI.
4. Isolar versões major de ferramentas de teste e Playwright em etapas posteriores da issue #265.

### Alternativas e trade-offs

- Atualizar tudo de uma vez: reduz quantidade de PRs, mas piora diagnóstico de regressões e acoplamento com Playwright/TypeScript/Vitest. Rejeitado.
- Atualizar apenas package.json: deixa o lockfile inconsistente e compromete npm ci. Rejeitado.
- Fixar engines.node <25: recusado por decisão explícita do mantenedor. A CI usa Node 24, mas bibliotecas podem aceitar runtimes posteriores.

### Compatibilidade e rollback

- `axe-core` fica fixado em 4.12.1 neste lote. Com 4.14.0, o E2E Firefox e WebKit detecta `label-content-name-mismatch` nos gatilhos visuais de conta e organização; a correção funcional de nome acessível exige testes e especificação próprios, antes de reativar o upgrade.
- React e react-dom avançam juntos, e seus @types seguem a mesma linha major; peers genéricos >=18.2.0 continuam.
- Next só é executado em apps/admin-demo, sem importação de Next em bibliotecas.
- Contratos, CSS público, temas, acessibilidade e snapshots devem permanecer estáveis.
- Se uma atualização causar incompatibilidade real, registrar evidência, reverter somente o pacote incompatível e deixar exceção explícita no issue/PR.
- O rollback é a reversão do commit do lote; não alterar tags nem publicar pacotes nesta etapa.
