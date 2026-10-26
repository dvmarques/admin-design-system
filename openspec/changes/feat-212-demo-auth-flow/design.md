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
- Erros associados aos campos (`AdsField` + `aria-describedby`); região `role="status"` / `aria-live="polite"` para confirmações simuladas.
- Foco no primeiro campo inválido após envio; botões e links com foco visível dos tokens.
- `AdsPasswordInput` com regras e força opcionais na redefinição.

## Simulação e segurança

- Login: e-mail com formato válido e senha não vazia → loading simulado (~400 ms) → `router.push('/')` e mensagem opcional via toast ou status (sem cookie de sessão).
- Recuperação: confirmação de envio simulada; link para continuar em `/redefinir-senha`.
- Redefinição: senha e confirmação coincidem e regras atendidas → sucesso simulado.
- "Lembrar-me" só altera estado local na sessão; nada em `localStorage`/cookies além do tema já existente.

## Testes

- Vitest: helpers de validação, presença do item de navegação e contrato de imports.
- Playwright: fluxo login → demo, links entre telas, validação, refresh, histórico (`goBack`), temas, override de `--ads-color-primary` no painel, 375 px sem painel visível.

## Documentação

- `docs/demo-auth-flow.md` descreve rotas, fluxo simulado, validações, limitações (sem backend, token nem armazenamento de credenciais), componentes usados, tema/cor principal no SVG e como testar; é linkado no `README.md`.

## Alternativas consideradas

- **Componente público `AuthLayout` no DS** — rejeitado: issue exige composição só no demo salvo lacuna comprovada.
- **Preview do dashboard no painel** — rejeitado pela issue.
- **Persistir e-mail em "lembrar-me"** — rejeitado para evitar armazenamento de dado de credencial.
