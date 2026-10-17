# Qualidade de componentes públicos

Um componente público só é considerado concluído quando possui API TypeScript,
CSS compilado, documentação no Storybook, testes de comportamento e verificações
de acessibilidade aplicáveis. Componentes interativos devem ser operáveis por
teclado, expor um nome acessível e manter foco visível.

## Vitest

O Vitest é o executor de testes do projeto. Ele executa testes de unidades,
componentes React e contratos públicos de pacotes.

- `vitest.config.ts` configura o ambiente de testes. O projeto usa `jsdom`
  para simular um navegador e localizar testes TypeScript e TSX nos pacotes.
- `vitest.setup.ts` prepara cada teste e inclui os matchers do Testing Library,
  permitindo asserções legíveis como `toHaveAttribute` e `toBeVisible`.

Exemplo:

```ts
expect(button).toHaveAttribute('aria-pressed', 'true');
```

## axe-core

`axe-core` é a ferramenta de auditoria automatizada de acessibilidade. Ela
analisa o HTML renderizado por componentes e identifica problemas comuns, como:

- botões sem nome acessível;
- campos de formulário sem label;
- imagens sem texto alternativo;
- atributos ARIA inválidos;
- erros de semântica e estrutura;
- parte das violações de contraste.

Ele complementa, mas não substitui, testes manuais com teclado, leitor de tela
e revisão visual. A suíte de primitivas usa verificações automatizadas de
acessibilidade para seus comportamentos públicos.

Exemplo conceitual:

```ts
import axe from 'axe-core';

const results = await axe.run(container);
expect(results.violations).toHaveLength(0);
```

## Playwright e testes end-to-end

O Playwright executa testes em navegadores reais: Chromium roda toda a suíte e
Firefox e WebKit rodam um smoke (ver abaixo).
Ele cobre comportamentos que o ambiente simulado do Vitest e JSDOM não reproduz
integralmente, como foco visível, navegação por teclado, CSS renderizado,
responsividade, hidratação do Next.js e fluxos completos entre componentes de
servidor e cliente.

[playwright.config.ts](../playwright.config.ts) define o endereço padrão da
aplicação e localiza os testes no diretório `e2e/`. Na CI, o Playwright instala
o Chromium em cada execução (com cache por versão).

Por padrão o E2E serve o build de produção do admin demo (`next start`), então
execute `npm run build` antes de rodar os testes. Para usar o servidor de
desenvolvimento (`next dev`, mais lento), defina `E2E_DEV=1`. Sem `E2E_DEV`, o
Playwright recusa um build ausente ou desatualizado: o build do admin demo grava
em `.next/e2e-build-stamp.json` uma impressão digital do código do demo, do
`dist` e do `package.json` dos pacotes, do `tsconfig.base.json` e do
`package-lock.json`, comparada antes dos testes.

```powershell
# Executar os testes end-to-end pela entrada oficial do repositório
npm run test:e2e

# Abrir o relatório visual da última execução
npx.cmd playwright show-report
```

### Snapshots visuais

Os snapshots visuais executam em toda execução de CI de Pull Request, sem
tolerância de diferença de pixels, e a única fonte da verdade são os baselines
Linux versionados (`*-chromium-linux.png`, ao lado de cada spec). Não há
baselines para outras plataformas e a execução local dos snapshots não é um
fluxo suportado.

Para aceitar uma mudança visual intencional:

1. Faça push da branch da PR.
2. Na aba Actions, execute o workflow "Atualizar baselines visuais"
   (`update-visual-baselines.yml`) escolhendo a branch da PR. Ele regenera os
   snapshots em `ubuntu-latest`, confirma que a suíte passa com os novos
   baselines e faz commit dos PNGs na branch.
3. Revise o diff das imagens na PR antes de aprovar; não aceite baselines apenas
   para eliminar uma falha.
4. O commit do workflow usa o `GITHUB_TOKEN` e, por isso, não dispara a CI da
   PR: faça um push adicional ou marque a PR como Draft e Ready for review para
   executar a verificação completa.

O workflow só roda em branches diferentes de `develop` e `master`.

### Preferências de acessibilidade

`e2e/accessibility-preferences.spec.ts` roda só em Chromium e emula movimento
reduzido, cores forçadas e maior contraste por estilo computado, sem snapshots.
O contraste dos tokens é verificado em `packages/tokens/tests/contrast.test.mjs`
a partir de uma lista central de pares (WCAG 2.2 AA, 4,5:1 para texto e 3:1 para
limites de controles, foco e indicadores). Detalhes em
[Acessibilidade visual dos estilos](visual-accessibility.md).

### Smoke em Firefox e WebKit

`e2e/smoke.spec.ts` roda nos três navegadores (projetos `chromium`, `firefox` e
`webkit` em `playwright.config.ts`); Firefox e WebKit executam só esse arquivo.
Ele cobre `/`, `/clientes` e `/componentes`: carregamento sem erros de console
nem de página (incluindo hidratação), hidratação do botão de tema e navegação
pelo menu principal. Não há snapshots nesses navegadores.

Na CI, cada navegador é um job paralelo e independente da matrix:
"Fluxos no navegador" (Chromium), "Fluxos no navegador (Firefox)" e "Fluxos no
navegador (WebKit)". O WebKit do Playwright no Linux detecta quebras de motor,
mas não garante paridade com o Safari. Para rodar um navegador isolado:
`npx playwright test --project=firefox`.

### Tempo de CI

Medido na CI (`ubuntu-latest`), no job "Fluxos no navegador". Antes da mudança
(`develop`, snapshots pulados): job de ~1 min 39 s, com ~40 s no passo do
Playwright. Depois (PR #96, 108 testes em Chromium com os snapshots ativos): job
de ~1 min 28 s, com ~43 s no passo do Playwright. O custo dos snapshots é de
cerca de 3 s por execução; a diferença total do job fica dentro da variação
entre runs.

Com a matrix (PR #97, primeira execução, com o cache dos navegadores ainda
frio), os jobs rodaram em paralelo: "Fluxos no navegador" (Chromium) em
~1 min 31 s, WebKit em ~1 min 27 s e Firefox em ~1 min 5 s, com o smoke levando
~5 s por navegador (4 testes). O tempo de relógio da CI não aumentou de forma
perceptível, porque os navegadores não rodam em série; os minutos totais de
runner crescem em cerca de 2 min 30 s por execução.

O diretório `e2e/` contém testes end-to-end com extensão `.spec.ts`. A suíte
atual valida o consumo público das primitivas no admin demo, a alternância de
tema pelo teclado, a ausência de erros de hidratação e snapshots dos temas
claro e escuro.

```text
e2e/
├── admin-demo.spec.ts
├── admin-demo-all-routes.spec.ts
├── admin-demo-routes.spec.ts
├── data-display.spec.ts
├── overlay.spec.ts
└── smoke.spec.ts
```

Os arquivos `e2e/axe.ts` e `e2e/routes.ts` são apoio compartilhado, não
testes: o primeiro injeta o `axe-core` da raiz na página (excluindo o
`nextjs-portal` do `next dev`) e o segundo lista as rotas do admin demo.

Esses testes abrem o admin de referência, alternam temas, validam controles por
teclado, verificam a ausência de divergências de hidratação e capturam
screenshots representativos dos temas claro e escuro.

## Checklist pré-PR

Esta é a referência humana para os comandos e a checklist de validação antes
do PR. As instruções para agentes ficam em `AGENTS.md` e os critérios de
changes ficam em `openspec/config.yaml`.

Antes de abrir ou atualizar um PR, execute todos os comandos abaixo na raiz e
confirme que não há falhas:

```powershell
npm run format
npm run lint
npm run build
npm run typecheck
npm run test:quiet
npm run test:e2e
```

O build vem antes de tipos e testes porque o admin demo importa os pacotes pelo
`dist`. O `.gitattributes` mantém o checkout em LF, inclusive no Windows com
`core.autocrlf=true`, para o `npm run format` passar sem ajuste local em um
checkout novo.

Uma working copy criada antes do `.gitattributes` continua com os arquivos em
CRLF mesmo após o `git pull`, e o `npm run format` falha;
`git add --renormalize .`, `git update-index --really-refresh` e `git checkout`
não resolvem. Execute uma única vez, na raiz:

```powershell
git status --short # precisa sair vazio
git rm --cached -r -q .
git reset --hard
```

A árvore precisa estar limpa: o `git reset --hard` descarta alterações não
commitadas. Faça commit ou `git stash` antes.

O comando `npm run validate` combina essa sequência de qualidade e também
executa o E2E após o build. Se uma alteração visual intencional modificar um
snapshot, revise o diff e atualize-o explicitamente com
`npm run test:e2e -- --update-snapshots`; não aceite snapshots apenas para
silenciar uma regressão. Os testes E2E devem preferir nomes acessíveis, funções
ARIA, identificadores semânticos e headings de seção estáveis a textos
editoriais incidentais.

Os comandos de teste da checklist usam saída concisa para reduzir ruído. Em
caso de falha, o processo ainda retorna código diferente de zero. Para
investigar com todos os detalhes, execute:

```powershell
npm run test:verbose
npm run test:e2e:verbose
```

## Formulários

A família de formulários possui cobertura adicional para os contratos de
campos nativos, estados de validação, associação de rótulos e descrições,
grupos de seleção e consumo do CSS compilado sem Tailwind na aplicação
consumidora. Os exemplos ficam em `apps/docs/src/form.stories.tsx` e no
admin demo.
