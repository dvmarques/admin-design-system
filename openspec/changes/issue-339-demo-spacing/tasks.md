# Tasks

## 1. Demo e Catálogo

- [ ] 1.1 Auditar rotas e ajustar espaçamentos compartilhados e atalhos; verificar alinhamento, semântica e funcionamento das páginas.
- [x] 1.2 Acrescentar testes Playwright para alinhamento, atalhos, teclado, temas e larguras; executar os testes pertinentes.
- [x] 1.3 Registrar a mudança no changelog e conferir documentação e contratos públicos inalterados.

## 2. Integração e revisão

- [ ] 2.1 Revisar visualmente rotas, temas, viewports 320/390/768/1440 e zoom real de 200%, foco e rolagem; revisar snapshots intencionais pelo workflow Linux.
- [ ] 2.2 Executar `npm run validate` (inclui lint, build, typecheck, test:quality e test:e2e) sem falhas; para diagnóstico usar `npm run test:verbose` ou `npm run test:e2e:verbose`.
- [ ] 2.3 Formatar arquivos alterados com Prettier e confirmar `npm run format` e `openspec.cmd validate --all --strict`.
