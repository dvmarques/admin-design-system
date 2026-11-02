# Design

## Context

Ver `proposal.md` e o requisito delta de `release-process`. O job read-only obtém as notas por `extractReleaseNotes`, que remove o marcador editorial. O script privilegiado de publicação mantinha um extrator local que incluía esse marcador, causando um hash divergente antes de qualquer escrita.

## Goals / Non-Goals

**Goals:** reutilizar a extração canônica em todo o fluxo privilegiado de publicação e recuperação.

**Non-Goals:** alterar o processo de revisão editorial, o changelog fechado da 0.1.1, autenticação OIDC, artefatos npm ou comportamento de publicação de pacotes.

## Decisions

- Importar `extractReleaseNotes` e `releaseNotesSha` de `scripts/release-utils.mjs` no script de publicação e remover o extrator/hash duplicados. Assim, revalidação, comparação com `develop` e comparação de releases anteriores compartilham a mesma extração, e o hash usa a mesma regra testada que as notas read-only.
- Preservar a validação estrutural estrita local de um único heading `Em andamento` antes de extrair notas de `develop` e de releases predecessoras; a extração compartilhada não substitui esse gate.
- Testar que o hash canônico é exatamente o SHA-256 das notas sem o marcador e verificar estruturalmente que o publisher chama a extração/hash compartilhados.
- Alternativa descartada: duplicar a regex para retirar o marcador no publisher. Duas implementações poderiam divergir novamente.

## Risks / Trade-offs

- [Importação de módulo com dependências auxiliares] → `release-utils.mjs` já é módulo interno sem dependências externas; validar os testes locais do fluxo de release e a CI antes de merge.
- [Notas públicas poderiam mudar se a função comum mudar] → a função define a representação canônica já usada pelo job read-only e seus testes cobrem a extração.

## Migration Plan

Não há migração de dados. A correção deve ser integrada antes de tentar novamente o job de publicação GitHub. Após merge autorizado, retomar a mesma versão; não repetir `npm publish`, pois o workflow falhou antes de criar tag ou GitHub Release.
