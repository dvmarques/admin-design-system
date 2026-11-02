# Limpeza da documentação após a publicação npm

## Why

Atualizar a documentação de adoção relacionada à issue #195 para refletir a publicação efetiva dos quatro pacotes `@dvmarques/admin-ds-*` na versão 0.1.1, removendo instruções temporárias de pré-publicação e deixando comandos de instalação utilizáveis.

## What Changes

- Atualizar o README principal, os quatro READMEs de pacote, `docs/integration.md` e as orientações operacionais em `docs/release-process.md`.
- Corrigir menções desatualizadas em `AGENTS.md`, na página de API do demo, na documentação de desenvolvimento, Pages e histórico por componente.
- Registrar a alteração em `[0.1.2] - Em andamento` no changelog.
- Pacotes afetados: tokens, components, admin e highlighted-code, apenas em documentação. APIs públicas: nenhuma alteração. Demo: somente texto editorial da página de API.
- Não alterar código da publicação, versões npm, configurações Trusted Publisher ou o histórico fechado de `[0.1.1]`.

## Verification

- As instruções principais instalam pacotes do npm sem condicionais de primeira publicação.
- A documentação oferece uma forma de reproduzir a versão publicada 0.1.1.
- Nenhuma página afirma que os quatro pacotes ainda não estão publicados.
- O CHANGELOG documenta a atualização sob 0.1.2.
