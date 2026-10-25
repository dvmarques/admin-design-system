## Context

A marca do demo já mantém sua coordenada ao recolher. Os itens expandidos usam padding, enquanto os recolhidos usam justify-content center. Com scrollbar, o centro da navegação diverge do centro da barra.

## Goals / Non-Goals

Manter a coordenada horizontal dos ícones e do avatar da organização entre estados, centralizados no destaque compacto. Não alterar largura da sidebar, destaque ativo, área de toque, navegação móvel ou APIs.

## Decisions

Usar a largura útil compacta já calculada com container queries para alinhar links, grupos e avatar ao centro do destaque, descontando a scrollbar. Em links e grupos, o padding inicial é metade dessa largura menos metade do ícone; o item ativo compensa também o outset existente. O avatar expandido usa a mesma conta com seu tamanho de 2rem e desconta a borda do botão; no recolhido, o botão recebe alvo de 44 px centralizado nessa área, sem depender da largura mínima intrínseca do avatar. Reservar o gutter da scrollbar no desktop evita que seu aparecimento mude o eixo entre estados.

A referência é o centro do destaque azul, conforme refinamento solicitado pelo usuário. O eixo físico da marca no topo permanece como antes; não forçar a centralização pela largura externa da barra, pois isso desloca os ícones para a direita quando há scrollbar.

CSS restrito à composição desktop opt-in, sem reset global ou Tailwind no consumidor. Não há mudanças em Server/Client Components, DOM, foco, ARIA, dependências ou bundle JS. Os tokens de largura continuam personalizáveis.

## Risks / Trade-offs

A largura útil pode mudar quando uma scrollbar surge. Validar com e sem scrollbar, nos dois temas, com largura compacta personalizada e com conteúdo suficiente para rolagem em ambos os estados. A imagem de organização e as iniciais usam o mesmo invólucro de avatar.

## Validation

Comparar as coordenadas dos ícones e do avatar antes/depois e verificar o centro do destaque compacto, inclusive em links ativos e grupos. Executar smoke, branding/mobile, build, lint, tipos e OpenSpec estrito. Baselines Linux somente pelo workflow update-visual-baselines.yml; as limitações Windows da validação geral permanecem documentadas.
