## Context

Os estilos publicados por `@admin-ds/components` são compilados com Tailwind e consomem variáveis semânticas de `@admin-ds/tokens`. Os componentes já expõem as famílias necessárias para controles, superfícies, navegação e overlays, mas usam uma fundação visual ainda pouco diferenciada entre níveis e estados. Consulte `proposal.md` para a motivação e os deltas em `specs/` para os contratos observáveis.

## Goals / Non-Goals

**Goals:**

- Consolidar uma linguagem visual administrativa sóbria, legível e densa por meio de tokens públicos.
- Aplicar essa linguagem de forma consistente nos componentes existentes sem remover contratos públicos.
- Adicionar skeleton como primitiva opcional e sem dependência de runtime.
- Validar temas, responsividade, foco, contraste e movimento reduzido com os testes existentes e novos testes direcionados.

**Non-Goals:**

- Redesenhar Storybook, suas stories ou a aplicação de demonstração.
- Adicionar bibliotecas de ícones, animação, temas ou CSS em runtime.
- Mudar semântica HTML, gerenciamento de foco ou contratos controlados já estabelecidos, salvo correções necessárias para manter acessibilidade.
- Criar componentes compostos específicos de domínio administrativo.

## Decisions

### Evoluir tokens semânticos por adição compatível

Os tokens existentes permanecem como contrato. Novos papéis semânticos ou valores refinados serão adicionados quando um componente precisar distinguir superfície, interação ou estado sem recorrer a valores locais. Os valores serão definidos nos dois temas e gerados nos formatos CSS e TypeScript atuais.

Alternativa considerada: definir valores diretamente nas classes de cada componente. Isso foi rejeitado porque impede personalização consistente por consumidores e fragmenta a linguagem visual.

### Manter Tailwind interno e variáveis CSS como fronteira pública

Os mapeamentos de variantes continuarão estáticos no código-fonte dos componentes e classes públicas continuarão prefixadas com `ads-`. As utilidades Tailwind internas consumirão variáveis `--ads-*`; a folha compilada continuará sendo suficiente para consumidores que não usam Tailwind.

Alternativa considerada: exigir que aplicações consumidoras gerem classes Tailwind. Isso foi rejeitado por quebrar o modelo atual de distribuição e aumentar o acoplamento.

### Tratar estados como matriz comum de componentes

Controles interativos usarão uma matriz compartilhada de aparência para repouso, hover, foco visível, pressionado, indisponível, carregamento e validação quando aplicável. Cor será combinada com borda, opacidade, tipografia, forma ou movimento para evitar comunicar estado apenas cromaticamente. Transições serão curtas e restritas a `transform`, `opacity`, cor, borda e sombra; a preferência de movimento reduzido desativará o movimento não essencial.

Alternativa considerada: personalizar cada estado de forma independente em cada componente. Isso foi rejeitado porque produziria respostas visuais inconsistentes para a mesma interação.

### Diferenciar superfícies por função, não por ornamentação

As variantes de superfície, menus e overlays usarão contraste de canvas, borda e elevação suficiente para comunicar agrupamento, prioridade e contexto. Gradientes decorativos, efeitos de vidro e sombras pesadas não serão introduzidos. Raios de controles e superfícies continuarão tokenizados e coerentes entre famílias de componentes.

Alternativa considerada: usar cartões com bordas e sombras idênticas em todo agrupamento. Isso foi rejeitado porque reduz a hierarquia e deixa interfaces administrativas visualmente ruidosas.

### Introduzir skeleton como primitiva simples e semântica

O novo componente de skeleton terá tamanho e forma composicionáveis, será decorativo por padrão e permitirá texto/semântica acessível quando representar uma região inteira. A animação será CSS e terá alternativa estática sob `prefers-reduced-motion`. Ele será compatível com Server Components por não exigir estado ou efeitos no cliente.

Alternativa considerada: substituir globalmente o loading indicator por skeleton. Isso foi rejeitado porque o spinner continua apropriado para trabalho indeterminado e ações pontuais.

### Preservar compatibilidade de APIs

Nenhuma prop, variante, exportação ou token existente será removido ou renomeado. Se algum refinamento exigir capacidade adicional, ela será opcional e seguirá os prefixos públicos do projeto. Ajustes puramente visuais serão entregues pelo CSS distribuído e documentados pelas stories existentes, sem mudança estrutural nelas.

### Explicitar interação, elevação e camadas por tokens aditivos

Além dos papéis atuais, a fundação passará a representar explicitamente superfícies de hover e seleção, borda de maior contraste, anel e offset de foco, hover semântico de ações, três níveis de elevação e uma escala de camadas. Os componentes MUST consumir esses papéis em vez de calcular cor, opacidade ou sombra localmente. Os valores manterão contraste nos dois temas e não usarão gradiente, vidro ou blur decorativo.

Alternativa considerada: intensificar cores e sombras existentes diretamente em cada componente. Isso foi rejeitado porque não oferece uma escala compartilhada para consumidores nem preserva coerência entre overlays, ações e navegação.

### Separar indisponibilidade, somente leitura e validação

Controles desabilitados continuarão sem interação; controles somente leitura preservarão legibilidade e seu comportamento nativo, porém comunicarão que o valor não é editável. Foco, erro e sucesso serão cumulativos quando coexistirem, e a informação de estado combinará cor com borda, ícone, texto ou estrutura disponível no componente.

Alternativa considerada: tratar somente leitura como uma variação cromática de desabilitado. Isso foi rejeitado porque transmite incorretamente a capacidade de seleção e leitura do conteúdo.

### Tornar a responsividade parte do contrato visual

Em contextos compactos, controles interativos terão área tátil efetiva de pelo menos 40 px quando o layout permitir, sem alterar dimensões públicas já contratadas. Tabs e paginação adotarão comportamento explícito de rolagem horizontal ou quebra controlada, sem esconder destinos operáveis; grupos de campo poderão reduzir espaçamento e reorganizar adornos. Dialogs, drawers e notificações reduzirão padding de forma fluida abaixo de 768 px, preservando área de conteúdo e ações.

Alternativa considerada: deixar o navegador quebrar cada família automaticamente. Isso foi rejeitado porque produz navegação truncada, ações comprimidas e resultados inconsistentes entre componentes.

### Usar seleção estrutural na navegação

Tabs e navegação persistente comunicarão seleção principalmente por indicador, borda ou superfície suave, mantendo foco visível separado. Breadcrumb preservará a hierarquia de destino, e paginação usará métricas estáveis, incluindo números tabulares onde aplicável, para reduzir variação visual entre páginas.

Alternativa considerada: usar o mesmo preenchimento forte de botões para qualquer item selecionado. Isso foi rejeitado porque transforma navegação densa em um conjunto de chamadas de ação concorrentes.

## Risks / Trade-offs

- [Alteração visual pode afetar layouts consumidores que dependem de medidas implícitas] → preservar dimensões públicas existentes, testar a aplicação Next.js de consumo e limitar mudanças de layout a tokens documentados.
- [Novo contraste de tema pode regredir WCAG em uma variante] → executar testes de acessibilidade e verificar cada matriz de estado nos temas claro e escuro.
- [Elevação refinada pode aumentar custo de pintura] → usar sombras curtas e estáticas; não aplicar blur em superfícies roláveis.
- [Animações de feedback podem prejudicar pessoas sensíveis a movimento] → limitar propriedades animadas e fornecer redução estática por media query.
- [Skeleton pode ser usado onde progresso indeterminado é mais adequado] → manter `AdsLoadingIndicator` e documentar, nas APIs públicas, a diferença entre ambos.
- [Novos papéis de token podem ser parcialmente adotados] → incluir testes de CSS e de estados para cada família alterada e impedir valores visuais locais para os novos casos.
- [Ajustes compactos podem alterar quebra de layout em consumidores] → preservar APIs e dimensões contratuais, testar as larguras estreitas nas famílias afetadas e limitar a reorganização a CSS responsivo.

## Migration Plan

1. Publicar os novos tokens e estilos mantendo todos os nomes existentes.
2. Atualizar componentes por família, começando por fundação, botões, superfícies e formulários.
3. Adicionar `AdsSkeleton` como exportação compatível e verificar a distribuição de tipos e CSS.
4. Executar testes de componentes, qualidade de CSS, temas e consumo Next.js antes de liberar.
5. Caso seja necessário reverter, restaurar os valores de token e os mapeamentos visuais anteriores sem migração para consumidores, pois as APIs permanecem inalteradas.
