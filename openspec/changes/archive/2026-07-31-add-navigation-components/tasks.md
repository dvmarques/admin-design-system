## 1. Fundação e contratos públicos

- [x] 1.1 Mapear os tokens existentes de superfície, texto, borda, foco e seleção; adicionar tokens semânticos de navegação somente onde não houver cobertura nos temas claro e escuro.
- [x] 1.2 Criar a estrutura de módulos, tipos e exports públicos `Ads*` da família de navegação no pacote `@admin-ds/components`, mantendo compatibilidade com os pontos de entrada e o CSS distribuído.
- [x] 1.3 Criar utilitários internos mínimos para IDs estáveis, roving focus e cálculo de intervalo de páginas, sem adicionar dependências de runtime.

## 2. Breadcrumb e navegação estrutural

- [x] 2.1 Implementar `AdsBreadcrumb` com lista ordenada, região de navegação nomeável, item atual, separadores decorativos e composição com links externos ao pacote.
- [x] 2.2 Implementar `AdsNav` e seus itens com semântica de lista, estado atual, foco visível e comportamento responsivo para destinos que excedam a largura disponível.
- [x] 2.3 Adicionar estilos estáticos, consumo de tokens e personalização segura por `className` para breadcrumb e nav nos dois temas.
- [x] 2.4 Escrever testes unitários e de acessibilidade para hierarquia, `aria-current`, foco, links fornecidos pelo consumidor e viewport estreita de breadcrumb e nav.
- [x] 2.5 Criar histórias Storybook e exemplo no admin demo para `AdsBreadcrumb` e `AdsNav`, incluindo temas claro/escuro e integração com links de uma aplicação Next.js.

## 3. Tabs

- [x] 3.1 Implementar `AdsTabs` composto com lista, tab e painel, estado controlado/não controlado, IDs estáveis e associação ARIA entre tabs e painéis.
- [x] 3.2 Implementar roving focus de ativação manual, incluindo setas, Home, End, Enter, Space e exclusão de tabs desabilitadas.
- [x] 3.3 Adicionar estilos estáticos, tokens, foco visível e comportamento responsivo para listas de tabs que excedam a largura disponível.
- [x] 3.4 Escrever testes unitários e de acessibilidade para controle de estado, teclado, tabs desabilitadas, relações ARIA e temas.
- [x] 3.5 Criar história Storybook e exemplo no admin demo para cada API pública de `AdsTabs`, demonstrando estados controlado, não controlado e desabilitado.

## 4. Dropdown

- [x] 4.1 Implementar `AdsDropdown` composto com estado controlado/não controlado, gatilho, conteúdo e itens de ação ou link, sem acoplamento a roteador.
- [x] 4.2 Reutilizar os utilitários internos de portal, posicionamento, clique externo, Escape, rolagem, redimensionamento e sincronização de tema já usados pelos overlays ancorados.
- [x] 4.3 Implementar semântica de menu, foco inicial condicionado à abertura por teclado, roving focus com setas/Home/End, restauração de foco e exclusão de itens desabilitados.
- [x] 4.4 Adicionar estilos estáticos de menu, posições configuráveis, estados de item e tokens nos temas claro/escuro, verificando que o portal não expõe classes Tailwind ao consumidor.
- [x] 4.5 Escrever testes unitários, de acessibilidade e Playwright para abertura por teclado, navegação entre itens, Escape, clique externo, bordas de viewport, rolagem, redimensionamento e propagação de tema no portal.
- [x] 4.6 Criar histórias Storybook e exemplo no admin demo para `AdsDropdown`, incluindo itens de link, ações, itens desabilitados e gatilho perto da borda.

## 5. Paginação

- [x] 5.1 Implementar `AdsPagination` com página atual, total, destinos anterior/próximo, callbacks ou links fornecidos pelo consumidor e região de navegação nomeável.
- [x] 5.2 Implementar cálculo determinístico do intervalo compacto, com indicadores não interativos de omissão e preservação de primeira, última e página atual quando aplicáveis.
- [x] 5.3 Adicionar estados atual, desabilitado e foco visível, estilos responsivos e tokens para os temas claro/escuro sem buscar dados ou manipular URL.
- [x] 5.4 Escrever testes unitários e de acessibilidade para limites, `aria-current`, links/callbacks, intervalo extenso, viewport estreita, foco e controles desabilitados.
- [x] 5.5 Criar histórias Storybook e exemplo no admin demo para `AdsPagination`, incluindo coleções extensas e uso por links Next.js fornecidos pelo consumidor.

## 6. Integração e validação

- [x] 6.1 Atualizar testes de consumo público para todos os novos exports, tipos e folha de estilos compilada de `@admin-ds/components`.
- [x] 6.2 Adicionar ou atualizar o teste da aplicação Next.js de demonstração para consumir os componentes e o CSS compilado sem escanear fontes Tailwind internas.
- [x] 6.3 Atualizar snapshots visuais nos temas claro e escuro e executar os fluxos Playwright críticos de teclado, responsividade e acessibilidade.
- [x] 6.4 Executar verificações de tipo, lint, testes, build e validação OpenSpec da change; corrigir falhas relacionadas.
- [x] 6.5 Executar `npx.cmd prettier --write` nos arquivos alterados e confirmar que `npm run format` passa antes de concluir a change.
