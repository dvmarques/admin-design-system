# Design — página de componente opcional

## Baseline e contrato
@admin-ds/highlighted-code expõe AdsHighlightedCodeSnippet e auxiliares de linguagem. O componente é importado explicitamente em catalog-preview.tsx, onde destaca código dos demais exemplos. Nenhuma das listas de exports dos pacotes principais o contém e nenhuma deve passar a contê-lo.

### Registro e dependência
Acrescentar registro do componente visual em catalogEntries (grupo Dados), com demo específica e descrição própria. Evoluir cobertura para considerar um conjunto declarado e justificado de workspaces públicos adicionais; não usar descoberta global indiscriminada que classifique utilitários, types ou loaders como componentes UI. Verificar que somente AdsHighlightedCodeSnippet entra como UI desse pacote, e que faltas posteriores de exports visuais opcionalmente declarados falham no teste.

O catálogo pode importar AdsHighlightedCodeSnippet diretamente de @admin-ds/highlighted-code, pois o demo já depende do pacote. O import do pacote opcional não deve atingir o bundle público de @admin-ds/components nem @admin-ds/admin. O demo pode incluir o custo do componente na rota de catálogo; documentar o trade-off entre eager import da página e code splitting da demonstração quando pertinente.

### Demonstração
Criar função TSX de exemplo em catalog-demos.tsx (ou módulo próprio com integração ao extrator AST existente) e registrá-la sem divergência entre o código exibido e o executado. Mostrar vários snippets de código local estático e controles para alternar linguagem, tema (light/dark/auto), linhas e wrap. A ação copiar deve ser real e acessível.

Exercitar fallback de linguagem desconhecida e estado inicial plain antes do highlighting sem fabricar uma mensagem de erro nova. Explicar que o componente limita processamento em código longo; testes de limites são mais adequados que exibir 1000 linhas na tela. Evitar executar texto de código como HTML e manter legendas acessíveis.

### Navegação e documentação
Criar /catalogo/highlighted-code-snippet, indexar AdsHighlightedCodeSnippet, HighlightedCodeSnippet, HighlightedCode, CodeSnippet, Código destacado; manter /exemplos/codigo-destacado e adicionar link de ida/volta para a página canônica. Em eventual implementação da #240, a página permanece um componente independente da categoria Dados; compartilhar fonte de metadados para a busca sem acoplar branches.

A página documenta props com tipos/padrões reais e como importar CSS/tokens do pacote; não recomendar instalação que altere a árvore de deps do pacote principal. Storybook inclui uma story do componente importado pelo entrypoint público opcional, com estados essenciais.

### Plataforma, tokens e acessibilidade
Demo Next.js (Server Component para rota, Client Component para controles e Shiki). Não acrescentar Next.js ao pacote. CSS/tokens públicos já distribuídos permanecem inalterados; personalização via theme/data-theme, não inline CSS hardcoded. Respeitar os temas claro/escuro, reduced motion, overflow local de código, foco visível e região de status da cópia.

## Alternativas e riscos
- Reexportar no pacote principal: simplificaria busca mas violaria isolamento de Shiki; rejeitado.
- Manter somente em Exemplos de aplicação: omite componente público do catálogo; rejeitado.
- Duplicar lógica de Shiki no demo: criaria caminhos divergentes; rejeitado.
- Registro explícito de pacote opcional: requer atualização de cobertura, mas conserva limites de dependência.

Revisão independente deve observar imports do bundle, código mostrado/funcional, SSR/hidratação, Page export, condições de falha e compatibilidade com #240. Rollback local da entrada/demo sem tocar o pacote opcional.
