## SHAs desta revisão

| Papel                                       | SHA                                        | Observação                                                                                               |
| ------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| **Código / CI**                             | `452283bc9d94a0a6ac78c71c69d174a141600b06` | Último commit com alteração de implementação (demo/CSS). Gates automatizados verificados aqui.           |
| **HEAD final (docs OpenSpec + inventário)** | `5054acf` (completo após push)             | Commits só de documentação/evidências; **não** redefinem o veredito de CI já obtido no SHA de código/CI. |

## Contexto e decisão (#318; épico #315)

Change OpenSpec ativa: `openspec/changes/issue-318-responsive-layout` (não arquivar). Perfil **Critical** pela alteração de CSS público. Comparadas (A) CSS Grid/Flexbox nativo documentado, (B) quatro classes CSS `ads-layout-*` e (C) primitivas React `AdsContainer/Grid/GridItem/Stack`; escolhida **B apoiada em A**. Os componentes React seriam wrappers e props especulativas; a solução nova é só CSS opt-in, sem Tailwind no consumidor, dependências, tokens globais ou mudança de exports JS/TS.

## Implementação

- `packages/components/src/styles.css`: `ads-layout-container`, `ads-layout-stack`, `ads-layout-grid`, `ads-layout-cluster`, com gaps tokenizados, minmax/auto-fit, min-width 0, propriedades lógicas para RTL e isolamento em `@layer components`.
- Consulta: layout/ações responsivas e tabela rolável localmente, sem card obrigatório.
- Formulário: campos em grid responsivo e ações de validação; dashboard: indicadores e grid aninhado com H4s adequados.
- Storybook: exemplos da #317 passaram a exercitar classes distribuídas e possuem nova story de grid aninhado com conteúdo longo.
- Testes: CSS compilado, E2E 320/390/768/1440 em dois temas, axe, teclado, RTL, reflow simulado e capturas de auditoria visual opt-in.
- Docs: `docs/responsive-layout.md`, README, docs de composição, catálogo, changelog, `docs/visual-audit-inventory.md` (três rotas #318 em **Pendente**) e OpenSpec.

## Compatibilidade e limites

`AdsAdminShell`, `AdsPageHeader`, `AdsCard`, `AdsSurface`, `AdsDashboardGrid` e `AdsSmartTable` preservados. Classes são aditivas; consumidores que não as usam não mudam. CSS compilado não depende do Tailwind consumidor; sem duplicação do dashboard especializado. Nenhuma alteração permanente em workflows, snapshots ou aplicativos externos. Dois budgets CSS foram alterados apenas após medição real: JS/CSS publicado de components 305.000→305.200 B, cenário admin-public CSS gzip 15.400→15.450 B; os demais tetos permanecem iguais.

## Validação e revisão

**Verificação no SHA de código/CI `452283bc9d94a0a6ac78c71c69d174a141600b06`:** [CI #43752585078](https://github.com/dvmarques/admin-design-system/actions/runs/43752585078): qualidade rápida aprovada (format, lint, build, typecheck, testes Node, Vitest **1.583/1.583**, cobertura); política de develop/OpenSpec strict **71/71**; artefatos de distribuição e orçamentos aprovados; Firefox **26** testes, WebKit **25**, Chromium shard 2/2 **253** testes, Chromium shard 1/2 **261/261** testes, aprovados. O agregador oficial `Fluxos no navegador` concluiu **success**. CI completa **success**. [Security #43752584975](https://github.com/dvmarques/admin-design-system/actions/runs/43752584975): CodeQL, Gitleaks e npm audit passaram. [Pages #43752584972](https://github.com/dvmarques/admin-design-system/actions/runs/43752584972): build passou; publicação pulada em PR, conforme previsto.

**Verificação no HEAD de documentação anterior `de561ad` (somente tasks OpenSpec):** [CI #43754770088](https://github.com/dvmarques/admin-design-system/actions/runs/43754770088), [Security #43754770110](https://github.com/dvmarques/admin-design-system/actions/runs/43754770110) e [Pages #43754770029](https://github.com/dvmarques/admin-design-system/actions/runs/43754770029) também **success** no mesmo diff de implementação.

**Auditoria visual:** [24/24 capturas automatizadas](https://github.com/dvmarques/admin-design-system/actions/runs/43751285029/artifacts/14176183377), 3 rotas × 2 temas × 4 larguras, concluídas em SHA `ca6b042` (anterior ao último ajuste de seletor CSS local). Inspeção das capturas identificou H1 com letra órfã em 320px, corrigido retirando gutter duplo, revalidado em capturas posteriores. A auditoria completa de todo catálogo (#152) não foi executada nesta rodada. **Pendência humana:** aceite visual, zoom nativo 200% e leitor de tela. Viewport reduzida não prova zoom real.

## Vínculos e restrições

Issue **#318**, épico **#315**, referência de composição **#317**. Não usar `Closes #318` antes do aceite humano. **Não fazer merge, archive OpenSpec nem fechar #318/#315**.

## Checklist

- [x] Decisão arquitetural comparada e documentada
- [x] Branch, OpenSpec, implementação CSS, exemplos, testes e docs versionados
- [x] Verificações oficiais executadas e aprovadas no SHA de código/CI
- [x] Medida real de bundle/gzip antes/depois
- [x] Auditoria visual focalizada inspecionada (aceite humano pendente)
- [ ] Revisão humana (zoom 200% real e leitor de tela)
- [ ] Aprovação para merge posterior (não autorizada nesta execução)

## Revisão técnica e impacto medido (#318)

Comparação do mesmo toolchain Node 24.22.2/npm 11.19.1, Ubuntu, `develop` [SHA 8ff38e1 / CI #43744007350](https://github.com/dvmarques/admin-design-system/actions/runs/43744007350/job/132903194588) versus PR [SHA 3087fd7 / CI #43750739423](https://github.com/dvmarques/admin-design-system/actions/runs/43750739423/job/132923973759): pacote `components` JS/CSS **304.361→305.176 B (+815 B, +0,27%)**, gzip **91.473→91.657 B (+184 B, +0,20%)**; cenários JavaScript inalterados. Cenário `admin-public` CSS gzip **15.272→15.434 B (+162 B)**. Métricas documentadas em `docs/bundle-measurement.md`.

Problemas corrigidos no code review e CI: formatação oficial de 10 arquivos; overflow de grid aninhado a 195px; duplicação de gutter e H1 com letra órfã em 320px; uso de seletores `.ads-field` e `.ads-layout-stack` da biblioteca dentro do CSS da demo (detecção pelo teste de consumo público), substituídos por classe local `demo-semantic-filter-field` e descendentes nativos sem alterar o botão de limpar. Workflows temporários de validação foram removidos; nenhuma mudança em workflow original.
