# Tasks

## 1. API reutilizável

- [x] 1.1 Implementar `AdsFileUpload` e exportar API/tipos públicos; confirmar ausência de alteração nos exports antigos ou dependências de runtime.
- [x] 1.2 Validar `accept`, tamanho e quantidade; comunicar rejeições tipadas e preservar seleção quando todas as novas escolhas falharem.
- [ ] 1.3 Estados controlado e não controlado, limpeza/reseleção e remoção; revisar rótulos, foco, teclado, erros, temas e responsividade.

## 2. Verificação e consumidores

- [x] 2.1 Criar testes unitários para seleção, rejeições, remoção, limpeza, cancelamento, estado controlado, loading e acessibilidade; executar os testes.
- [x] 2.2 Adicionar Storybook com estados vazio, selecionado, erro, desabilitado e carregando e verificar geração.
- [x] 2.3 Incluir exemplo funcional no Admin Demo com `AdsDialog`/`AdsButton`, importação simulada sem backend; verificar o consumo do CSS compilado no Next.js.
- [ ] 2.4 Cobrir fluxo de importação, teclado, acessibilidade e responsividade por E2E; executar e conferir resultados.
- [x] 2.5 Documentar API, integração/limitações e registrar a change #232 no CHANGELOG da versão em andamento.

## 3. Gates e revisão

- [x] 3.1 Formatar todos os arquivos alterados com Prettier; executar `npm run format`.
- [x] 3.2 Executar `npm run lint`, `npm run typecheck`, `npm run build` e `npm run test:quality`.
- [ ] 3.3 Executar `npm run test:e2e` sem falhas, confirmar temas e screenshots; não aceitar snapshots sem revisão.
- [x] 3.4 Executar `npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive`.
- [ ] 3.5 Revisar diff, riscos e evidências no SHA final antes da PR e da revisão humana.
