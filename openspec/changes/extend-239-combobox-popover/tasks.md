## 1. Contratos e infraestrutura compartilhada

- [x] 1.1 Definir e validar tipos aditivos `presentation`, `renderTrigger`, `footer`, `triggerRef`, `searchInputRef`, `searchable`, `filterOption`, `closeOnSelect` e props de pesquisa/seleção sem regressão `forwardRef<HTMLInputElement>` no modo input.
- [x] 1.2 Extrair estado e lógica compartilhados de seleção, opções ativas, filtro, portais e value/label sem nova dependência nem import de `admin` em `components`.
- [x] 1.3 Implementar gatilho customizado com apenas um handler de abertura, painel de diálogo não modal, pesquisa separada, lista sem interativos aninhados e footer; manter `AdsAutocomplete` funcionando como antes.
- [x] 1.4 **Antes do Apply**, prototipar `name`, `required`, `form`, `reportValidity()`, foco inválido, `FormData` e reset; implementar controle/descontrole, erro/loading/vazio, disabled/readOnly, valor distinto da consulta e `closeOnSelect={false}`.

## 2. Acessibilidade e casos difíceis

- [x] 2.1 Testar ARIA/nome e fluxo de foco distintos: input editável versus botão/popover, com e sem busca, setas, Enter, Escape, Tab/Shift+Tab, footer e retorno ao gatilho.
- [x] 2.2 Testar overlay portalled em `AdsDialog`, modal mobile e popover aninhado; click outside, Escape por camada, scroll, overflow e posicionamento.
- [x] 2.3 Testar foco, axe, SSR/Next.js hydration, React StrictMode, portal com layout atualizado, viewport 390px, zoom 200%, alto contraste e temas claro/escuro.

## 3. Refatoração de OrganizationSwitcher

- [x] 3.1 Mapear organizações → `AdsComboboxOption` e substituir navegação/filtro próprios por composição da nova apresentação; preservar busca por nome/descrição via `filterOption` com diacríticos, ausência de busca e limiar `searchable="auto"`.
- [x] 3.2 Manter `AdsOrganizationSwitcherProps` e aparência: gatilho expandido/recolhido, logo/avatar/fallback/tom via slots sem duplicação, tooltip, labels, placement, opção atual e footer `manage`.
- [x] 3.3 Preservar troca síncrona/assíncrona via `useGuardedAction`, pending/error, rejeição e race guard; valor controlado sem confirmação otimista, retorno de foco e click outside.
- [x] 3.4 Testar sidebar expandida/recolhida/mobile, sem OrganizationSwitcher, 0/1/muitas organizações, opções disabled e links/callback manage.

## 4. Consumo e documentação na mesma PR

- [x] 4.1 Adicionar ao Admin Demo ambos os modos Combobox: gatilho com avatar, busca, seleção, disabled, vazio, erro/loading, footer, formulário e valores controlados/não controlados.
- [x] 4.2 Atualizar Admin Demo do OrganizationSwitcher: sidebar com/sem seletor, expandida/recolhida, mobile, troca assíncrona com sucesso/falha e gerenciar.
- [x] 4.3 Criar/atualizar stories, documentação pública de APIs, semântica ARIA, composição e migração interna; atualizar matriz do catálogo e CHANGELOG [0.1.1].
- [x] 4.4 Executar testes de regressão da #142 e #185 e medir pacote JS/CSS e orçamento gzip, documentando quaisquer diferenças.

## 5. Gates

- [x] 5.1 Formatar todos os arquivos alterados via `npx.cmd prettier --write` e aprovar `npm run format`.
- [ ] 5.2 Executar e aprovar `npm run validate`, `openspec.cmd validate extend-239-combobox-popover --strict` e `openspec.cmd validate --all --strict`; registrar logs, skipped checks, testes E2E e accessibility.
- [ ] 5.3 Validar builds de Admin Demo/Storybook, CSS publicado e consumidores Next.js; revisar snapshots apenas após diferença intencional, compatibilidade e rollback antes de marcar Ready for review.
