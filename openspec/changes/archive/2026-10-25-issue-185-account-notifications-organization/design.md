## Contexto

`AdsAdminShell` compõe cabeçalho e sidebar por slots; `AdsPopover` (diálogo não modal ancorado), `AdsDrawer` (diálogo modal com isolamento do fundo) e `AdsAvatar` já existem em `@admin-ds/components`. O `AdsThemeControl` (#182) ocupa o lado direito do cabeçalho e não é alterado.

## Decisões

### Local e nomes

As três composições vivem em `@admin-ds/admin` (composição administrativa, sem regra de negócio) e consomem apenas exports públicos de `@admin-ds/components`. Nomes: `AdsAccountMenu`, `AdsNotificationCenter`, `AdsOrganizationSwitcher`. O CSS é simples (sem Tailwind), com classes `ads-*` e tokens `--ads-*`, em `packages/admin/src/styles.css`, como o restante do pacote.

### Semântica: painel, não `role="menu"`

Conta, organização e notificações misturam identidade, busca, filtros e botões; `role="menu"` exigiria apenas itens de menu e quebraria a leitura por tecnologias assistivas. Conta e organização usam `AdsPopover` (`role="dialog"` não modal, nome acessível, foco movido para o primeiro controle ao abrir, Escape e clique externo fecham, foco volta ao gatilho) com listas (`ul`) de links e botões nativos. Setas, Home e End movem o foco entre as ações como conveniência; Tab fecha o painel e devolve o foco ao gatilho para a ordem natural seguir. Notificações usam `AdsDrawer` (modal), herdando isolamento do fundo, retorno de foco e a pilha de Escape.

### Gatilhos

Cada gatilho é um único `button` nativo (sem interativos aninhados) com nome acessível, `aria-haspopup="dialog"`, `aria-expanded` e `aria-controls` (aplicados por `AdsPopover` ou pelo componente). O avatar é decorativo dentro do botão (`alt=""`); o nome acessível vem do rótulo do botão.

### Avatar

`AdsAvatar` já mostra imagem com fallback textual e reage a `onError`. A falha era guardada como booleano e nunca revertia; passa a guardar o `src` que falhou, de modo que trocar o `src` tenta de novo. O avatar continua um `span` sem comportamento de menu. Iniciais: o consumidor pode fornecer `initials`; sem elas, derivam-se do nome (primeira letra de até duas palavras, maiúsculas); nome ausente produz fallback neutro sem quebrar o layout.

### Conta

- Props: `user` (`name`, `email?`, `avatarSrc?`, `avatarAlt?`, `initials?`), `groups` (grupos com `id`, `label?`, `actions`), `switchAccount?` (ação opcional, grupo próprio com o rótulo `Trocar conta`), `open`/`defaultOpen`/`onOpenChange`, `labels`, `placement`.
- Ação: `id`, `label`, `icon?`, `href?` (link nativo; o roteamento fica com o navegador ou com o consumidor), `onSelect?`, `disabled?`, `tone?` (`danger`), `description?`. `onSelect` pode retornar `Promise`: a ação fica `aria-busy` e desabilitada enquanto pendente, o painel permanece aberto e só fecha ao concluir; rejeição mostra uma mensagem `role="alert"` e reabilita a ação.
- Ações de navegação (`href`) fecham o painel; a navegação em si é do navegador/roteador do consumidor.
- Não há autenticação nem logout reais; "Sair" é uma ação do consumidor. `Trocar conta` (identidade) não é a troca de organização (contexto).
- Textos longos truncam com `title` no bloco de identidade; layout `min-width: 0` e quebra segura em 320 px.

### Notificações

- Dados, contagem e leitura são **controlados**: `notifications`, `unreadCount?` (padrão: não lidas carregadas; não presume igualdade com o total), `onMarkRead(id)`, `onMarkAllRead()`, `onItemSelect(notification)`, `status` (`ready | loading | error`), `onRetry`, `hasMore`, `onLoadMore`, `loadingMore`, `filter`/`defaultFilter`/`onFilterChange`, `open`/`defaultOpen`/`onOpenChange`, `labels`, `formatTime`, `historyHref`.
- **Política de marcação:** abrir o painel nunca marca nada como lido. Ativar um item (link ou ação) chama `onItemSelect` e, com `markReadOnSelect` (padrão `true`), `onMarkRead(id)` para itens não lidos; `markReadOnSelect={false}` deixa a leitura só para o botão. O botão `Marcar como lida` é irmão (nunca filho) do link do item; `Marcar todas como lidas` chama `onMarkAllRead`. A leitura é pedida ao consumidor; o item só deixa de ser "não lido" quando `read` muda nos dados.
- Item: `id`, `title`, `description?`, `timestamp?` (ISO/Date/ms) ou `timeLabel?`, `icon?`, `avatar?`, `read`, `href?`. Data: `formatTime(notification)` do consumidor; padrão `Intl.DateTimeFormat` com `labels`/`locale`, sem biblioteca de datas e sem divergência de hidratação (o tempo só é formatado depois da montagem do painel, que só existe aberto e no cliente).
- Não lida indicada por ponto + texto visualmente oculto "Não lida" + título em peso maior; lida em cor atenuada. Contador: oculto em zero; `99+` visual com contagem exata no nome acessível do gatilho (`Notificações, 120 não lidas`). Sem `aria-live`: o painel não anuncia atualizações da lista ou da contagem.
- Painel: título, filtros `Todas`/`Não lidas` (botões `aria-pressed`), ação global, lista com rolagem interna, rodapé (histórico, `Carregar mais`). Em viewport estreita ocupa `100vw`. Estados: carregando (`role="status"`), vazio, filtro sem resultados, erro com `Tentar novamente` (`role="alert"`), ação pendente (`aria-busy`) e erro por item/global.

### Organização

- Props: `organizations` (`id`, `name`, `description?`, `logoSrc?`, `initials?`, `disabled?`), `value`/`defaultValue`, `onValueChange(id)` (síncrono ou `Promise`), `status`, `onRetry`, `manage?` (`label?`, `href?`, `onSelect?`), `searchable?` (`'auto'` por padrão: busca a partir de 7 opções), `open`/`defaultOpen`/`onOpenChange`, `labels`, `collapsed?`.
- Opcional e independente: não há mudança em `AdsAdminShell`; o consumidor coloca o componente como primeiro filho de `AdsAdminShell.Sidebar`. Sem ele, nada é renderizado (sem bloco, altura ou separador). `collapsed` é inferido do shell quando existir (sidebar desktop recolhida) e pode ser forçado; não exige o shell.
- Seleção: a organização atual é marcada com `aria-current="true"` + ícone de verificação + texto oculto. A troca é **otimista-nunca**: durante a promessa, a opção fica `aria-busy` e as demais desabilitadas, o gatilho continua mostrando a organização anterior e só muda quando `value` muda; rejeição mantém o painel aberto com `role="alert"`.
- Casos: zero organizações (gatilho desabilitado "Sem organizações"), uma, muitas, nomes longos (truncam com `title`), logo que falha (fallback de iniciais via `AdsAvatar`), opções desabilitadas, carregando e erro.
- Recolhida: gatilho compacto só com logo/iniciais e `AdsTooltip` com o nome; o painel continua operável sem expandir a sidebar. Mobile: dentro do drawer de navegação, o popover é uma camada acima do modal (comportamento existente de popups descendentes), com foco e Escape por camada.

### Client/Server

Os três usam estado, foco e overlays: `"use client"`. Nenhum acessa DOM, `window` ou `matchMedia` fora de efeitos/handlers; o markup de servidor é o do estado fechado, idêntico ao primeiro render do cliente. A formatação de datas ocorre só dentro do painel (montado no cliente).

### CSS e distribuição

CSS simples em `@layer components` de `@admin-ds/admin/styles.css`, com prefixos `ads-account-menu`, `ads-notification-center`, `ads-organization-switcher`. Sem dependência do Tailwind pelo consumidor. Cores e espaçamentos por tokens semânticos (`--ads-color-*`, `--ads-spacing-*`), portanto claro/escuro e alto contraste herdam os temas; `prefers-reduced-motion` desativa transições; alvos de toque ≥ 2,75 rem; zoom 200% e 320 px sem rolagem horizontal. O painel do drawer ajusta `padding`/`overflow` do painel por `style` próprio para ter cabeçalho fixo e lista rolável, sem sobrescrever utilitários por especificidade.

### Alternativas descartadas

- `AdsDropdown` (`role="menu"`) para conta/organização: inadequado a painéis com identidade e busca.
- Obrigar o seletor de organização no shell ou criar um slot dedicado: viola a opcionalidade; a composição por filhos já cobre "topo da sidebar".
- Marcar tudo como lido ao abrir: rejeitado explicitamente na issue.
- Estado interno de organização atual otimista: contradiz "não mostrar como confirmada antes do sucesso".
- Biblioteca de datas ou de ícones: dependência desnecessária.

### Bundle e dependências

Sem dependências novas. Três componentes pequenos em `@admin-ds/admin` e sete ícones. Os componentes novos não são carregados por quem não os importa (exports nomeados, `sideEffects` só no CSS).

## Riscos

- Overlays aninhados (popover sobre drawer, tooltip sobre popover): cobertos por testes unitários e E2E.
- Painel com foco inicial programático: coberto por testes de foco, Escape e retorno ao gatilho.
- Snapshots visuais do cabeçalho mudam por intenção; baselines Linux regenerados pelo fluxo oficial.
