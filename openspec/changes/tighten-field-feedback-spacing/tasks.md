## 1. Composição compartilhada

- [x] 1.1 Ajustar gap e margens do AdsField e primitivas, preservando rótulo e ARIA; documentar no Storybook e changelog.
- [x] 1.2 Validar geometria com CSS compilado sem reset, temas, mobile, ajuda e erro longos, primitivas e token personalizado; conferir catálogo Next.js.

## 2. Integração e validação

- [ ] 2.1 Executar build, lint, typecheck, test:quality e test:e2e (sem falhas antes de commit); usar test:verbose e test:e2e:verbose somente para diagnóstico. Revisar snapshots afetados e atualizar apenas pelo workflow Linux update-visual-baselines.yml.
- [ ] 2.2 Formatar arquivos alterados com prettier --write, executar npm run format e openspec.cmd validate --all --strict; no fluxo completo pré-PR, npm run validate.
- [x] 2.3 Subir demo e Storybook no worktree para revisão local.

## Evidência de validação

- Revisão visual do demo aprovada pelo mantenedor; testes focalizados cobrem temas, mobile, mensagens longas, acessibilidade, scrollbar e largura compacta personalizada.
- Build completo, lint, typecheck, prettier, npm run format e OpenSpec estrito passaram.
- `npm run test:e2e -- --ignore-snapshots --workers=2` com E2E_DEV=1: 311 testes passaram no Windows. A opção ignora apenas comparações de imagem; os snapshots oficiais serão confirmados no Linux.
- `npm run validate` executado: a etapa test:quality encontra a falha preexistente de caminhos POSIX em scripts/ci-impact.test.mjs no Windows. Não alterar CI fora do escopo; confirmar qualidade na CI Linux.
- Pendente: workflow oficial de baselines Linux, revisão de seus diffs e CI completa no SHA da PR. Não marcar os gates como concluídos antes dessa evidência.
