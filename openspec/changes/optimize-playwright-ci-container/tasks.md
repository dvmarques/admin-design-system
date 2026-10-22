## 1. Análise

- [x] 1.1 Revisar CI, Playwright config, lockfile e documentação.
- [x] 1.2 Definir imagem exata e riscos de snapshots, Node/npm, rede e permissões.

## 2. Implementação

- [x] 2.1 Migrar matrix E2E para container oficial, preservando gates e builds.
- [x] 2.2 Remover instalação apt e cache de browsers redundantes.
- [x] 2.3 Adicionar verificação de versão da imagem/lockfile.
- [x] 2.4 Atualizar documentação operacional e changelog.

## 3. Validação

- [x] 3.1 Validar OpenSpec strict, format, lint, build, typecheck e quality.
- [x] 3.2 Confirmar execução real dos três browsers na CI, inclusive snapshots Chromium sem atualização automática.
- [ ] 3.3 Medir antes/depois em runs comparáveis, incluindo pull/start do container e cache frio/quente; registrar mediana e limitações.
- [x] 3.4 Revisar PR, corrigir achados e encaminhar para code review.
