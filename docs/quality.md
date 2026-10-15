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

O Playwright executa testes em um navegador real — neste projeto, Chromium.
Ele cobre comportamentos que o ambiente simulado do Vitest e JSDOM não reproduz
integralmente, como foco visível, navegação por teclado, CSS renderizado,
responsividade, hidratação do Next.js e fluxos completos entre componentes de
servidor e cliente.

[playwright.config.ts](../playwright.config.ts) define o endereço padrão da
aplicação e localiza os testes no diretório `e2e/`. O Chromium necessário já
foi instalado localmente.

Por padrão o E2E serve o build de produção do admin demo (`next start`), então
execute `npm run build` antes de rodar os testes. Para usar o servidor de
desenvolvimento (`next dev`, mais lento), defina `E2E_DEV=1`. Sem `E2E_DEV`, o
Playwright recusa um build ausente ou desatualizado: o build do admin demo grava
em `.next/e2e-build-stamp.json` uma impressão digital do código do demo e do
`dist` dos pacotes, comparada antes dos testes.

```powershell
# Executar os testes end-to-end pela entrada oficial do repositório
npm run test:e2e

# Atualizar snapshots somente após revisar uma mudança visual intencional
npm run test:e2e -- --update-snapshots

# Abrir o relatório visual da última execução
npx.cmd playwright show-report
```

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
└── overlay.spec.ts
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
npm run typecheck
npm run test:quiet
npm run build
npm run test:e2e
```

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
