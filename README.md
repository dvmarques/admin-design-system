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
Next.js, documentação e controles de qualidade.

O histórico dela está arquivado no OpenSpec. Consulte as mudanças ativas e
arquivadas com:

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

Criar a change `add-core-primitives`, começando por elementos reutilizáveis
como Button, Badge, Avatar, Surface, Tipografia, Ícones e indicadores de
carregamento:

```powershell
openspec.cmd new change add-core-primitives `
  --description "Adicionar os componentes fundamentais reutilizáveis do Admin Design System" `
  --goal "Disponibilizar primitivas acessíveis, tematizáveis e compatíveis com Next.js"
```

Depois, use `openspec-propose` para elaborar a proposta, specs, design e
tarefas dessa nova change.
