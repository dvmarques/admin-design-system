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

```powershell
# Executar os testes end-to-end
npx.cmd playwright test

# Abrir o relatório visual da última execução
npx.cmd playwright show-report
```

O diretório `e2e/` contém testes end-to-end com extensão `.spec.ts`. A suíte
atual valida o consumo público das primitivas no admin demo, a alternância de
tema pelo teclado, a ausência de erros de hidratação e snapshots dos temas
claro e escuro.

```text
e2e/
└── admin-demo.spec.ts
```

Esses testes abrem o admin de referência, alternam temas, validam controles por
teclado, verificam a ausência de divergências de hidratação e capturam
screenshots representativos dos temas claro e escuro.
