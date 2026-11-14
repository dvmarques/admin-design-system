# Proposal — política editorial do changelog (#286)

## Why

O `CHANGELOG.md` combina resultados públicos com tarefas internas em uma release extensa (#286 registra 64 entradas e ~139 linhas em 0.1.1). Sem critério editorial, a leitura e as Release Notes ficam menos úteis. O histórico publicado, os hashes SHA-256 e a publicação são contratos de segurança: não podem ser reescritos.

**Perfil: Critical (por proximidade do fluxo de release).** A implementação proposta é exclusivamente documental; o risco seria alto caso mudássemos parser, preparação, aprovação, extração ou back-merge. A revisão humana do desenho continua sendo gate de aceitação.

## What Changes

- Define quais alterações são publicamente relevantes e quando manter apenas rastreabilidade em PR/issue/commit/OpenSpec.
- Formaliza seções, redação orientada ao consumidor, consolidação manual, avisos BREAKING/migração e exemplos de até 300 caracteres.
- Analisa compatibilidade/custo de `Unreleased`, datas ISO, links de comparação e arquivo histórico; mantém o formato atual.
- Atualiza guia de release e contribuição, com delta OpenSpec do contrato editorial.
- Alinha a regra obrigatória de `AGENTS.md` com a seleção por impacto; a mudança exclusivamente editorial #286 não gera entrada pública, mas permanece rastreável nesta PR e no OpenSpec.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `release-process`: seleção editorial pública e preservação da rastreabilidade interna, mantendo os gates atuais.

## Impact

Arquivos: `AGENTS.md`, `docs/release-process.md`, `CONTRIBUTING.md`, `CHANGELOG.md` (apenas preâmbulo) e artefatos OpenSpec. Sem modificações em `scripts/**`, workflow, parser, `packages/**`, `apps/**`, CSS, tokens, APIs ou bundle. Não há novas dependências, alterações visuais ou E2E funcionais aplicáveis.

Fora do escopo: reescrever versões fechadas/hashes, migrar formato para ISO/`Unreleased`, dividir changelog, gerar links automaticamente, trocar Changesets, alterar ou executar publicação, tag e GitHub Releases. Caso futuras alterações de scripts sejam aprovadas, abrir change específica com regressão de histórico longo, aprovação e extração.
