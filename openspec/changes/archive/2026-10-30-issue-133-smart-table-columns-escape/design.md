## Contexto

`useEscapeKey` registra camadas num listener único de `document`; só a camada superior age e o handler ignora eventos com `defaultPrevented`. O painel de colunas é um bloco inline (`hidden` alternado) dentro da barra de ferramentas; seu Escape é tratado por `onKeyDown` React na barra, que fecha o painel e devolve o foco ao botão "Colunas". Como o React 19 delega no contêiner raiz, `stopPropagation()` do evento sintético interrompe o evento nativo antes de `document`.

## Decisões

1. **Manter o tratamento local.** O painel não é overlay (sem foco preso, sem portal, sem backdrop); participar da pilha só para fechar um bloco inline não compensa uma API pública nova.
2. **Sem acoplamento interno.** `@admin-ds/admin` não importa de `overlay-utils`; só os `exports` públicos de `@admin-ds/components` são consumidos.
3. **Defesa em profundidade:** `closeColumns` chama `preventDefault()` e `stopPropagation()`. `defaultPrevented` é o contrato que a pilha já usa para "evento tratado", então a garantia não depende mais só da interrupção da propagação (inclusive se o painel for movido para um portal no futuro). Escape sem painel aberto continua intacto e chega ao overlay ao redor.
4. **Testes de contrato:** além do fluxo Dialog/Drawer existente, verificar que um listener de `document` não recebe o Escape do painel e que, simulando propagação até `document`, o evento já chega marcado como `defaultPrevented`.

## Alternativas e trade-offs

- **API pública mínima para registrar camada de Escape** (ex.: `useAdsEscapeLayer`): rejeitada nesta change; amplia a superfície pública e exige compatibilidade futura. Pode ser reavaliada se surgirem outros consumidores fora de `@admin-ds/components`.
- **Importar `useEscapeKey` por caminho interno**: rejeitada (viola contrato de `exports`).
- **Manter apenas `stopPropagation`**: rejeitada por ponto único de falha.

## Cliente/servidor, A11y, CSS, bundle

`AdsSmartTable` já é Client Component. Acessibilidade: foco devolvido ao botão e `aria-expanded` preservados; nenhuma mudança de ARIA. Sem CSS, token ou dependência novos; impacto de bundle desprezível.

## Riscos

`preventDefault()` no Escape dentro do painel: o painel só contém checkboxes, sem comportamento padrão de Escape; risco baixo. Só atua com o painel aberto.
