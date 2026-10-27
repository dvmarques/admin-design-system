# Design

## Context

Ver proposal.md e issue #219. Atualmente só existem atribuições de terceiros, sem licença para o código próprio. Todos os pacotes permanecem privados no npm.

## Goals / Non-Goals

Declarar MIT de modo consistente e preservar atribuições. Nenhuma mudança de arquitetura, publicação ou interface.

## Decisions

- Usar LICENSE.md na raiz, conforme preferência do mantenedor; texto MIT em inglês, sem tradução das cláusulas, conferido em https://opensource.org/license/mit. Copyright: 2026 Daniel Marques, nome configurado no Git.
- Declarar license: MIT na raiz e em todos os workspaces; atualizar apenas as entradas locais do lockfile, preservando resoluções e integridades. private: true continua controlando publicação.
- Preservar os avisos da Inter e das skills externas: MIT do projeto não substitui suas licenças ou copyrights. README e docs/licensing.md devem explicar a distinção.
- Alternativas: Apache-2.0 foi descartada pela escolha explícita de MIT; manter ausência de licença não atende à solicitação. LICENSE sem extensão foi descartado pela preferência por Markdown.
- Sem mudança em Server/Client Components, exports, composição, Tailwind, tokens, CSS compilado, conflitos CSS, acessibilidade, temas, responsividade, Storybook ou consumo Next.js. Sem dependências novas ou impacto em tamanho de bundle. Não há componente novo que exija story ou teste novo.

## Risks / Trade-offs

- Atribuir MIT a material alheio indevidamente → delimitar código próprio e manter avisos de terceiros intactos.
- Divergência de metadados → comparar manifests e entradas locais do lockfile.
- Concessão de direitos → decisão expressa do mantenedor; alterações futuras não revogam automaticamente permissões já concedidas.

## Migration Plan

Integração por PR para develop. Sem migração de consumidores. Um revert restaura arquivos e metadados, mas não deve ser apresentado como revogação retroativa de permissões. Archive/sync e merge continuam sujeitos aos gates humanos do projeto.
