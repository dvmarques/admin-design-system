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
e revisão visual. A integração com a suíte de componentes será concluída na
tarefa 6.2 da change de fundação.

Exemplo conceitual:

```ts
import axe from 'axe-core';

const results = await axe.run(container);
expect(results.violations).toHaveLength(0);
```
