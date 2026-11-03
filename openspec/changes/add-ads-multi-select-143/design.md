## Contexto e alternativas

O pacote `components` exporta controles `Ads*`, usa `AdsField` que injeta `id`/`aria-describedby`/`validationState` no elemento filho e classes de formulário apoiadas em tokens. `AdsCombobox` oferece seleção única, enquanto `AdsFilterBar` oferece multisseleção específica de filtros administrativos. Evitar introduzir dependência do pacote `admin` ou alterar semântica do combobox existente.

Alternativas: (A) estender `AdsCombobox` com `multiple` causa sobrecarga de estados/refs e riscos de regressão no modo único; (B) encapsular `AdsFilterBar` acopla o componente genérico à composição administrativa; (C) controle independente reutilizando tipos utilitários e estilos existentes. **Adotar C**, admitindo reutilização pontual de utilitários existentes sem acoplar domínios.

## Contrato e decisões

- `AdsMultiSelectOption = { value: string; label: string; disabled?: boolean; description?: string }`. Valores são strings estáveis. Proibir duplicatas de valor na lista em documentação; ignorar seleções repetidas.
- `value?: readonly string[]`, `defaultValue?: readonly string[]`, `onValueChange?: (next: string[]) => void`. `value !== undefined` define modo controlado, inclusive `[]`; não mutar arrays fornecidos. Mudança de `options` não deve apagar valores controlados; chips de itens removidos do catálogo ainda podem apresentar o value e ser removidos.
- `maxSelections?: number` positivo: bloqueia novas escolhas após o limite, sem esconder opções existentes e sem bloquear remoção/limpeza. Valores externos acima do limite são renderizados sem destruição implícita; callback nunca cria novos itens acima do limite.
- `disabled` bloqueia todas as mudanças e fecha lista; `readOnly` impede edição e remoção, mas permite inspecionar escolhas; `loading` sinaliza carregamento sem confirmação acidental; `error` apresenta estado legível. `clearable` permite limpar os valores, mas não ignora `required` (navegação/validação de formulário cabem ao formulário).
- `name` gera um valor de formulário por item selecionado, repetindo o nome para cada entrada (`FormData.getAll(name)`). Controle sem seleção não serializa valores. `required` deve oferecer validação de ausência de seleção, foco/feedback anunciáveis e reset em modo não controlado, com documentação dos limites do controle composto. Evitar input hidden como único mecanismo de `required`.
- `AdsField` rotula o input pesquisável via `htmlFor`, associa descrição/erro e injeta `aria-invalid`. Um só controle de foco editável usa `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`; o popup usa `role="listbox"` e `aria-multiselectable="true"` com `role="option"`/`aria-selected`.
- ArrowDown/Up move o destaque entre opções habilitadas; Enter ou clique alterna seleção; Escape fecha; Backspace com consulta vazia remove a última escolha removível; Tab permite sair naturalmente; digitação filtra por label/value (normalizando diacríticos). A lista pode reabrir sem apagar escolhas; foco retorna/permanece no input após seleção.
- O painel permanece no fluxo/contêiner local para a primeira versão (sem portal), com posicionamento responsivo e foco controlado; não criar listeners globais sem necessidade. Para sobreposições modais aninhadas, testar uso em `AdsDialog` e evitar ultrapassar limites de clipping; se houver risco, revisar para reutilizar infraestrutura de overlay antes de considerar a change concluída.
- Preferir tokens `--ads-*` e classes de `formControlClasses`, sem dependência nova nem Tailwind exposto ao consumidor. Publicação usa o pipeline atual de CSS. Proteger no pacote React/Next.js a fronteira `'use client'`; preservar IDs `useId` entre SSR/hidratação.
- `readOnly`, `required`, limites e serialização merecem testes explícitos, inclusive valores vazios, itens desabilitados, limpeza, duplicados, opções dinâmicas e modo controlado. Validação de API/ARIA por testes e E2E; responsividade (390px, zoom 200%), temas claro/escuro e forced colors.

## Integração, riscos e rollback

- Admin Demo: entrada `/catalogo/multi-select`, dados fictícios e demos de controle, erro, desabilitado, loading, zero resultados, limite e formulário. Storybook: stories equivalentes e orientação de teclado.
- Sem dependência nova, sem alteração de `AdsFilterBar`, `AdsCombobox` ou #91. Regressões: seleção única, estilos globais, tamanho de bundle, catálogo autoauditor e tests de consumo público.
- Rollback: remover export e novos arquivos sem afetar APIs anteriores, caso validação de acessibilidade, CSS ou CI falhe.
- Gates: `npm run format`, `npm run validate`, `openspec validate --all --strict`, `npm run test:e2e`, builds Next.js/Storybook, `inspect:packages`, CI executada no SHA final e revisão humana antes de archive/merge. Não assumir sucesso por job skipped nem por ausência de logs locais.


## Evidência de orçamento na integração CI (#143)

Na execução [CI #41558579830](https://github.com/dvmarques/admin-design-system/actions/runs/41558579830) do commit `9429edef`, `npm run inspect:packages` mediu **292.236 bytes** de JS/CSS públicos em `@dvmarques/admin-ds-components` contra o teto anterior de **285.000 bytes**. O artefato completo mediu **670.263 bytes**, permanecendo abaixo do teto de **690.852 bytes** do baseline de distribuição; o novo controle público agrega lógica e CSS, mantendo os imports de Shiki fora do entrypoint. Para não mascarar a mudança, o teto JS/CSS publicado foi revisado explicitamente para **295.000 bytes** (incremento de 10.000 bytes, 3,51%), com 2.764 bytes de margem sobre a medição; orçamento gzip e demais cenários permanecem inalterados e exigem nova medição. A aprovação humana da PR deve revisar esse custo e o resultado de `inspect:packages` completo antes de merge; não usar a elevação como substituto dos gates.
