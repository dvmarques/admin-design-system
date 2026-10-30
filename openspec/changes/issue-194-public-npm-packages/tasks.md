## 1. Preparação e revisão

- [x] 1.1 Confirmar escopo com o mantenedor: MIT, Daniel Marques e quatro nomes públicos; distinguir #194, #195 e #198.
- [x] 1.2 Conferir estado das issues relacionadas e manifests na `develop`; classificar como Critical e registrar estratégia de migração.
- [x] 1.3 Executar `openspec.cmd list` e `openspec.cmd validate issue-194-public-npm-packages --strict` em checkout/worktree isolada antes do Apply.
- [x] 1.4 Revisar o planejamento após a validação e adaptar para novas dependências da `develop`.

## 2. Nomes, artefatos e contratos

- [x] 2.1 Renomear quatro manifests com acesso público; root e apps continuam privados e protegidos.
- [x] 2.2 Corrigir peers/dependências internas, imports, CSS, caminhos e subpaths em bibliotecas, apps, stories e exemplos; regenerar `package-lock.json` com npm fixado.
- [x] 2.3 Atualizar scripts de build, testes, CI, detecção de impacto, budgets e geração de API, sem renomear registros históricos indiscriminadamente.
- [x] 2.4 Auditar `exports`, tipos, `'use client'`, `sideEffects`, `files`, CSS compilado, manifests e metadados em cada pacote.
- [x] 2.5 Incluir a licença MIT aprovada e avisos de terceiros aplicáveis nos tarballs; conferir origem, copyrights e não vazamento de arquivos.
- [x] 2.6 Preservar `react-imask` como peer opcional do subpath e `highlighted-code` como dependência opcional independente, sem Shiki no bundle principal.

## 3. Empacotamento e consumo externo

- [x] 3.1 Implementar teste automatizado de quatro `npm pack --json`/tarballs, inventário e exclusão da raiz/apps.
- [x] 3.2 Instalar os quatro tarballs por `file:` em Next.js App Router fora dos workspaces, com peers resolvidos sem nomes não publicados no registry.
- [x] 3.3 Comprovar `exports`, `.d.ts`, CSS sem Tailwind no consumidor, Server/Client Components e hidratação em navegador real.
- [x] 3.4 Comprovar integração opcional de `highlighted-code`, isolamento de Shiki e subpath masked-input; medir budgets e regressões.
- [x] 3.5 Adicionar instrução mínima para migração dos quatro nomes e atualizar o changelog `[0.1.1] - Em andamento`; sem antecipar a documentação abrangente da #198.

## 4. Validação, revisão e PR

- [x] 4.1 Executar `npm run build`, `npm run typecheck`, testes de pacote, lint e verificadores focalizados; revisar resultados.
- [ ] 4.2 Executar `npm run validate`, `npm run test:e2e` e `openspec.cmd validate --all --strict` (ou comando Linux fixado) em ambiente com Node/npm corretos; registrar checks skipped e limitações.
- [x] 4.3 Formatar arquivos alterados com Prettier e comprovar `npm run format` sem erros; não aceitar snapshots sem diferenças intencionais revisadas.
- [ ] 4.4 Preparar PR Draft para `develop` com evidências, riscos, issue e change; usar Ready só após validações locais completas.
- [ ] 4.5 Solicitar revisão independente, conferir CI no SHA final, completar tasks e OpenSpec antes de archive; não efetuar merge sem aprovação humana.

## Evidências estáticas da preparação anterior

- GitHub na PR #264: quatro manifests com `private: false`, `publishConfig.access: public`, MIT e copyright de Daniel Marques; raiz/apps verificados com `private: true`.
- Arquivos LICENSE.md idênticos ao canônico nos quatro pacotes; nomes novos e links do lockfile conferidos por leitura/parse JSON.
- Migração antiga → nova registrada para quatro pacotes e smoke adicionado à CI Chromium, sem npm publish.
- O script novo foi verificado apenas sintaticamente por inspeção JS (não executado como smoke).
- A develop avançou pela #259; reconciliação concluída por merge sem descartar código da #259 (commit `1d4836bd`).

## Validação local em 30/10/2026

- Windows, Node 24.21.0, npm 11.19.1 e OpenSpec 1.15.0; lockfile regenerado e `npm ci --ignore-scripts` executado.
- `npm run build`, lint, typecheck, 1.500 testes Vitest, testes Node e release, inspeção de pacotes e budgets, peer opcional e `verify:distribution` passaram. Testes de CI: 95 passaram e 18 foram pulados.
- Os quatro tarballs foram instalados juntos em Next.js externo; tipos, build, CSS, interação e hidratação passaram. O cenário principal não inclui Shiki; o teste do peer cobre ausência de `react-imask` e subpath com o peer instalado.
- `openspec.cmd validate --all --strict`: 62 itens passaram.
- `npm run validate` chegou ao E2E: 497 passaram, 1 pulado e 9 falharam pela ausência dos snapshots Chromium `win32`; as referências do projeto são Linux. Docker e WSL não estão disponíveis. Os arquivos gerados automaticamente foram removidos, sem atualizar baselines. A execução Linux foi solicitada na CI antes da conclusão.
- Inspeção de budgets passou com os limites anteriores: dist 612.049 B, JS/CSS 264.247 B e gzip 79.735 B; confirmar na CI Linux.
