## Context

O fluxo de release precisa garantir que cinco elementos representem exatamente a mesma versão: commit em `master`, versão canônica do projeto, seção fechada do `CHANGELOG.md`, tag Git e GitHub Release. O processo deve reduzir operações manuais sem transformar qualquer merge em `master` em uma publicação automática.

A versão canônica continuará sendo a declarada no `package.json` raiz enquanto os workspaces permanecerem privados. A publicação será deliberadamente manual para evitar releases acidentais.

## Goals / Non-Goals

**Goals:**

- Automatizar preparação, validações mecânicas, tag e GitHub Release.
- Preservar decisão humana sobre versão, merge e publicação.
- Tornar o processo idempotente em relação a tags existentes: nunca mover ou sobrescrever uma tag.
- Usar o `CHANGELOG.md` como fonte das notas da release.
- Documentar o fluxo de forma curta no README e completa em documento dedicado.

**Non-Goals:**

- Publicar automaticamente em todo push para `master`.
- Inferir automaticamente se uma mudança é major, minor ou patch.
- Versionar e publicar cada workspace de forma independente.
- Alterar a estratégia de branching do projeto além da branch temporária `release/X.Y.Z`.

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
5. fazer o merge após CI verde;
6. disparar manualmente `Publicar release` informando `X.Y.Z`.

Todo o restante será automatizado e validado por scripts/workflows.

### Tratar o package.json raiz como versão canônica

Enquanto os workspaces forem privados, `package.json` raiz representará a versão do produto. O comando de preparação atualizará essa versão e o lockfile quando necessário.

### Fechar e reabrir o changelog automaticamente

O script localizará exatamente uma seção `### [X.Y.Z] - Em andamento`, substituirá `Em andamento` pela data corrente em `dd-mmm-aaaa` em português e abrirá acima a próxima versão patch `X.Y.(Z+1) - Em andamento`.

O processo falhará se a estrutura não for inequívoca.

### Extrair release notes por script dedicado

`scripts/extract-release-notes.mjs` receberá uma versão e devolverá somente o corpo daquela seção fechada. O workflow reutilizará esse resultado para criar a GitHub Release, evitando divergência entre changelog e release notes.

### Workflow manual com validações antes de qualquer escrita

`.github/workflows/release.yml` utilizará `workflow_dispatch` com input de versão e `contents: write`. Antes de criar a tag, validará:

- execução a partir de `master` ou resolução explícita do HEAD de `master`;
- `package.json` raiz na versão informada;
- seção correspondente fechada no changelog;
- ausência da tag remota `vX.Y.Z`;
- extração válida das release notes;
- validações de consistência aplicáveis.

Somente depois dessas verificações criará a tag anotada e, em seguida, a GitHub Release.

### README como porta de entrada, documento dedicado como referência

O `README.md` terá apenas o fluxo resumido e link para `docs/release-process.md`. O documento dedicado conterá passo a passo, responsabilidades humano/automação, pré-condições e recuperação de falhas.

## Risks / Trade-offs

- [Operador informa versão errada no workflow] → validar a versão contra `package.json`, changelog e tag antes de qualquer escrita.
- [Tag criada e criação da GitHub Release falha] → manter a tag imutável; a documentação deve orientar reexecução segura ou criação da release a partir da tag existente sem movê-la.
- [Mudança futura para publicação de workspaces] → estender a estratégia de versão canônica de forma coordenada, sem alterar retroativamente releases já criadas.
- [Próxima versão não é patch] → a seção automática `X.Y.(Z+1) - Em andamento` é apenas o próximo placeholder; uma futura política de bump poderá substituir essa regra se necessário.
