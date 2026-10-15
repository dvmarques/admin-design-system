# Integração do design system

## Instalação e estilos

Uma aplicação consumidora importa as APIs e folhas de estilo públicas:

```ts
import { ThemeToggle } from '@admin-ds/components';
import { tokenValues } from '@admin-ds/tokens';
import '@admin-ds/tokens/styles.css';
import '@admin-ds/components/styles.css';
```

O CSS distribuído já contém as classes necessárias. A aplicação consumidora
não precisa instalar ou configurar Tailwind CSS para usar os componentes.

## Temas

Defina o tema no elemento raiz da aplicação:

```html
<html data-theme="dark"></html>
```

Os valores aceitos são `light` e `dark`. Sem o atributo, os tokens usam a
preferência `prefers-color-scheme` do sistema. A aplicação é responsável por
persistir a preferência e aplicá-la antes da hidratação quando necessário.

## Next.js App Router

Importe os estilos globais em `app/layout.tsx` e mantenha componentes
interativos, como `ThemeToggle`, em um limite de Client Component. Tokens e
componentes puramente apresentacionais podem ser usados por Server Components.

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
- `AdsDashboardPanel` prioriza `loading`, `error`, `empty` e conteúdo. Gráficos não
  fazem parte desta entrega.
- `error` e `empty` são nós nos dois componentes e aceitam elementos de bloco,
  como uma lista. No painel, passe um `AdsEmptyState` em `empty`
  (`empty={<AdsEmptyState title="Sem pedidos" />}`); no card, um texto curto.

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
Em telas estreitas os campos ficam recolhidos atrás de um botão (use
`defaultExpanded` ou `expanded`/`onExpandedChange`); `disabled` e `loading`
cobrem os demais estados, e `labels` e `locale` ajustam os textos.

O exemplo abaixo persiste o filtro em `searchParams`. A página (Server
Component) repassa os parâmetros, e o Client Component os converte em valores e
navega ao alterar. Como o texto é emitido a cada digitação, aplique debounce ao
atualizar a URL em listagens reais.

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

export function UsuariosFiltros({
	params,
}: {
	params: Record<string, string | string[] | undefined>;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const first = (key: string) => [params[key]].flat()[0];
	const value: AdsFilterValues = {};
	if (first('q')) value.q = first('q') as string;
	if (first('status')) value.status = first('status') as string;
	if (first('de') || first('ate')) {
		value.periodo = { start: first('de') ?? null, end: first('ate') ?? null };
	}

	function onChange(next: AdsFilterValues) {
		const query = new URLSearchParams();
		if (typeof next.q === 'string') query.set('q', next.q);
		if (typeof next.status === 'string') query.set('status', next.status);
		if (next.periodo && !Array.isArray(next.periodo) && typeof next.periodo === 'object') {
			if (next.periodo.start) query.set('de', next.periodo.start);
			if (next.periodo.end) query.set('ate', next.periodo.end);
		}
		router.replace(`${pathname}?${query}`);
	}

	return <AdsFilterBar filters={filters} onChange={onChange} value={value} />;
}
```
