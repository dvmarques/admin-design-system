# Proposta: adicionar AdsOTPInput (#146)

## Why

Aplicações administrativas precisam coletar códigos de uso único com ergonomia em dispositivos móveis, colagem, teclado e leitores de tela, sem reinventar comportamento nem vincular a biblioteca a serviços de autenticação.

**Perfil adaptativo: Critical.** Nova API pública React e estilo CSS distribuído, com implicações de acessibilidade e consumo em Next.js.

## What Changes

- `packages/components`: adicionar `AdsOTPInput`, tipos públicos, controles de tamanho e validação, tratamento de entrada numérica, foco, colagem, autofill e callbacks `onChange`/`onComplete`; sem nova dependência.
- `apps/admin-demo`: integrar ao catálogo existente uma demonstração navegável de estados controlado/não controlado, 4/6 dígitos, erro, desabilitado e leitura.
- `apps/docs`: Storybook com exemplos e documentação de contrato.
- `packages/components/tests` e `e2e`: cobrir comportamento, formulário, acessibilidade, responsividade e regressões.
- `CHANGELOG.md` e documentação: registrar API e limites.

## Fora do escopo

Envio de SMS/e-mail, validação remota, expiração, contagem regressiva, resend e alterações na #91. Códigos da demo são fictícios.

## Compatibilidade

Export aditivo no entrypoint principal, `'use client'`, React 18+, CSS gerado via Tailwind interno a partir de tokens semânticos. Consumidores existentes permanecem compatíveis; ausência de dependência de backend ou runtime nova.
