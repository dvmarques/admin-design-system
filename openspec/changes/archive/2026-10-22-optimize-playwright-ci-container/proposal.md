## Why

A matrix E2E instala repetidamente dependências de navegador por apt mesmo com
cache dos binários. Nos runs 39768760228 e 39771583007, downloads apt de WebKit
levaram de 19 a 31 minutos, enquanto os testes levaram segundos. A imagem
oficial pré-instalada pode reduzir esse custo, mas o pull e a preparação do
container também devem ser medidos.

## What Changes

- Executar Chromium, Firefox e WebKit na imagem oficial
  `mcr.microsoft.com/playwright:v1.62.0-noble`, alinhada ao lockfile.
- Eliminar cache de binários e instalação apt redundantes nos jobs migrados.
- Verificar a versão de Playwright instalada antes de executar testes.
- Preservar Node 24, npm 11.19.1, `npm ci --ignore-scripts`, builds e política
  Draft/docs-only.
- Documentar compatibilidade de snapshots, execução local e medição comparável
  de desempenho.

## Impact

- Apenas pipeline CI e documentação operacional. Nenhuma alteração de API
  pública, runtime, CSS ou snapshots.
- `apps/admin-demo` continua sendo compilado e servido via Next.js para o E2E.

## Out of Scope

- Atualizar Playwright, aceitar snapshots automaticamente ou diminuir cobertura.
- Mudar Tooltip/Popover/Dropdown ou criar runner/imagem customizada.
