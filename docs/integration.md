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
