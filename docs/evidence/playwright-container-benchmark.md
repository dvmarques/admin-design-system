# Benchmark histórico — Playwright em container (#171)

Registro do experimento de migração, preservado da seção de benchmark de `docs/playwright-ci-container.md` na revisão documental #197 (25/10/2026). A proveniência por run está nos URLs abaixo; versões/ambiente no [guia vigente](../playwright-ci-container.md). Os resultados de commits e suítes diferentes não estabelecem ganho causal nem desempenho atual.

## Benchmark antes/depois

Os valores abaixo são calculados a partir do primeiro e último timestamp de cada log de job no GitHub Actions. Incluem a preparação do runner/container, checkout, dependências, builds e testes, mas não o tempo de espera em fila. O cache de imagem e npm não pode ser classificado com segurança como frio ou quente pelos dados disponíveis.

### Jobs anteriores à migração (host `ubuntu-latest`)

- [Run 39768760228](https://github.com/dvmarques/admin-design-system/actions/runs/39768760228): Chromium 4min23s (181 testes), Firefox 11min49s (10 testes), WebKit 20min24s (10 testes).
- [Run 39771583007](https://github.com/dvmarques/admin-design-system/actions/runs/39771583007): Chromium 1min57s (181 testes), Firefox 1min26s (10 testes), WebKit 32min58s (10 testes).

### Jobs após migração (container oficial Playwright)

- [Run 39787750701](https://github.com/dvmarques/admin-design-system/actions/runs/39787750701): Chromium 2min35s (167 testes, passou), WebKit 1min42s (10 testes, passou), Firefox 1min31s (falhou por `HOME`).
- [Run 39789421161](https://github.com/dvmarques/admin-design-system/actions/runs/39789421161): Chromium 2min12s (167 testes, passou), WebKit 1min18s (10 testes, passou), Firefox 1min16s (falhou por `HOME`).
- [Run 39790016962](https://github.com/dvmarques/admin-design-system/actions/runs/39790016962): Chromium 2min14s (167 testes, passou), Firefox 1min18s (10 testes, passou), WebKit 1min20s (10 testes, passou).

- [Run 39791463329](https://github.com/dvmarques/admin-design-system/actions/runs/39791463329): Chromium 2min02s (167 testes, passou), Firefox 1min23s (10 testes, passou), WebKit 1min18s (10 testes, passou).

### Medianas observadas e limites

- **Chromium:** mediana host ~3min10s (2 jobs) e container ~2min13s (4 jobs). A contagem difere (181 antes, 167 depois) porque os runs anteriores incluíam os 14 E2E de posicionamento da #167, ainda ausentes na base `develop` dos runs migrados; por isso a diferença não pode ser atribuída exclusivamente ao container.
- **WebKit:** mediana host ~26min41s (2 jobs) e container ~1min19s (4 jobs). A amostra é pequena, e a instalação via apt apresentou grande variação no host.
- **Firefox:** mediana host ~6min38s (2 jobs). Container: mediana ~1min21s (2 jobs aprovados, após correção do `HOME`).

O pull da imagem não aparece como etapa independente: a medição usa a duração total do job. Sem instrumentação adicional não é possível separar com precisão download da imagem, inicialização e cache. As execuções são de commits diferentes e não controlam carga do runner. A amostragem mínima de duas execuções aprovadas por browser foi atingida. As condições de cache permanecem não classificáveis com precisão pelos logs disponíveis; esta é uma limitação explícita do benchmark, não uma medição de cache frio/quente. Não extrapolar percentuais de economia como prova causal.
