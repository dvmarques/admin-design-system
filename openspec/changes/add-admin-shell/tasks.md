# Tasks — add-admin-shell

Cada incremento abaixo deve terminar em um estado verificável. Uma seção só pode ser marcada como concluída quando seus critérios explícitos estiverem atendidos.

## 1. Levantamento e contrato público

- [x] Revisar componentes públicos existentes de navegação, overlay e layout que possam ser reutilizados.
- [x] Confirmar os pacotes e pontos de entrada afetados.
- [x] Definir nomes `Ads*`, tipos e API pública final do Admin Shell sem acoplamento a Next.js.
- [x] Confirmar breakpoints, tokens de espaçamento e contratos `--ads-*` que serão reutilizados ou adicionados.
- [x] Registrar no `design.md` qualquer alteração de decisão arquitetural identificada no levantamento.

**Concluído quando:** a API proposta pode ser implementada somente com contratos públicos definidos e sem nova dependência de runtime não justificada.

## 2. Estrutura estática do Admin Shell

- [x] Implementar a estrutura principal reutilizável do shell.
- [x] Implementar/compor a região de header.
- [x] Implementar/compor a região de sidebar.
- [x] Implementar a região principal de conteúdo.
- [x] Garantir que identidade, ações, navegação e conteúdo sejam fornecidos por composição.
- [x] Manter regiões sem interatividade compatíveis com Server Components.
- [x] Adicionar testes de renderização, composição e semântica estrutural.
- [x] Adicionar stories para os componentes públicos introduzidos neste incremento.
- [x] Executar typecheck e testes relacionados ao incremento.

**Concluído quando:** header, sidebar e main podem ser compostos pelas APIs previstas, possuem testes e stories e não exigem estado cliente quando não há interação.

## 3. Navegação responsiva e acessibilidade

- [x] Implementar sidebar persistente em viewport ampla.
- [x] Implementar navegação acionável em viewport reduzida isolando a interatividade no menor Client Component necessário.
- [x] Garantir controle por teclado e atributos ARIA adequados.
- [x] Garantir que conteúdo oculto não permaneça interativo.
- [x] Validar landmarks, foco, contraste e ordem de navegação.
- [x] Adicionar testes do comportamento responsivo e de teclado.
- [x] Adicionar demonstração responsiva no Storybook.
- [x] Executar typecheck e testes relacionados ao incremento.

**Concluído quando:** a navegação funciona por mouse e teclado nos estados amplo e reduzido, sem regressão de semântica ou foco.

## 4. Tokens, temas, CSS compilado e API pública

- [x] Reutilizar tokens existentes antes de introduzir novos `--ads-*`.
- [x] Implementar estilos sem concatenação dinâmica de classes Tailwind.
- [x] Garantir que novas classes CSS públicas usem prefixo `ads-` e não dependam de seletores globais genéricos.
- [x] Validar temas claro e escuro.
- [x] Adicionar exemplo/teste de customização por design tokens sem recompilação.
- [x] Garantir que estilos do shell estejam incluídos na folha CSS compilada distribuída.
- [x] Exportar componentes e tipos necessários pelas entradas públicas do pacote.
- [x] Adicionar teste que impeça dependência de imports internos no consumo de referência.
- [x] Executar build da biblioteca e validar os exports gerados.

**Concluído quando:** o shell funciona com o CSS distribuído, nos dois temas e com sobrescrita suportada de tokens, sem exigir Tailwind na aplicação consumidora.

## 5. Storybook e documentação pública

- [x] Adicionar/completar stories cobrindo composição, temas, responsividade e customização por tokens para cada componente público.
- [x] Documentar API, responsabilidades e limites do Admin Shell.
- [x] Documentar que autenticação, autorização e roteamento pertencem à aplicação consumidora.
- [x] Revisar exemplos para garantir uso exclusivo de APIs públicas.

**Concluído quando:** um consumidor consegue descobrir a API e reproduzir o uso básico apenas pela documentação e exemplos públicos.

## 6. Consumo Next.js e admin demo

- [x] Integrar um exemplo do shell ao admin demo Next.js App Router usando apenas APIs públicas.
- [x] Validar que o demo importa a folha CSS compilada distribuída pela biblioteca.
- [x] Adicionar/atualizar teste de consumo do CSS compilado em Next.js sem scan do código-fonte interno da biblioteca.
- [ ] Verificar ausência de erro de hidratação introduzido pelo shell.
- [x] Confirmar que a aplicação continua responsável por links e roteamento.
- [ ] Executar build do admin demo.

**Concluído quando:** o admin demo funciona como consumidor externo real das APIs e do CSS compilado do design system.

## 7. E2E e qualidade final

- [x] Executar testes unitários em modo conciso; usar modo verboso equivalente somente para diagnóstico de falhas.
- [x] Executar lint e typecheck completos.
- [ ] Executar build completo dos workspaces aplicáveis.
- [ ] Executar `npm run test:e2e` e confirmar que nenhum teste E2E falha.
- [ ] Atualizar snapshots somente quando a mudança visual for intencional e revisada.
- [x] Executar Prettier nos arquivos alterados conforme a orientação do projeto.
- [x] Executar `npm run format` e corrigir todas as falhas.
- [x] Executar validação OpenSpec estrita antes do PR.

**Concluído quando:** todos os comandos obrigatórios passam e qualquer atualização visual de snapshot está explicitamente revisada.

## 8. Encerramento da change

- [x] Revisar implementação contra todos os requisitos do MVP e critérios da Issue #15.
- [x] Registrar limitações conhecidas e trabalhos futuros, se houver.
- [x] Confirmar que nenhuma dependência de runtime foi adicionada sem justificativa no `design.md`.
- [ ] Marcar todas as tasks obrigatórias concluídas somente após as validações finais.
- [ ] Arquivar a change conforme o processo OpenSpec do projeto após a implementação estar concluída.

**Concluído quando:** requisitos, implementação, documentação, testes e OpenSpec estão alinhados e a change está pronta para arquivamento.

## Pendências conhecidas de validação

- O `next build` compilou a aplicação, mas falhou depois na etapa interna de
  leitura de `tsc --showConfig` do Next.js; o comando `npx tsc --showConfig -p
apps/admin-demo/tsconfig.json` retorna JSON válido e o typecheck do workspace
  passa. A causa precisa ser resolvida antes de concluir a task de build.
- A suíte E2E não pôde iniciar o Chromium porque ele não existe no ambiente e o
  download solicitado por `npx playwright install chromium` retornou um arquivo
  inválido do proxy. Por isso não foram validados hidratação nem snapshots e a
  change permanece aberta.
