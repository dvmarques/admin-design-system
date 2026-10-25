# Integração do design system

## Instalação e estilos

Uma aplicação consumidora importa as APIs e folhas de estilo públicas:

```ts
import { AdsThemeControl } from '@admin-ds/components';
import { tokenValues } from '@admin-ds/tokens';
import '@admin-ds/tokens/styles.css';
import '@admin-ds/components/styles.css';
```

O CSS distribuído já contém as classes necessárias. A aplicação consumidora
não precisa instalar ou configurar Tailwind CSS para usar os componentes.

## Navegação hierárquica da sidebar

Dentro de `AdsAdminShell.Sidebar`, use `AdsAdminShell.Navigation` como raiz,
`NavigationSection label="Componentes"` como seção não interativa,
`NavigationGroup label="Básicos" icon={...}` como categoria expansível e
`NavigationItem` envolvendo um link nativo ou do roteador. As partes e os tipos
`AdsAdminShellNavigation*Props` são públicos no pacote admin; os estilos já são
distribuídos em `@admin-ds/admin/styles.css`.

As seções usam `role="group"` com `aria-labelledby` vinculado ao título por um id único, inclusive entre instâncias e durante hidratação.

O grupo usa `details/summary`: Tab move o foco e Enter/Espaço alternam a expansão.
Para controlar a abertura, passe `open` e `onToggle`; omitir `open` permite o
comportamento nativo. O consumidor aplica `aria-current="page"` no link e decide
quando abrir o grupo de destino. No desktop recolhido, acionar o ícone expande
a sidebar e abre o grupo. As partes usam o contexto de `AdsAdminShell` e não
dependem do roteamento Next.js. Veja a story **Layout/Admin Shell — Navegação com
seções, grupos e itens** e `/catalogo/admin-shell`.

## Temas

Defina o tema no elemento raiz da aplicação:

```html
<html data-theme="dark"></html>
```

Os valores aceitos são `light` e `dark`. Sem o atributo, os tokens usam a
preferência `prefers-color-scheme` do sistema. A aplicação é responsável por
persistir a preferência e aplicá-la antes da hidratação quando necessário.

### Controle de preferência: Claro, Escuro e Sistema

`AdsThemeControl` oferece as três preferências (`light`, `dark` e `system`). Ele
só apresenta e **emite** a escolha: a biblioteca não impõe provider, persistência,
roteador nem acesso ao DOM global. A aplicação guarda a preferência, resolve
`system` e aplica o tema efetivo (`light` ou `dark`) em `data-theme`.

```tsx
'use client';
import { AdsThemeControl, type AdsThemePreference } from '@admin-ds/components';

export function HeaderThemeControl({ preference, onChange }: Props) {
	return <AdsThemeControl value={preference} onValueChange={onChange} />;
}
```

- `variant="menu"` (padrão): botão compacto só com ícone que abre as opções.
  O gatilho mostra o ícone da **preferência** (sol, lua ou monitor) e, em Sistema,
  mantém o monitor mesmo quando o tema efetivo muda. `variant="group"` mostra as
  três opções inline.
- `optionDisplay="icon"` (padrão) usa só ícones, com nome acessível e tooltip;
  `optionDisplay="icon-text"` acrescenta o texto.
- `triggerVariant` (`secondary` por padrão) muda a aparência do botão do menu; `ghost` o deixa sem
  borda, como no cabeçalho do admin demo.
  No cabeçalho do admin demo o gatilho é só ícone (com tooltip) e o menu usa
  `optionDisplay="icon-text"`: ao abrir, cada opção mostra ícone e nome.
- Controlado (`value` + `onValueChange`) ou não controlado (`defaultValue`, padrão
  `system`). Mudanças externas atualizam o controle sem remontagem nem `key`, e o
  foco é preservado.
- `labels` (`group`, `light`, `dark`, `system`) personaliza nomes e tooltips; `tooltips={false}`
  desliga os tooltips; `disabled` e `className` seguem o padrão do projeto.
- Acessibilidade: o menu usa itens `menuitemradio` com `aria-checked`, o grupo usa
  `radiogroup` com `radio`; a opção ativa também recebe uma marca visual. Escape
  fecha o menu e devolve o foco ao gatilho; escolher uma opção também.

**Migração de `ThemeToggle`.** `ThemeToggle` (alternância binária, `initialTheme`
e `onThemeChange`) permanece exportado e inalterado; ele não vira ternário. Para
incluir Sistema, troque `initialTheme`/`onThemeChange` por `defaultValue`/`onValueChange`
de `AdsThemeControl` e resolva `system` na aplicação. Uma depreciação formal de
`ThemeToggle` só ocorrerá em uma versão futura, com aviso prévio.

**Exemplo completo (admin demo).** O cabeçalho e as Preferências compartilham uma
única fonte de verdade nos atributos de `<html>` (`data-theme-preference` guarda a
escolha e `data-theme` o tema efetivo):

- a preferência é persistida no cookie `ads-theme` (`light`, `dark` ou `system`);
  cookies `light`/`dark` anteriores continuam válidos e a ausência de valor equivale a
  Sistema;
- `system` é resolvido por `prefers-color-scheme` e acompanhado enquanto estiver
  selecionado (o listener é removido ao sair); escolhas explícitas não são
  sobrescritas pelo sistema;
- um script inline no `<head>` aplica a preferência antes da primeira pintura em todos
  os builds. O servidor não conhece o esquema do sistema: com `system` ou sem cookie ele
  renderiza `data-theme="light"` como fallback e o script o corrige antes da pintura (se o
  script for bloqueado, por exemplo por CSP, o fallback `light` permanece). `<html>` usa
  `suppressHydrationWarning` por isso; o ícone do gatilho depende só da preferência e
  não diverge na hidratação;
- se o cookie não puder ser gravado, a escolha vale na sessão e a interface continua
  funcional.

## Fonte

A pilha tipográfica começa por `Inter`, mas a biblioteca não distribui a fonte. Carregue-a na
aplicação (em Next.js, com `next/font`) para que o texto renderize igual em todas as plataformas;
sem isso, o texto usa a fonte de sistema da pilha. Detalhes e exemplo em
[Identidade visual](visual-identity.md).

## Next.js App Router

Importe os estilos globais em `app/layout.tsx` e mantenha componentes
interativos, como `AdsThemeControl`, em um limite de Client Component. Tokens e
componentes puramente apresentacionais podem ser usados por Server Components.

### Tooltip, Popover e Dropdown nas bordas

Os painéis ancorados preferem o lado solicitado, invertem para o oposto quando
necessário e ajustam os dois eixos com margem de 8px. `data-placement` informa o
lado efetivo nos três componentes; a seta do Tooltip acompanha esse lado e o
centro do gatilho, respeitando os limites do painel. Nenhuma prop mudou.

Os painéis acompanham alterações de tamanho da âncora/conteúdo, scroll de
ancestrais, resize e mudanças da viewport visual. As medidas usam CSS pixels
e posicionamento fixo no portal, sem somar o scroll da página. O portal é
montado após hidratação; as APIs do navegador só são usadas no cliente.

Se nenhum dos lados opostos comportar o conteúdo, escolhe-se o de maior espaço
e o painel pode sobrepor a âncora. Conteúdo maior que a viewport não pode ficar
inteiramente visível: limite as dimensões e ofereça rolagem no conteúdo quando
necessário. Evite transformar `html`/`body`, pois isso pode redefinir o bloco
de referência do posicionamento fixo.

O Storybook inclui `ExtremePositions`; o admin-demo oferece a rota
`/componentes/overlays` para testar lados, cantos, conteúdo dinâmico, temas,
resize, scroll e zoom usando apenas o CSS compilado dos pacotes.

## Admin Shell

O `AdsAdminShell`, de `@admin-ds/admin`, organiza header, navegação e conteúdo sem
assumir autenticação, autorização ou roteamento. Os links pertencem à aplicação
consumidora, que pode usar `a`, `next/link` ou sua própria abstração de navegação
dentro da sidebar.

```tsx
import '@admin-ds/tokens/styles.css';
import '@admin-ds/components/styles.css';
import '@admin-ds/admin/styles.css';
import { AdsAdminShell } from '@admin-ds/admin';

export default function AdminPage() {
	return (
		<AdsAdminShell>
			<AdsAdminShell.Header>
				<AdsAdminShell.NavigationTrigger />
				<AdsAdminShell.SidebarToggle />
				Minha aplicação
			</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar>
					<a href="/clientes">Clientes</a>
				</AdsAdminShell.Sidebar>
				<AdsAdminShell.Main>Conteúdo da página</AdsAdminShell.Main>
			</AdsAdminShell.Body>
		</AdsAdminShell>
	);
}
```

### Estilos e dependências

Os estilos do shell ficam em `@admin-ds/admin/styles.css`, que deve ser importado
junto com `@admin-ds/tokens/styles.css` e `@admin-ds/components/styles.css`. Eles
usam apenas os tokens públicos `--ads-*`, portanto não exigem Tailwind no
consumidor. `@admin-ds/admin` declara `@admin-ds/components` como peer
dependency, pois reutiliza `AdsDrawer` na navegação móvel. A largura da sidebar
pode ser ajustada por `--ads-admin-shell-sidebar-width` e
`--ads-admin-shell-sidebar-width-collapsed`.

### Altura e rolagem no desktop

No layout desktop (a partir de `48rem`, o mesmo limite em que a sidebar substitui o
drawer), o shell ocupa a altura da viewport (`100dvh`, com `100vh` como fallback). O
header mantém a altura natural, mesmo que quebre linhas, e a área abaixo dele é dividida
entre a sidebar e `AdsAdminShell.Main`, que rolam de forma independente: a sidebar só
mostra barra de rolagem quando os itens excedem a altura disponível, e a página não rola
no uso padrão. Por isso o contêiner de rolagem do conteúdo é `AdsAdminShell.Main`, não a
janela: `window.scrollTo`, restauração de scroll da janela e elementos `sticky` do
conteúdo passam a se relacionar com o main. Não renderize o shell dentro de um contêiner
com altura própria e não use `position: fixed` para reposicionar a sidebar. No layout
móvel nada muda: a página rola e a navegação continua no drawer.

`AdsAdminShell.Main` recebe `tabIndex={0}` por padrão, para que a região rolável seja
alcançável pelo teclado mesmo sem conteúdo focável; passe `tabIndex` para sobrescrever.

### Conteúdo do header em telas estreitas

O header é um contêiner flex de uma única linha: o shell não quebra linha nem
esconde o conteúdo que a aplicação compõe nele. Em telas estreitas, como 390px,
componha o header com itens que possam encolher ou quebrar linha, por exemplo
agrupando as ações em um contêiner com `flex-wrap`, para que nenhum controle fique
cortado nem a página ganhe rolagem horizontal. `ThemeToggle` usa a fonte do design
system e mantém o rótulo em uma única linha, então ele depende desse contêiner para
quebrar de linha quando não couber. O gatilho compacto de `AdsThemeControl` ocupa 2,5 rem
quadrados e não exige essa quebra.

### Server Components e estado

Header, Body e Main permanecem compatíveis com Server Components. O estado do shell,
o trigger, o toggle e a sidebar ficam em um limite Client Component interno; não é
necessário transformar a página consumidora em cliente.

A sidebar desktop e o drawer mobile nunca são montados ao mesmo tempo, de modo que o
conteúdo de navegação existe em uma única instância. A decisão entre os dois layouts
usa `matchMedia` somente após a hidratação; o servidor e o primeiro render do cliente
sempre produzem o layout desktop, sem divergência de hidratação.

### Estado recolhido e navegação móvel

Há dois estados independentes, ambos com modo controlado e não controlado:

| Estado                 | Props                                                   | Efeito                                       |
| ---------------------- | ------------------------------------------------------- | -------------------------------------------- |
| Sidebar recolhida      | `collapsed`, `defaultCollapsed`, `onCollapsedChange`    | Somente a ocupação da sidebar desktop        |
| Navegação móvel aberta | `mobileOpen`, `defaultMobileOpen`, `onMobileOpenChange` | Somente a presença do drawer no layout móvel |

`collapsed` nunca compacta o drawer, e `mobileOpen` nunca altera `collapsed`. O shell
não converte o conteúdo da sidebar para uma versão compacta: use `useAdsAdminShell()`
dentro da sidebar para adaptar rótulos e ícones no desktop, mantendo nomes acessíveis.

Para o caso comum de esconder o texto dos itens na sidebar recolhida, aplique a classe
opcional `ads-admin-shell-sidebar-label` ao rótulo. Na sidebar desktop recolhida o texto
fica oculto só visualmente: o item mantém o nome acessível e o foco, sem rótulos
cortados. O drawer mobile sempre mostra o rótulo completo.

```tsx
<a href="/clientes">
	<span aria-hidden="true">Cl</span>
	<span className="ads-admin-shell-sidebar-label">Clientes</span>
</a>
```

Quando a viewport sai do layout móvel com o drawer aberto, o shell encerra o overlay,
move o foco para a navegação desktop e chama `onMobileOpenChange(false)`. No modo
controlado, a prop não é alterada pelo shell; um `true` que continue chegando após o
pedido de fechamento não reabre o drawer. Uma nova abertura exige que a aplicação
reconheça o fechamento (`false`) e depois solicite a abertura (`true`).

### Responsabilidades da aplicação consumidora

O shell não cuida de roteamento, autenticação, autorização, itens de navegação,
conteúdo do header nem persistência de preferências. Para persistir o estado
recolhido, controle `collapsed` e grave o valor em `onCollapsedChange`, por exemplo em
cookie (para renderizar no servidor sem troca visual) ou `localStorage`.

O `AdsNav` atual é horizontal. Por isso a sidebar permanece composicional e aceita
qualquer estrutura de navegação fornecida pela aplicação, como uma lista de links.

## Conta, notificações e organização no shell

Três composições de `@admin-ds/admin`, independentes entre si, completam o cabeçalho e a
sidebar do `AdsAdminShell`: `AdsAccountMenu`, `AdsNotificationCenter` e
`AdsOrganizationSwitcher`. Nenhuma implementa autenticação, sessão, autorização,
multitenancy, backend, persistência ou transporte de notificações: a aplicação fornece os dados
e executa as ações. Todas são Client Components, não exigem provider, roteador ou o próprio shell,
e o servidor renderiza apenas os gatilhos fechados. O CSS vem de `@admin-ds/admin/styles.css`.

```tsx
<AdsAdminShell.Header>
	{/* ... */}
	<AdsThemeControl onValueChange={onTheme} value={theme} />
	<AdsNotificationCenter notifications={items} unreadCount={total} onMarkRead={markRead} />
	<AdsAccountMenu groups={groups} user={user} />
</AdsAdminShell.Header>
<AdsAdminShell.Sidebar>
	<AdsOrganizationSwitcher organizations={orgs} value={orgId} onValueChange={switchOrg} />
	<AdsAdminShell.Navigation>{/* ... */}</AdsAdminShell.Navigation>
</AdsAdminShell.Sidebar>
```

### Menu de conta (`AdsAccountMenu`)

O gatilho é um botão com o `AdsAvatar` (foto quando carrega; iniciais quando ausente, quando a imagem
falha ou quando `initials` é informado; sem `initials`, derivam de `name`). O painel é um diálogo não
modal, não um `role="menu"`: mistura identidade (avatar, nome e e-mail, com truncamento) e ações
(`groups`, com ícone opcional, `href` ou `onSelect`, `disabled`, `tone="danger"`).

- O foco vai para a primeira ação ao abrir; setas, Home e End movem entre as ações habilitadas; Escape,
  clique externo e Tab além das extremidades fecham o painel e devolvem o foco ao botão.
- `switchAccount` é opcional e aparece como grupo próprio "Trocar conta". É troca de identidade
  (autenticação), não de organização: não a use para o seletor de organização.
- `onSelect` pode retornar uma `Promise`: a ação fica `aria-busy`, as demais ficam inoperantes (sem Sair
  duplicado) e o painel só fecha ao concluir; a rejeição mostra um alerta e reabilita a ação.
- Aceita `open`/`onOpenChange` (controlado) ou `defaultOpen`, `labels` e `placement`.
- O avatar do gatilho e da identidade tem fundo (padrão: tom `primary`). Escolha um tom do tema com
  `user.avatarTone` (`neutral`, `primary`, `success`, `warning`, `danger`) ou qualquer cor CSS com
  `user.avatarBackgroundColor` e `user.avatarForegroundColor` (cuide do contraste). `AdsAvatar` aceita
  as mesmas opções (`tone`, `backgroundColor`, `foregroundColor`); o padrão segue neutro.
- `AdsAvatar` continua utilizável sozinho; passou a tentar de novo a imagem quando `src` muda após uma
  falha e aceita `src={undefined}` explícito.

### Central de notificações (`AdsNotificationCenter`)

Sino com contador e painel lateral direito modal (sobre `AdsDrawer`: isolamento do fundo, Escape,
foco e retorno ao sino). Dados, contagem e leitura são controlados:

| Prop                                            | Papel                                                                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `notifications`                                 | Itens carregados (`id`, `title`, `description`, `timestamp` ou `timeLabel`, `icon`/`avatar`, `read`, `href`). |
| `unreadCount`                                   | Total de não lidas da aplicação; não presume igualdade com os itens carregados.                               |
| `onMarkRead`, `onMarkAllRead`                   | Pedem a leitura; o item só vira lido quando `read` muda nos dados. Podem retornar `Promise`.                  |
| `onItemSelect`, `markReadOnSelect`              | Ativar um item chama `onItemSelect` e, por padrão, `onMarkRead` para itens não lidos.                         |
| `status`, `onRetry`                             | `ready`, `loading` ou `error` com "Tentar novamente".                                                         |
| `hasMore`, `onLoadMore`, `loadingMore`          | "Carregar mais" opcional; sem busca nem paginação de backend.                                                 |
| `filter`/`defaultFilter`/`onFilterChange`       | Filtros "Todas" e "Não lidas".                                                                                |
| `historyHref`, `labels`, `locale`, `formatTime` | Rodapé opcional, textos e datas do consumidor.                                                                |

Política de leitura: **abrir o painel nunca marca nada como lido.** Cada item separa navegação e
leitura: o link ou botão do item e o botão "Marcar como lida" são irmãos (nunca um botão dentro de
link). Ativar um item não lido marca-o como lido por padrão; use `markReadOnSelect={false}` para deixar
a leitura apenas ao botão. O badge fica oculto em zero e mostra `99+` acima de 99, enquanto o nome
acessível do sino mantém a contagem exata. Não há região viva: atualizações de lista e contagem não são
anunciadas. Itens não lidos têm marca visual e texto "Não lida"; os lidos ficam atenuados. A lista rola
internamente (cabeçalho e ações fixos) e o painel ocupa a largura disponível em telas estreitas. As
datas só são formatadas dentro do painel, no cliente; sem `formatTime`, usa-se `Intl.DateTimeFormat`
com `locale`.

### Seletor de organização (`AdsOrganizationSwitcher`)

Opcional e independente: coloque-o como primeiro filho de `AdsAdminShell.Sidebar`. O `AdsAdminShell`
não o exige nem cria organização fictícia; sem ele, a navegação ocupa o topo, sem bloco, altura
reservada ou separador residual. O gatilho mostra logo ou iniciais, nome, descrição opcional e seta; o
painel lista as organizações com a atual marcada (`aria-current`, marca visual e texto), busca a partir
de 7 opções (`searchable`), estado sem resultados e `manage` ("Gerenciar organizações") opcional.

- A aplicação controla `value` e `onValueChange`. Com uma `Promise`, a opção fica pendente e o gatilho
  continua mostrando a organização anterior até `value` mudar; a rejeição mantém o painel aberto com um
  alerta. Permissões e a mudança efetiva de contexto ficam com a aplicação.
- Cobre zero (gatilho desabilitado), uma e muitas organizações, nomes longos, logo indisponível,
  opções desabilitadas, `status` `loading` e `error` com `onRetry`.
- Na sidebar desktop recolhida o gatilho fica compacto (logo ou iniciais, com tooltip e nome acessível)
  e a seleção continua utilizável sem expandir a sidebar; `collapsed` força esse modo fora do shell. No
  drawer móvel, o painel é uma camada acima do modal: Escape fecha só o painel.

### Acessibilidade e validação

Gatilhos são botões únicos com nome acessível, `aria-haspopup="dialog"` e `aria-expanded`. O painel
da conta e o da organização reutilizam `AdsPopover` (diálogo não modal) e o das notificações,
`AdsDrawer` (modal). Os testes cobrem teclado, foco e retorno, `Promise` pendente ou rejeitada, axe,
SSR e hidratação; os E2E cobrem os três fluxos no demo, claro e escuro, 320 px, sidebar recolhida,
menu móvel e overlays aninhados. O demo (`/catalogo/account-menu`, `/catalogo/notification-center` e
`/catalogo/organization-switcher`) compara a sidebar com e sem o seletor.

## Padrões de dashboard

`@admin-ds/admin` também exporta `AdsMetricCard`, `AdsDashboardGrid` e
`AdsDashboardPanel`, com os mesmos estilos de `@admin-ds/admin/styles.css` (sem
Tailwind no consumidor). Eles não buscam dados nem conhecem rotas: a aplicação
decide quando exibir cada estado.

```tsx
<AdsDashboardGrid>
	<AdsMetricCard title="Receita" value="R$ 48.200" change="+12,4%" trend="up" />
	<AdsDashboardPanel title="Pedidos recentes" span={3} loading={isLoading} error={error}>
		{conteudo}
	</AdsDashboardPanel>
</AdsDashboardGrid>
```

- `trend` (`up`, `down`, `neutral`) define o ícone e o texto acessível; `sentiment`
  (`positive`, `negative`, `neutral`) define a cor, pois uma alta pode ser ruim.
- O grid usa 1, 2 e 4 colunas (a partir de 40rem e 64rem) conforme a largura
  disponível do próprio grid, via container query, e não a viewport: ao lado da
  sidebar ele usa menos colunas. Nunca reordena painéis; `span` (1 a 4) só se
  aplica quando há colunas suficientes.
- Por ser um container de `inline-size`, o grid não tira a largura do conteúdo:
  o layout precisa defini-la. A largura natural dele é zero, então ele colapsa
  como item de flex em linha sem `flex: 1` (ou `width`), em `inline-block`, em
  `float` ou em elemento `absolute` sem largura. Em bloco comum ou como item de
  grid, ocupa a largura disponível.
- `AdsDashboardPanel` prioriza `loading`, `error`, `empty` e conteúdo. Gráficos
  completos não fazem parte do pacote; só o `AdsSparkline` (abaixo).
- `error` e `empty` são nós nos dois componentes e aceitam elementos de bloco,
  como uma lista. No painel, passe um `AdsEmptyState` em `empty`
  (`empty={<AdsEmptyState title="Sem pedidos" />}`); no card, um texto curto.

### Sparkline

`AdsSparkline` (`@admin-ds/components`) desenha a evolução de uma série em SVG, sem
eixos, sem animação e sem dependência de runtime. Funciona em Server Components.

```tsx
<AdsSparkline label="Receita diária" values={[10, 8, 12, 15, null, 18]} />

<AdsMetricCard
	title="Cancelamentos"
	value="38"
	change="-8%"
	trend="down"
	sentiment="positive"
	sparkline={{ label: 'Cancelamentos, últimos 12 meses', values: serie }}
/>
```

- `values` aceita `null`, `undefined` e `NaN`: são ignorados e a linha liga os pontos
  válidos, mantendo o espaçamento pelo índice. Sem pontos válidos, nada é renderizado
  (no card, o sparkline é omitido). Um ponto vira um marcador; série constante, uma
  linha reta. `min` e `max` fixam a escala.
- O nome acessível (`role="img"`) é gerado: quantidade de pontos, primeiro e último
  valor, mínimo e máximo, formatados em pt-BR. Ajuste com `label`, `labels` (rótulo
  por ponto), `formatValue` ou substitua tudo com `summary`.
- `tone` (`default`, `positive`, `negative`) usa `--ads-color-chart1`, `-success` e
  `-danger`; no card, o tom vem do `sentiment`. A cor nunca é a única informação, e em
  `forced-colors` o traço usa `CanvasText`.
- A largura é a do contêiner e a altura padrão é `2rem` (`className` sobrescreve).

## Aplicação de referência (`admin-demo`)

O `apps/admin-demo` consome os pacotes como uma aplicação externa e serve de
referência para integrar o shell, a navegação, formulários e dados em um Next.js
App Router. Os exemplos abaixo vêm do código do demo.

### Layout compartilhado entre rotas

Monte o `AdsAdminShell` uma única vez em um `layout.tsx` de um grupo de rotas.
O estado do shell (sidebar recolhida, navegação móvel) sobrevive à navegação no
cliente porque o layout não é remontado entre rotas do mesmo grupo:

```tsx
// app/(admin)/layout.tsx
export default async function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<AdsAdminShell>
			<RouteChangeHandler />
			<AdsAdminShell.Header>{/* gatilhos, título e tema */}</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar label="Navegação do demo" mobileTitle="Navegação do demo">
					<DemoNavigation />
				</AdsAdminShell.Sidebar>
				<AdsAdminShell.Main>{children}</AdsAdminShell.Main>
			</AdsAdminShell.Body>
		</AdsAdminShell>
	);
}
```

### Navegação com `next/link`

Os links ficam como filhos da sidebar, em um Client Component da aplicação, que
usa `usePathname` para marcar a página atual. A biblioteca não conhece o roteador:

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function DemoNavigation() {
	const pathname = usePathname();

	return (
		<ul className="demo-shell-nav-list">
			{items.map((item) => (
				<li key={item.href}>
					<Link
						aria-current={pathname === item.href ? 'page' : undefined}
						className="demo-shell-nav-link"
						href={item.href}
					>
						{item.label}
					</Link>
				</li>
			))}
		</ul>
	);
}
```

Como o estado do shell sobrevive à navegação, o drawer móvel não fecha sozinho ao
trocar de rota. Renderize um componente sempre montado, dentro de `AdsAdminShell`
e fora de `Sidebar`, que o feche quando o `pathname` muda. Ele **não** pode viver
na sidebar: no celular o `AdsDrawer` só monta os filhos com o drawer aberto, e um
efeito que fecha o drawer na montagem o fecharia ao abri-lo.

```tsx
'use client';

import { useAdsAdminShell } from '@admin-ds/admin';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function RouteChangeHandler() {
	const pathname = usePathname();
	const { setMobileOpen } = useAdsAdminShell();
	const previousPathname = useRef(pathname);

	useEffect(() => {
		if (previousPathname.current === pathname) return;
		previousPathname.current = pathname;
		setMobileOpen(false);
	}, [pathname, setMobileOpen]);

	return null;
}
```

### Paginação por links (`renderPageLink`)

`AdsPagination` não conhece URL nem roteador. Forneça o link de cada página com
`renderPageLink` e `next/link`, em um Client Component fino (a função é passada
ao componente). Cada página é um link real, sem botão aninhado:

```tsx
'use client';

export function CustomersPagination({ page, pageCount }: CustomersPaginationProps) {
	return (
		<AdsPagination
			page={page}
			pageCount={pageCount}
			renderPageLink={(target, props) => <Link href={`/clientes?pagina=${target}`} {...props} />}
		/>
	);
}
```

Use `onPageChange` apenas quando a mudança de página não for uma navegação (por
exemplo, estado local).

### Links do consumidor em `AdsNav`, `AdsBreadcrumb` e `AdsPagination`

Para usar `next/link` (ou outro link) sem conteúdo interativo aninhado, use
`renderLink` nos itens de `AdsNav` e `AdsBreadcrumb`, e `renderPageLink` em
`AdsPagination`. Espalhe as props recebidas no link: elas trazem `className`,
`aria-current` e o conteúdo.

```tsx
<AdsNav items={[{ label: 'Clientes', renderLink: (props) => <Link href="/clientes" {...props} /> }]} />

<AdsPagination
	page={page}
	pageCount={pageCount}
	renderPageLink={(target, props) => <Link href={`/clientes?pagina=${target}`} {...props} />}
/>
```

A biblioteca não acessa o roteador. `renderPage` (que recebe um botão pronto)
continua funcionando, mas está obsoleto: envolver o botão em um link gera
conteúdo interativo aninhado.

### Tabs, Breadcrumb e Accordion

`AdsTabs` e `AdsAccordion` usam estado e declaram `"use client"`: podem ser
importados por uma página Server Component, mas qualquer função passada a eles
(`onValueChange`, por exemplo) precisa vir de um Client Component. Em uma página
Server Component, componha as partes pelas exportações nomeadas (`AdsTabsList`,
`AdsTabsTrigger`, `AdsTabsPanel`, `AdsAccordionItem`, `AdsAccordionHeader`,
`AdsAccordionTrigger` e `AdsAccordionPanel`): a notação `AdsTabs.List` e
`AdsAccordion.Item` só funciona dentro de Client Components.
`AdsBreadcrumb` e `AdsNav` continuam sem `"use client"`, então uma página Server
Component pode passar `renderLink` com `next/link` diretamente. Só o botão de
expandir do breadcrumb é uma ilha cliente.

**`AdsTabs`**

| Prop             | Valores                     | Padrão       | Efeito                                                                                          |
| ---------------- | --------------------------- | ------------ | ----------------------------------------------------------------------------------------------- |
| `activationMode` | `manual`, `automatic`       | `manual`     | `manual` ativa com Enter ou Space; `automatic` ativa ao mover o foco                            |
| `orientation`    | `horizontal`, `vertical`    | `horizontal` | `vertical` usa ↑ e ↓ (Home e End valem nas duas) e um indicador lateral; empilha abaixo de `sm` |
| `keepMounted`    | `boolean` (raiz ou `Panel`) | `false`      | mantém painéis inativos no documento, com `hidden`, preservando o estado interno do conteúdo    |

Por padrão o painel inativo é desmontado. Os ids derivados de `value` são
válidos para qualquer texto e nunca colidem, e a lista sempre tem uma tab
tabulável, inclusive quando a ativa está desabilitada.

**`AdsBreadcrumb`**

```tsx
<AdsBreadcrumb
	items={items}
	maxItems={4}
	itemsBeforeCollapse={1}
	itemsAfterCollapse={2}
	separator="›"
	aria-label="Trilha de navegação"
	expandLabel="Mostrar caminho completo"
/>
```

Com mais itens que `maxItems`, os do meio ficam atrás de um botão que expande a
trilha no lugar e leva o foco ao primeiro item revelado. O item atual nunca é
escondido. Sem `maxItems`, a trilha aparece por inteiro. `separator` aceita
qualquer nó e é ignorado por leitores de tela.

**`AdsAccordion`**

```tsx
<AdsAccordion type="single" collapsible defaultValue="account">
	<AdsAccordion.Item value="account">
		<AdsAccordion.Header level={3}>
			<AdsAccordion.Trigger>Conta</AdsAccordion.Trigger>
		</AdsAccordion.Header>
		<AdsAccordion.Panel>Conteúdo</AdsAccordion.Panel>
	</AdsAccordion.Item>
</AdsAccordion>
```

- `type="single"` abre um item por vez (`value` e `defaultValue` são texto;
  `collapsible` permite fechar o aberto e `onValueChange` recebe `''`);
  `type="multiple"` abre vários (`value` e `defaultValue` são listas).
- `AdsAccordion.Header` é um heading real: ajuste `level` (2 a 6, padrão 3) à
  hierarquia da página.
- `Item` aceita `disabled`: o item não alterna e é pulado pelas setas. Todos os
  gatilhos habilitados continuam na ordem de tabulação; ↑, ↓, Home e End movem o
  foco entre eles (com volta ao início e ao fim, como nas tabs).
- Por padrão o painel fechado fica no documento com `hidden`, e o estado dos
  campos é preservado. `unmountOnCollapse` remove o conteúdo; defina na raiz e
  sobrescreva por item. Não aplique classes de `display` ao `Panel`, que
  anulariam o `hidden`.
- O painel é uma região nomeada pelo gatilho. Com muitos itens (mais de seis), o
  WAI-ARIA recomenda evitar o papel para não poluir os pontos de referência:
  sobrescreva com `role` no `Panel`.

**Textos e idiomas**

Os textos embutidos têm padrão em inglês (`Breadcrumb` e `Show full path` no
breadcrumb) e sempre podem ser sobrescritos por prop. A biblioteca não traduz
nem depende de uma biblioteca de i18n: passe os textos da sua aplicação.

```tsx
<AdsBreadcrumb
	aria-label={t('breadcrumb')}
	expandLabel={t('showFullPath')}
	items={items}
	maxItems={4}
/>
```

A ordem de resolução é a prop explícita e depois o padrão em inglês. Um provider
de idioma e o suporte a RTL são evoluções futuras.

### Filtros e tabela inteligente (`/clientes`)

`/clientes` combina `AdsFilterBar` e `AdsSmartTable` (`apps/admin-demo`), usando
só caminhos públicos. O estado vive na URL e é tratado no servidor:

| Parâmetro   | Valor                                                                           |
| ----------- | ------------------------------------------------------------------------------- |
| `q`         | texto, no nome ou no e-mail                                                     |
| `status`    | `Ativo`, `Pendente` ou `Inativo`                                                |
| `plano`     | lista separada por vírgula (`Essencial,Empresarial`)                            |
| `de`, `ate` | datas ISO `AAAA-MM-DD` de "cliente desde" (inclusivas)                          |
| `ordem`     | `coluna:direção` (`name`, `status`, `plan`, `orders`, `since`; `asc` ou `desc`) |
| `pagina`    | número da página                                                                |

A página (Server Component) lê `searchParams` com `parseCustomersQuery`, aplica
`applyCustomersQuery` (funções puras: mesma URL, mesmo HTML) e repassa linhas,
filtros e ordenação. Valores inválidos são ignorados e a página é normalizada.
O Client Component `customers-listing.tsx` mantém os filtros em estado local (com
debounce no texto, como na seção "Barra de filtros"), grava filtros e ordenação
com `router.replace` sem rolar a página e volta para a página 1 a cada mudança.
Os links da paginação usam `renderPageLink`, pela prop `pagination` do
`AdsSmartTable`, e preservam filtros e ordenação. Seleção de linhas e colunas
ocultas são locais e não vão para a URL.

### Visão geral (`/`)

Os indicadores usam `AdsMetricCard` (variação com ícone e texto) e o progresso e a
atividade recente ficam em painéis de `AdsDashboardGrid` e `AdsDashboardPanel`.

### Parâmetros de URL do demo

`?pagina=N` e `?estado=vazio|carregando|erro` em `/clientes` são **recursos do
demo**, não API do design system. Servem para que os testes e os snapshots
alcancem cada estado sem depender de temporizadores. Um `?pagina` ausente, não
numérico ou menor que 1 vale 1; valores acima do total valem a última página; um
`?estado` desconhecido exibe os dados normais.

### Sobrescrita de tokens

Sobrescreva variáveis `--ads-*` no CSS da aplicação, **depois** de importar
`@admin-ds/tokens/styles.css`, com seletores `[data-theme='light']` e
`[data-theme='dark']` (sem `:root`), e sem recompilar os componentes:

```css
[data-theme='light'] {
	--ads-color-primary: #0369a1;
}

[data-theme='dark'] {
	--ads-color-primary: #38bdf8;
}
```

Os seletores precisam ter a mesma forma dos gerados pelo pacote de tokens
(`:root, [data-theme="light"]` e `[data-theme="dark"]`) e vir depois deles: com
essa especificidade, vale a ordem de carga. O seletor sem `:root` é necessário
porque os overlays (dialog, drawer e toast) são renderizados em um `div` com
`data-theme` próprio, fora do `<html>`. Uma sobrescrita em `:root[data-theme=…]`
não os alcança. O demo não traz essa sobrescrita de forma permanente: ela é
injetada apenas no teste `e2e/admin-demo-all-routes.spec.ts`, com `--ads-color-text`.

## Botões ao lado de campos

`AdsButton` e os campos de texto (`AdsInput`, `AdsSelect`) de mesmo `size` não têm
a mesma altura: o botão usa `--ads-dimension-control-*` e o campo usa
`--ads-dimension-field-*`. A diferença vem desses tokens distintos (os botões
compartilham a altura de controle com outros componentes) e aparece quando os dois
ficam na mesma linha.

| `size` | `AdsButton` | `AdsInput` e `AdsSelect` |
| ------ | ----------- | ------------------------ |
| `sm`   | 32px        | 30px                     |
| `md`   | 36px        | 32px                     |
| `lg`   | 40px        | 36px                     |

Em uma linha com `align-items: center`, o campo desce 1px em `sm` e 2px em `md` e
`lg` em relação ao botão. Para alinhar, escolha um dos dois caminhos:

- **Mesma altura.** Use `align-items: stretch`, que é o padrão de `display: flex`:
  o campo cresce até a altura do botão (32, 36 ou 40px).
- **Mesmo topo.** Use `align-items: flex-start` e aceite a diferença de 2 a 4px.

O `AdsDatePicker` faz o inverso: o gatilho do calendário anula a própria altura
mínima e acompanha a altura do campo.

```css
.minha-busca {
	display: flex;
	gap: 0.5rem;
	align-items: stretch;
}
```

O CSS distribuído contém apenas as utilidades que a própria biblioteca usa, então
escreva o layout da linha no CSS da aplicação em vez de depender de classes
utilitárias da biblioteca.

Um `AdsButton` pode ser o conteúdo de `startContent` ou `endContent` de
`AdsInputGroup`. O adendo perde a moldura (borda, fundo e padding), o botão fica rente
ao campo, com a quina externa arredondada, e o grupo mantém a altura do campo (30, 32 ou
36px). O `size` do botão só define o padding horizontal e a fonte: a altura é sempre a
do campo, então não é preciso combinar `size` do botão e do campo.

```tsx
<AdsInputGroup endContent={<AdsButton type="submit">Buscar</AdsButton>}>
	<AdsInput aria-label="Busca" placeholder="Nome ou e-mail" />
</AdsInputGroup>
```

Vários botões no mesmo adendo ficam contíguos: só a quina externa do conjunto é
arredondada e cada junção sobrepõe 1px, para as bordas não somarem 2px.

```tsx
<AdsInputGroup
	endContent={
		<>
			<AdsButton type="button" variant="secondary">
				Limpar
			</AdsButton>
			<AdsButton type="submit">Buscar</AdsButton>
		</>
	}
>
	<AdsInput aria-label="Busca" />
</AdsInputGroup>
```

O adendo deve conter só botões como filhos diretos. Texto e botão no mesmo adendo não são
suportados: o adendo perde a moldura e o texto fica sem fundo nem padding; para texto e
botão lado a lado, use um adendo de texto em `startContent` e o botão em `endContent`. Um
botão dentro de outro elemento no adendo mantém a moldura e a altura do botão, e o campo
cresce para 34, 38 ou 42px.

## Overlays modais e o conteúdo de fundo

Com um `AdsDialog` ou `AdsDrawer` aberto (inclusive o diálogo de `AdsConfirmDialog` e o drawer de
navegação do `AdsAdminShell`), os filhos de `<body>` fora do modal recebem o atributo `inert`: o
fundo deixa de receber foco, cliques e leitura por tecnologia assistiva. Isso vale também para nós
criados ou substituídos em `<body>` enquanto o modal está aberto (navegação, portais de terceiros).
Ao fechar, o estado anterior é restaurado. Com modais aninhados só o mais recente é interativo.

- Popovers, tooltips e menus abertos a partir do modal continuam interativos, e `AdsToast` nunca fica
  inerte. Um popup aberto por código da página, antes ou durante o modal, fica inerte.
- Um `inert` que a aplicação já tinha é preservado. Se a aplicação acrescentar `inert` a uma região
  durante o modal, ele permanece depois do fechamento; se a aplicação o remover, a região é marcada
  de novo enquanto o modal estiver aberto.
- Ao fechar, o foco volta ao elemento que abriu o modal. Se ele saiu da página (por exemplo, o modal
  de origem fechou antes de um modal aninhado), volta ao elemento que abriu o modal ao redor.
- O atributo exige suporte do navegador (Chromium 102+, Firefox 112+, Safari 15.5+); sem ele o foco
  continua preso por teclado e `aria-modal` segue exposto, mas o fundo ainda é alcançável por clique.
- A rolagem do fundo não é bloqueada.
- Nada muda na API: não há prop nova, e a marcação só acontece no cliente, depois da hidratação. O
  atributo `data-ads-overlay-layer` do root do portal é interno e não deve ser usado em seletores da
  aplicação.

## Seletor de data

O `AdsDatePicker` seleciona uma data ou um intervalo (`mode="range"`) por
digitação ou calendário. É um Client Component e funciona dentro de `AdsField`.
Os valores são strings ISO `AAAA-MM-DD` (intervalo: `{ start, end }`), sem fuso
horário, e `min`, `max` e `isDateDisabled` usam o mesmo formato.

```tsx
<AdsField label="Período">
	<AdsDatePicker mode="range" onValueChange={setPeriodo} value={periodo} />
</AdsField>
```

O locale padrão é `pt-BR`; use `locale`, `firstDayOfWeek` e `labels` para outros
idiomas. A renderização inicial depende só das props, o que evita erros de
hidratação; a data atual só é lida ao abrir o calendário.

## Barra de filtros

O `AdsFilterBar`, de `@admin-ds/admin`, compõe filtros de texto, seleção
(`select`), seleção múltipla (`multiselect`), data (`date`) e intervalo
(`date-range`), com os filtros ativos como chips removíveis e a ação "Limpar
filtros". É um Client Component e o estado é do consumidor: `value` é um objeto
por `id` de filtro e `onChange` recebe o objeto completo, sem chaves vazias. A
barra não consulta dados, não lê a URL e não importa o roteador do Next.js.
O `id` de cada filtro deve ser único na barra também depois da sanitização
usada nos ids do DOM, que remove caracteres fora de `[A-Za-z0-9_-]` (`a b` e
`ab` colidem).
Em telas estreitas os campos ficam recolhidos atrás de um botão (use
`defaultExpanded` ou `expanded`/`onExpandedChange`); `disabled` e `loading`
cobrem os demais estados, e `labels` e `locale` ajustam os textos.

O exemplo abaixo persiste o filtro em `searchParams`. A página (Server
Component) repassa os parâmetros, e o Client Component guarda os valores em
estado local, inicializado por eles, e atualiza esse estado na hora a cada
`onChange`. Cada emissão de `onChange` parte do `value` atual; se o
consumidor só aplicasse o valor quando a URL mudasse, duas ações seguidas antes
da navegação fariam a segunda desfazer a primeira. A URL é atualizada depois:
a digitação usa uma pausa (debounce), e "Limpar filtros" e os demais filtros
navegam na hora, cancelando a atualização pendente do texto. Se a URL mudar por
fora (por exemplo, com Voltar), os parâmetros são reaplicados.
`router.replace` usa `{ scroll: false }` para a página não voltar ao topo, e
`useTransition`, que é opcional, liga o `loading` da barra enquanto a navegação
acontece.

```tsx
// app/usuarios/page.tsx (Server Component)
export default async function Page({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const params = await searchParams;
	return <UsuariosFiltros params={params} />;
}
```

```tsx
// app/usuarios/usuarios-filtros.tsx
'use client';

import { AdsFilterBar, type AdsFilterDefinition, type AdsFilterValues } from '@admin-ds/admin';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';

type Params = Record<string, string | string[] | undefined>;

const filters: AdsFilterDefinition[] = [
	{ id: 'q', type: 'text', label: 'Busca' },
	{
		id: 'status',
		type: 'select',
		label: 'Status',
		options: [
			{ value: 'ativo', label: 'Ativo' },
			{ value: 'inativo', label: 'Inativo' },
		],
	},
	{ id: 'periodo', type: 'date-range', label: 'Período' },
];

const first = (params: Params, key: string) => [params[key]].flat()[0];

function fromParams(params: Params): AdsFilterValues {
	const value: AdsFilterValues = {};
	const q = first(params, 'q');
	if (q) value.q = q;
	const status = first(params, 'status');
	if (status) value.status = status;
	const start = first(params, 'de');
	const end = first(params, 'ate');
	if (start || end) value.periodo = { start: start ?? null, end: end ?? null };
	return value;
}

function toQuery(next: AdsFilterValues) {
	const query = new URLSearchParams();
	if (typeof next.q === 'string') query.set('q', next.q);
	if (typeof next.status === 'string') query.set('status', next.status);
	if (next.periodo && !Array.isArray(next.periodo) && typeof next.periodo === 'object') {
		if (next.periodo.start) query.set('de', next.periodo.start);
		if (next.periodo.end) query.set('ate', next.periodo.end);
	}
	return query.toString();
}

export function UsuariosFiltros({ params }: { params: Params }) {
	const router = useRouter();
	const pathname = usePathname();
	const [pending, startTransition] = useTransition();
	// Estado local aplicado na hora: o texto aparece a cada tecla e ações seguidas partem
	// sempre do valor mais recente. A URL é atualizada depois.
	const [value, setValue] = useState(() => fromParams(params));
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
	// Set: pode haver várias navegações próprias em andamento ao mesmo tempo.
	const ownQueries = useRef(new Set<string>());
	const urlQuery = toQuery(fromParams(params));
	useEffect(() => () => clearTimeout(timer.current), []);
	useEffect(() => {
		// URL alterada fora deste componente (por exemplo, com Voltar): reaplica os parâmetros.
		if (ownQueries.current.delete(urlQuery)) return;
		// Cancela a navegação pendente da digitação para não sobrescrever a URL externa.
		clearTimeout(timer.current);
		setValue(fromParams(params));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [urlQuery]);

	function navigate(next: AdsFilterValues) {
		const query = toQuery(next);
		if (query !== urlQuery) ownQueries.current.add(query);
		startTransition(() => {
			router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
		});
	}

	function onChange(next: AdsFilterValues) {
		const { q: nextText = '', ...nextOthers } = next;
		const { q: text = '', ...others } = value;
		// Só a digitação usa debounce; "Limpar filtros" e os outros filtros navegam na hora.
		const cleared = Object.keys(next).length === 0;
		const typing = !cleared && nextText !== text && toQuery(nextOthers) === toQuery(others);
		clearTimeout(timer.current);
		setValue(next);
		if (typing) {
			timer.current = setTimeout(() => navigate(next), 300);
			return;
		}
		navigate(next);
	}

	return <AdsFilterBar filters={filters} loading={pending} onChange={onChange} value={value} />;
}
```

## Tabela inteligente

O `AdsSmartTable`, de `@admin-ds/admin`, compõe `AdsTable`, `AdsPagination`,
`AdsSkeleton` e `AdsEmptyState` com ordenação, seleção de linhas e visibilidade
de colunas. É um Client Component e todo o estado é do consumidor: a tabela não
busca, ordena nem pagina dados, e as `rows` já chegam processadas. Como `cell` e
`getRowId` são funções, use-a dentro de um Client Component.

- Ordenação: `sort` (`{ columnId, direction } | null`) e `onSortChange`. O clique
  cicla ascendente, descendente e nenhuma; colunas com `sortable` ganham um botão
  e `aria-sort` no cabeçalho.
- Seleção: `onSelectionChange` habilita a coluna de seleção; `selectedIds` é o
  estado. `selectionMode="single"` usa botões de opção. "Selecionar todas" age só
  na página e fica indeterminado quando parcial; ids de outras páginas são
  preservados. `getRowLabel` nomeia o controle de cada linha.
- Colunas: `onHiddenColumnsChange` habilita o seletor "Colunas";
  `hiddenColumnIds` é o estado. `hideable: false` fixa uma coluna e a última
  visível não pode ser ocultada.
- Estados: `loading`, `error` (com `onRetry`) e `emptyState`; a precedência é
  erro, carregamento e vazio.
- Opcionais: `filters` (slot acima, por exemplo `AdsFilterBar`) e `pagination`
  (props de `AdsPagination`, inclusive `renderPageLink`).
- A tabela rola na horizontal dentro de uma região nomeada e focável por teclado,
  sem ocultar colunas. `labels` ajusta os textos (pt-BR por padrão).

A página (Server Component) lê `searchParams`, consulta e ordena os dados e
repassa `rows`, `page`, `pageCount`, `sort` e os próprios parâmetros. Os links
de página e a ordenação partem dos parâmetros atuais e trocam só a própria
chave, então filtros de um `AdsFilterBar` na mesma URL são preservados. Ordenar
volta à primeira página (apaga `pagina`), e a URL não fica com `?` vazio. A
seleção guarda ids de todas as páginas; o contador mostra quantas estão na
página exibida, e o exemplo oferece um botão para limpá-la. Com `AdsListFlow` e
ações em massa, o foco após limpar a seleção é tratado pelo pacote `admin` (ver
abaixo).

```tsx
// app/usuarios/usuarios-tabela.tsx
'use client';

import { AdsSmartTable, type AdsSmartTableSort } from '@admin-ds/admin';
import { AdsButton } from '@admin-ds/components';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLayoutEffect, useRef, useState, type MouseEvent } from 'react';

type Params = Record<string, string | string[] | undefined>;

interface Usuario {
	id: string;
	nome: string;
	perfil: string;
}

function formatReadableSearchQuery(serialized: string) {
	if (!serialized) return '';
	return serialized.replace(/%3A/gi, ':');
}

// Parte dos parâmetros atuais e troca só as chaves informadas (null apaga a chave).
function withParams(params: Params, changes: Record<string, string | null>) {
	const query = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		for (const item of [value].flat()) if (item !== undefined) query.append(key, item);
	}
	for (const [key, value] of Object.entries(changes)) {
		if (value === null) query.delete(key);
		else query.set(key, value);
	}
	return formatReadableSearchQuery(query.toString());
}

function selectionFocusWasLost(doc: Document = document) {
	const active = doc.activeElement;
	return !active || active === doc.body;
}

function applyPendingClearSelectionFocus(
	pending: HTMLElement | null,
	root: HTMLElement | null,
	doc: Document = document,
): 'idle' | 'waiting' | 'dropped' | 'applied' {
	if (pending === null) return 'idle';
	const focusLost = selectionFocusWasLost(doc);
	if (!focusLost && root && !root.contains(doc.activeElement)) return 'dropped';
	if (pending.isConnected) return 'waiting';
	if (!focusLost) return 'dropped';
	const selectAll = root?.querySelector<HTMLInputElement>(
		'thead .ads-smart-table-select-cell input[type="checkbox"]',
	);
	const scrollRegion = root?.querySelector<HTMLElement>('.ads-smart-table-scroll');
	if (selectAll && !selectAll.disabled) selectAll.focus();
	else scrollRegion?.focus();
	return 'applied';
}

export function UsuariosTabela({
	rows,
	page,
	pageCount,
	sort,
	params,
}: {
	rows: Usuario[];
	page: number;
	pageCount: number;
	sort: AdsSmartTableSort | null;
	params: Params;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const [selected, setSelected] = useState<string[]>([]);
	const [hidden, setHidden] = useState<string[]>([]);
	const rootRef = useRef<HTMLDivElement>(null);
	const pendingClearRef = useRef<HTMLElement | null>(null);
	const href = (changes: Record<string, string | null>) => {
		const query = withParams(params, changes);
		return query ? `${pathname}?${query}` : pathname;
	};

	function onSortChange(next: AdsSmartTableSort | null) {
		// Ordenar volta à primeira página; os demais parâmetros (filtros) são mantidos.
		const ordem = next ? `${next.columnId}:${next.direction}` : null;
		router.replace(href({ ordem, pagina: null }), { scroll: false });
	}

	function clearSelection(event: MouseEvent<HTMLButtonElement>) {
		pendingClearRef.current = event.currentTarget;
		setSelected([]);
	}

	useLayoutEffect(() => {
		const result = applyPendingClearSelectionFocus(pendingClearRef.current, rootRef.current);
		if (result === 'dropped' || result === 'applied') pendingClearRef.current = null;
	}, [selected]);

	return (
		<div ref={rootRef}>
			{selected.length > 0 ? (
				<AdsButton onClick={clearSelection} size="sm" variant="secondary">
					Limpar seleção
				</AdsButton>
			) : null}
			<AdsSmartTable<Usuario>
				caption="Usuários"
				columns={[
					{ id: 'nome', label: 'Nome', sortable: true, hideable: false, cell: (u) => u.nome },
					{ id: 'perfil', label: 'Perfil', sortable: true, cell: (u) => u.perfil },
				]}
				getRowId={(u) => u.id}
				getRowLabel={(u) => u.nome}
				hiddenColumnIds={hidden}
				onHiddenColumnsChange={setHidden}
				onSelectionChange={setSelected}
				onSortChange={onSortChange}
				pagination={{
					page,
					pageCount,
					renderPageLink: (target, { children, ...props }) => (
						<Link
							href={href({ pagina: target > 1 ? String(target) : null })}
							scroll={false}
							{...props}
						>
							{children}
						</Link>
					),
				}}
				rows={rows}
				selectedIds={selected}
				sort={sort}
			/>
		</div>
	);
}
```

Ao limpar a seleção, o foco vai ao checkbox "Selecionar todas as linhas da página"
ou, se ele não existir, à região rolável da tabela, e só quando o botão some e o
foco se perdeu (`body` ou `null`), no mesmo espírito da barra de ações em massa.

Para combinar com o `AdsFilterBar`, passe-o em `filters`; os dois seguem
independentes. Como os links partem dos parâmetros atuais, mudar de página ou de
ordenação mantém os filtros. O consumidor decide, por exemplo, limpar a seleção
quando o filtro muda.

## Fluxos administrativos

`@admin-ds/admin` compõe os componentes públicos em fluxos recorrentes. Todo o
estado (seleção, filtros, etapa ativa, abertura do diálogo) é do consumidor: os
fluxos não persistem nem enviam dados, não leem a URL e não usam o roteador do
Next.js. São Client Components; funções como `validate` e `cell` não atravessam
a fronteira de um Server Component, então use-os dentro de um Client Component
(`"use client"`).

### Listagem com ações em massa (`AdsListFlow`)

`AdsListFlow` aceita as props de `AdsSmartTable` e acrescenta `filterBar` (props
de `AdsFilterBar`), `bulkActions` e `onClearSelection`. A `AdsBulkActionBar` só
aparece com itens em `selectedIds`, anuncia a quantidade por uma região de
status e, para não duplicar o anúncio, a contagem da própria tabela fica vazia
quando `bulkActions` é informado. "Limpar seleção" chama `onClearSelection` ou,
por padrão, `onSelectionChange([])`. Quando a barra some com o foco num controle
dela, o foco vai ao checkbox do cabeçalho ou à região da tabela. O slot `filters`
da tabela é ocupado pelo fluxo; para outro arranjo, componha `AdsSmartTable`
diretamente.

O exemplo abaixo exclui os selecionados com confirmação. `pending` impede o
envio duplo enquanto a exclusão acontece; no sucesso, o diálogo fecha e a
seleção é limpa no mesmo passo, e no erro o diálogo continua aberto com a
mensagem.

```tsx
'use client';

import {
	AdsConfirmDialog,
	AdsListFlow,
	type AdsFilterDefinition,
	type AdsFilterValues,
	type AdsSmartTableColumn,
} from '@admin-ds/admin';
import { AdsButton, type AdsPaginationProps } from '@admin-ds/components';
import { useState } from 'react';

interface Usuario {
	id: string;
	nome: string;
	email: string;
}

const columns: AdsSmartTableColumn<Usuario>[] = [
	{ id: 'nome', label: 'Nome', cell: (u) => u.nome },
	{ id: 'email', label: 'E-mail', cell: (u) => u.email },
];

const filterDefinitions: AdsFilterDefinition[] = [{ id: 'q', type: 'text', label: 'Busca' }];

export function Usuarios({
	rows,
	filters,
	onFiltersChange,
	pagination,
	deleteUsers,
}: {
	rows: Usuario[];
	filters: AdsFilterValues;
	onFiltersChange: (next: AdsFilterValues) => void;
	pagination: AdsPaginationProps;
	deleteUsers: (ids: string[]) => Promise<void>;
}) {
	const [selected, setSelected] = useState<string[]>([]);
	const [confirming, setConfirming] = useState(false);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const count = selected.length;

	async function confirmDelete() {
		setPending(true);
		setError(null);
		try {
			await deleteUsers(selected);
			setSelected([]);
			setConfirming(false);
		} catch {
			setError('Não foi possível excluir. Tente novamente.');
		} finally {
			setPending(false);
		}
	}

	return (
		<>
			<AdsListFlow<Usuario>
				bulkActions={
					<AdsButton onClick={() => setConfirming(true)} size="sm" variant="danger">
						Excluir selecionados
					</AdsButton>
				}
				caption="Usuários"
				columns={columns}
				filterBar={{ filters: filterDefinitions, value: filters, onChange: onFiltersChange }}
				getRowId={(u) => u.id}
				getRowLabel={(u) => u.nome}
				onSelectionChange={setSelected}
				pagination={pagination}
				rows={rows}
				selectedIds={selected}
			/>
			<AdsConfirmDialog
				description="Esta ação não pode ser desfeita."
				onConfirm={confirmDelete}
				onOpenChange={(open) => {
					setConfirming(open);
					if (!open) setError(null);
				}}
				open={confirming}
				pending={pending}
				title={count === 1 ? 'Excluir 1 item?' : `Excluir ${count} itens?`}
			>
				{error ? <p role="alert">{error}</p> : null}
			</AdsConfirmDialog>
		</>
	);
}
```

`AdsConfirmDialog` usa `AdsDialog`: o foco inicial vai a "Cancelar", `Escape` e o
clique fora cancelam (`onOpenChange(false)`) e `onConfirm` não fecha o diálogo.
`pending` deixa as ações indisponíveis com `aria-disabled` (o botão focado não
perde o foco) e suspende `Escape` e o clique fora, mesmo com `closeOnEscape` ou
`closeOnBackdrop` informados. Ao fechar, o foco volta ao elemento que abriu o
diálogo; se ele saiu da página, vai a `returnFocusRef`, quando informado.
`destructive` (padrão) usa a variante de perigo e o papel `role="alertdialog"`;
com `destructive={false}` o papel é `dialog`. `role` explícito prevalece (por
exemplo `role="dialog"` para manter o papel anterior). `AdsDialogProps` também
expõe `role` (`dialog` | `alertdialog`); `AdsDrawer` continua `dialog`. Título e
descrição permanecem associados nos dois casos.

### Formulário em etapas (`AdsStepForm`)

O consumidor guarda os dados e a etapa ativa; o componente cuida do indicador,
da validação por etapa, do foco e da confirmação final.

```tsx
const [step, setStep] = useState('account');
const steps = [
	{ id: 'account', label: 'Conta', validate: () => name !== '', content: <AccountFields /> },
	{ id: 'review', label: 'Confirmação', content: <Summary /> },
];

<AdsStepForm
	activeStepId={step}
	aria-label="Novo usuário"
	onActiveStepChange={setStep}
	onSubmit={save}
	steps={steps}
/>;
```

- `validate` pode ser síncrona ou retornar `Promise<boolean>`. Com uma Promise, o
  formulário fica com `aria-busy`, anuncia `labels.validating`, mostra o
  carregamento no botão acionado e deixa as ações com `aria-disabled` (o foco não
  se perde) até resolver; rejeitar equivale a `false`, e um resultado que chega
  depois de a etapa mudar ou do desmonte é descartado. Os campos ficam inertes
  durante a espera e editar um campo cancela a validação pendente (acione
  "Próxima" de novo), e alterar por código o valor de um campo nativo da etapa
  durante a espera descarta o resultado; estado sem campo nativo correspondente
  não é detectado, então evite alterá-lo enquanto valida.
  Retorno síncrono continua sendo tratado de forma síncrona.
- O indicador de etapas navega para etapas anteriores e, adiante, apenas para as
  que já foram validadas ao avançar (a atual e as intermediárias incluídas). Editar
  uma etapa remove essa marca, e "Próxima" a revalida. A marca depende de eventos
  `change` borbulhantes nos campos da etapa.
- `validate` roda ao avançar e ao confirmar; com `false`, a etapa não
  muda, um alerta é exibido e o foco vai ao primeiro campo `aria-invalid="true"`
  (ou ao título da etapa). Os erros de campo são do consumidor e devem ser
  definidos no mesmo ciclo em que `validate` retorna: com `AdsField`, informe
  `validationState="error"` (é ele que define `aria-invalid`) e a mensagem em
  `error`. O alerta some quando uma edição torna a etapa válida.
- Ao mudar `activeStepId`, o foco vai ao título da etapa e "Etapa X de N: rótulo"
  é anunciado; na renderização inicial o foco não se move.
- As etapas inativas ficam montadas e ocultas, então os dados (inclusive de campos
  não controlados) permanecem ao voltar. Voltar não valida.
- A última etapa mostra "Confirmar" (`labels.submit`), que valida e chama
  `onSubmit`. Inclua nela um resumo para revisão. `submitting` desabilita as
  ações e define `aria-busy`. `Enter` em um campo não envia nem avança.

## Paginação adaptativa e rodapé opcional

`AdsPagination` observa a largura real do contêiner e dos controles, preservando
primeira, atual e última página. `siblingCount` limita os adjacentes; uma lacuna
unitária usa o número da página quando cabe. Se faltam slots para reticências,
elas cedem espaço aos números obrigatórios. Se o conjunto mínimo não cabe fisicamente,
a região "Controles de paginação roláveis" permite rolar e receber foco, com
folga vertical para bordas, hover e foco. Os dígitos usam largura estável pelo
total de páginas. SSR produz HTML determinístico; a medição começa após montagem.

A adaptação reduz a lista calculada por `siblingCount` (padrão 1, até sete
itens numéricos/reticências para coleções extensas); ela não acrescenta mais
adjacentes só porque o contêiner ficou largo. Para ampliar essa lista, configure
`siblingCount`. Totais pequenos mantêm a exibição completa quando couber.

O padrão continua texto "Anterior"/"Próxima", sem salto ou controles extras.
`navigationMode="arrows"`, `previousContent`, `nextContent`, `showFirstLast`,
`showPageJump` e `loading` são opcionais. `labels` personaliza nomes acessíveis,
`previousText`/`nextText`, salto, erro e nome da região rolável. As props
públicas e `renderPage` legado continuam disponíveis; prefira `renderPageLink`
e espalhe as props recebidas no link, sem envolver um botão em uma âncora.

Ao trocar `labels.previousText` ou `labels.nextText`, atualize também
`labels.previous` ou `labels.next`: o nome acessível deve conter o texto
visível, inclusive com `previousContent`/`nextContent` customizados. Exemplo:
`labels={{ previousText: "Voltar", previous: "Voltar uma página", nextText: "Avançar", next: "Avançar uma página" }}`.
No modo de setas sem texto, mantenha nomes acessíveis descritivos.

```tsx
<AdsPagination
	page={page}
	pageCount={pageCount}
	onPageChange={setPage}
	navigationMode="arrows"
	showPageJump
	loading={pending}
/>
```

O salto aceita inteiro decimal entre 1 e `pageCount`, por Enter ou "Ir";
vazio, fração, expoente, fora da faixa e página atual não navegam. O campo
sincroniza mudanças externas de página e total. Não cria form, podendo ser
usado dentro do formulário do consumidor. Com `renderPageLink`, "Ir" é o link
do consumidor e Enter ativa esse mesmo link; o callback de paginação não é
chamado nesse modo. Loading usa `aria-disabled` e `aria-busy`, mantém os links
e botões focáveis e bloqueia ativações, sem fazer busca de dados. O consumidor
sinaliza o loading enquanto sua navegação estiver pendente.

Quando `pageCount` positivo torna `page` inválida, a página visual é limitada
ao intervalo e `onPageChange` solicita a correção em efeito, uma vez por
combinação inválida; o consumidor deve atualizar estado e dados. A solicitação
é adiada durante loading e nunca ocorre com total zero. No modo somente de
links, o consumidor normaliza URL e dados: não há redirecionamento automático.
Mudanças externas não movem foco; resize/interação recuperam foco na página
atual somente se o controle focado foi removido e o foco se perdeu.

Na `AdsSmartTable`, passe essas opções em `pagination`. `pageSize` e
`onPageSizeChange` habilitam o seletor controlado, com `pageSizeOptions`
(padrão 10/25/50/100); o consumidor decide a nova página, total e busca.
`totalItems` e `pageSize` habilitam o resumo, limitado às `rows` recebidas e ao
total, inclusive última página incompleta. Sem total conhecido, página válida
ou durante loading, não é inventado um intervalo. `labels.pageSize`,
`labels.pageSummary(first,last,total)` e `labels.emptyPage` localizam o rodapé.
Loading da tabela ou de sua paginação bloqueia também o seletor. Nenhum desses
controles altera os comportamentos padrão sem as props opcionais.

O salto e o seletor usam `input type="number"` e `select` nativos com estilos
locais e tokens semânticos, em vez de `AdsInput`/`AdsSelect`. A escolha mantém
a estrutura compacta, a largura do campo e o foco sob controle desta composição;
não representa uma restrição dos componentes de formulário. O erro do salto é
comunicado por `aria-invalid`, descrição e alerta textual, sem borda de erro
específica. O campo fica `readOnly` durante loading para preservar o foco e
`disabled` quando não há páginas. O seletor é desabilitado durante loading. Estilos dedicados
para esses estados e a unificação visual com os campos do sistema ficam como
melhoria futura, preservando os contratos atuais.

Exemplos interativos: `/componentes/paginacao` no admin-demo e stories
Navigation/Components (PaginationResponsive, PaginationLocalizedLoading) e
Layout/SmartTable (PaginationFooter). Os apps consomem os exports públicos e
CSS compilado; não é necessário configurar Tailwind no consumidor.

### AdsSmartTable: virtualização, redimensionamento e exportação

Os três recursos são opcionais e independentes; sem as props, a tabela se
comporta como antes. A tabela continua sem buscar, ordenar nem paginar dados.

```tsx
const [widths, setWidths] = useState<Record<string, number>>({});

<AdsSmartTable<Usuario>
	caption="Usuários"
	columns={columns} // com `minWidth`, `maxWidth`, `exportValue` e `exportable`
	rows={usuarios}
	getRowId={(u) => u.id}
	virtualization={{ rowHeight: 44, height: 480 }}
	columnWidths={widths}
	onColumnWidthsChange={setWidths}
	onExport={(dados) => baixar(getAdsSmartTableCsv(dados, { bom: true }))}
/>;
```

- **Virtualização.** `virtualization={{ rowHeight, height, overscan? }}` renderiza
  só as linhas visíveis em uma região rolável de altura máxima `height`, com
  cabeçalho fixo. Cada linha tem exatamente `rowHeight` pixels e o conteúdo que
  excede é cortado. A tabela expõe `aria-rowcount` (total de linhas mais o
  cabeçalho) e `aria-rowindex` em cada linha montada. A linha que contém o foco
  não é desmontada ao rolar. "Selecionar todas" e a contagem de selecionadas
  consideram todas as linhas recebidas, não só as montadas. O HTML inicial é a
  primeira janela, igual no servidor e no cliente.
- **Redimensionamento.** `onColumnWidthsChange` exibe uma alça por coluna
  (`role="separator"`, com `aria-valuenow`, `aria-valuemin` e `aria-valuemax`).
  Com o ponteiro, arraste; com o teclado, foque a alça e use ←/→ (10 px; Shift,
  50 px), Home/End (mínimo/máximo) e Enter (volta à largura automática; duplo
  clique faz o mesmo). `columnWidths` é a fonte da verdade: sem aplicar o valor
  recebido, nada muda. Limites por coluna em `minWidth` (80) e `maxWidth` (640);
  `resizable: false` remove a alça.
- **Exportação.** `onExport` exibe o botão "Exportar" na barra de ferramentas,
  desabilitado durante carregamento, erro e sem linhas, e emite `columns`
  (visíveis, na ordem exibida e com `exportable !== false`), `rows`, `records`
  (valores por id de coluna), `selectedIds` e `selectedRows`. O valor de cada
  célula vem de `exportValue` ou, na falta, do retorno de `cell` quando for texto
  ou número; conteúdo React vira `null`. `getAdsSmartTableCsv(dados, opções)` é um
  helper opcional que gera CSV (RFC 4180; `separator`, `onlySelected`, `bom`) e
  prefixa com `'` textos iniciados por `=`, `+`, `-` ou `@`
  (`neutralizeFormulas`). Gerar o arquivo e baixá-lo é do consumidor.

Textos configuráveis em `labels.export` e `labels.resizeColumn`. Exemplos:
`/componentes/tabela-avancada` no admin-demo e as stories Layout/SmartTable
(Virtualized, ResizableColumns, ExportHook).

## Marca no topo da sidebar (opcional)

Use `<AdsAdminShell layout="sidebar-header">` e passe `header` em
`AdsAdminShell.Sidebar` com a marca e `AdsAdminShell.SidebarToggle`.
O padrão continua `standard`, com header de largura completa. O slot aceita
ReactNode, não cria marca ou organização e, ausente, não cria bloco vazio.
No desktop opt-in, topo da sidebar e header compartilham altura natural por CSS
grid/subgrid; navegação e main rolam separadamente. O controle circular com chevron fica na divisória,
sem empilhar marca e botão nem aumentar a altura do topo. Use `ads-admin-shell-sidebar-label` no nome para ocultá-lo visualmente
no desktop recolhido, preservando o nome acessível.

Mantenha `NavigationTrigger` no header principal: o toggle desktop fica oculto no
mobile. O slot `header` aparece no Drawer aberto; componha também uma identificação
compacta no header móvel. O consumidor esconde essa alternativa no desktop.

```tsx
<AdsAdminShell layout="sidebar-header">
	<AdsAdminShell.Header>
		<AdsAdminShell.NavigationTrigger />
		{/* ações do consumidor e identificação compacta móvel */}
	</AdsAdminShell.Header>
	<AdsAdminShell.Body>
		<AdsAdminShell.Sidebar
			header={
				<>
					<span className="ads-admin-shell-sidebar-label">Minha aplicação</span>
					<AdsAdminShell.SidebarToggle />
				</>
			}
		>
			{/* organização opcional e navegação */}
		</AdsAdminShell.Sidebar>
		<AdsAdminShell.Main>Conteúdo</AdsAdminShell.Main>
	</AdsAdminShell.Body>
</AdsAdminShell>
```

`--ads-sidebar-active-background` personaliza apenas o fundo do item ativo
(fallback `--ads-color-surface-selected`). Texto, faixa lateral e foco permanecem
independentes. O demo sobrescreve essa variável somente no light.
Veja as stories **Marca na sidebar** e `/catalogo/admin-shell`.
Estado controlado/não controlado, SSR/hidratação e persistência do consumidor seguem
os contratos anteriores; não há dependências novas.

Cada item de `AdsOrganizationSwitcher.organizations` aceita `avatarTone` (tons de `AdsAvatar`, padrão `neutral`). O tom vale no gatilho e na opção da lista; `primary` usa o mesmo fundo semântico do avatar da conta no demo. Logos e fallback continuam funcionando.

O seletor expandido preenche a largura de seu contêiner, independente do nome; use um contêiner com largura limitada para restringi-lo. No recolhido, somente a cor da borda fica transparente, preservando a geometria. Na composição sidebar-header, o item ativo recolhido mede 2,75rem quadrados; seu recuo lateral é compartilhado pelo expandido e considera a largura útil com scrollbar.

Na composição sidebar-header expandida, o seletor e o destaque de um item raiz ativo compartilham os limites laterais, preservando a posição de avatar/texto. O demo mantém a coordenada do símbolo ao recolher e omite mobileTitle para identificar o menu somente por logo/Admin DS; aria-label continua nomeando o diálogo. O menu móvel do shell preenche toda a viewport; o Drawer genérico mantém sua largura padrão e ocupa toda a altura em telas estreitas, sem herdar o max-height do diálogo.

O destaque recolhido tem dimensões explícitas de 2,75rem. Os containers de consulta ficam no conteúdo da navegação e no seletor expandido, já descontada a scrollbar; não no próprio elemento rolável. Isso preserva proporção e alinhamento com scrollbar nativa visível. O smoke desativa --hide-scrollbars no Chromium para validar o comportamento real.
