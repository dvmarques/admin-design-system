# Proposta: AdsPasswordInput (#147)

## Por quê

Disponibilizar entrada de senha acessível e reutilizável, coerente com AdsField e a identidade do Design System.

## O que muda

- `packages/components`: novo AdsPasswordInput e tipos públicos, estilos compilados e testes.
- `apps/admin-demo`: página e navegação no padrão atual do catálogo de componentes, com exemplos interativos.
- `apps/docs`: stories e documentação Storybook.
- `e2e`: cenários de teclado, visibilidade e integração.

## Fora do escopo

Autenticação, armazenamento de credenciais, validação de senhas no servidor, mudanças na issue #91 e redesign do catálogo.

## Compatibilidade

Preservar APIs existentes, temas claro/escuro, tokens semânticos, CSS distribuível e uso em Next.js App Router.
