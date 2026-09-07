## Context

O admin-demo já consome os estilos distribuídos e apresenta primitivas, formulários, overlays e navegação, mas seus cenários mostram poucos estados alternativos e fluxos compostos. Consulte proposal.md para a motivação e a spec de admin-demo-evaluation para os comportamentos observáveis.

## Goals / Non-Goals

**Goals:**

- Transformar o admin-demo em uma referência de composição administrativa, sem torná-lo um segundo Storybook.
- Exercitar componentes públicos em temas claro e escuro, em interações de teclado e em larguras reduzidas.
- Manter a fronteira entre CSS de layout da demonstração e aparência interna dos componentes.

**Non-Goals:**

- Criar componentes de tabela, sidebar, header ou dados remotos.
- Duplicar as stories ou modificar o catálogo do Storybook.
- Alterar tokens, variantes, semântica ou APIs públicas da biblioteca.

## Decisions

### Separar composição administrativa de catálogo isolado

O admin-demo reunirá cenários de página e fluxo; o Storybook continuará como referência de APIs e estados isolados. A página usará estrutura HTML e classes locais apenas para layout, enquanto interação, aparência e estados serão fornecidos pelos componentes públicos.

Alternativa considerada: reproduzir no demo a disposição de cada story. Foi rejeitada porque não exercita a densidade, prioridade e responsividade de uma interface administrativa real.

### Usar estados locais apenas para os fluxos já suportados

Carregamento, estados de formulário, confirmação destrutiva e notificações usarão estado React local e conteúdo estático conciso. Isso permite avaliar componentes já publicados sem introduzir chamadas de rede, autenticação, regras de domínio ou padrões de apresentação de dados ainda não entregues.

Alternativa considerada: antecipar uma listagem administrativa com filtros e registros. Foi rejeitada porque a família de componentes de apresentação de dados ainda será planejada e implementada em change própria.

### Tratar tema e compactação como critérios de cada cenário

Os cenários adicionais responderão ao tema já controlado pelo layout e usarão layout fluido para que campos, ações, paginação, dialog e toast possam ser avaliados em larguras reduzidas. Nenhum valor cromático local substituirá papéis semânticos dos componentes.

Alternativa considerada: criar uma página separada para cada tema e viewport. Foi rejeitada porque duplicaria conteúdo e reduziria a utilidade do controle de aparência existente.

### Preservar a fronteira pública dos pacotes

O demo continuará importando somente exports e folhas de estilo públicas. Testes verificarão a presença dos novos componentes no consumo público e os fluxos críticos por interação, sem exigir Tailwind na aplicação.

Alternativa considerada: importar componentes por caminhos internos para simplificar exemplos. Foi rejeitada porque deixaria de validar a experiência de uma aplicação consumidora.

## Risks / Trade-offs

- [Cenários em uma única página podem aumentar a carga cognitiva] → agrupar por intenção e manter dados estáticos concisos.
- [CSS local pode mascarar os componentes] → limitar classes demo a grid, espaçamento, largura e ordem visual; usar tokens para qualquer superfície local.
- [Fluxos client-side podem ampliar a área hidratada] → isolar apenas os cenários interativos em componentes cliente pequenos.
- [Avaliação compacta pode não reproduzir todos os dispositivos] → testar uma faixa de larguras e preservar o comportamento responsivo já contratado pelos componentes.

## Migration Plan

1. Adicionar os cenários de forma compatível à página existente.
2. Expandir testes de consumo público e interação do admin-demo.
3. Executar build, testes, temas e validação do workspace.
4. Caso seja necessário reverter, remover somente os cenários e estilos locais novos, sem impacto em pacotes públicos ou consumidores.
