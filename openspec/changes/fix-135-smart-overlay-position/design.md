## Context

O hook useAnchoredPosition retorna apenas CSSProperties, utiliza dimensões de offset e window.innerWidth/Height e observa apenas resize e scroll. Tooltip renderiza a seta e data-placement conforme a preferência, não a posição efetiva.

## Decision

Manter um algoritmo interno pequeno, sem dependência runtime nova. Implementar cálculo puro de candidatos opostos, overflow por eixo principal, escolha do lado com maior espaço quando nenhum cabe, shift no eixo transversal e clamp final com margem de 8px. Retornar internamente {style, placement, arrowOffset} e adaptar os três consumidores sem alterar props públicas.

## Alternatives

@floating-ui/react oferece middleware flip/shift/arrow e autoUpdate maduros, reduzindo manutenção geométrica, mas adiciona dependências e custo de bundle; seu ganho deve ser reavaliado se surgirem placements compostos, collision boundaries ou requisitos mais complexos. Uma implementação própria reduz dependências para quatro placements e dois alinhamentos atuais, mas exige testes robustos de geometria, zoom e limpeza.

## Geometry and lifecycle

Usar getBoundingClientRect e dimensões efetivas do painel, respeitar visualViewport quando disponível (offsets e dimensões), observar ResizeObserver para âncora e painel, resize/scroll de viewport e ancestrais com capture. Agendar cálculos via requestAnimationFrame para agrupar eventos; cancelar frames e desconectar observers no cleanup. Evitar loop de ResizeObserver comparando valores antes de atualizar estado. Quando conteúdo exceder a viewport, limitar coordenadas sem prometer visibilidade integral impossível.

O anexo do painel é acompanhado por ref de callback estável, sem timers ou polling. O cálculo e a instalação do observer acontecem em layout effect após o anexo real; uma troca de painel desconecta a instância anterior. O primeiro estado usa opacidade zero até a medição, permitindo o foco inicial do Dropdown ainda na ref de montagem. Usar visibility:hidden impediria esse foco no navegador. O ownerDocument fornece a janela da área de posicionamento. A ausência de ResizeObserver mantém resize/scroll funcionais. Os listeners usam a mesma instância de visualViewport durante instalação e limpeza.

Coordenadas são CSS pixels de viewport, sem somar scrollX/scrollY e sem multiplicar por devicePixelRatio ou visualViewport.scale. Zoom de página altera o layout e emite resize; pinch zoom altera dimensões e offsets da viewport visual. Não há garantia de suporte a ancestrais transformados de body que redefinam o containing block de position:fixed. Quando nenhum lado comporta o painel, escolhe-se o maior espaço entre preferência e oposto (empate preserva preferência); o clamp nos dois eixos pode sobrepor âncora e painel. Conteúdo maior que a área disponível pode continuar cortado: esta change não adiciona um contrato de redimensionamento ou rolagem interna automática.

Os quatro placements e alinhamentos center/start continuam internos ao cálculo; não são introduzidas props novas. Metadados data-placement são aplicados nos três painéis. A seta mantém apenas classes explícitas do lado e da translação; a coordenada transversal vem do cálculo, com limite de 8px (ou o centro, em painéis menores que 16px).

## Tooltip arrow

A seta acompanha o placement efetivo. No eixo transversal, posicioná-la na direção do centro da âncora com limites que preservem o raio/borda do painel; não usar centro fixo após shift. data-placement deve refletir o lado efetivamente renderizado.

## Compatibility and accessibility

Manter posicionamento somente após montagem do portal no cliente; SSR não acessa window/document durante render. Não modificar listeners de Escape, outside click, foco, inert, nem hierarquia de portal. Conservar CSS e classes ads-; verificar temas claro/escuro, zoom, teclado e overlays aninhados.

Biblioteca e demonstrações interativas mantêm use client. O portal produz o mesmo marcador no servidor e no primeiro render de hidratação; nenhum layout é lido durante render. Tailwind continua ferramenta de build interna: as classes de painel/seta entram no CSS compilado e os tokens semânticos existentes permitem personalização e temas sem recompilar. A nova rota /componentes/overlays consome somente exports públicos e folhas de estilo já importadas pelo layout Next.js; não altera os exemplos existentes nem seus snapshots.

Floating UI fornece maturidade em colisões e engines e também primitives de interação; estas últimas não são necessárias para a issue e sobreporiam a infraestrutura atual de foco/Escape. A solução interna preserva os handlers existentes e não introduz dependências. O custo dessa escolha é manter a cobertura geométrica, de ciclo de vida e de navegadores. Reavaliar Floating UI ao adicionar boundaries, virtual elements ou placements compostos; não foi incorporado código de terceiros nesta implementação.

## Validation

Comparar tamanho do bundle antes/depois, verificar ausência de dependências novas, executar testes de geometria e integração, Storybook, admin-demo, E2E, formatação, lint, tipos, build e OpenSpec estrito. Sem aceitar snapshots automaticamente.
