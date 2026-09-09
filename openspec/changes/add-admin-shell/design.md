## Context

O roadmap do Admin Design System prevê uma composição estrutural reutilizável para aplicações administrativas depois da consolidação das famílias básicas de componentes. O pacote `@admin-ds/admin` já existe como boundary para essas composições, porém hoje contém apenas um placeholder e ainda não oferece layout React real.

A implementação deve preservar os contratos existentes do projeto: APIs públicas `Ads*`, CSS distribuído consumível sem Tailwind na aplicação cliente, tokens semânticos, temas claro/escuro, acessibilidade, documentação no Storybook, exemplos no admin demo e validação automatizada. O shell deve compor componentes existentes em vez de duplicar navegação, overlay ou controle de tema.

## Goals / Non-Goals

### Goals

- Fornecer uma composição estrutural pública para header, sidebar e conteúdo principal.
- Permitir composição livre de branding, navegação, ações, usuário e preferências pela aplicação consumidora.
- Suportar layout responsivo com sidebar persistente em desktop e navegação sobreposta em telas estreitas.
- Oferecer contratos controlados e não controlados para estados de layout relevantes sem impor mecanismo de persistência.
- Manter independência de Next.js, React Router, autenticação, autorização, fetching e domínio de negócio.
- Reutilizar tokens e componentes existentes antes de criar novos contratos visuais.

### Non-Goals

- Implementar autenticação, sessão, autorização ou filtragem de menu por permissão.
- Implementar roteamento, geração automática de breadcrumbs ou conhecimento de URL atual.
- Persistir preferências em localStorage, cookie ou backend.
- Transformar o `apps/admin-demo` em aplicação administrativa completa nesta change.
- Implementar dashboards, filtros avançados, data grids inteligentes ou outros padrões da change `add-advanced-admin-patterns`.
- Duplicar `AdsDrawer`, `AdsNav`, `ThemeToggle` ou outras APIs já públicas em `@admin-ds/components`.

## Decisions

### 1. O shell será uma composição React no pacote `@admin-ds/admin`

`@admin-ds/admin` continuará sendo a boundary para padrões administrativos compostos. O placeholder atual será substituído por uma API React pública. A API deve favorecer composição explícita, preferencialmente com partes como `AdsAdminShell.Header`, `AdsAdminShell.Sidebar` e `AdsAdminShell.Content`, ou contrato equivalente que mantenha regiões claras e extensíveis.

A aplicação consumidora continua responsável pelo conteúdo de cada região. O shell não conhece usuários, produtos, permissões, rotas ou backend.

### 2. Header, sidebar e main manterão semântica estrutural explícita

O shell deve produzir landmarks adequados para que tecnologias assistivas consigam distinguir banner/header, navegação lateral e conteúdo principal. Deve existir apenas um `main` estrutural fornecido pelo shell no caso comum, e a API não deve exigir que o consumidor recrie landmarks internamente.

O header deve permitir branding e ações arbitrárias. A sidebar deve permitir conteúdo de navegação fornecido pelo consumidor por APIs públicas. O shell não deve assumir que `AdsNav` atual atende automaticamente a navegação vertical: durante a implementação, o componente existente deve ser validado nesse contexto e somente receber uma evolução genérica de orientação se essa capacidade fizer sentido fora do Admin Shell. Caso contrário, a sidebar permanece composicional e aceita outra estrutura pública de navegação fornecida pelo consumidor.

### 3. Responsividade será comportamento do shell, não do roteador

Em viewports amplas, a sidebar deve participar do layout e poder permanecer expandida ou recolhida. Em viewports estreitas, a navegação estrutural deve sair do fluxo principal e ser apresentada como overlay/drawer acessível.

A implementação deve reutilizar `AdsDrawer` quando seus contratos de foco, Escape, backdrop e portal atenderem ao caso. O shell pode coordenar a abertura/fechamento, mas não deve copiar internamente toda a lógica de overlay existente.

A troca entre os modos desktop e móvel deve ser definida por CSS responsivo e comportamento React mínimo, evitando listeners de viewport quando CSS puder resolver a apresentação.

### 4. Estados de layout terão modo controlado e não controlado

Estados relevantes como sidebar expandida/recolhida e navegação móvel aberta/fechada devem poder ser:

- controlados pela aplicação por prop + callback; ou
- mantidos internamente com valor inicial/default.

O design system não persistirá esses estados. A aplicação poderá persistir preferências externamente e alimentar o shell por props.

### 5. Preferências são estruturais, não um sistema de configurações

Nesta primeira versão, preferência de layout significa apenas estado necessário ao shell, principalmente expansão/recolhimento da sidebar. Densidade global, posição alternativa do header, múltiplas sidebars e layouts arbitrários ficam fora do escopo até existir demanda concreta.

O estado recolhido controla a ocupação estrutural da sidebar, não a transformação semântica do conteúdo arbitrário recebido. O shell deve expor esse estado de forma suficiente para que a composição consumidora adapte rótulos, ícones ou outras representações quando necessário, preservando nomes acessíveis e ordem de teclado. O design system não deve inferir automaticamente como converter conteúdo textual em uma versão compacta.

O tema não será gerenciado pelo shell. O header poderá receber `ThemeToggle` ou outro controle fornecido pelo consumidor, preservando o mecanismo existente.

### 6. Tokens existentes serão priorizados

Superfícies, texto, borda, foco, sombra, espaçamento e motion existentes devem ser reutilizados. Novos tokens somente serão adicionados para conceitos estruturais realmente ausentes e estáveis, como largura expandida/recolhida da sidebar ou altura estrutural do header, se isso trouxer valor público de customização.

Dimensões que não precisarem ser customizadas por consumidores podem permanecer como estilos internos e não devem virar tokens apenas por conveniência de implementação.

### 7. A change não deve antecipar `add-nextjs-admin-demo`

O `apps/admin-demo` receberá somente uma página ou seção suficiente para validar o shell, seus estados, responsividade e composição com componentes públicos. A remodelação completa da aplicação demo como admin final pertence ao item seguinte do roadmap.

### 8. Dependências entre `@admin-ds/admin` e `@admin-ds/components` serão explícitas

Se `@admin-ds/admin` importar componentes de runtime de `@admin-ds/components`, essa relação deve ser declarada de forma explícita no pacote, seguindo a estratégia adotada pelo workspace para consumo/publicação. A implementação deve validar se `@admin-ds/components` entra como dependency/peer dependency compatível com o modelo do monorepo, evitando que o pacote admin funcione apenas por resolução incidental do workspace.

O contrato de estilos também deve permanecer explícito. O shell não deve depender silenciosamente de CSS não declarado: estilos próprios de `@admin-ds/admin` devem ser exportados pelo pacote, e qualquer estilo requerido de `@admin-ds/components` deve permanecer compatível com a forma pública de consumo já existente. A documentação e os testes de consumo devem demonstrar quais imports de CSS são necessários para uma aplicação consumidora.

### 9. A navegação responsiva não deve manter duas montagens simultâneas do mesmo conteúdo

A implementação deve evitar renderizar simultaneamente a mesma composição de sidebar em uma árvore desktop e em outra árvore mobile/drawer. Duplicar children arbitrários pode duplicar IDs, estado interno, efeitos, listeners e integrações de roteamento, mesmo quando uma das cópias está visualmente oculta.

A estratégia responsiva deve manter uma única instância lógica do conteúdo de navegação por vez. Se a solução escolhida exigir troca de montagem entre desktop e mobile, essa transição deve preservar os contratos de acessibilidade e estado documentados. Uma solução com duas montagens simultâneas só poderá ser aceita se houver justificativa técnica explícita e testes que provem ausência de colisões de IDs, estado ou efeitos; ela não é o comportamento padrão esperado desta change.

## Accessibility

- O conteúdo principal deve ser exposto por landmark `main` e permanecer alcançável por teclado.
- A navegação lateral deve ter nome acessível configurável quando necessário.
- O controle que abre a navegação móvel deve expor nome, estado e associação apropriados.
- Ao abrir a navegação móvel, foco, Escape, backdrop e retorno de foco devem seguir os contratos acessíveis já fornecidos pelo overlay reutilizado.
- Ao recolher a sidebar, informações essenciais não podem depender apenas de ícones sem nomes acessíveis ou tooltips quando a aplicação optar por manter itens visíveis; a composição consumidora é responsável por adaptar seu conteúdo ao estado estrutural exposto pelo shell.
- Estados visuais não podem depender apenas de cor e devem manter contraste adequado nos temas claro e escuro.
- Foco visível deve permanecer consistente em controles do header, sidebar e conteúdo.
- Transições estruturais devem respeitar `prefers-reduced-motion`.

## Testing Strategy

- Testes unitários para estrutura, landmarks, props públicas e contratos controlado/não controlado.
- Testes de acessibilidade para nomes de navegação, controles de abertura/recolhimento, foco e uso por teclado.
- Testes de integração com componentes públicos existentes, sem imports privados de `@admin-ds/components`.
- Testes de consumo público garantindo exports, tipos, peer dependencies/dependencies declaradas e CSS compilado/importável do pacote `@admin-ds/admin`.
- Testes específicos para garantir que a navegação responsiva não mantenha duas montagens simultâneas do mesmo conteúdo arbitrário.
- Storybook cobrindo shell desktop expandido, desktop recolhido, mobile fechado/aberto e composição com ações/tema.
- Admin demo com exemplo realista e mínimo, consumindo apenas APIs públicas.
- Playwright e snapshots visuais para temas claro/escuro, viewport desktop e móvel, abertura da navegação e navegação por teclado.
- Validação final com format, lint, typecheck, testes, build, E2E e OpenSpec strict.

## Risks / Trade-offs

- Uma API excessivamente opinativa pode limitar diferentes aplicações administrativas; por isso o shell deve estruturar regiões e estados, mas deixar conteúdo e roteamento ao consumidor.
- Uma API excessivamente genérica pode não entregar valor além de CSS de layout; a primeira versão deve encapsular comportamento responsivo, acessibilidade e coordenação de navegação suficientes para justificar o pacote admin.
- Reutilizar `AdsDrawer` pode exigir adaptação visual para representar navegação lateral; qualquer mudança necessária deve permanecer genérica e não degradar os contratos existentes de overlay.
- Estado controlado e não controlado aumenta a superfície da API; a convenção deve seguir padrões React previsíveis e ser testada para evitar divergência entre props e estado interno.
- Reaproveitar `AdsNav` na sidebar pode exigir uma orientação vertical ainda inexistente; essa evolução só deve ocorrer se resultar em capacidade genérica reutilizável, evitando acoplamento do componente ao Admin Shell.
- Reutilizar componentes de `@admin-ds/components` cria uma relação de runtime que precisa estar refletida no contrato de empacotamento e consumo de CSS do pacote admin.
- Evitar duas montagens simultâneas pode exigir coordenação de breakpoint em runtime; caso CSS puro não seja suficiente sem duplicar a árvore, a implementação pode adotar comportamento React mínimo e bem encapsulado para preservar uma única instância lógica da navegação.

## Open Questions

Nenhuma decisão externa é necessária para iniciar a implementação. A nomenclatura final das partes compostas, o breakpoint exato e a forma concreta de declarar a dependência entre pacotes podem ser refinados durante a implementação, desde que preservem as requirements desta change, os contratos públicos de empacotamento/CSS e a separação de responsabilidades definida acima.
