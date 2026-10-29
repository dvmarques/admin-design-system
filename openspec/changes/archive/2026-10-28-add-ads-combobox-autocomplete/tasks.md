# Tarefas verificáveis — #142

## Planejamento

- [x] Revisar issue, épico, infraestrutura e convenções do monorepo.
- [x] Definir APIs, cenários, risco Critical e abordagem sem dependências de runtime.
- [x] Validar OpenSpec em modo estrito (`openspec validate --all --strict`).

## Biblioteca — implementação versionada

- [x] Implementar AdsCombobox controlado/não controlado, ARIA, teclado, seleção, clear e name.
- [x] Implementar AdsAutocomplete síncrono e assíncrono com debounce, abort, proteção contra respostas obsoletas e estados.
- [x] Integrar código de portal/overlay, tamanhos, tokens, tema, AdsField, SSR e renderOption.
- [x] Exportar tipos e componentes; não alterar #91 nem adicionar react-select.

## Consumo — arquivos versionados

- [x] Adicionar exemplos e snippets ao Admin Demo para busca local/assíncrona, vazio, erro, loading, respostas fora de ordem e uso em AdsDialog.
- [x] Criar stories no Storybook, docs de API/migração e entrada no CHANGELOG.

## Testes e revisão

- [x] Escrever testes unitários cobrindo teclado, ARIA/axe, concorrência assíncrona, estados controlados/não controlados, formulários e foco.
- [x] Escrever testes E2E para interações do Combobox/Autocomplete e integração com AdsDialog (demais cenários gerais também dependem do catálogo E2E existente).
- [x] Revisar estaticamente o código e o diff; aplicar correções identificadas na PR.
- [x] Abrir a PR #238 para develop (iniciada como Draft; marcada Ready for review após a validação).

- [x] Validar o indicador do AdsSelect (#140) no CSS público, temas, tamanhos, teclado e alto contraste; demais requisitos da #140 permanecem pendentes.

## Elementos visuais

- [x] Implementar ícone/avatar opcional por opção e seleção, com controle de exibição, fallback e teste de formulário/acessibilidade.
- [x] Demonstrar formatos ligados e desligados no Admin Demo e Storybook e documentar API e migração.
- [x] Verificar visualmente temas, tamanhos e estados, incluindo opção remota selecionada e renderOption.

## Navegação do catálogo

- [x] Ordenar itens dos grupos da sidebar por nome e verificar a ordem e preservação dos grupos com teste.

## Gates pendentes — não marcar como concluídos sem evidência

- [x] Executar testes unitários, de acessibilidade e regressões; corrigir todas as falhas.
- [x] Executar Playwright E2E, inclusive temas, 390 px, diálogo/overlay e SSR/hidratação; corrigir falhas.
- [x] Executar format/Prettier, lint, build, typecheck, test:quality e OpenSpec estrito; registrar resultados.
- [x] Medir orçamento de bundle JS/CSS e fazer revisão final de API pública/acessibilidade.
- [x] Passar PR #238 para Ready for review e obter CI verde no SHA final.
- [x] Concluir revisão independente antes de merge, arquivamento da change ou fechamento da #142.

## Evidência e situação atual

- Código, exemplos, docs, stories e arquivos de teste presentes na branch `feat/142-ads-combobox-autocomplete`.
- Revisão estática e correções registradas na PR #238. Diff sem alterações na issue #91 nem dependência nova de runtime.
- Evidência final: format, lint, build, typecheck, `test:quality` (1.253 testes), OpenSpec estrito e E2E (Chromium, Firefox e WebKit) verdes na CI do SHA final da PR #238, com baselines Linux regenerados pelo workflow oficial.
- Revisão independente (API pública e acessibilidade) e revisão geral publicadas na PR; pendências P2 tratadas no follow-up #245.
