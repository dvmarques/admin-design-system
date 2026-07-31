## Context

Veja a motivação em `proposal.md`. O pacote `@admin-ds/components` já distribui componentes React e CSS compilado com classes Tailwind estáticas que consomem variáveis `--ads-*`. `AdsPopover` e seus utilitários internos já estabelecem portal, posicionamento ancorado, clique externo, Escape e propagação de tema para overlays; esta change deve reutilizar esses limites sem expor sua infraestrutura como API pública.

## Goals / Non-Goals

**Goals:**

- Entregar APIs públicas compostas e independentes de roteador para navegação, tabs, dropdown e paginação.
- Reusar a infraestrutura interna de overlay para menus, mantendo comportamento de foco próprio de menu.
- Preservar Server Components onde possível e isolar o JavaScript de interação nos componentes que precisam dele.
- Distribuir estilos estáticos, tokens semânticos e exemplos que funcionem sem Tailwind no consumidor.

**Non-Goals:**

- Criar um roteador, provider global de navegação, sidebar, menu multinível, megamenu ou virtualização.
- Implementar carregamento de dados, sincronização de URL ou tabelas paginadas.
- Adicionar uma dependência de runtime para primitives ou posicionamento.

## Decisions

### APIs compostas, com links e ações fornecidos pelo consumidor

`AdsBreadcrumb`, `AdsNav` e `AdsPagination` serão componentes sem opinião sobre URL: aceitarão elementos de link ou callbacks do consumidor. `AdsTabs` e `AdsDropdown` usarão subcomponentes nomeados para preservar a relação estrutural entre lista, gatilho, itens e painéis, sem uma configuração monolítica. Tabs e dropdown oferecem os pares controlado (`value`/`open`) e não controlado (`defaultValue`/`defaultOpen`) com callbacks de mudança.

Alternativa considerada: receber objetos de rota e montar links internamente. Ela reduziria marcação em demos, mas acoplaria a biblioteca a frameworks e impediria uso com links customizados.

### Server Components por padrão; cliente apenas para interação

Breadcrumb, nav e a estrutura estática da paginação permanecerão compatíveis com Server Components. Tabs, dropdown e paginação com callback serão módulos de cliente, pois gerenciam teclado, foco ou eventos. Nenhum componente acessará `document` durante a renderização inicial; dropdown usará o portal somente após a montagem.

Alternativa considerada: marcar toda a família como cliente. Isso simplificaria a implementação, mas ampliaria desnecessariamente o limite de hidratação em páginas administrativas.

### Tabs de ativação manual

As tabs usarão navegação roving focus e ativação manual por Enter ou Space. Essa escolha evita trocar painel inadvertidamente enquanto o usuário explora tabs e permite que painéis futuros tenham custo de renderização ou carregamento próprio. IDs estáveis formarão as associações `tab`/`tabpanel`.

Alternativa considerada: ativação automática ao mover foco. É adequada para painéis instantâneos, mas transforma navegação exploratória em mudanças de conteúdo e é menos resiliente a painéis caros.

### Dropdown baseado no overlay ancorado existente

O conteúdo de `AdsDropdown` será renderizado por portal e reutilizará cálculo de posição, listeners de rolagem/redimensionamento e sincronização de `data-theme` do `OverlayPortal`. O componente acrescentará semântica `menu` e roving focus nos itens; o primeiro item recebe foco apenas para aberturas por teclado. A mudança não reutilizará diretamente a API de `AdsPopover`, porque menu e popover possuem contratos ARIA e foco distintos.

Alternativa considerada: estender `AdsPopover` com opções de menu. Isso misturaria duas semânticas acessíveis e tornaria uma API existente mais difícil de evoluir.

### Estilos, tokens e isolamento de CSS

Os estilos serão adicionados ao CSS compilado usando mapeamentos Tailwind estaticamente analisáveis e classes públicas `ads-*`. Primeiro serão reutilizados tokens de superfície elevada, texto, borda, foco e estado selecionado; novos tokens `--ads-*` somente serão introduzidos para papéis que não tenham equivalente semântico. Coordenadas do overlay podem permanecer internas em estilos calculados. Nenhuma classe Tailwind será gerada por concatenação, e `className` será aplicado somente a pontos de personalização seguros.

Alternativa considerada: estilos inline para variantes e tema. Isso impediria a customização global por tokens e aumentaria o CSS específico em cada renderização.

## Risks / Trade-offs

- [Tabs manuais podem surpreender usuários que esperam ativação automática] → Documentar o comportamento e cobrir as teclas na Storybook e nos testes.
- [Roving focus em dropdown pode divergir entre elementos link e botão] → Definir uma abstração interna única para itens elegíveis e testar os dois tipos.
- [Portal do dropdown pode aumentar código cliente] → Reusar os utilitários já distribuídos e limitar listeners ao período em que o menu está aberto.
- [Paginação compacta pode omitir contexto visual] → Sempre preservar primeira, última e atual quando aplicáveis e anunciar controles de forma descritiva.
- [Novos tokens elevam superfície pública] → Preferir tokens existentes; documentar e testar qualquer novo token nos dois temas.

## Migration Plan

1. Criar componentes, tipos, exports e estilos no pacote de componentes, reutilizando os utilitários internos de overlay sem alterar APIs existentes.
2. Atualizar tokens somente quando um novo papel semântico for comprovadamente necessário e incluí-lo nos temas claro e escuro.
3. Adicionar histórias, exemplos no admin demo e testes de comportamento, acessibilidade, CSS compilado e fluxos Playwright.
4. Publicar como adição compatível. Um rollback remove somente os novos exports, estilos e tokens introduzidos, sem migração de consumidores existentes.
