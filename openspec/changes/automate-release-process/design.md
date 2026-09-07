## Context

O fluxo de release precisa garantir que cinco elementos representem exatamente a mesma versão: commit liberado, versões coordenadas do monorepo, seção fechada do `CHANGELOG.md`, tag Git e GitHub Release. O processo deve reduzir operações manuais sem transformar qualquer merge em `master` em uma publicação automática.

O estado atual está alinhado em `0.0.1` no manifesto raiz, workspaces e lockfile, com `0.0.1 - Em andamento` no changelog. Essa passa a ser a primeira release esperada pelo fluxo.

## Goals / Non-Goals

**Goals:**

- Automatizar preparação, validações mecânicas, tag e GitHub Release.
- Preservar decisão humana sobre versão, merge e publicação.
- Manter raiz, workspaces privados, dependências internas, lockfile e changelog coordenados na mesma versão.
- Garantir que a tag aponte para o commit exato produzido pela PR da release, e não simplesmente para o HEAD corrente de `master`.
- Tornar a publicação recuperável sem nunca mover ou sobrescrever uma tag existente.
- Usar o `CHANGELOG.md` como fonte única das notas da release.
- Reutilizar a CI existente e adicionar somente validações específicas de release.
- Executar OpenSpec na CI de forma reprodutível e multiplataforma.
- Documentar o fluxo de forma curta no README e completa em documento dedicado.

**Non-Goals:**

- Publicar automaticamente em todo push para `master`.
- Inferir automaticamente se uma mudança é major, minor ou patch.
- Versionar ou publicar cada workspace de forma independente.
- Alterar a estratégia geral de branching do projeto além da branch temporária `release/X.Y.Z`.

## Decisions

### Separar preparação de publicação

A preparação ocorrerá localmente na branch `release/X.Y.Z` por meio de `npm run release:prepare -- X.Y.Z`. A publicação acontecerá somente depois do merge em `master`, via `workflow_dispatch`.

Essa separação permite revisar no PR todas as alterações de versão e changelog antes de criar qualquer tag imutável.

### Manter ações humanas explícitas

O mantenedor será responsável por:

1. escolher `X.Y.Z`;
2. criar `release/X.Y.Z` a partir de `develop`;
3. executar o comando de preparação;
4. revisar e abrir PR para `master`;
5. fazer o merge após os checks obrigatórios ficarem verdes;
6. disparar manualmente `Publicar release` informando `X.Y.Z`.

Todo o restante será automatizado e validado por scripts/workflows.

### Versionamento coordenado do monorepo

A versão do produto é coordenada entre o `package.json` raiz e todos os manifests em `packages/*` e `apps/*`. O comando de preparação atualizará todos para `X.Y.Z`, ajustará também referências internas versionadas entre workspaces e regenerará o `package-lock.json` sem atualizar dependências externas.

A validação de release falhará se qualquer manifesto ou dependência interna permanecer em uma versão diferente da release preparada.

### Preflight antes de qualquer escrita

`release:prepare` terá duas fases lógicas. Primeiro executará apenas validações e cálculos; somente depois de todas passarem aplicará alterações aos arquivos.

O preflight verificará no mínimo:

- SemVer válida;
- branch atual `release/X.Y.Z`;
- working tree limpa antes da preparação;
- exatamente uma seção `Em andamento` no changelog e correspondência com `X.Y.Z`;
- ausência de uma seção já fechada para a mesma versão;
- consistência das versões atuais do monorepo;
- possibilidade de calcular a próxima versão patch e todas as alterações necessárias.

Falha de preflight não deve deixar arquivos parcialmente modificados pelo script.

### Fechar e reabrir o changelog automaticamente

O script localizará exatamente uma seção `### [X.Y.Z] - Em andamento`, substituirá `Em andamento` pela data corrente em `dd-mmm-aaaa` em português e abrirá acima a próxima versão patch `X.Y.(Z+1) - Em andamento`.

O processo falhará se a estrutura não for inequívoca.

### Extrair release notes por script dedicado

`scripts/extract-release-notes.mjs` receberá uma versão e devolverá somente o corpo daquela seção fechada. O workflow reutilizará esse resultado para criar a GitHub Release, evitando divergência entre changelog e release notes.

### Reutilizar a CI existente

A CI atual já executa qualidade, build e E2E em jobs próprios. A implementação não duplicará esse pipeline chamando `npm run validate` novamente dentro de um job de release.

Será adicionado um check específico de release para PRs `release/* -> master`, responsável por validar:

- versões coordenadas do monorepo;
- changelog fechado corretamente;
- estrutura e consistência da preparação;
- OpenSpec em modo estrito.

Os jobs existentes de qualidade, build e E2E continuam sendo os responsáveis por suas validações atuais. A proteção/ruleset de `master` deve exigir os checks necessários para impedir merge de uma preparação inválida.

### OpenSpec reprodutível na CI

Como a CI roda em Linux, o workflow não dependerá de `openspec.cmd` nem de instalação global presente na máquina do desenvolvedor. A implementação deverá fixar uma forma reproduzível de disponibilizar a versão esperada do OpenSpec na CI e executar o CLI multiplataforma correspondente.

### Resolver o commit exato da PR de release

O workflow `Publicar release` não assumirá que o HEAD atual de `master` é o commit da versão informada. Ele resolverá a PR integrada da branch `release/X.Y.Z` para `master` e obterá o commit resultante efetivamente integrado.

Esse commit será validado quanto à versão e changelog. A tag `vX.Y.Z` apontará para ele mesmo que `master` já contenha commits posteriores.

O workflow falhará se não conseguir resolver de forma inequívoca uma PR merged correspondente à versão.

### Publicação manual, idempotente e sem mover tags

Antes de qualquer escrita remota, o workflow validará:

- existência e merge da PR `release/X.Y.Z -> master`;
- commit exato resultante dessa PR;
- versões coordenadas em `X.Y.Z` nesse commit;
- seção correspondente fechada no changelog desse commit;
- extração válida das release notes;
- estado da tag `vX.Y.Z` e da GitHub Release correspondente.

Comportamento:

- se a tag não existir, criar tag anotada `vX.Y.Z` no commit validado e depois criar a GitHub Release;
- se a tag existir no mesmo commit e a GitHub Release ainda não existir, preservar a tag e criar somente a GitHub Release;
- se a tag existir apontando para outro commit, falhar imediatamente;
- se a GitHub Release já existir, não recriá-la silenciosamente; reportar que a versão já foi publicada.

Nenhum caminho permitido move, sobrescreve ou recria uma tag existente.

### README como porta de entrada, documento dedicado como referência

O `README.md` terá apenas o fluxo resumido e link para `docs/release-process.md`. O documento dedicado conterá passo a passo, responsabilidades humano/automação, pré-condições, checks obrigatórios e recuperação de falhas.

## Risks / Trade-offs

- [Operador informa versão errada no workflow] → resolver PR, commit, manifests, changelog e tag antes de qualquer escrita.
- [Master avança depois do merge da release] → tag apontará para o commit da PR de release, não para o HEAD atual.
- [Tag criada e criação da GitHub Release falha] → reexecução reutiliza a tag somente se ela apontar para o mesmo commit validado.
- [Tag existente em commit diferente] → falhar sem modificar o repositório.
- [Alteração parcial durante `release:prepare`] → executar preflight completo antes da primeira escrita e cobrir o comportamento com testes.
- [CI duplicada e lenta] → reutilizar jobs existentes e adicionar apenas check específico de release.
- [OpenSpec depende de ambiente local] → fixar instalação/execução multiplataforma e reprodutível no workflow.
- [Próxima versão não é patch] → a seção automática `X.Y.(Z+1) - Em andamento` é apenas o próximo placeholder; uma futura política de bump poderá substituir essa regra.
