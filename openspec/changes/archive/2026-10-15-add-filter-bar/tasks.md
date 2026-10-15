## 1. API e tipos

- [x] 1.1 Definir tipos públicos (`AdsFilterBarProps`, `AdsFilterBarLabels`, `AdsFilterDefinition` e variantes, `AdsFilterOption`, `AdsFilterValue`, `AdsFilterValues`) e utilitários internos (valor vazio, normalização, descrição dos chips). Concluída quando os tipos exportam sem `any` e passam no `typecheck`.
- [x] 1.2 Exportar a API pelo ponto de entrada de `@admin-ds/admin`.

## 2. Componente

- [x] 2.1 Renderizar filtros `text`, `select`, `multiselect`, `date` e `date-range` com `AdsField`, `AdsInput`, `AdsSelect`, `AdsSelectionGroup`/`AdsCheckbox` e `AdsDatePicker`, em modo controlado, com `description` e `error`; na seleção múltipla, `AdsFieldDescription`/`AdsFieldMessage` ligados ao grupo por `aria-describedby` e `aria-invalid` nas opções.
- [x] 2.2 Implementar chips de filtros ativos, remoção individual, "Limpar filtros", anúncio da quantidade (por chip) e gestão de foco, que vai ao botão "Filtros" quando os campos estão recolhidos e só é aplicada quando o foco se perdeu com a remoção do botão acionado (consumidores assíncronos ou em etapas).
- [x] 2.3 Implementar recolhimento responsivo (botão com `aria-expanded`/`aria-controls`, `defaultExpanded`, `expanded`, `onExpandedChange`) sem leitura de `window`.
- [x] 2.4 Implementar estados `disabled` (botão "Filtros" operável só para expandir e recolher), `loading` (com indicador visual discreto, também em touch) e sem filtros ativos.
- [x] 2.5 Adicionar estilos `ads-filter-bar*` em `packages/admin/src/styles.css` com tokens, temas claro e escuro e container query, sem Tailwind.

## 3. Testes e documentação

- [x] 3.1 Testes de comportamento: cada tipo de filtro, chips, remoção, limpar tudo, foco, recolhimento, estados, controle estrito, SSR e `axe`; teste de que o pacote não importa `next/*`.
- [x] 3.2 Story no Storybook (padrão, todos os tipos, recolhida/estreita, desabilitada, carregando, sem filtros, com erro, tema escuro) e atualização do teste de pacote do `admin`, se necessário.
- [x] 3.3 Atualizar `docs/integration.md` (exemplo com `searchParams`), `docs/architecture.md` e `docs/limitations.md`.

## 4. Validação

- [x] 4.1 Executar `npm run format`, `lint`, `build`, `typecheck`, `test:quiet`, `inspect:packages`, `openspec validate --all --strict` e `npm run test:e2e`, confirmando que nenhum teste E2E falha.
- [x] 4.2 Registrar que os snapshots visuais têm baseline só `win32`: são pulados na CI, falham em execução local fora do Windows, e esta change não adiciona nem altera baseline.
- [x] 4.3 Confirmar que nenhuma dependência de runtime foi adicionada e que `apps/admin-demo` não foi alterado.
- [x] 4.4 Validar o consumo do CSS compilado em uma aplicação Next.js (build de produção do `admin-demo` com página temporária não commitada, temas claro e escuro, sem erro de hidratação).
- [x] 4.5 Atualizar o baseline de `@admin-ds/admin` em `docs/bundle-baseline.json` e `docs/bundle-baseline.md` somente se `inspect:packages` exigir.

Notas de validação (Windows, Node 24): `npm run validate` completo passou (Vitest 314, `test:quality` 28 e E2E 92/92, incluindo os snapshots visuais `win32`), e nenhum baseline visual foi criado ou alterado. O CSS da barra (container query, cabeçalho e `[data-expanded='false']`) é verificado em `package.test.mjs` e `verify-package.mjs`. A 4.4 foi feita numa página temporária, não commitada, no build de produção do `admin-demo`: temas claro e escuro, 1100 px com os campos visíveis e 375 px com os campos recolhidos atrás do botão "Filtros", sem rolagem horizontal e sem erro ou aviso de hidratação no console. Na mesma página, em 375 px, remover o último chip e "Limpar filtros" levam o foco ao botão "Filtros"; em 1100 px, ao primeiro campo. O exemplo de `docs/integration.md` foi executado no build de produção, junto com uma variante que aplica o texto na hora e o restante só via URL (`startTransition`), em 375 e 1100 px: "Limpar filtros" com e sem texto, chip do meio e remoção um a um nunca deixaram o foco no `body` (chip vizinho; sem chips, botão "Filtros" em 375 px ou primeiro campo em 1100 px). No exemplo, duas remoções rápidas se mantêm, e uma mudança externa da URL (link e Voltar) reaplica os parâmetros, inclusive durante a pausa da digitação, sem que o texto pendente sobrescreva a URL externa. Com `loading`, a faixa animada aparece no topo da barra nos dois temas e fica estática com `prefers-reduced-motion: reduce`. O `openspec validate --all --strict` passa (37/37) e só reporta uma nota INFO já existente em `spec/date-picker` (requisito com mais de 500 caracteres), fora do escopo desta change. A change continua ativa; o archive fica para o closeout.
