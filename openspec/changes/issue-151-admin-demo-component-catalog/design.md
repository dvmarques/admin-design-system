# Design

## Registro, rotas e limites

Registro tipado com nome, categoria, slug, descrição e chave da composição. Um Server Component gera parâmetros estáticos e seleciona a entrada, devolvendo 404 para slugs desconhecidos. A busca, previews e sidebar ficam em Client Components. As rotas também funcionam no export estático do GitHub Pages. Todas as rotas antigas são preservadas.

Cada export visual tem uma URL própria. Subcomponentes compartilham uma composição executável para demonstrar a semântica completa. As funções TSX são compiladas normalmente; um script extrai as mesmas funções por AST para snippets com os imports usados. O teste de sincronização bloqueia código exibido desatualizado.

## Acessibilidade e estados

Grupos nativos `details/summary`, foco visível, `aria-current` e fechamento móvel pelo handler existente. Busca rotulada, resultado vazio, região de status, feedback de cópia e fallback em caso de indisponibilidade do clipboard. Campos associam rótulos/descrições/erro; exemplos exercitam teclado, seleção, loading, erro, vazio e recuperação quando pertinentes. A composição do shell é executada em iframe com documento próprio para preservar landmarks e controles sem aninhar regiões main. O tema do preview é passado ao documento isolado.

O tema usa o mecanismo existente da aplicação para sincronizar documento, cabeçalho e portais. Larguras limitadas ao espaço disponível evitam overflow da página; tabelas/código extensos têm scroll local. Os overlays seguem a viewport real, validada em testes com viewport estreita e larga.

## Estilos e pacotes

Usar APIs Ads* públicas e CSS compilado dos pacotes; não há Tailwind no consumidor. O ajuste da sidebar acrescenta partes de composição ao shell e estilos públicos `ads-sidebar-*` no pacote admin, com tokens semânticos `--ads-*`, sem alterar contratos existentes. Os demais estilos do catálogo permanecem locais ao demo. Sem novas dependências de runtime.

## Alternativas e riscos

Âncoras em uma página única simplificariam o roteamento, mas dificultariam contexto isolado e links diretos. Rotas por export com composições compartilhadas preservam descoberta sem duplicar exemplos semanticamente relacionados. Snippets manuais seriam mais curtos, mas poderiam divergir do exemplo: a extração por AST mantém coerência e imports reais. O custo é manter um artefato gerado, protegido por teste.

Mudança intencional da sidebar altera snapshots das páginas existentes. Diferenças devem ser inspecionadas antes de atualizar baselines pelo workflow oficial. Regressões podem ser revertidas pelo commit da implementação, sem migrações ou mudança de contratos dos pacotes.

## Ajuste da revisão — expansão da sidebar

Cada grupo tem identidade estável pelo rótulo e mantém seu próprio estado de expansão, atualizado pelo evento nativo `toggle`. Navegar abre o grupo da página de destino; as escolhas dos demais grupos sobrevivem à troca de rota, inclusive voltar/avançar. Não há persistência entre recarregamentos nem alteração do estado móvel do shell.

## Ajuste visual autorizado — hierarquia da sidebar

A navegação usa três papéis: título de seção sem interação, grupo expansível com ícone e chevron à direita, e link recuado. Visão geral e Catálogo são links diretos. Componentes, Composições administrativas e Exemplos de aplicação são seções fixas. A aplicação abre a categoria ativa e mantém as demais escolhas. Os nomes do menu omitem Ads, preservando nomes técnicos nas páginas e snippets.

O pacote admin adiciona, de forma compatível, as partes AdsAdminShell.Navigation, NavigationSection, NavigationGroup e NavigationItem e seus tipos públicos. O grupo usa details/summary nativos; o item permite compor links do roteador sem dependência de Next.js. CSS ads-* distribuído usa tokens semânticos. No desktop recolhido, os grupos exibem ícones com nome acessível; ativar um grupo expande a sidebar e abre os links. O drawer móvel mantém o menu completo. Sem dependências novas ou alteração de tokens, fonte ou identidade. Storybook, demonstração do shell e testes cobrem a composição.
