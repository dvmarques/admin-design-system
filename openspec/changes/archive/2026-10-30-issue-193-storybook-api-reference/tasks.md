## 1. Preparação e contrato

- [x] 1.1 Revisar #193, #196, #151, AGENTS.md, specs e a matriz de cobertura; verificar a versão do Storybook.
- [x] 1.2 Validar a change com OpenSpec estrito em checkout/worktree isolada. A branch remota foi criada, mas não substitui worktree.
- [x] 1.3 Comparar os exports atuais à matriz da #151, com exceções justificadas: 78/78 exports públicos de UI após corrigir a omissão de `AdsAlert`.

## 2. Geração de documentação

- [x] 2.1a Configurar `@storybook/addon-docs` 10.5.5, `react-docgen-typescript`, geração MDX e dependências exclusivamente de desenvolvimento no manifest/lockfile.
- [x] 2.1b Executar `npm ci` com o lockfile, confirmar compatibilidade e build reproduzível; regenerar o lockfile com npm oficial se necessário.
- [x] 2.2a Implementar gerador por export visual da matriz, utilizando as stories existentes, sem substituir exemplos do catálogo.
- [x] 2.2b Confirmar que a geração cria as 78 páginas reais e que cada uma é indexada, navegável e carregada no Storybook.
- [x] 2.3a Implementar extração conservadora de tipos/obrigatoriedade/defaults literais, fontes explícitas e notas especiais; incluir partes públicas de Shell, Dropdown, Accordion e SmartTable.
- [x] 2.3b Conferir visualmente e corrigir, componente a componente, a fidelidade dos valores padrão, variantes, estados, acessibilidade, tabelas e exemplos **no build executado**.
- [x] 2.4 Atualizar matriz da #151, guia `docs/storybook-api-reference.md` e `CHANGELOG.md`.

## 3. Testes de saída e publicação

- [x] 3.1 Substituir teste vazio por asserções do `storybook-static/index.json`, matriz, páginas MDX, tabelas e exemplos, detectando ausência de exports.
- [x] 3.2a Implementar smoke Playwright para páginas de documentação de Button, SmartTable, AdminShell e InputGroup e troca light/dark.
- [x] 3.2b Executar e ajustar o smoke no navegador real, validar teclado, foco, tabelas e exemplos carregados.
- [x] 3.3a Preservar o link do demo para o Storybook (#189) e criar verificações do subcaminho `/admin-design-system/storybook/`.
- [x] 3.3b Executar os testes do site Pages para confirmar assets, navegação, temas e rotas reais.
- [x] 3.4 Incluir novos exports integrados em `develop` no inventário e na geração sem implementar componentes futuros: `AdsAlert` corrigido na matriz.

## 4. Validação e PR

- [x] 4.1 Executar `npm run build`, `npm run typecheck`, testes focalizados e o Storybook real; inspecionar exemplos e diferenças intencionais.
- [x] 4.2 Executar `npm run validate` e `openspec.cmd validate --all --strict`; registrar resultados, falhas e checks dispensados. Snapshots só com diff intencional revisado.
- [x] 4.3a Criar branch `feat/193-storybook-api-reference`, registrar a change e abrir a PR #261 para `develop`, em Draft.
- [x] 4.3b Executar Prettier nos arquivos alterados, `npm run format` e revisar o diff já formatado.
- [x] 4.4 Após validação comprovada, marcar PR Ready, inspecionar CI do SHA atual, corrigir findings e solicitar revisão humana; não efetuar merge nem archive sem autorização.

## Evidências verificadas e correções da revisão

- Confronto estático dos índices runtime e da matriz: 78 exports visuais/78 linhas, zero ausentes ou extras, incluindo `AdsAlert`.
- Foram inspecionados os 32 arquivos `*.stories.tsx` existentes: todos exportam stories declaradas; esses arquivos permanecem inalterados, exceto os metadados de Button, AdminShell e SmartTable.
- Corrigido o uso de `as const` no AST de `catalogEntries`, que antes descartava as descrições reais. A geração falha quando falta uma descrição.
- Tabelas de propriedades passaram de pipes Markdown (GFM não garantido) para `<table>` MDX, compatível com o Storybook; testes reforçados com descrição real, tabela e defaults de Button.
- Defaults agora são coletados apenas de parâmetros tipados do componente e seus contratos, não de qualquer função do módulo. Tipos das partes compostas foram incluídos.
- Os testes foram **escritos e enviados**, mas **não executados**. Nenhum resultado de CI, build, formato, OpenSpec ou Playwright foi inferido a partir de inspeção estática.
- `git ls-remote` da sessão não conseguiu resolver `github.com` no container; acesso remoto ao código aconteceu via GitHub conectado. Não foi possível realizar checkout/worktree nem instalar dependências.

## Limites ainda bloqueantes

- Executar instalação e regeneração oficial do lockfile, build Storybook, testes, lint/tipos/formato, OpenSpec estrito e E2E do Pages.
- Verificar os exemplos, tema e as tabelas das 78 páginas no navegador e ajustar falhas detectadas.
- PR permanece Draft; archive, merge e fechamento da issue ficam pendentes.

## Execução real (30/10/2026, Node 22.22/npm 10.9 no container; o projeto pede Node 24/npm 11.19.1)

- Passaram: `npm ci`, `npm run build`, `npm run lint`, `npm run format`, `npm run typecheck`, `npm run verify:optional-peer`, `npm run test:quality`, testes Node do docs (6/6), E2E Pages (30/30) e varredura das 78 páginas em light/dark sem erros de console/rede.
- Corrigido na revisão: exemplo errado de `AdsButton`, entidades em código inline, `AdsDatePicker`/`AdsCard` sem props, heading dos testes, variantes/estados/acessibilidade derivados dos tipos.
- `npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive` (mesmo comando da CI): 62 itens, 0 falhas, incluindo esta change.
- 4.2: o `npm run validate` completo não roda neste container (E2E principal com 25 falhas ambientais: headless shell ausente e snapshots). Evidência: cada etapa do `validate` e o OpenSpec estrito passaram na CI do SHA `ae5c8f6` (Qualidade rápida, Artefatos de distribuição, Política de develop, Fluxos no navegador em Chromium, Firefox e WebKit). O Chromium falhou uma vez em `admin-demo.spec.ts:204` (alinhamento do logo, arquivo fora desta change) e passou no re-run único do job.
- 4.4: PR Ready, CI verde no SHA `ae5c8f6` e revisão humana concluída pelo responsável.
- Limitação do tema: o decorator aplica o tema aos exemplos (Canvas), não ao corpo MDX.
