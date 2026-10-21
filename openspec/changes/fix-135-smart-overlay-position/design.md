## Context
O hook useAnchoredPosition retorna apenas CSSProperties, utiliza dimensões de offset e window.innerWidth/Height e observa apenas resize e scroll. Tooltip renderiza a seta e data-placement conforme a preferência, não a posição efetiva.

## Decision
Manter um algoritmo interno pequeno, sem dependência runtime nova. Implementar cálculo puro de candidatos opostos, overflow por eixo principal, escolha do lado com maior espaço quando nenhum cabe, shift no eixo transversal e clamp final com margem de 8px. Retornar internamente {style, placement, arrowOffset} e adaptar os três consumidores sem alterar props públicas.

## Alternatives
@floating-ui/react oferece middleware flip/shift/arrow e autoUpdate maduros, reduzindo manutenção geométrica, mas adiciona dependências e custo de bundle; seu ganho deve ser reavaliado se surgirem placements compostos, collision boundaries ou requisitos mais complexos. Uma implementação própria reduz dependências para quatro placements e dois alinhamentos atuais, mas exige testes robustos de geometria, zoom e limpeza.

## Geometry and lifecycle
Usar getBoundingClientRect e dimensões efetivas do painel, respeitar visualViewport quando disponível (offsets e dimensões), observar ResizeObserver para âncora e painel, resize/scroll de viewport e ancestrais com capture. Agendar cálculos via requestAnimationFrame para agrupar eventos; cancelar frames e desconectar observers no cleanup. Evitar loop de ResizeObserver comparando valores antes de atualizar estado. Quando conteúdo exceder a viewport, limitar coordenadas sem prometer visibilidade integral impossível.

## Tooltip arrow
A seta acompanha o placement efetivo. No eixo transversal, posicioná-la na direção do centro da âncora com limites que preservem o raio/borda do painel; não usar centro fixo após shift. data-placement deve refletir o lado efetivamente renderizado.

## Compatibility and accessibility
Manter posicionamento somente após montagem do portal no cliente; SSR não acessa window/document durante render. Não modificar listeners de Escape, outside click, foco, inert, nem hierarquia de portal. Conservar CSS e classes ads-; verificar temas claro/escuro, zoom, teclado e overlays aninhados.

## Validation
Comparar tamanho do bundle antes/depois, verificar ausência de dependências novas, executar testes de geometria e integração, Storybook, admin-demo, E2E, formatação, lint, tipos, build e OpenSpec estrito. Sem aceitar snapshots automaticamente.
