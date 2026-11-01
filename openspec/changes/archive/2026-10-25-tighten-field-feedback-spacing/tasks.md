## 1. Composição compartilhada

- [x] 1.1 Ajustar gap e margens do AdsField e primitivas, preservando rótulo e ARIA; documentar no Storybook e changelog.
- [x] 1.2 Validar geometria com CSS compilado sem reset, temas, mobile, ajuda e erro longos, primitivas e token personalizado; conferir catálogo Next.js.

## 2. Integração e validação

- [x] 2.1 Executar build, lint, typecheck, test:quality e test:e2e (sem falhas antes de commit); usar test:verbose e test:e2e:verbose somente para diagnóstico. Revisar snapshots afetados e atualizar apenas pelo workflow Linux update-visual-baselines.yml.
- [x] 2.2 Formatar arquivos alterados com prettier --write, executar npm run format e openspec.cmd validate --all --strict; no fluxo completo pré-PR, npm run validate.
- [x] 2.3 Subir demo e Storybook no worktree para revisão local.

## Evidência de validação

- Demo revisado e aprovado pelo mantenedor. Regressões cobrem temas, mobile, mensagens longas, contratos ARIA, scrollbar e largura compacta personalizada.
- Validação local: build completo, lint, typecheck, prettier, npm run format e OpenSpec estrito aprovados; 311 testes de navegador passaram no Windows sem comparação de imagens.
- Qualidade, artefatos, política de develop, Firefox e WebKit aprovados na [CI Linux](https://github.com/dvmarques/admin-design-system/actions/runs/40238389413). A falha preexistente de caminho POSIX em npm run validate no Windows não ocorre no Linux.
- [Workflow oficial de baselines Linux](https://github.com/dvmarques/admin-design-system/actions/runs/40239041757): 281 testes Chromium passaram ao gerar e outros 281 na confirmação sem atualização. Os 16 diffs de imagens foram revisados: alinhamento da sidebar e compactação de ajuda/erros; catálogo de componentes ficou 112 px mais curto. Nenhum baseline Windows aceito.
- Revisão independente pelo Claude Code CLI 2.1.304, somente leitura: PASS, sem achados acionáveis confirmados. Conferência final refutou a hipótese inicial sobre a posição da organização e confirmou a documentação explícita do gutter estável.
- Requisitos sincronizados com a spec principal e change arquivada conforme autorização do mantenedor; o squash depende da CI final da PR #206.
