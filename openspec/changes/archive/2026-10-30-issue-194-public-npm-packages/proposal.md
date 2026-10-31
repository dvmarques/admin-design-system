# Proposal

## Why

A issue #194 prepara o design system para distribuição pública no npm sem depender da estrutura do monorepo. Os pacotes atuais ainda usam nomes internos `@admin-ds/*` e `private: true`. Em 30/10/2026, o mantenedor confirmou a licença **MIT**, preservando o copyright de Daniel Marques, e ampliou o escopo de três para **quatro** bibliotecas: o pacote opcional `highlighted-code`, entregue nas #213 e #241, também deve ser publicável. A primeira publicação real continua exclusiva da #195.

## What Changes

- Renomear `@admin-ds/tokens` → `@dvmarques/admin-ds-tokens`, `@admin-ds/components` → `@dvmarques/admin-ds-components`, `@admin-ds/admin` → `@dvmarques/admin-ds-admin` e `@admin-ds/highlighted-code` → `@dvmarques/admin-ds-highlighted-code`.
- Atualizar referências executáveis em manifests, lockfile, imports/exports, peers, scripts, CI, testes, exemplos, geração de documentação, medições, budgets e workspaces consumidores. Preservar releases, changes arquivadas e evidências históricas, sem substituição indiscriminada.
- Tornar públicos **somente os quatro pacotes**. Manter root, `apps/admin-demo` e `apps/docs` privados, com proteções explícitas contra publicação acidental.
- Preservar `highlighted-code` como instalação/import opcional independente e o isolamento do Shiki, sem reexport pelo pacote components.
- Revisar `exports`, arquivos efetivamente empacotados, tipos `.d.ts`, CSS compilado, `sideEffects`, dependências/peer opcionais, licença, avisos de terceiros, metadados e README mínimo dos pacotes.
- Implementar smoke reproduzível que empacote os quatro artefatos com `npm pack` e os instale por caminhos `file:` em um consumidor Next.js limpo, sem resolução de versões `@dvmarques/*` não publicadas no registry. Verificar build, tipos, CSS sem Tailwind, entradas Server/Client e hidratação em navegador.
- Fornecer instrução mínima de migração executável. O guia abrangente de adoção fica na #198; automação, Trusted Publishing e primeira publicação no npm ficam na #195.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `library-distribution`: contratos dos quatro pacotes públicos, metadados, tarballs, isolamento do pacote opcional, instalação fora do monorepo e integridade da licença.
- `nextjs-consumption`: smoke externo de App Router e validação de CSS/SSR/hidratação por tarballs (se os cenários existentes precisarem de delta).

## Impact

Perfil **Critical**: alteração transversal de nomes, `exports`, peers e CSS distribuído, publicação, licenças, compatibilidade e fluxo de release. Workspaces: `packages/tokens`, `packages/components`, `packages/admin`, `packages/highlighted-code`; consumidores `apps/admin-demo` e `apps/docs`; scripts, CI, OpenSpec e documentação mínima. A mudança altera os nomes dos imports; não há promessa de alias público para os nomes anteriores.

A `develop` consultada em 30/10/2026 já inclui as #147, #191, #192, #193, #213 e #241. Iniciar a partir dela e reavaliar mudanças concorrentes antes do merge.

## Fora do escopo

- Publicar pacotes no npm, configurar credenciais/OIDC/Trusted Publishing, escolher a versão inicial ou alterar tags/releases (issue #195).
- Reescrever guias completos, histórico por componente ou documentação operacional do registro (issue #198).
- Alterar o runtime do HighlightedCodeSnippet, reexportar Shiki, criar organização npm ou redesenhar UI.
