## 1. Alinhamento da navegação

- [x] 1.1 Ajustar CSS desktop da composição sidebar-header sem alterar mobile, largura e área de seleção; documentar no Storybook, integração e changelog.
- [x] 1.2 Cobrir posição real dos ícones e avatar antes/depois, centro do destaque, grupos e item ativo, dois temas, scrollbar e tokens; validar consumo no demo e smoke/mobile.

## 2. Validação

- [x] 2.1 Executar build, lint, typecheck, test:quality e test:e2e; no fluxo pré-PR, npm run validate, sem falhas E2E antes de commit. Diagnóstico: test:verbose e test:e2e:verbose. Baselines visuais somente no workflow Linux update-visual-baselines.yml e após revisão.
- [x] 2.2 Formatar arquivos alterados com prettier --write e executar npm run format e openspec.cmd validate --all --strict; manter demo disponível.

## Evidência de validação

- Demo revisado e aprovado pelo mantenedor. Regressões cobrem temas, mobile, mensagens longas, contratos ARIA, scrollbar e largura compacta personalizada.
- Validação local: build completo, lint, typecheck, prettier, npm run format e OpenSpec estrito aprovados; 311 testes de navegador passaram no Windows sem comparação de imagens.
- Qualidade, artefatos, política de develop, Firefox e WebKit aprovados na [CI Linux](https://github.com/dvmarques/admin-design-system/actions/runs/40238389413). A falha preexistente de caminho POSIX em npm run validate no Windows não ocorre no Linux.
- [Workflow oficial de baselines Linux](https://github.com/dvmarques/admin-design-system/actions/runs/40239041757): 281 testes Chromium passaram ao gerar e outros 281 na confirmação sem atualização. Os 16 diffs de imagens foram revisados: alinhamento da sidebar e compactação de ajuda/erros; catálogo de componentes ficou 112 px mais curto. Nenhum baseline Windows aceito.
- Revisão independente pelo Claude Code CLI 2.1.304, somente leitura: PASS, sem achados acionáveis confirmados. Conferência final refutou a hipótese inicial sobre a posição da organização e confirmou a documentação explícita do gutter estável.
- Requisitos sincronizados com a spec principal e change arquivada conforme autorização do mantenedor; o squash depende da CI final da PR #206.
