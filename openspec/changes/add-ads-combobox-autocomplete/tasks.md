# Tarefas verificáveis — #142

## Planejamento
- [x] Revisar issue, épico, infraestrutura e convenções do monorepo.
- [x] Definir APIs, cenários, risco Critical e abordagem sem dependências de runtime.
- [ ] Validar OpenSpec estrito antes da implementação.

## Biblioteca
- [ ] Implementar AdsCombobox controlado/não controlado, ARIA, teclado, seleção, clear e name.
- [ ] Implementar AdsAutocomplete síncrono e assíncrono com debounce, abort, stale-response e estados.
- [ ] Integrar portal/overlay, tamanhos, tokens, tema, AdsField, SSR e renderOption.
- [x] Exportar tipos e componentes; não alterar #91 nem adicionar react-select. (Conferido no diff da branch.)

## Consumo
- [ ] Exemplos navegáveis e snippet no Admin Demo para busca local e assíncrona, vazio/erro/loading/out-of-order.
- [x] Criar stories no Storybook, docs de API/migração e entrada no CHANGELOG. (Arquivos presentes na branch; build pendente.)

## Validação
- [ ] Testes unitários, teclado, a11y, concorrência assíncrona, controlled/uncontrolled, formulários e foco.
- [ ] Testes E2E de fluxo real, dialog, tema, responsividade e SSR.
- [ ] Executar format, lint, build, typecheck, quality, E2E e OpenSpec estrito; registrar resultados reais.
- [ ] Revisar código e diff, atualizar checkboxes somente com evidência.
- [ ] Abrir PR Draft para develop com riscos e pendências, depois Ready apenas após validações locais.

## Evidência e pendências da execução corrente

- Código e rotas criados na branch `feat/142-ads-combobox-autocomplete`, com testes unitários e E2E escritos, mas **ainda não executados**.
- Diff conferido: nenhum arquivo da issue #91 alterado; nenhuma dependência de runtime nova.
- Validações `openspec validate --all --strict`, `npm run format`, `npm run lint`, `npm run build`, `npm run typecheck`, `npm run test:quality` e `npm run test:e2e` pendentes porque esta execução não dispõe do ambiente do monorepo com Node 24/npm 11.19.1 e dependências instaladas.
- Não considerar a issue concluída, não arquivar a change e não marcar a PR como Ready até obter validação executável, corrigir erros e verificar CI.
