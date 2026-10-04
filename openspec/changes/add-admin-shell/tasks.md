# Tasks — add-admin-shell

## 1. Levantamento e API

- [ ] Revisar componentes públicos existentes de navegação, overlay e layout que possam ser reutilizados.
- [ ] Definir a API pública final do Admin Shell e de suas regiões sem acoplamento a Next.js.
- [ ] Confirmar breakpoints, tokens de espaçamento e comportamento responsivo com a fundação existente.

## 2. Estrutura do Admin Shell

- [ ] Implementar a estrutura principal reutilizável do shell.
- [ ] Implementar/compor a região de header.
- [ ] Implementar/compor a região de sidebar.
- [ ] Implementar a região principal de conteúdo.
- [ ] Garantir que identidade, ações, navegação e conteúdo sejam fornecidos por composição.

## 3. Responsividade e acessibilidade

- [ ] Implementar comportamento de sidebar persistente em viewport ampla.
- [ ] Implementar navegação acionável em viewport reduzida.
- [ ] Garantir controle por teclado e atributos ARIA adequados.
- [ ] Garantir que conteúdo oculto não permaneça interativo.
- [ ] Validar landmarks, foco, contraste e ordem de navegação.

## 4. Integração visual e API pública

- [ ] Reutilizar tokens e componentes públicos existentes antes de introduzir novas abstrações.
- [ ] Validar temas claro e escuro.
- [ ] Exportar todos os elementos necessários pelas entradas públicas do pacote.
- [ ] Adicionar teste que impeça dependência de imports internos no consumo de referência.

## 5. Documentação e demonstração

- [ ] Adicionar stories do Admin Shell cobrindo composição e estados relevantes.
- [ ] Demonstrar comportamento responsivo no Storybook.
- [ ] Integrar um exemplo do shell ao admin demo usando apenas APIs públicas.
- [ ] Atualizar documentação pública necessária para descoberta e uso do shell.

## 6. Testes e qualidade

- [ ] Adicionar testes de renderização e composição.
- [ ] Adicionar testes do comportamento responsivo.
- [ ] Adicionar testes de acessibilidade e teclado.
- [ ] Atualizar/revisar snapshots E2E somente quando a mudança visual for intencional.
- [ ] Executar formatação, lint, typecheck, testes, build e E2E conforme `docs/quality.md`.
- [ ] Executar validação OpenSpec estrita antes do PR.

## 7. Encerramento da change

- [ ] Revisar implementação contra os critérios da Issue #15.
- [ ] Marcar todas as tasks concluídas após validação.
- [ ] Arquivar a change conforme o processo OpenSpec do projeto quando a implementação estiver concluída.
