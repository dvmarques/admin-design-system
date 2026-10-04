# Tasks — add-admin-shell

Cada incremento abaixo deve terminar em um estado verificável. Uma seção só pode ser marcada como concluída quando seus critérios explícitos estiverem atendidos.

## 1. Levantamento e contrato público

- [ ] Revisar componentes públicos existentes de navegação, overlay e layout que possam ser reutilizados.
- [ ] Confirmar os pacotes e pontos de entrada afetados.
- [ ] Definir nomes `Ads*`, tipos e API pública final do Admin Shell sem acoplamento a Next.js.
- [ ] Confirmar breakpoints, tokens de espaçamento e contratos `--ads-*` que serão reutilizados ou adicionados.
- [ ] Registrar no `design.md` qualquer alteração de decisão arquitetural identificada no levantamento.

**Concluído quando:** a API proposta pode ser implementada somente com contratos públicos definidos e sem nova dependência de runtime não justificada.

## 2. Estrutura estática do Admin Shell

- [ ] Implementar a estrutura principal reutilizável do shell.
- [ ] Implementar/compor a região de header.
- [ ] Implementar/compor a região de sidebar.
- [ ] Implementar a região principal de conteúdo.
- [ ] Garantir que identidade, ações, navegação e conteúdo sejam fornecidos por composição.
- [ ] Manter regiões sem interatividade compatíveis com Server Components.
- [ ] Adicionar testes de renderização, composição e semântica estrutural.
- [ ] Adicionar stories para os componentes públicos introduzidos neste incremento.
- [ ] Executar typecheck e testes relacionados ao incremento.

**Concluído quando:** header, sidebar e main podem ser compostos pelas APIs previstas, possuem testes e stories e não exigem estado cliente quando não há interação.

## 3. Navegação responsiva e acessibilidade

- [ ] Implementar sidebar persistente em viewport ampla.
- [ ] Implementar navegação acionável em viewport reduzida isolando a interatividade no menor Client Component necessário.
- [ ] Garantir controle por teclado e atributos ARIA adequados.
- [ ] Garantir que conteúdo oculto não permaneça interativo.
- [ ] Validar landmarks, foco, contraste e ordem de navegação.
- [ ] Adicionar testes do comportamento responsivo e de teclado.
- [ ] Adicionar demonstração responsiva no Storybook.
- [ ] Executar typecheck e testes relacionados ao incremento.

**Concluído quando:** a navegação funciona por mouse e teclado nos estados amplo e reduzido, sem regressão de semântica ou foco.

## 4. Tokens, temas, CSS compilado e API pública

- [ ] Reutilizar tokens existentes antes de introduzir novos `--ads-*`.
- [ ] Implementar estilos sem concatenação dinâmica de classes Tailwind.
- [ ] Garantir que novas classes CSS públicas usem prefixo `ads-` e não dependam de seletores globais genéricos.
- [ ] Validar temas claro e escuro.
- [ ] Adicionar exemplo/teste de customização por design tokens sem recompilação.
- [ ] Garantir que estilos do shell estejam incluídos na folha CSS compilada distribuída.
- [ ] Exportar componentes e tipos necessários pelas entradas públicas do pacote.
- [ ] Adicionar teste que impeça dependência de imports internos no consumo de referência.
- [ ] Executar build da biblioteca e validar os exports gerados.

**Concluído quando:** o shell funciona com o CSS distribuído, nos dois temas e com sobrescrita suportada de tokens, sem exigir Tailwind na aplicação consumidora.

## 5. Storybook e documentação pública

- [ ] Adicionar/completar stories cobrindo composição, temas, responsividade e customização por tokens para cada componente público.
- [ ] Documentar API, responsabilidades e limites do Admin Shell.
- [ ] Documentar que autenticação, autorização e roteamento pertencem à aplicação consumidora.
- [ ] Revisar exemplos para garantir uso exclusivo de APIs públicas.

**Concluído quando:** um consumidor consegue descobrir a API e reproduzir o uso básico apenas pela documentação e exemplos públicos.

## 6. Consumo Next.js e admin demo

- [ ] Integrar um exemplo do shell ao admin demo Next.js App Router usando apenas APIs públicas.
- [ ] Validar que o demo importa a folha CSS compilada distribuída pela biblioteca.
- [ ] Adicionar/atualizar teste de consumo do CSS compilado em Next.js sem scan do código-fonte interno da biblioteca.
- [ ] Verificar ausência de erro de hidratação introduzido pelo shell.
- [ ] Confirmar que a aplicação continua responsável por links e roteamento.
- [ ] Executar build do admin demo.

**Concluído quando:** o admin demo funciona como consumidor externo real das APIs e do CSS compilado do design system.

## 7. E2E e qualidade final

- [ ] Executar testes unitários em modo conciso; usar modo verboso equivalente somente para diagnóstico de falhas.
- [ ] Executar lint e typecheck completos.
- [ ] Executar build completo dos workspaces aplicáveis.
- [ ] Executar `npm run test:e2e` e confirmar que nenhum teste E2E falha.
- [ ] Atualizar snapshots somente quando a mudança visual for intencional e revisada.
- [ ] Executar Prettier nos arquivos alterados conforme a orientação do projeto.
- [ ] Executar `npm run format` e corrigir todas as falhas.
- [ ] Executar validação OpenSpec estrita antes do PR.

**Concluído quando:** todos os comandos obrigatórios passam e qualquer atualização visual de snapshot está explicitamente revisada.

## 8. Encerramento da change

- [ ] Revisar implementação contra todos os requisitos do MVP e critérios da Issue #15.
- [ ] Registrar limitações conhecidas e trabalhos futuros, se houver.
- [ ] Confirmar que nenhuma dependência de runtime foi adicionada sem justificativa no `design.md`.
- [ ] Marcar todas as tasks obrigatórias concluídas somente após as validações finais.
- [ ] Arquivar a change conforme o processo OpenSpec do projeto após a implementação estar concluída.

**Concluído quando:** requisitos, implementação, documentação, testes e OpenSpec estão alinhados e a change está pronta para arquivamento.
