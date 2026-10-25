## 1. Alinhamento da navegação

- [x] 1.1 Ajustar CSS desktop da composição sidebar-header sem alterar mobile, largura e área de seleção; documentar no Storybook, integração e changelog.
- [x] 1.2 Cobrir posição real dos ícones e avatar antes/depois, centro do destaque, grupos e item ativo, dois temas, scrollbar e tokens; validar consumo no demo e smoke/mobile.

## 2. Validação

- [ ] 2.1 Executar build, lint, typecheck, test:quality e test:e2e; no fluxo pré-PR, npm run validate, sem falhas E2E antes de commit. Diagnóstico: test:verbose e test:e2e:verbose. Baselines visuais somente no workflow Linux update-visual-baselines.yml e após revisão.
- [x] 2.2 Formatar arquivos alterados com prettier --write e executar npm run format e openspec.cmd validate --all --strict; manter demo disponível.

## Evidência de validação

- Revisão visual do demo aprovada pelo mantenedor; testes focalizados cobrem temas, mobile, mensagens longas, acessibilidade, scrollbar e largura compacta personalizada.
- Build completo, lint, typecheck, prettier, npm run format e OpenSpec estrito passaram.
- `npm run test:e2e -- --ignore-snapshots --workers=2` com E2E_DEV=1: 311 testes passaram no Windows. A opção ignora apenas comparações de imagem; os snapshots oficiais serão confirmados no Linux.
- `npm run validate` executado: a etapa test:quality encontra a falha preexistente de caminhos POSIX em scripts/ci-impact.test.mjs no Windows. Não alterar CI fora do escopo; confirmar qualidade na CI Linux.
- Pendente: workflow oficial de baselines Linux, revisão de seus diffs e CI completa no SHA da PR. Não marcar os gates como concluídos antes dessa evidência.
