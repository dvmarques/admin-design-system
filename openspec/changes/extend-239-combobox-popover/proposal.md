## Why

Issue #239: o `AdsOrganizationSwitcher` entregue pela #185 contém sua própria pesquisa, navegação e seleção com `AdsPopover`/`AdsInput`, enquanto o `AdsCombobox` e `AdsAutocomplete` consolidados na #142 (PRs #238 e #245, integradas em `develop`) já possuem seleção única, filtro, opções com imagens, portal e estados. Falta uma apresentação genérica **gatilho → popover com campo de busca separado**, capaz de atender a outros consumidores, sem regras de organização.

## What Changes

- Adicionar ao `AdsCombobox` a apresentação aditiva `presentation="popover"`, com `renderTrigger`, `footer` e refs separadas para gatilho e campo de busca. Adicionar busca opcional `searchable` e filtragem customizada `filterOption` para suportar os comportamentos já existentes. Manter `presentation="input"` como padrão e preservar `AdsAutocomplete` e a API atual.
- Extrair a lógica comum de opção ativa, value/label, filtro, aberto/fechado, disabled, erro/loading, limpeza e valor de formulário; definir contratos ARIA distintos para campo editável e popover com busca.
- Suportar gatilho com avatar/ícone/título/descrição, pesquisa separada, conteúdo de rodapé arbitrário (composição acessível), value/defaultValue, open/defaultOpen, selectedOption, onValueChange e semântica de seleção única.
- Refatorar `AdsOrganizationSwitcher` para **efetivamente usar** o novo modo, mantendo API, visual, localização na sidebar, `searchable="auto"`, mobile, tooltip, estados e troca assíncrona sem confirmação otimista.
- Integrar exemplos funcionais no Admin Demo e Storybook na mesma PR, testes de foco/ARIA/formulários, overlays aninhados, SSR/hidratação, E2E e revisão de bundle.

## Capabilities

### New Capabilities

Nenhuma (extensão das capacidades existentes).

### Modified Capabilities

- `combobox-autocomplete`: nova apresentação genérica de seleção única com gatilho e pesquisa interna.
- `organization-switcher`: implementação composta reutilizando `AdsCombobox` popover, mantendo contrato público observável.

## Impact

Perfil **Critical**: API pública, acessibilidade transversal, refatoração entre `@admin-ds/components` e `@admin-ds/admin`, overlays portalled, integração Next.js, CSS e regressões de seleção assíncrona. `apps/admin-demo`, `apps/docs`, testes e documentação. Dependência direcional preservada: `components` nunca importa `admin`. Sem nova dependência runtime nem redesenho.

Fora do escopo: mudar #142 ou PR #238, multisseleção (#143), backend, autenticação, permissões/persistência, gestão real de organizações, outros popovers, #91. Entrega em branch/PR próprias para `develop`. Não arquivar ou fazer merge sem revisão/validação exigida. Referências: [#239](https://github.com/dvmarques/admin-design-system/issues/239), #185, #142, #141.
