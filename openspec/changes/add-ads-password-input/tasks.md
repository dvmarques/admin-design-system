# Tasks — issue #147

## Biblioteca
- [x] Inspecionar AdsField, inputs e exports; definir API inicial consistente.
- [x] Implementar primeira versão de AdsPasswordInput, alternância, foco, teclado nativo e estados (ainda sem validação executada).
- [ ] Implementar feedback opcional de regras e força com acessibilidade.
- [ ] Atualizar exports, tipos e CSS compilado sem regressões.

## Catálogos
- [ ] Integrar menu e página ao Admin Demo no padrão atual, com exemplos padrão, visibilidade, erro, desabilitado e força.
- [x] Criar stories Storybook para os estados atualmente implementados (padrão, erro, desabilitado).
- [ ] Documentar API e atualizar CHANGELOG.md na seção 0.1.1 em andamento.

## Verificação
- [ ] Criar testes unitários, de teclado, leitor de tela e estados.
- [ ] Validar CSS compilado em consumidor Next.js e responsividade/temas.
- [ ] Executar typecheck, lint, build, testes e revisão de acessibilidade.
- [ ] Executar npm run test:e2e sem falhas; atualizar snapshots somente se mudanças visuais intencionais forem revisadas.
- [ ] Executar formatação nos arquivos alterados, npm run format e openspec validate --all --strict.
- [ ] Revisar diff e corrigir problemas antes de abrir PR para develop.

## Progresso parcial registrado
- [x] Export público e tipos adicionados (CSS compilado e regressões ainda não verificados).
- [x] Entrada do componente e demonstrações iniciais adicionadas ao Admin Demo (indicador de força pendente).
- [x] Changelog 0.1.1 atualizado (documentação de API pendente).
- [x] Arquivo de testes unitários iniciais criado (execução, teclado e leitor de tela pendentes).
- [x] Snippet inicial de PasswordInput incluído no JSON do catálogo (equivalência com gerador ainda não validada).
