# Proposta

## Why

A issue #219 adota MIT para permitir a reutilização do código próprio com termos explícitos. O mantenedor autorizou a licença e solicitou arquivo Markdown.

## What Changes

- Adicionar LICENSE.md integral com copyright de 2026 de Daniel Marques.
- Declarar MIT na raiz e nos seis workspaces, alinhando o lockfile.
- Documentar a licença no README, no guia de atribuições e no changelog.

## Capabilities

Nenhuma capacidade de runtime muda. skip_specs: true registra a alteração documental e de metadados sem inventar comportamento de produto.

## Impact

Perfil **Critical**, pelo gatilho de licenciamento. Afeta os manifests de tokens, components, admin, highlighted-code, admin-demo e docs, além da raiz. APIs públicas, dependências, CSS e bundles permanecem iguais. A biblioteca recebe declaração de licença; as aplicações demonstrativas recebem apenas metadados. Fora do escopo: publicar no npm, modificar licenças de terceiros, interfaces, tokens ou estilos. Revisão independente dos contratos antes da PR e revisão humana antes do merge.
