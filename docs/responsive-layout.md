# Layout responsivo leve — #318

O ADS mantém HTML nativo como estrutura. Quatro classes CSS **opt-in** reduzem repetição em filtros, formulários, dashboards simples e ações. Não foram criados `AdsContainer`, `AdsGrid`, `AdsGridItem`, `AdsStack` nem dependências de runtime. As classes estão no CSS compilado de `@dvmarques/admin-ds-components`, sem exigir Tailwind no projeto consumidor.

## Importação

Carregue o CSS na aplicação uma vez, após os tokens:

```tsx
import '@dvmarques/admin-ds-tokens/styles.css';
import '@dvmarques/admin-ds-components/styles.css';
```

| Classe CSS             | Função e padrão                                                                                                                 | Ajustes opcionais por elemento                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `ads-layout-container` | `width:100%`, `max-width:76rem`, centralizado, padding inline `--ads-spacing-4` no mobile e `--ads-spacing-6` a partir de 48rem | `--ads-layout-max-width`, `--ads-layout-gutter`         |
| `ads-layout-stack`     | `display:flex`, coluna, gap `--ads-spacing-4`                                                                                   | `--ads-layout-stack-gap`                                |
| `ads-layout-grid`      | CSS Grid `repeat(auto-fit,minmax(min(100%,16rem),1fr))`; gap `--ads-spacing-4`                                                  | `--ads-layout-grid-min-column`, `--ads-layout-grid-gap` |
| `ads-layout-cluster`   | Flex com wrap e gap `--ads-spacing-3`, adequado a grupos de ações                                                               | `--ads-layout-cluster-gap`                              |

Use propriedades CSS locais, evitando interfaces React artificiais:

```css
.minha-pagina {
	--ads-layout-max-width: 64rem;
}
.meus-indicadores {
	--ads-layout-grid-min-column: 13rem;
	--ads-layout-grid-gap: var(--ads-spacing-4);
}
```

Essas propriedades não substituem os tokens públicos e não introduzem uma nova escala. As classes podem ser combinadas e são independentes de tema; `margin-inline` e `padding-inline` respeitam RTL. A ordem de leitura/teclado é a ordem DOM. Nenhuma classe define cores, landmarks ou ARIA.

## Exemplo de composição

```tsx
import {
	AdsButton,
	AdsField,
	AdsInput,
	AdsPageHeader,
	AdsTypography,
} from '@dvmarques/admin-ds-components';

export function Pagina() {
	return (
		<div className="ads-layout-container ads-layout-stack">
			<AdsPageHeader
				title="Consultar registros"
				description="Conteúdo sem card obrigatório."
				actions={<AdsButton type="button">Nova consulta</AdsButton>}
			/>
			<section aria-labelledby="filtros-titulo" className="ads-layout-stack">
				<AdsTypography as="h2" id="filtros-titulo" variant="heading2">
					Filtros
				</AdsTypography>
				<div className="ads-layout-grid">
					<AdsField label="Nome">
						<AdsInput type="search" />
					</AdsField>
					<AdsField label="Código">
						<AdsInput />
					</AdsField>
				</div>
				<div className="ads-layout-cluster">
					<AdsButton type="button">Pesquisar</AdsButton>
					<AdsButton type="button" variant="secondary">
						Limpar
					</AdsButton>
				</div>
			</section>
		</div>
	);
}
```

O aplicativo fornece estados e handlers. Dentro de `AdsAdminShell.Main`, que já fornece `main` e padding, **não** aninhe outro `main`; o container é opcional. Escolha `<section aria-labelledby>` e headings H2/H3/H4 para semântica. A grade usa a largura disponível **local**, não calcula colunas por `window.innerWidth`, inclusive aninhada.

Conteúdo não quebrável precisa de tratamento próprio: use `overflow-wrap:anywhere` para texto apropriado e `overflow-x:auto` no wrapper local de tabelas largas, nunca `overflow:hidden` indiscriminado. `AdsCard` serve para resumos ou KPIs autocontidos; `AdsSurface` acrescenta delimitação visual. Não são wrappers obrigatórios. `AdsDashboardGrid` e `AdsDashboardPanel` no pacote admin já oferecem uma composição mais rica para estados e spans de painéis; não foram duplicados.

## Escolha arquitetural

- **A. CSS Grid/Flexbox nativos:** recomendado para composições únicas ou especiais; zero contratos extras, mas tende à repetição nos padrões recorrentes.
- **B. Classes CSS próprias (escolhida):** quatro contratos explícitos, pequenos, prefixados e opt-in; reduzem estilos repetidos sem introduzir DOM, React, JS ou Tailwind no consumidor.
- **C. Primitivas React:** descartadas por ora; `AdsGrid`, `AdsGridItem`, `AdsStack` e `AdsContainer` exigiriam props, exports, tipos e wrappers para funcionalidade já atendida pelo CSS. Reavaliar apenas com evidência de necessidade.
- Framework completo de utilities, sistema de breakpoints novo e mudanças de tokens globais não fazem parte do escopo.

## Exemplos e verificação

As rotas existentes `/exemplos/composicao-semantica/consulta`, `/formulario` e `/dashboard` demonstram filtros, tabela com rolagem local, ações, validação, indicadores e grid aninhado sem card de página. As stories em `apps/docs/src/page-composition.stories.tsx` apresentam também título longo e grid aninhado. Os casos E2E em `e2e/responsive-layout.spec.ts` cobrem 320/390/768/1440px, dois temas, RTL, axe, teclado e largura equivalente a reflow com zoom; `visual-audit/responsive-layout.spec.ts` prepara capturas adicionais. Essas verificações dependem de execução real.

**Zoom 200% nativo no navegador, leitor de tela e aprovação visual das capturas precisam de revisão humana.** Testes com viewport reduzida não substituem essa revisão. Os resultados, checks e limitações devem ser registrados na PR.

## Bundle e compatibilidade

Não há alteração de JavaScript, declarações TypeScript ou dependências. O efeito é no CSS distribuído de `components`. Comparar bytes e gzip com `npm run inspect:packages` antes/depois, mesmo toolchain, registrando SHA, Node/npm, saída real e limites em `docs/bundle-measurement.md`. Não aumentar budgets por antecipação nem tratar baseline histórico como resultado atual. Mudanças são aditivas; remoção das classes/uso reverte sem migração de API React.
