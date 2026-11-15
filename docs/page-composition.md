# Composição semântica de páginas — #317

O HTML define o significado e a hierarquia; `AdsCard` e `AdsSurface` são escolhas **visuais**, não substitutos da estrutura semântica. Mantenha um `h1` que identifique a página, `h2` por seção principal e `h3`/`h4` para subseções aninhadas quando necessárias. Não salte níveis apenas pelo tamanho da fonte.

## Cabeçalho de página

`AdsPageHeader` é exportado pelo pacote `@dvmarques/admin-ds-components` e não depende de `@dvmarques/admin-ds-admin`, roteamento, autenticação, ícones ou backend. Ele aceita `title: ReactNode` (obrigatório), `description?: ReactNode`, `actions?: ReactNode`, `className` e atributos HTML nativos de header.

O componente renderiza `<header>`, `AdsTypography as="h1"`, um parágrafo descritivo opcional e ações em ordem DOM. As props `title` e `description` são `ReactNode`, mas o markup interno já fixa **H1** e **`<p>`** — portanto envie **somente conteúdo inline** (texto, `span`, `abbr`, ênfase etc.) nessas props. Não passe outro heading, parágrafo, `div` nem qualquer elemento de bloco em `title` ou `description` (evita HTML inválido e leitura confusa em tecnologia assistiva). Botões, links e demais controles interativos ficam no slot `actions`; cada controle deve ter **nome acessível** explícito (`aria-label`, texto visível ou `aria-labelledby` quando o rótulo visível não bastar). Os slots vazios não acrescentam nós de apresentação. Layout, espaçamento e quebra de texto longo usam o CSS compilado e os tokens existentes.

```tsx
import { AdsButton, AdsPageHeader, AdsTypography } from '@dvmarques/admin-ds-components';

export function Registros() {
	return (
		<main>
			<AdsPageHeader
				title="Registros"
				description="Consulte os dados do período"
				actions={<AdsButton type="button">Atualizar</AdsButton>}
			/>
			<section aria-labelledby="registros-heading">
				<AdsTypography as="h2" variant="heading2" id="registros-heading">
					Resultados
				</AdsTypography>
				{/* Filtros e tabela podem ficar aqui sem AdsCard. */}
			</section>
		</main>
	);
}
```

O código acima mostra a estrutura; o consumidor implementa a ação do botão. Caso utilize `AdsAdminShell.Main`, **não** envolva novamente em `<main>`: o shell já fornece o landmark e `tabIndex` para sua região rolável. Insira `AdsPageHeader` e `<section>` diretamente como descendentes do shell. O `header` dentro de `main` não precisa receber `role="banner"`; o shell já tem o cabeçalho global.

## Seções e aparência

Use `<section aria-labelledby="id-do-h2">` junto de `<AdsTypography as="h2" id="id-do-h2" variant="heading2">` para nomear a região. A mesma estratégia vale para H3 e H4 de subseções. `AdsTypography` separa **semântica** de **aparência**, por exemplo `as="h2" variant="heading3"` mantém a hierarquia H2 com visual menor. Prefira nomes visíveis; `aria-label` é alternativa quando a seção não tem título.

**Não criamos `AdsSection`**: a abstração repetiria `section`, `AdsTypography` e CSS Flex/Grid sem comportamento adicional. **Não criamos** `AdsCardTitle`, `AdsCardText` ou `AdsCardFooter`. `AdsSurface` permanece um contêiner visual neutro e `AdsCard` é adequado a indicadores, resumos e unidades de conteúdo autocontidas, não um wrapper obrigatório da página.

## Exemplos

- Consulta: [Demo](<../apps/admin-demo/app/(admin)/exemplos/composicao-semantica/consulta/page.tsx>), filtros e tabela sem card.
- Formulário: [Demo](<../apps/admin-demo/app/(admin)/exemplos/composicao-semantica/formulario/page.tsx>), múltiplas seções, validação e ações.
- Dashboard: [Demo](<../apps/admin-demo/app/(admin)/exemplos/composicao-semantica/dashboard/page.tsx>), cards apenas em indicadores e resumos.
- [Storybook com os três cenários e casos-limite](../apps/docs/src/page-composition.stories.tsx).

Acessibilidade: confira heading/landmarks via árvore de acessibilidade, foco visível em controles, leitura de erros, temas claro/escuro, viewports 320/390/768/desktop, zoom 200% **real** e SSR/hidratação. Reduzir a largura da viewport não equivale à verificação manual do zoom do navegador. Não aceite snapshots automaticamente para esconder diferenças.
