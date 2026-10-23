# Design

## Registro, rotas e limites

Registro tipado com nome, categoria, slug, descrição e chave da composição. Um Server Component gera parâmetros estáticos e seleciona a entrada, devolvendo 404 para slugs desconhecidos. A busca, previews e sidebar ficam em Client Components. As rotas também funcionam no export estático do GitHub Pages. Todas as rotas antigas são preservadas.

Cada export visual tem uma URL própria. Subcomponentes compartilham uma composição executável para demonstrar a semântica completa. As funções TSX são compiladas normalmente; um script extrai as mesmas funções por AST para snippets com os imports usados. O teste de sincronização bloqueia código exibido desatualizado.

## Acessibilidade e estados

Grupos nativos `details/summary`, foco visível, `aria-current` e fechamento móvel pelo handler existente. Busca rotulada, resultado vazio, região de status, feedback de cópia e fallback em caso de indisponibilidade do clipboard. Campos associam rótulos/descrições/erro; exemplos exercitam teclado, seleção, loading, erro, vazio e recuperação quando pertinentes. A composição do shell é executada em iframe com documento próprio para preservar landmarks e controles sem aninhar regiões main. O tema do preview é passado ao documento isolado.

O tema usa o mecanismo existente da aplicação para sincronizar documento, cabeçalho e portais. Larguras limitadas ao espaço disponível evitam overflow da página; tabelas/código extensos têm scroll local. Os overlays seguem a viewport real, validada em testes com viewport estreita e larga.

## Estilos e pacotes

Usar APIs Ads* públicas e CSS já compilado dos pacotes; não há Tailwind no consumidor nem alteração de CSS distribuído. Estilos locais usam tokens semânticos `--ads-*` e classes locais do demo para evitar conflitos. Biblioteca, APIs públicas e bundle distribuído permanecem inalterados. O catálogo aumenta apenas o bundle da demonstração, sem novas dependências de runtime.

## Alternativas e riscos

Âncoras em uma página única simplificariam o roteamento, mas dificultariam contexto isolado e links diretos. Rotas por export com composições compartilhadas preservam descoberta sem duplicar exemplos semanticamente relacionados. Snippets manuais seriam mais curtos, mas poderiam divergir do exemplo: a extração por AST mantém coerência e imports reais. O custo é manter um artefato gerado, protegido por teste.

Mudança intencional da sidebar altera snapshots das páginas existentes. Diferenças devem ser inspecionadas antes de atualizar baselines pelo workflow oficial. Regressões podem ser revertidas pelo commit da implementação, sem migrações ou mudança de contratos dos pacotes.
