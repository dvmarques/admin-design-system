## 1. Preparação e contrato

- [x] 1.1 Revisar #193, #196, #151, AGENTS.md, specs e a matriz de cobertura; verificar a versão do Storybook.
- [ ] 1.2 Validar esta change com OpenSpec em checkout isolado, em branch criada de develop.
- [ ] 1.3 Comparar exports atuais com matriz da #151, identificando APIs simples, genéricas e compostas, com exceções justificadas.

## 2. Geração de documentação

- [ ] 2.1 Configurar `@storybook/addon-docs` compatível e dependências dev/lockfile reproduzíveis, preservando o build.
- [ ] 2.2 Garantir página de API por export público de UI sem remover ou substituir stories.
- [ ] 2.3 Revisar props/tipos, obrigatoriedade, defaults reais, variantes, estados, acessibilidade e exemplos; complementar genéricos e partes compostas explicitamente.
- [ ] 2.4 Atualizar matriz/guia de referência de API e CHANGELOG na versão em andamento.

## 3. Testes de saída e publicação

- [ ] 3.1 Substituir teste vazio por validação de documentação efetivamente gerada em `index.json`, confrontando inventário real.
- [ ] 3.2 Adicionar/verificar smoke de páginas de docs reais com tabelas e exemplos, light/dark e teclado.
- [ ] 3.3 Validar os URLs, assets, tema e navegação em `/admin-design-system/storybook/`, preservando o link do demo.
- [ ] 3.4 Conferir que novos exports já integrados em develop constam da referência, sem adicionar componentes futuros.

## 4. Validação e PR

- [ ] 4.1 Executar `npm run build`, `npm run typecheck`, testes focalizados e o Storybook real; inspecionar exemplos e diferenças intencionais.
- [ ] 4.2 Executar `npm run validate` e `openspec.cmd validate --all --strict`; registrar resultados, falhas e checks dispensados. Não atualizar snapshots sem mudança visual intencional revisada.
- [ ] 4.3 Formatar arquivos alterados com Prettier, executar `npm run format`, revisar diff e abrir PR para `develop`.
- [ ] 4.4 Após validação comprovada, marcar PR Ready, inspecionar CI do SHA atual, corrigir findings e solicitar revisão humana; não efetuar merge ou archive sem autorização.

## Evidência e limites

- Branch GitHub criada nesta sessão; não equivale a worktree local.
- A ausência de checkout executável impede afirmar quaisquer testes ou builds aprovados. Só 1.1 foi concluída por inspeção dos arquivos e issues via GitHub.
