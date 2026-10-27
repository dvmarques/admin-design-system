# Design

## Limites Server / Client

- `app/(auth)/layout.tsx` é Server Component: lê a preferência de tema do cookie (`readServerPreference`) e repassa ao chrome.
- Formulários e o painel decorativo são Client Components (`"use client"`), com validação local e navegação via `next/link` / `useRouter`.
- Nenhuma rota de auth usa `cookies()` para credenciais; apenas o tema compartilhado com o demo.

## Layout e estilos

- Composição interna em `apps/admin-demo/app/auth/` e classes `demo-auth-*` em `globals.css`, usando somente variáveis `--ads-*` públicas (sem Tailwind no demo, sem hex fixo no SVG decorativo).
- Desktop: grid `45fr` / `55fr`; mobile: painel oculto (`display: none` abaixo de 48rem), formulário em largura confortável com padding responsivo.
- Logo oficial via `next/image` apontando para `app/icon.svg` (mesmo asset do `DemoBrand`), com `NEXT_PUBLIC_BASE_PATH` quando aplicável.
- Formas abstratas no painel usam `fill`/`stroke` com `color-mix` e `var(--ads-color-primary)`, `var(--ads-color-border)` etc., acompanhando tema claro/escuro e sobrescrita de `--ads-color-primary` pelo consumidor.

## Acessibilidade

- Um `h1` por rota; link "Voltar ao Demo" visível no topo.
- Erros associados aos campos (`AdsField` + `aria-describedby`); região `role="status"` (que já é `aria-live="polite"` implícito) para confirmações simuladas.
- Foco no primeiro campo inválido após envio (regras da nova senha no campo **Nova senha**, divergência no campo de confirmação); ao confirmar a recuperação ou a redefinição, o foco vai para a mensagem `role="status"` (`tabIndex={-1}`), porque o formulário é desmontado; "Continuar" e "Voltar ao login" são links; botões e links com foco visível dos tokens.
- `AdsPasswordInput` com regras e força opcionais na redefinição.

## Simulação e segurança

- Login: e-mail com formato válido e senha não vazia → loading simulado (~400 ms) → `router.push('/')`, sem mensagem de sucesso (a tela é desmontada na navegação) e sem cookie de sessão.
- Recuperação: confirmação de envio simulada; link para continuar em `/redefinir-senha`.
- Redefinição: senha e confirmação coincidem e regras atendidas → sucesso simulado.
- Os campos não têm `name`: o HTML é SSR e o submit nativo (sem JS ou antes da hidratação, ambos cobertos no E2E) é GET; sem `name`, nada digitado vai para a URL. `method="post"` não serve no export estático (405).
- "Lembrar-me" só altera estado local na sessão; nada em `localStorage`/cookies além do tema já existente.

## Testes

- Vitest: helpers de validação, presença do item de navegação e os três formulários (erro, foco, sucesso, atraso simulado com timers falsos). A proteção de imports públicos vem da regra ESLint existente.
- Playwright: fluxo login → demo, links entre telas, validação, refresh, histórico (`goBack`), temas, override de `--ads-color-primary` no painel, axe em 3 rotas × 2 temas × 320/375/1280 px (e após erro e sucesso, também em 320 px), teclado nas 3 rotas, foco, envio sem JavaScript e 320/375 px sem painel visível nem rolagem horizontal.

## Documentação

- `docs/demo-auth-flow.md` descreve rotas, fluxo simulado, validações, limitações (sem backend, token nem armazenamento de credenciais), componentes usados, tema/cor principal no SVG e como testar; é linkado no `README.md`.

## Alternativas consideradas

- **Componente público `AuthLayout` no DS** — rejeitado: issue exige composição só no demo salvo lacuna comprovada.
- **Preview do dashboard no painel** — rejeitado pela issue.
- **Persistir e-mail em "lembrar-me"** — rejeitado para evitar armazenamento de dado de credencial.
