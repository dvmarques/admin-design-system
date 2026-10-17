## 1. PR 1 — Baselines Linux e snapshots na CI

- [x] 1.1 Criar o workflow `workflow_dispatch` de atualização de baselines (`ubuntu-latest`, `contents: write`, versão do Playwright fixada) e verificar que uma execução commita `*-chromium-linux.png` na branch informada
- [x] 1.2 Remover os 16 `*-chromium-win32.png` e verificar que `git ls-files e2e | grep win32` não retorna nada
- [x] 1.3 Remover `test.skip(Boolean(process.env.CI), …)` de `admin-demo.spec.ts`, `admin-demo-routes.spec.ts` e `data-display.spec.ts` e verificar com `grep` que nenhum skip por `CI` resta
- [x] 1.4 Gerar os baselines Linux pelo workflow, revisar o diff das imagens nos dois temas e verificar que `npm run test:e2e` (CI) passa sem snapshots pulados
- [x] 1.5 Atualizar `docs/quality.md` e `docs/limitations.md` (Linux único, fluxo de atualização, sem execução local, remoção das menções a `win32` e ao skip) e verificar que `grep -rn win32 docs openspec/specs` não restam referências inválidas
- [x] 1.6 Medir o tempo do job de E2E antes e depois e registrar em `docs/quality.md`
- [x] 1.7 Executar `npx prettier --write` nos arquivos alterados, `npm run format`, `npm run lint`, `npm run typecheck` e confirmar a CI verde da PR 1

## 2. PR 2 — Smoke cross-browser

- [x] 2.1 Adicionar os projetos `firefox` e `webkit` em `playwright.config.ts` restritos ao spec de smoke e verificar que `playwright test --list` mostra o smoke só neles
- [x] 2.2 Criar o spec de smoke para `/`, `/clientes` e `/componentes` (carregamento sem erro de console, hidratação por `waitForHydration`, navegação principal) usando `e2e/routes.ts`, com seletores por papel ARIA, e verificar que passa na CI em Firefox e WebKit
- [x] 2.3 Converter o job `Fluxos no navegador` em matrix `chromium | firefox | webkit` com `fail-fast: false`, instalando só o navegador do job, e verificar que os três checks aparecem na PR
- [x] 2.4 Atualizar `docs/quality.md` e `docs/limitations.md` (navegadores cobertos, WebKit Linux ≠ Safari, tempo de CI da matrix) e verificar a coerência com o spec
- [ ] 2.5 Adicionar os novos checks como required na proteção de `develop` (ação administrativa) e verificar nas configurações do repositório
- [x] 2.6 Executar `npx prettier --write`, `npm run format`, `npm run lint`, `npm run typecheck`, `openspec validate --all --strict` e confirmar a CI verde da PR 2

## 3. Encerramento

- [x] 3.1 Validar com `npx @fission-ai/openspec@1.10.0 validate --all --strict --no-interactive` e arquivar a change após a PR 2
