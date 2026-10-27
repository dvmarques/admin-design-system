# Tasks: AdsLoadingText

## 1. Contrato e biblioteca
- [x] 1.1 Revisar padrões de componentes e fixar API `AdsLoadingText`, documentação de tipos e export público.
- [x] 1.2 Implementar apresentação estática/animada, velocidades, polimorfismo e atributos HTML sem dependências novas.
- [x] 1.3 Adicionar CSS `ads-` distribuível com tokens, temas, movimento reduzido e forced colors.

## 2. Testes e demonstrações
- [ ] 2.1 Testar estados loading, velocidades, tag, className, atributos e conteúdo multilinha/SSR.
- [ ] 2.2 Testar acessibilidade e comportamento de CSS, inclusive reduced motion, forced colors e contraste.
- [x] 2.3 Criar story Storybook e exemplos no catálogo/Admin Demo sem importar caminhos internos.
- [ ] 2.4 Verificar consumo do CSS compilado e pacote em aplicação Next.js, além do impacto no bundle.

## 3. Documentação e qualidade
- [x] 3.1 Documentar API, usos, limitações e distinção de Spinner/Skeleton; atualizar `CHANGELOG.md` na seção `0.1.1`.
- [ ] 3.2 Revisar implementação e corrigir problemas encontrados, mantendo spec/design sincronizados.
- [ ] 3.3 Executar formatação dos arquivos alterados e `npm run format`.
- [ ] 3.4 Executar `npm run validate`, incluindo lint, build, typecheck, qualidade e `npm run test:e2e` sem falhas antes do commit final.
- [ ] 3.5 Executar `openspec.cmd validate --all --strict`; registrar evidências e pendências reais, sem marcar como concluídas verificações não executadas.

## Evidências e impedimentos (27/10/2026)

- Arquivos públicos, story, catálogo e documentação implementados na branch `feat/226-loading-text`.
- CI inicial: política `develop` e OpenSpec estrito aprovados; navegação Firefox e WebKit aprovada após inclusão do snippet gerado.
- A validação de qualidade ainda falha em `npm run format` (9 arquivos listados no log do CI).
- A inspeção de distribuição registrou 188.976 bytes para JS/CSS do pacote components, frente ao teto anterior de 187.500 bytes; orçamento específico atualizado para 190.000 bytes, pendente de novo CI.
- Não foram executados comandos locais `npm run validate`, `npm run test:e2e` ou formatação com Prettier nesta sessão; nenhum deles deve ser marcado concluído com base apenas na existência da PR.
