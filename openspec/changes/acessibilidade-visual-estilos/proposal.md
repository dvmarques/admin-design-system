## Why

`prefers-reduced-motion` só é tratado no CSS do admin e da demo, apesar de haver
várias transições em `packages/components`; não há suporte a `forced-colors` nem
a `prefers-contrast`, e o contraste dos tokens é verificado só para texto
(4,5:1), sem cobrir bordas, foco e seleção (3:1). Usuários com vestibular
sensível, alto contraste do sistema ou baixa visão ficam sem garantias
(issue #87, filha do épico #85).

## What Changes

- Movimento reduzido padronizado por token: `--ads-motion-fast` e
  `--ads-motion-normal` passam a `0ms` sob `prefers-reduced-motion: reduce`,
  gerados em `@admin-ds/tokens`; animações contínuas (spinner, skeleton) e
  transformações de hover são desativadas nos componentes que ainda não as tratam.
- Migrar as durações literais de `packages/admin/src/styles.css` (150 ms) e de
  `apps/admin-demo/app/globals.css` (240 ms) para os tokens e remover os blocos
  `prefers-reduced-motion` que só zeravam transições; permanecem os que tratam
  animação contínua e rolagem suave.
- Suporte a `forced-colors: active` no CSS compilado de `@admin-ds/components` e
  `@admin-ds/admin`: foco, bordas, seleção (tabelas, navegação, DatePicker),
  Button, campos de formulário e Badge continuam distinguíveis com cores de sistema
  (o que o navegador já força, como o contorno de foco, é validado por E2E).
- Suporte a `prefers-contrast: more` por sobrescritas de tokens de cor nos dois
  temas (bordas, texto secundário e foco mais fortes), geradas no `tokens.css`.
- Teste automatizado de contraste com lista central de pares de tokens nos temas
  claro e escuro e em `prefers-contrast: more`: 4,5:1 para texto e 3:1 para
  bordas de controles, foco e estados selecionados. Pares abaixo do mínimo
  exigem ajuste de token.
- Validação E2E em Chromium com `reducedMotion`, `forcedColors` e `contrast`
  emulados, por asserções de estilo computado e papéis ARIA (sem novos snapshots).
- Documentar em `docs/`.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `theming`: adiciona requisitos de movimento reduzido, `forced-colors` e `prefers-contrast`.
- `design-tokens`: adiciona o requisito de tokens de movimento e sobrescritas de contraste respeitando preferências do usuário.
- `quality-assurance`: adiciona a verificação automatizada de contraste não textual e a validação das preferências de acessibilidade no navegador.

## Impact

- **Pacotes e APIs públicas:** `@admin-ds/tokens` (novo conteúdo gerado em
  `tokens.css`; nomes de tokens existentes preservados), `@admin-ds/components` e
  `@admin-ds/admin` (CSS compilado). Nenhuma mudança de props ou de exports.
- **Aplicação de demonstração:** remoção de CSS redundante e testes E2E em `e2e/`;
  nenhuma regra nova de negócio.
- **Visual:** ajustes de tokens para atingir 3:1 podem alterar snapshots; baselines
  só são atualizados pelo workflow "Atualizar baselines visuais", com diff revisado.
- **Dependências:** nenhuma nova. O CSS distribuído cresce pouco e deve ficar
  dentro da margem de 10% do baseline de tamanho.
- **Valor para consumidores:** conformidade com WCAG 2.2 AA para movimento e
  contraste, sem exigir configuração do Tailwind nas aplicações consumidoras.

### Fora do escopo

- Novos componentes ou novas variantes visuais.
- Modo de alto contraste como tema nomeado ou seletor manual.
- Contraste AAA como requisito e testes com leitor de tela ou dispositivos reais.
- `prefers-reduced-transparency`, `prefers-reduced-data` e snapshots em Firefox/WebKit.
- Grupo de seleção por teclado ou outras mudanças de comportamento dos componentes.
