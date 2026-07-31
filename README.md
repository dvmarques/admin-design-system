# Admin Design System

Design system React reutilizável para a construção de aplicações
administrativas com Next.js App Router. O projeto é inspirado nos padrões
de usabilidade e layout de painéis administrativos como o CoreUI, mas
possui arquitetura, identidade visual e implementação próprias.

A biblioteca utilizará TypeScript, Tailwind CSS e variáveis CSS
semânticas para oferecer componentes acessíveis, responsivos e
personalizáveis, com suporte a temas claro e escuro. Os pacotes serão
documentados no Storybook e validados por uma aplicação Next.js de
referência.

O desenvolvimento é orientado por especificações com OpenSpec. Cada
mudança relevante passa por proposta, requisitos, design, tarefas,
implementação, validação e arquivamento.

## Executar as aplicações

Instale as dependências uma vez, na raiz do repositório:

```powershell
npm install
```

Antes de iniciar qualquer aplicação, gere os artefatos distribuídos dos
pacotes internos:

```powershell
npm run build
```

### Catálogo de componentes (Storybook)

Inicie o catálogo visual dos componentes com:

```powershell
npm run dev --workspace @admin-ds/docs
```

Abra [http://localhost:6006](http://localhost:6006) no navegador. Para
interromper o servidor, pressione `Ctrl+C` no terminal.

### Aplicação de demonstração (`admin-demo`)

Inicie a aplicação Next.js de referência com:

```powershell
npm run dev --workspace @admin-ds/admin-demo
```

Abra [http://localhost:3000](http://localhost:3000) no navegador. Para
interromper o servidor, pressione `Ctrl+C` no terminal.

## Documentação

- [Roadmap do projeto](docs/roadmap.md)
- [Estrutura e arquitetura do monorepo](docs/architecture.md)
- [Critérios de qualidade](docs/quality.md)
- [Integração em aplicações consumidoras](docs/integration.md)
- [Licenças e atribuições](docs/licensing.md)
- [Limitações conhecidas](docs/limitations.md)
- [Comandos úteis do OpenSpec](docs/openspec-commands.md)
- [Modelos recomendados por fase](docs/models.md)

## Estado atual

A change `establish-design-system-foundation` concluiu a fundação do
monorepo, design tokens, temas, distribuição dos pacotes, integração com
Next.js, documentação e controles de qualidade. A change
`add-core-primitives` concluiu os componentes públicos fundamentais:
`AdsButton`, `AdsBadge`, `AdsAvatar`, `AdsSurface`, `AdsTypography`,
`AdsIcon` e `AdsLoadingIndicator`. A change `add-form-components` concluiu
os controles e composições de formulário, e `add-overlay-components` concluiu
`AdsDialog`, `AdsDrawer`, `AdsTooltip`, `AdsPopover` e `AdsToast`, incluindo
foco, teclado, temas, CSS distribuído, documentação, testes e integração no
admin demo. A change `add-navigation-components` concluiu `AdsBreadcrumb`,
`AdsNav`, `AdsTabs`, `AdsDropdown` e `AdsPagination`, com interações por
teclado, temas, CSS distribuído, documentação, testes, snapshots visuais e
consumo pela aplicação Next.js de demonstração.

O histórico das changes está arquivado no OpenSpec. Consulte as mudanças
ativas e arquivadas com:

```powershell
openspec.cmd list
Get-ChildItem openspec/changes/archive
```

## Tecnologias planejadas

- React e TypeScript com modo estrito
- Next.js com App Router
- Tailwind CSS e variáveis CSS semânticas
- npm workspaces
- Storybook
- Vitest e React Testing Library
- Playwright
- OpenSpec

## Próximo passo

Planejar a change `add-data-display-components`, começando por tabelas,
listas, cards, indicadores de progresso, estados vazios e padrões de
apresentação de dados administrativos:

```powershell
openspec-propose add-data-display-components
```

Isso criará a proposta, specs, design e tarefas da próxima família de
componentes.
