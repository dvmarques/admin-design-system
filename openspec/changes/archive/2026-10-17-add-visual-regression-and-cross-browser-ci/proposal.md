## Why

Os baselines visuais existem só para `win32` e os testes de snapshot são
pulados na CI (Linux), então regressões visuais só aparecem se alguém rodar a
suíte localmente no Windows. Os E2E também rodam apenas em Chromium, sem sinal
de quebra em Firefox ou WebKit. O objetivo é tornar a regressão visual
verificada em toda PR e detectar incompatibilidades entre navegadores
(issue #86, filha do épico #85).

## What Changes

- Tornar o Linux a única fonte da verdade dos baselines visuais: remover os 16
  PNGs `*-chromium-win32.png` e versionar os equivalentes `*-chromium-linux.png`.
- Gerar os baselines Linux por um workflow `workflow_dispatch` em
  `ubuntu-latest`, que executa `--update-snapshots` e faz commit dos PNGs na
  branch da PR, sem execução local.
- Remover o `test.skip` por `CI` dos três specs de snapshot
  (`admin-demo`, `admin-demo-routes`, `data-display`), com tolerância zero.
- Adicionar projetos Firefox e WebKit ao Playwright com smoke tests em
  `/`, `/clientes` e `/componentes`: carregamento sem erros e hidratação, sem
  snapshots.
- Executar os navegadores em matrix paralela na CI, com os novos jobs como
  required checks.
- Medir e documentar o impacto no tempo de CI.
- Atualizar `docs/limitations.md` e `docs/quality.md` (incluindo as menções a
  `win32` e "sem baseline visual" dos componentes).
- Entrega em duas PRs sob esta mesma change: (1) baselines Linux e snapshots na
  CI; (2) smoke cross-browser.

**BREAKING** (apenas para contribuidores): os baselines `win32` deixam de
existir; a execução local dos snapshots no Windows deixa de ser suportada e
mudanças visuais passam pelo workflow de atualização.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `quality-assurance`: adiciona requisitos para execução dos snapshots visuais
  na CI com baselines Linux e para smoke tests em Firefox e WebKit.

## Impact

- **Pacotes e APIs públicas:** nenhum. Não afeta `@admin-ds/tokens`,
  `@admin-ds/components`, `@admin-ds/admin` nem o Storybook.
- **Aplicação de demonstração:** só os testes E2E em `e2e/` que a consomem; o
  código do `admin-demo` não muda.
- **Arquivos:** `playwright.config.ts`, `e2e/*.spec.ts` e seus diretórios de
  snapshots, `.github/workflows/ci.yml`, novo workflow de atualização de
  baselines, `docs/quality.md`, `docs/limitations.md` e o delta de spec em
  `openspec/specs/quality-assurance`.
- **Required checks:** novos checks por navegador precisam ser adicionados à
  proteção de `develop` (ação de administração do repositório fora do código).
- **Dependências:** nenhuma nova de runtime; apenas os navegadores Firefox e
  WebKit do Playwright já incluído.
- **Valor para consumidores:** menor risco de regressão visual e de
  incompatibilidade entre navegadores nas aplicações que consomem o pacote.

### Fora do escopo

- Snapshots em Firefox e WebKit.
- Novos snapshots para componentes sem baseline visual.
- Testes em dispositivos móveis reais ou emulação além dos viewports atuais.
- Container Docker do Playwright e execução local de snapshots.
- Retries e flakiness de testes existentes (issue #76).
