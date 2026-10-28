# Tarefas verificáveis — #142

## Planejamento
- [x] Revisar issue, épico, infraestrutura e convenções do monorepo.
- [x] Definir APIs, cenários, risco Critical e abordagem sem dependências de runtime.
- [ ] Validar OpenSpec em modo estrito (`openspec validate --all --strict`).

## Biblioteca — implementação versionada (execução ainda não validada)
- [x] Implementar AdsCombobox controlado/não controlado, ARIA, teclado, seleção, clear e name.
- [x] Implementar AdsAutocomplete síncrono e assíncrono com debounce, abort, proteção contra respostas obsoletas e estados.
- [x] Integrar código de portal/overlay, tamanhos, tokens, tema, AdsField, SSR e renderOption.
- [x] Exportar tipos e componentes; não alterar #91 nem adicionar react-select.

## Consumo — arquivos versionados (execução ainda não validada)
- [x] Adicionar exemplos e snippets ao Admin Demo para busca local/assíncrona, vazio, erro, loading, respostas fora de ordem e uso em AdsDialog.
- [x] Criar stories no Storybook, docs de API/migração e entrada no CHANGELOG.

## Testes e revisão — escritos, não executados
- [x] Escrever testes unitários cobrindo teclado, ARIA/axe, concorrência assíncrona, estados controlados/não controlados, formulários e foco.
- [x] Escrever testes E2E para interações do Combobox/Autocomplete e integração com AdsDialog (demais cenários gerais também dependem do catálogo E2E existente).
- [x] Revisar estaticamente o código e o diff; aplicar correções identificadas na PR.
- [x] Abrir PR Draft #238 para develop, com riscos e pendências registrados.

## Gates pendentes — não marcar como concluídos sem evidência
- [ ] Executar testes unitários, de acessibilidade e regressões; corrigir todas as falhas.
- [ ] Executar Playwright E2E, inclusive temas, 390 px, diálogo/overlay e SSR/hidratação; corrigir falhas.
- [ ] Executar format/Prettier, lint, build, typecheck, test:quality e OpenSpec estrito; registrar resultados.
- [ ] Medir orçamento de bundle JS/CSS e fazer revisão final de API pública/acessibilidade.
- [ ] Passar PR #238 para Ready for review e obter CI verde no SHA final.
- [ ] Concluir revisão independente antes de merge, arquivamento da change ou fechamento da #142.

## Evidência e situação atual

- Código, exemplos, docs, stories e arquivos de teste presentes na branch `feat/142-ads-combobox-autocomplete`.
- Revisão estática e correções registradas na PR #238. Diff sem alterações na issue #91 nem dependência nova de runtime.
- **Os checkboxes marcados acima indicam trabalho escrito/versionado, não comportamento validado em execução.**
- Os comandos de validação do monorepo ainda **não foram executados** nesta sessão. CI consta como `skipped` enquanto a PR estiver Draft.
- Não considerar a issue concluída; não arquivar a change nem fazer merge antes dos gates.
