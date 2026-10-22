## Why
A CI recompila todos os workspaces em múltiplos jobs e a detecção atual só distingue documentação, elevando custo e latência.

## What Changes
- Classificar arquivos alterados por workspace e dependências transitivas, com fallback para validação completa.
- Oferecer comandos de validação focal para desenvolvimento sem remover gates obrigatórios de PR, release e alterações críticas.
- Medir duração, falhas, retrabalho e consumo de tokens quando disponível; comparar baseline e resultado sem estimativas tratadas como medição.
- Avaliar cache e compartilhamento de artefatos entre jobs sem criar dependência insegura entre jobs.

## Capabilities
### New Capabilities
- `impact-aware-validation`: seleção conservadora de workspaces e validações com fallback seguro.

## Impact
Scripts de CI, testes Node, workflows GitHub Actions, documentação e comandos npm. APIs públicas e identidade visual não devem mudar.
