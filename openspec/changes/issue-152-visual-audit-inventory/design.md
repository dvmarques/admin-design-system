# Decisões da fase 1

O catálogo `apps/admin-demo/app/catalogo/catalog-data.ts` é a fonte de nomes/grupos/rotas. A tabela em `docs/admin-demo-catalog.md` é a fonte de Storybook. O teste AST da #151 continua garantindo cobertura dos exports de runtime; o script da #152 não substitui esse teste.

O extrator é deliberadamente estrito quanto ao formato literal atual. Se ele mudar, a verificação falha em vez de tratar uma matriz parcial como completa. `--print` produz stdout e não sobrescreve status ou evidência. `--check` confronta as três fontes, valida stories existentes e requer evidência para status não pendente.

Não há aplicação Client Component, import privado de pacote, alteração de dependência, CSS ou bundle. Teste Node integrado ao `test:ci`. Risco: reestruturações de sintaxe do catálogo/Markdown exigirão adaptar o extrator; rollback simples reverte script, matriz, docs e entrada de teste.
