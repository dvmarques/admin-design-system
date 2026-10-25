# Tasks — issue #147

## Biblioteca

- [x] Inspecionar AdsField, inputs e exports; definir API inicial consistente.
- [x] Implementar primeira versão de AdsPasswordInput, alternância, foco, teclado nativo e estados (ainda sem validação executada).
- [x] Implementar feedback opcional de regras e força com acessibilidade.
- [x] Atualizar exports, tipos e CSS compilado sem regressões.

## Catálogos

- [x] Integrar menu e página ao Admin Demo no padrão atual, com exemplos padrão, visibilidade, erro, desabilitado e força.
- [x] Criar stories Storybook para os estados atualmente implementados (padrão, erro, desabilitado).
- [x] Documentar API e atualizar CHANGELOG.md na seção 0.1.1 em andamento.

## Verificação

- [x] Criar testes unitários, de teclado, leitor de tela e estados.
- [x] Validar CSS compilado em consumidor Next.js e responsividade/temas.
- [x] Executar typecheck, lint, build, testes e revisão de acessibilidade.
- [x] Executar npm run test:e2e sem falhas; atualizar snapshots somente se mudanças visuais intencionais forem revisadas.
- [x] Executar formatação nos arquivos alterados e npm run format.
- [x] Executar `openspec validate --all --strict` (54 itens, 0 falhas).
- [x] Revisar diff e corrigir problemas antes de abrir PR para develop.

## Validação registrada

- Build, typecheck, lint, format, testes unitários (1080) e E2E completo no Chromium (251) sem falhas.
- Revisão de acessibilidade e de contrato público por subagentes; achados corrigidos.
- Verificação visual nos temas claro e escuro e a 390 px sem overflow; CSS compilado consumido pelo Admin Demo (Next.js).
