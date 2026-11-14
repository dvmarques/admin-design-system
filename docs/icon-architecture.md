# Arquitetura dos ícones do Admin DS

**Estado:** módulo interno em `@dvmarques/admin-ds-components`, preparado para possível extração. **Não existe pacote `@admin-ds/icons` nesta versão.**

## Estrutura

```text
packages/components/src/
├── icon.tsx           # Reexport de compatibilidade
├── index.ts           # Export público do pacote (inalterado)
└── icons/
    ├── paths.tsx      # Geometria oficial dos 20 ícones licenciados
    ├── types.ts       # AdsIconName, AdsIconProps e AdsIconSize
    ├── icon.tsx       # Componente React AdsIcon e regras de tamanho
    └── index.ts       # Barrel do módulo interno
```

O consumidor continua importando `AdsIcon` e seus tipos de `@dvmarques/admin-ds-components`, sem subpath adicional nem nova dependência. O caminho `src/icon.tsx`, usado pelo próprio pacote e pelos testes, continua reexportando a implementação modular e preservando a identidade da função.

Os arquivos de SVG são apenas elementos JSX embutidos: o pacote não instala Feather, Lucide nem Hugeicons em tempo de execução. As 20 fontes e licenças estão discriminadas em [Auditoria de ícones](icons-license-audit.md) e os textos integrais de licença são entregues no `dist/THIRD_PARTY_NOTICES.md`, com o `LICENSE.md` do projeto.

## Extração futura (fora do escopo da PR #258)

Uma change independente deverá avaliar: (1) criação efetiva de `@admin-ds/icons`; (2) como desacoplar o uso interno de `classNames`; (3) publicação de licenças e atribuições com o pacote novo; (4) preservação de `AdsIcon` e dos tipos reexportados por `@dvmarques/admin-ds-components`; (5) estratégia de versionamento, builds e orçamento; (6) testes de API e identidade visual. A modularização atual não implica compromisso com um pacote separado ou alteração da API.

## Validação de compatibilidade

`packages/components/tests/icon-modules.test.tsx` confere os 20 nomes oficiais e a identidade dos exports público/legado/modular, além da renderização dos ícones. `content-primitives.test.tsx` cobre as geometrias, larguras de traço, acessibilidade e tamanhos. As mudanças visuais decorrentes da substituição dos SVGs ainda precisam ser revisadas no Storybook e nos snapshots da CI antes do merge.

## Composição agnóstica (issue #316)

O catálogo interno continua com os mesmos 20 nomes e `<AdsIcon name="user" />`. Aplicações que já usam React podem fornecer **elementos renderizados** ao componente público `AdsIconSlot`, sem precisar instalar Lucide, Heroicons ou outro catálogo.

```tsx
import { AdsIcon, AdsIconSlot, AdsButton, AdsThemeControl } from '@dvmarques/admin-ds-components';
import { Truck } from 'lucide-react'; // opcional: instalação feita pela aplicação
import { BellIcon } from '@heroicons/react/24/outline'; // opcional: segunda alternativa

const Local = () => (
	<svg
		width={20}
		height={20}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		aria-hidden="true"
	>
		<path d="M4 4h16v16H4z" />
	</svg>
);

export function Sample() {
	return (
		<>
			<AdsIcon name="user" />
			<AdsButton>
				<Truck size={18} aria-hidden="true" /> Entregas
			</AdsButton>
			<AdsIconSlot icon={<BellIcon width={20} height={20} />} />
			<AdsIconSlot icon={<Local />} label="Pacote" size="lg" />
			<AdsThemeControl
				variant="group"
				icons={{ light: <Truck size={20} />, dark: <BellIcon width={20} />, system: <Local /> }}
			/>
		</>
	);
}
```

**Apenas `apps/docs` usa Lucide React e Heroicons como dependências de desenvolvimento do Storybook.** Nenhuma delas é dependência direta ou peer de `@dvmarques/admin-ds-components` ou `@dvmarques/admin-ds-admin`. Cada aplicação importa seletivamente os ícones que escolheu. O pacote ADS não mantém lookup por nome de biblioteca e não importa catálogos externos.

### Contrato do slot

- `icon: ReactNode` **já instanciado**, como `<Truck />`; `icon={Truck}` (referência de função não renderizada) não é suportado. Não existe `cloneElement`, spread de props no filho ou API dependente de fornecedor.
- `size: 'sm' | 'md' | 'lg'` define **somente a caixa externa** (16, 20 ou 24 px). Passe `size`, `width` e `height` ao próprio SVG conforme a API escolhida. `className`, `style` e demais props HTML são aplicadas ao `span`, nunca ao ícone externo.
- `currentColor` é a convenção recomendada para ícones que devem acompanhar tokens do texto em claro/escuro; SVGs com `fill`/cores próprias seguem sua implementação. O ADS não força espessura de traço.
- O slot é decorativo por padrão (`aria-hidden` no wrapper). Se o desenho contiver significado que não é repetido em texto adjacente, forneça `label` ao slot; ele se torna `role="img"` nomeado. Botões devem continuar com nome acessível independente do SVG, e estado/erro não pode depender exclusivamente da cor.
- O componente não cria estado, não lê `window` e pode renderizar no servidor. Elementos com handlers/hook internos seguem as regras usuais de limites Server/Client de React/Next; não passe funções não serializáveis entre RSC e Client Components.

### Inventário de pontos fixos e prioridade

| Componente/ponto                                                                                      | Estado do contrato                                                | Diretriz                                                       |
| ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------- |
| `AdsIcon`                                                                                             | 20 nomes internos, sem alteração                                  | Fallback compatível; sem catálogo obrigatório                  |
| `AdsButton`, navegação `AdsNav`, `AdsBreadcrumb`                                                      | Composição por `children`, `label` ou separador `ReactNode`       | Não criar prop redundante                                      |
| `AdsAlert`                                                                                            | `icon?: ReactNode\|null` já existia; novo `closeIcon?: ReactNode` | Default interno e acessibilidade de fechar preservados         |
| `AdsToast`                                                                                            | `closeIcon?: ReactNode`                                           | Default de fechar preservado                                   |
| `AdsThemeControl`                                                                                     | `icons?: Partial<Record<AdsThemePreference, ReactNode>>`          | `light/dark/system` e fallback por chave                       |
| `AdsAccountMenu` (ações)                                                                              | `icon?: AdsIconName` original; `iconNode?: ReactNode`             | Precedência do nó externo; `null` remove desenho               |
| `AdsAdminShell` (ícones de navegação)                                                                 | nós definidos no consumidor                                       | Compor sem impor fonte                                         |
| `AdsCombobox`, `AdsAutocomplete`, `AdsDatePicker`, `AdsTimePicker`, overlays, switcher e notificações | ícones de controles e estados internos                            | Avaliar override sob demanda; não alterar em massa sem demanda |
| `AdsSelect`                                                                                           | select nativo/estilização CSS                                     | Preservar semântica nativa; não injetar ícone em `select`      |

O conjunto interno e suas **notices existentes não foram substituídos**: consulte `docs/icons-license-audit.md` e `THIRD_PARTY_NOTICES.md`. SVG local do exemplo é desenho de demonstração, e bibliotecas de exemplo mantêm suas próprias licenças em seu ambiente de desenvolvimento.

### Desempenho e verificações

- Import seletivo evita que o ADS incorpore um catálogo. `sideEffects` do pacote `components` continua restrito ao CSS distribuído.
- Medição CI de 14/11/2026 ([execução #43624407692](https://github.com/dvmarques/admin-design-system/actions/runs/43624407692), SHA `b8036a0`, Linux): `components` dist total **698.865 B**; JS/CSS publicados **302.894 B** (teto 303.500 B); gzip por arquivo **90.877 B** (teto 91.000 B). `admin` total **353.676 B**; JS/CSS **170.970 B** e gzip **46.503 B**.
- Cenários públicos com esbuild minificado/tree-shaking: `components-public` **33.417 B / 11.882 B gzip** (tetos 33.600 / 12.000 B, com folga de ~180 B para não ser um alerta de 3 B), `admin-public` **71.439 B / 24.050 B gzip** (tetos 71.800 / 24.200 B). Esses cenários não importam catálogos externos; presença de `AdsIconSlot` no pacote não força sua inclusão no consumo seletivo. O Storybook com Lucide e Heroicons foi construído no Pages, mas os bytes de cada fornecedor **não foram medidos individualmente**.
- São números de distribuição e cenários de referência, não bytes transferidos por navegação. As licenças de exemplos opcionais permanecem no ambiente de desenvolvimento.
- Gates de aceite: `npm run format`, lint, build, typecheck, test:quality, E2E, check de OpenSpec strict, inspeção dos visual diffs e CI por SHA. Um build pulado não comprova conformidade.
