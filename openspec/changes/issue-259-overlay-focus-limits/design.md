## Contexto

`getEligibleFocusableElements` devolve candidatos em ordem de documento e o listener de Tab usa o primeiro e o último como pontas; o foco inicial usa o primeiro. O navegador, porém, ordena por `tabindex` positivo e trata rádios agrupados como uma única parada.

## Decisões

1. **Ordem real de tabulação:** o helper ordena por `max(tabIndex, 0) || 32768` (ordenação estável: `tabindex` positivo crescente, depois os demais em ordem de documento). Alternativa descartada: documentar `tabindex` positivo como não suportado; deixaria o ciclo saltar controles e a correção custa poucos bytes.
2. **Rádios:** o helper recebe a direção (`reverse`). Rádios elegíveis com `name` são agrupados por `name` e formulário (`form`); de cada grupo permanece uma parada: o marcado ou, sem marcado, o primeiro (Tab) ou o último (Shift+Tab) na ordem de tabulação. Rádios sem `name` seguem como paradas próprias. Só entram no agrupamento rádios elegíveis, como no navegador. O foco inicial usa a lista direta.
3. **Ativo fora da lista:** mantém a regra da #234 (`compareDocumentPosition` apenas quando o ativo está dentro do modal e fora da lista); com `tabindex` positivo esse caso raro continua a favor de não escapar.
4. **StrictMode:** o layout effect de foco inicial deixa de depender de `previousOpen`; passa a focar sempre que `open` vira verdadeiro (deps `[containerRef, open]`), e o retorno de foco continua controlado por `previousOpen` no efeito passivo. O re-run de efeitos reexecuta o foco e o timer, de forma idempotente.
5. **`iframe`:** continua limitação documentada. O ciclo não consegue interceptar o Tab dentro de outro documento; removê-lo da lista deixaria o conteúdo inalcançável por teclado.
6. **Orçamento:** medir antes/depois em `components-public` e nos pacotes; elevar apenas ao medido mais folga mínima, registrando na PR para aprovação humana.

## Riscos

- Agrupamento de rádios por `name`/`form` simplificado (sem shadow DOM), no mesmo escopo do ciclo atual.
- Ordenação estável depende de `Array.prototype.sort` estável (ES2019).
- JSDOM não simula Tab nativo: o comportamento real é confirmado em Chromium (Playwright).

## Medições e orçamentos (Apply)

Medição local (Windows, `node scripts/inspect-packages.mjs`) sobre `develop` b6ad33c, antes e depois; limites elevados ao medido com a menor folga que o arredondamento permite (o limite do dist é baseline × 1,1). Elevação sujeita à aprovação do mantenedor na PR; a CI é a referência.

| Métrica                                | Antes   | Depois  | Limite anterior   | Limite novo       |
| -------------------------------------- | ------- | ------- | ----------------- | ----------------- |
| `@admin-ds/components` dist (baseline) | 610.014 | 612.239 | 610.060 (554.600) | 612.260 (556.600) |
| JS/CSS publicado                       | 263.282 | 264.351 | 263.300           | 264.360           |
| JS/CSS gzip por arquivo                | 79.417  | 79.786  | 79.500            | 79.790            |
| `components-public` minificado         | 33.027  | 33.417  | 33.100            | 33.420            |
| `components-public` gzip               | 11.707  | 11.877  | 11.800            | 11.880            |
| `admin-public` minificado              | —       | 71.420  | 71.100            | 71.430            |
| `admin-public` gzip                    | —       | 24.047  | 23.900            | 24.050            |

O custo (+390 B minificados e +170 B gzip em `components-public`) supera a estimativa da #234 (+226 B/+95 B só para rádios) porque inclui a ordenação por `tabindex`.

## Limites conhecidos

Rádio marcado porém inelegível não conta no grupo; o grupo é calculado dentro do modal e sem shadow DOM; o desempate depende de `sort` estável.
