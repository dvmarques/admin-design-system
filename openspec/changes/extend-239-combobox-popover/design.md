## Contexto

`AdsCombobox` hoje usa um input `forwardRef<HTMLInputElement>`, `role="combobox"`, popup portalled com `role="listbox"`, value e inputValue separados e estado controlado/não controlado. `AdsOrganizationSwitcher` atualmente combina `AdsPopover` (`role=dialog`), `AdsInput`, lista de botões e `useGuardedAction`. As duas apresentações têm comportamentos de foco distintos. A refatoração não pode transformar o código genérico num seletor de organizações nem quebrar consumidores `AdsAutocomplete`.

## Contrato aditivo aprovado

- `presentation?: 'input' | 'popover'`, padrão `'input'`, sem alteração de props/semântica existentes nessa apresentação.
- `renderTrigger?: (context) => ReactElement`: composição de um **único botão** com conteúdo próprio (ícone/avatar, nome, descrição, chevron). O contexto inclui `open`, `selectedOption`, `disabled` e `triggerProps` com aria-expanded, aria-controls, aria-haspopup=dialog, onClick, disabled e ref de gatilho. A implementação deverá combinar handlers/refs sem aninhamento interativo e documentar que o consumidor deve espalhar `triggerProps` no elemento adequado.
- `footer?: ReactNode`: renderizado **fora da listbox**, dentro do painel, permitindo links e ações opcionais sem converter opções em conteúdo interativo aninhado. Textos/ícones do footer permanecem genéricos.
- `triggerRef?: Ref<HTMLButtonElement>`, `searchInputRef?: Ref<HTMLInputElement>` para modo popover. O `ref` já público do modo input continua referindo o input existente; na apresentação popover, o acesso é pelas refs nomeadas. Definir tipagem discriminada ou overload público para impedir associações indevidas sem exigir migração do modo antigo.
- Reutilizar `value`/`defaultValue`, `onValueChange(value, option)`, `selectedOption`, `open`/`defaultOpen`, `onOpenChange`, `disabled`, `readOnly`, `options`, `filterOptions`, `renderOption`, `showOptionVisuals`, `loading`, `error`, `onRetry`, `name`, `required`. `inputValue`/`onInputValueChange` correspondem **à consulta**, não ao valor selecionado. Para popover, digitar não apaga a seleção confirmada (diferente da política atual de digitação no modo input).
- Adicionar prop opt-in `closeOnSelect?: boolean` (default true), necessária para consumidores que aguardam aprovação assíncrona. Com false, não fechar nem forçar commit visual até a prop controlada mudar; `AdsOrganizationSwitcher` controla seleção e fechamento. A primitiva não interpreta `Promise` nem estado organizacional.
- `name` serializa apenas `value` selecionado, nunca `label` ou consulta; para `required` sem seleção, implementar controle validável em formulário, não depender apenas de `input type=hidden` (não participa de constraint validation). Documentar submissão/reset e campos desabilitados.
- Não mudar `AdsComboboxOption` de forma incompatível; visual de opção e footer são slots, não props de domínio.

## Foco e ARIA por apresentação

1. **Input (existente):** manter `role=combobox`, `aria-autocomplete=list`, campo editável com `aria-activedescendant`, teclado e comportamento de formulário atual; regressões de #142/#245.
2. **Popover:** o gatilho é um `button type=button` com `aria-haspopup=dialog`, `aria-expanded` e `aria-controls` quando aberto. O painel é um **dialog não modal** rotulado, portalled, com campo de busca separado (quando habilitado), e `listbox` apenas contendo opções. `renderOption` não deve gerar botões/links aninhados no `role=option`.
3. **Pesquisa visível:** ao abrir, foco vai para o input de pesquisa, cujo `aria-controls` aponta à lista; ArrowUp/ArrowDown atualizam opção ativa, Enter seleciona, Escape fecha somente popup e devolve foco ao gatilho, Tab permite alcançar footer/seguir fluxo sem prender foco em popup não modal.
4. **Pesquisa ausente:** iniciar foco na lista ou opção ativa por estratégia de `tabindex`/activedescendant definida e testada; setas/Enter/Escape continuam operáveis. Evitar múltiplos tab stops inesperados.
5. `aria-selected` identifica confirmação real, não hover ou pending. Não marcar gatilho genérico `role=combobox` quando ele abre um dialog. Painéis e footer têm nomes acessíveis e estados loading/vazio/erro anunciados sem duplicação.
6. Portal, click outside, foco de retorno e Escape usam `AdsPopover`/overlay-utils, com respeito a modal superior, backdrop, scroll, overflow, drawers mobile, z-index, tooltips e StrictMode. Não duplicar listeners nem quebrar hierarchy lógica de overlays.

## Refatoração do OrganizationSwitcher

- Converter organizações em `AdsComboboxOption` com id como value, name como label, description, avatar e disabled; manter `AdsOrganization`, tom de avatar, labels atuais, `manage`, positioning, `collapsed`, `searchable: true | false | 'auto'` (limiar atual 7) e customizações visuais via slots. Filtro por nome + descrição mantém normalização de diacríticos já usada; prever `filterOptions` customizável ou entrada de opções filtradas sem duplicar navegação e seleção.
- O wrapper fornece `value={currentId}` controlado e `closeOnSelect={false}`; ao solicitar seleção, `useGuardedAction` mantém `pendingId`, bloqueia operações concorrentes e aguarda `onValueChange(id): void | Promise<void>`. **Só após resolução bem-sucedida**, atualiza estado não controlado ou depende de prop controlada, fecha painel e devolve foco. Se rejeitar, não muda visualmente a organização, mantém painel/valor e mostra erro; nenhuma confirmação otimista.
- Ações `manage` ficam no `footer` externo à listbox; preservar link/callback, foco, labels e comportamento de fechamento. Continuar sem espaço reservado caso o seletor esteja ausente da sidebar; validar desktop expandido/recolhido, tooltip e drawer mobile.
- Sem mudar assinatura de callbacks, valores, CSS públicos ou visual estabelecido. Evitar alterações no `panel-utils` sem regressão de outros consumidores.

## Qualidade, bundle e rollback

- Isolar lógica de seleção em helper/hook interno para não duplicar toda a renderização; manter import `components → admin` unidirecional.
- Nenhuma lib nova de overlays, seleção ou posicionamento. Orçamento atual de `@admin-ds/components`: 226.000 bytes / 68.500 gzip; medir após build e não elevar sem evidências e revisão.
- Admin Demo/Storybook: input versus popover, gatilho com avatar, busca, seleção atual, vazio, disabled, loading, error, footer, controlado/não controlado; switcher desktop/mobile, sidebar sem switcher, pending sucesso/falha.
- E2E: diálogo com popover descendente, overflow/scroll, 390px, zoom, temas, SSR/hidratação Next.js, formulário, axe/ARIA e foco entre trigger, busca, lista e footer.
- Rollback: modo `input` e `AdsAutocomplete` continuam operando independente da feature; manter o wrapper antigo até passar teste de paridade de API/comportamento, sem migrar consumidores.
