## 1. Fundação e contratos públicos

- [ ] 1.1 Mapear tokens existentes de superfície, texto, borda, foco e estados; adicionar tokens semânticos somente onde a família de data display não puder reutilizar os atuais.
- [ ] 1.2 Criar estrutura de módulos, tipos e exports públicos `Ads*` para `AdsTable`, `AdsList`, `AdsCard`, `AdsProgress` e `AdsEmptyState` em `@admin-ds/components`.
- [ ] 1.3 Garantir que todos os componentes funcionem via CSS distribuído, sem exigir Tailwind na aplicação consumidora e sem adicionar dependência de runtime.

## 2. Tabelas

- [ ] 2.1 Implementar `AdsTable` e suas partes composicionais preservando semântica HTML tabular, atributos nativos e associações de cabeçalhos.
- [ ] 2.2 Implementar estilos de cabeçalho, linhas, células, divisores, alinhamentos, hover e foco de conteúdo interativo usando tokens públicos, sem introduzir estado de seleção de linha nesta change.
- [ ] 2.3 Implementar comportamento responsivo que preserve a estrutura tabular e acesso a todas as colunas por overflow horizontal quando o conteúdo exceder a largura disponível, sem ocultar colunas automaticamente.
- [ ] 2.4 Escrever testes unitários e de acessibilidade para estrutura, cabeçalhos, conteúdo interativo, atributos públicos, temas e viewport estreita.
- [ ] 2.5 Criar histórias Storybook e exemplos no admin demo com tabela simples, conteúdo rico em células e combinação externa com paginação.

## 3. Listas e cards

- [ ] 3.1 Implementar `AdsList` e itens com semântica de coleção, conteúdo composicional, divisores opcionais e suporte a ações/links fornecidos pelo consumidor.
- [ ] 3.2 Implementar `AdsCard` reutilizando primitivas existentes quando adequado e permitindo composição de cabeçalho, conteúdo, metadados e ações sem modelo de domínio.
- [ ] 3.3 Adicionar estilos responsivos, temas claro/escuro, estados visuais e personalização segura por `className` e tokens públicos.
- [ ] 3.4 Escrever testes unitários e de acessibilidade para semântica, foco, composição, temas e consumo sem Tailwind.
- [ ] 3.5 Criar histórias Storybook e exemplos no admin demo para coleções de cards, listas administrativas e itens com ações.

## 4. Progresso e estados vazios

- [ ] 4.1 Implementar `AdsProgress` determinado com valor, mínimo, máximo, normalização determinística de valores fora do intervalo e representação acessível coerente.
- [ ] 4.2 Implementar `AdsProgress` indeterminado sem anunciar percentual fictício, com animação que respeite preferências de movimento reduzido.
- [ ] 4.3 Implementar `AdsEmptyState` com título, descrição, visual opcional e área de ações fornecidas pelo consumidor, sem semântica de erro por padrão.
- [ ] 4.4 Adicionar tokens/estilos necessários para trilha e indicador de progresso, hierarquia do estado vazio e temas claro/escuro.
- [ ] 4.5 Escrever testes unitários e de acessibilidade para progresso determinado/indeterminado, limites de valor, reduced motion, estado vazio e ações.
- [ ] 4.6 Criar histórias Storybook e exemplos no admin demo para carregamento, processamento, coleção vazia e busca sem resultados.

## 5. Integração dos padrões de apresentação

- [ ] 5.1 Demonstrar composição entre `AdsTable`, `AdsProgress`, `AdsEmptyState` e `AdsPagination` sem criar acoplamento de estado ou fetching entre componentes.
- [ ] 5.2 Garantir que loading, empty e populated states possam ser controlados integralmente pela aplicação consumidora.
- [ ] 5.3 Revisar fronteiras com `add-advanced-admin-patterns` para não incluir sorting, filtering, busca, seleção massiva, edição inline, virtualização ou dashboards nesta change.

## 6. Documentação e validação

- [ ] 6.1 Atualizar testes de consumo público para todos os novos exports, tipos e folha de estilos compilada de `@admin-ds/components`.
- [ ] 6.2 Atualizar a aplicação Next.js de demonstração para consumir os componentes exclusivamente pelas APIs e CSS públicos.
- [ ] 6.3 Atualizar snapshots visuais nos temas claro e escuro e executar fluxos Playwright relevantes de responsividade, teclado e acessibilidade.
- [ ] 6.4 Executar format, lint, typecheck, testes, build, E2E e validação OpenSpec strict; corrigir falhas relacionadas à change.
- [ ] 6.5 Revisar o diff final e confirmar que a implementação permanece dentro do escopo da Issue #8 antes de concluir e arquivar a change.
