## Context

Veja a motivação em `proposal.md`. `@admin-ds/components` já distribui componentes React e `styles.css` compilado a partir de classes Tailwind estáticas, consumindo variáveis `--ads-*` geradas por `@admin-ds/tokens`. Não há atualmente uma dependência de runtime para posicionamento, foco ou portais; a mudança precisa preservar o consumo em Next.js App Router e não transferir configuração de Tailwind para as aplicações.

Os comportamentos públicos são definidos em `specs/overlay-dialogs/spec.md`, `specs/anchored-overlays/spec.md` e `specs/toast-notifications/spec.md`.

## Goals / Non-Goals

**Goals:**

- Entregar `AdsDialog`, `AdsDrawer`, `AdsTooltip`, `AdsPopover` e `AdsToast` como APIs controladas, com tipos públicos e composição de conteúdo.
- Concentrar o comportamento de portal, retorno de foco, foco modal, Escape e clique externo em utilitários internos reutilizáveis.
- Manter todos os estilos estáticos no CSS distribuído, usando os tokens semânticos existentes e acrescentando tokens somente se um papel visual não puder ser expresso por eles.

**Non-Goals:**

- Criar um provider global, uma fila de toasts, timers de autoclose ou coordenação entre overlays.
- Implementar menus/dropdowns, modal aninhado ilimitado ou um mecanismo genérico de posicionamento equivalente a uma biblioteca especializada.
- Renderizar os overlays no servidor ou acoplar seu estado ao roteador Next.js.

## Decisions

### APIs controladas com gatilho composicionável

Cada overlay receberá `open` e callback de solicitação de mudança, deixando abertura, remoção e regras de negócio sob controle da aplicação. `AdsDialog` e `AdsDrawer` aceitarão conteúdo composicionável e opções explícitas para os mecanismos de fechamento. `AdsTooltip` e `AdsPopover` receberão um único gatilho React para que a biblioteca aplique a relação ARIA e os eventos sem exigir uma API monolítica. `AdsToast` será uma unidade individual; cabe ao consumidor decidir coleção, posição e tempo de vida.

Alternativa considerada: componentes não controlados com estado interno e um provider de notificações. Isso simplificaria demos, mas ocultaria políticas de aplicação, aumentaria a superfície de API e dificultaria integração com Server Components.

### Limite de cliente pequeno e portal seguro para hidratação

Os módulos interativos declararão `"use client"`. Um utilitário interno somente acessará `document` depois da montagem e renderizará o conteúdo visível em um portal de `document.body`; antes disso, não haverá marcação dependente do navegador. Isso evita divergência de hidratação e impede que `overflow` ou `z-index` de contêineres consumidores recortem o overlay.

Alternativa considerada: renderizar no ponto da árvore do consumidor. Ela preserva uma árvore DOM simples, mas torna backdrop, sobreposição e clipping imprevisíveis em layouts administrativos.

### Acessibilidade nativa e gerenciamento de foco próprio, testável

Diálogo e drawer usarão semântica `role="dialog"` com `aria-modal`, nome acessível e um utilitário de focus trap que enumera elementos focalizáveis dentro do painel. O gatilho ativo será lembrado ao abrir e restaurado ao fechar quando ainda conectado ao documento. Escape, botão de fechar e backdrop apenas invocarão o callback do consumidor. Popover relacionará gatilho e painel com IDs estáveis, fechará por Escape ou interação externa e restaurará foco para fechamentos por teclado. Tooltip usará a associação descritiva sem capturar foco. Toast usará `role="status"` para informação/sucesso/aviso e `role="alert"` para erro, sem mover foco.

Alternativa considerada: adicionar uma biblioteca de primitives acessíveis. Ela reduziria código de interação, mas introduziria uma dependência de runtime para um escopo inicial limitado; o comportamento será coberto diretamente por testes para manter essa decisão reavaliável.

### Posicionamento limitado, previsível e responsivo

Modal ocupará a viewport com painel centralizado; drawer será ancorado a uma lateral e limitará largura à viewport. Tooltip e popover calcularão a posição a partir do retângulo do gatilho quando abrirem e ao ocorrer redimensionamento ou rolagem, invertendo a direção preferida ou restringindo coordenadas quando faltar espaço. A primeira versão não fará colisão entre overlays nem middleware de posicionamento extensível.

Alternativa considerada: CSS puro sem medição. Isso evita JavaScript adicional, mas não atende de forma confiável ao requisito de manter conteúdo ancorado visível junto às bordas da viewport.

### Estilos compilados com tokens e classes estáticas

Os componentes usarão mapeamentos de variantes estáticos e as variáveis públicas de superfície, texto, borda, elevação e opacidade de overlay já distribuídas. Caso um papel específico não tenha cobertura, o token será introduzido no pacote de tokens, aplicado nos temas claro e escuro e exposto como `--ads-*`; nenhuma classe Tailwind será construída por concatenação. APIs externas continuam a aceitar apenas `className`, sem expor utilitários Tailwind internos.

Alternativa considerada: estilos inline para coordenadas e temas. Coordenadas calculadas podem usar estilos inline estritamente internos, mas tema e variantes precisam permanecer no CSS compilado e nos tokens para permitir personalização sem rebuild.

## Risks / Trade-offs

- [Focus trap próprio omite casos de elementos focalizáveis] → Centralizar o seletor, testar Tab/Shift+Tab e cobrir o fluxo em Playwright.
- [Portais exigem limite de cliente] → Manter o `"use client"` apenas nos módulos interativos e evitar acesso ao DOM durante renderização inicial.
- [Posicionamento manual cobre menos casos que bibliotecas dedicadas] → Limitar formalmente o MVP, testar bordas e reavaliar uma dependência apenas se surgirem necessidades comprovadas.
- [Múltiplos modais podem competir por foco] → Documentar que o MVP suporta um modal ativo por contexto de aplicação e não introduzir empilhamento automático.
- [Anúncios de toast podem ser excessivos] → Não fazer autoclose nem reanúnciar conteúdo; o consumidor controla a criação e remoção.

## Migration Plan

1. Implementar utilitários internos, componentes, tipos e estilos no pacote de componentes, incluindo tokens adicionais somente se necessários.
2. Exportar as APIs e construir o CSS distribuído; validar o consumo apenas por esse contrato em docs e admin demo.
3. Adicionar testes de unidade, acessibilidade e Playwright para os fluxos de teclado, fechamento, temas e viewport estreita.
4. Publicar como adição compatível. Em caso de regressão, remover os novos exports e estilos em uma correção sem alterar as APIs existentes.
