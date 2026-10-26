# Proposal

## Why

A issue #212 pede um fluxo de autenticação **demonstrativo** no Admin Demo (login, recuperação e redefinição de senha), navegável sem backend, para exemplificar o consumo dos componentes públicos do design system. Hoje não há rotas nem composição de referência para esse padrão; a entrada em `/` e as rotas administrativas devem permanecer abertas sem login.

## What Changes

Perfil: **Standard** (comportamento novo só no demo, sem API pública nova, com E2E e acessibilidade).

- Rotas `/login`, `/esqueci-senha` e `/redefinir-senha` fora do `AdsAdminShell`, com layout split 45/55 (formulário + painel abstrato em SVG com logo oficial e cores via tokens `--ads-*`).
- Link **Login (exemplo)** na seção "Exemplos de aplicação" da navegação do demo.
- Validações e feedback simulados (incluindo loading breve no login), mensagens de que é demonstração, sem armazenar senha, token ou credenciais.
- Reutilização de `AdsInput`, `AdsPasswordInput`, `AdsField`, `AdsButton`, `AdsCheckbox`, `AdsTypography`, `AdsThemeControl` e tema compartilhado com o restante do demo.
- Testes Vitest (validação e navegação) e Playwright E2E do fluxo completo, temas, responsividade, teclado e persistência de preferência de tema.

Fora do escopo: autenticação real, middleware, APIs, novos componentes públicos no DS, proteção de rotas, persistência de credenciais, archive desta change na mesma PR.

## Capabilities

### New Capabilities

Nenhuma (composição interna do demo).

### Modified Capabilities

- `admin-demo-application`: rotas e fluxo de autenticação demonstrativo, link na navegação e requisitos de simulação/acessibilidade.

## Impact

- `apps/admin-demo` (rotas, estilos `demo-auth-*`, navegação, testes).
- `e2e` (novo spec de autenticação).
- Documentação OpenSpec, `CHANGELOG.md`, `README.md` e `docs/demo-auth-flow.md`.
- Pacotes `@admin-ds/*` **sem** alteração de API ou CSS distribuído.
