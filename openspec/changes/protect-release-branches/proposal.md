## Why

O processo de release exige que a exclusão automática de branches após merge
fique desabilitada em todo o repositório, para que `release/X.Y.Z` sobreviva até
o back-merge e a publicação. Essa configuração é global e também impede a
limpeza automática das branches de trabalho comuns. O GitHub não oferece
auto-delete por padrão de nome, mas uma branch protegida contra deleção não é
removida por ele, o que permite proteger só as branches de release.

## What Changes

- Passar a proteger as branches `release/*` com um ruleset de branch que
  restringe a deleção, em vez de exigir o auto-delete desabilitado no
  repositório.
- Permitir que o auto-delete de head branches permaneça habilitado para as
  demais branches.
- Formalizar na capability `release-process` a retenção da branch de release até
  o back-merge e a publicação, hoje descrita somente em `docs/release-process.md`.
- Atualizar `docs/release-process.md` (metadados e estratégia de merge, e a
  seção de recuperação) com o ruleset, a remoção manual pós-publicação e a
  verificação recomendada na primeira release após a mudança.

Sem **BREAKING**: nenhum comando, workflow, script ou API pública muda.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `release-process`: adiciona o requisito de retenção da branch de release até
  o back-merge e a publicação, independente do mecanismo de proteção.

## Impact

- **Pacotes e APIs públicas:** nenhum. Não afeta `@admin-ds/tokens`,
  `@admin-ds/components`, `@admin-ds/admin`, o `admin-demo` nem o Storybook.
- **Documentação:** `docs/release-process.md` e o delta de spec em
  `openspec/specs/release-process`.
- **Configuração externa (fora do repositório):** um ruleset no GitHub, criado
  manualmente por quem administra o repositório. Esta change não o cria.
- **Valor para consumidores:** nenhum direto; reduz atrito operacional dos
  mantenedores sem enfraquecer a proteção da release.

### Fora do escopo

- Alterar `scripts/*`, `.github/workflows/*` ou os rulesets de `master` e
  `develop`.
- Automatizar a criação do ruleset ou a remoção da branch de release.
- Mudar a estratégia de merge, os labels ou a política de tags.
