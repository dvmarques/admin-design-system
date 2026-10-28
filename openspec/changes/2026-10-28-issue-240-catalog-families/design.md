# Design — famílias de componentes no catálogo

## Contexto e decisões
O registro catalogEntries hoje tem uma entrada por export, e a sidebar mapeia todas diretamente. A página de detalhe monta a composição completa por demo, mas muda o título conforme o export. O teste catalog-coverage exige URLs únicas por export. São responsabilidades diferentes e deverão ser representadas explicitamente.

### Modelo
Criar um mapa de famílias em apps/admin-demo: id/slug canônico, categoria, título, descrição, members (nomes públicos e nomes compostos realmente disponíveis), ids de âncoras e demos. O cadastro dos exports e a matriz de cobertura continuam fontes de verificação; a sidebar recebe apenas as famílias + componentes independentes, e a busca indexa cada member.

As partes de Dropdown e AdminShell disponibilizadas como propriedades (por exemplo AdsDropdown.Trigger e AdsAdminShell.NavigationItem) são aliases de pesquisa/documentação, não novos exports nomeados. Dashboard reúne três exports independentes em um guia de composição, com indicação clara de uso isolado. InputGroup e SelectionGroup permanecem páginas independentes.

### Rotas e compatibilidade
A página canônica usa /catalogo/<familia> com seções / IDs determinísticos (por exemplo ads-tabs-trigger). A busca gera link direto à âncora do item encontrado; um resultado de Tabs pode abrir o topo e um resultado de TabsTrigger sua seção. Slugs preexistentes continuam presentes em generateStaticParams para materialização no export estático.

Não depender de redirect HTTP/Next não suportado em output export: servir página-alias estática útil, com link canônico e navegação cliente à âncora quando possível; em ausência de JavaScript, o visitante consegue acessar o conteúdo e a seção correspondente. A navegação interna do demo sempre emite URLs canônicas; metas de compatibilidade devem incluir acesso direto/refresh a slug antigo no GitHub Pages.

### Página e acessibilidade
O topo da família lista todos os nomes técnicos públicos, com links internos focáveis; cada seção apresenta nome exato, função, props/variantes relevantes, exemplos funcionais e recomendações ARIA. Navegar à âncora posiciona o heading no viewport sem ocultá-lo sob cabeçalho fixo; foco e leitor de tela permanecem coerentes. Busca mostra nome exato e relação com a família; sidebar indica família ativa ao entrar por alias/âncora.

O código exibido continua extraído das mesmas composições TSX em uso pelo AST. Onde o conjunto de exemplos não distinguir uma parte, acrescentar cenário específico sem inventar uma API. Documentação de referência automática do Storybook pertence à #193; evitar duplicação de código e contratos.

## Limites técnicos
Server Component da rota resolve family/alias e gera params estáticos. Busca, preview e navegação interativa são Client Components. CSS do catálogo permanece no demo, usando tokens públicos existentes; Tailwind interno e CSS compilado dos pacotes não mudam. Sem novo pacote e sem nova dependência de runtime.

## Alternativas e trade-offs
- Manter uma rota completa por export: preserva URLs, mas mantém redundância; rejeitado como apresentação canônica.
- Remover todas as rotas antigas e usar redirects de servidor: falha em export estático; rejeitado.
- Tratar todas as composições como exports individuais: distorce as APIs de Dropdown/AdminShell e a independência do Dashboard; rejeitado.
- Uma família canônica com aliases estáticos: acrescenta complexidade ao roteamento/coverage, mas preserva navegação e links.

## Riscos, rollback e revisão
Avaliar links antigos, basePath do Pages, links hash após hidratação, scroll, busca e composição em desktop/mobile. Rollback consiste em restaurar o registro e roteamento anteriores em PR, sem alteração nos pacotes públicos. Revisão do diff deve conferir explicitamente: nenhum export perdeu cobertura, nenhuma âncora/alias ficou órfão, nenhum exemplo passou a usar import privado, e não houve impacto nos componentes independentes.
