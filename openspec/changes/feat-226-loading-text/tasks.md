# Tasks: AdsLoadingText

## 1. Contrato e biblioteca
- [ ] 1.1 Revisar padrões de componentes e fixar API `AdsLoadingText`, documentação de tipos e export público.
- [ ] 1.2 Implementar apresentação estática/animada, velocidades, polimorfismo e atributos HTML sem dependências novas.
- [ ] 1.3 Adicionar CSS `ads-` distribuível com tokens, temas, movimento reduzido e forced colors.

## 2. Testes e demonstrações
- [ ] 2.1 Testar estados loading, velocidades, tag, className, atributos e conteúdo multilinha/SSR.
- [ ] 2.2 Testar acessibilidade e comportamento de CSS, inclusive reduced motion, forced colors e contraste.
- [ ] 2.3 Criar story Storybook e exemplos no catálogo/Admin Demo sem importar caminhos internos.
- [ ] 2.4 Verificar consumo do CSS compilado e pacote em aplicação Next.js, além do impacto no bundle.

## 3. Documentação e qualidade
- [ ] 3.1 Documentar API, usos, limitações e distinção de Spinner/Skeleton; atualizar `CHANGELOG.md` na seção `0.1.1`.
- [ ] 3.2 Revisar implementação e corrigir problemas encontrados, mantendo spec/design sincronizados.
- [ ] 3.3 Executar formatação dos arquivos alterados e `npm run format`.
- [ ] 3.4 Executar `npm run validate`, incluindo lint, build, typecheck, qualidade e `npm run test:e2e` sem falhas antes do commit final.
- [ ] 3.5 Executar `openspec.cmd validate --all --strict`; registrar evidências e pendências reais, sem marcar como concluídas verificações não executadas.
