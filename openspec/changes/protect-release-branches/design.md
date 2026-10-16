## Context

`docs/release-process.md` exige o auto-delete de head branches desabilitado no
repositório para preservar `release/X.Y.Z` até o back-merge e a publicação. Na
release 0.1.0 a opção estava habilitada e a branch foi apagada no merge da PR
para `master`; foi preciso recriá-la no mesmo commit para abrir o back-merge.

O auto-delete do GitHub é uma opção do repositório, sem filtro por padrão de
nome. `master` e `develop` já estão protegidas contra deleção e não foram
afetadas por ele. A capability `release-process` não descreve hoje a retenção da
branch de release; a regra existe só no documento operacional.

O repositório não tem código de runtime nesta change: não há componentes, CSS,
tokens, Tailwind ou acessibilidade de interface envolvidos.

## Goals / Non-Goals

**Goals:**

- Manter o auto-delete habilitado para branches de trabalho comuns.
- Garantir que `release/X.Y.Z` não seja removida antes do back-merge e da
  publicação.
- Registrar a regra como comportamento estável na spec, não só no documento.

**Non-Goals:**

- Alterar scripts, workflows, rulesets de `master`/`develop` ou a estratégia de
  merge.
- Criar o ruleset por código ou automatizar a remoção da branch de release.

## Decisions

1. **Ruleset de branch com alvo `release/**` e a regra "Restrict deletions".**
   Branch protegida contra deleção não é apagada pelo auto-delete. Alternativas:
   (a) manter o auto-delete desabilitado, que é o estado atual e perde a limpeza
   das demais branches; (b) um workflow que recria a branch depois do merge,
   descartado por ser reativo, adicionar permissão de escrita e fugir do escopo;
   (c) proteção clássica por padrão de nome, descartada em favor do ruleset, que
   já é o mecanismo usado em `master` e `develop`.

2. **A spec descreve o comportamento, não o mecanismo.** O requisito fala em
   retenção até a conclusão e deixa o ruleset para `docs/release-process.md`,
   evitando prescrever detalhe de implementação do GitHub.

3. **Remoção manual ao final.** Como a regra bloqueia também a exclusão manual,
   a limpeza exige um administrador (bypass mínimo) ou a remoção temporária da
   regra. O documento registra esse passo.

4. **Sem restrição de criação ou push.** Só a deleção é restrita, então
   `release:prepare`, o push da branch e as PRs seguem funcionando.

## Risks / Trade-offs

- **Não verificado:** que o auto-delete respeita "Restrict deletions" de ruleset
  como respeita a proteção clássica. Mitigação: validar na próxima release e, se
  a branch for apagada, reverter para o auto-delete desabilitado (estado atual).
- A branch de release passa a exigir limpeza manual e privilegiada.
- O ruleset fica fora do repositório e pode ser alterado sem rastro em Git;
  o documento passa a ser a referência da configuração esperada.
- Sem impacto em bundle, dependências, API pública, CSS distribuído ou
  consumidores.
