# Design

## Contexto e limites

O monorepo fixa npm 11.19.1 e Node >=24. Todos os workspaces seguem versão coordenada; `packages/highlighted-code` passou a ser o quarto workspace distribuível. O pacote `admin` usa `components` como peer e `highlighted-code` tem Shiki como dependência própria. Os quatro manifests ainda declaram `private: true`; root e apps devem continuar assim. O pacote `components` possui o subpath de máscara com peer opcional `react-imask`. `LICENSE.md` (MIT, Daniel Marques) e `THIRD_PARTY_NOTICES.md` são referências canônicas de avisos.

## Decisões

1. **Escopo npm**: usar os quatro nomes aprovados sob `@dvmarques` com `publishConfig.access: public`, `private: false` somente nos quatro pacotes. Root, demos, docs e quaisquer workspaces não aprovados continuam privados. A publicação real não é exercitada nesta change.
2. **Dependências**: manter peer React/React DOM conforme suporte real e referenciar `@dvmarques/admin-ds-components` em `admin` sem depender de publicação prévia no registry durante o teste. `highlighted-code` mantém Shiki apenas em seu grafo próprio, sem reexport pela raiz de components. Não publicar `react-imask` como dependência obrigatória do entrypoint principal.
3. **Entrypoints/estilos**: preservar subpaths públicos tipados, diretivas `'use client'`, CSS compilado e `sideEffects` específicos de CSS; impedir imports implícitos de `src/` ou conteúdo relativo ao monorepo. Manter ordem de CSS `tokens` → `components` → `admin` (e `highlighted-code` quando opt-in). Evitar resets globais.
4. **Artefatos**: gerar quatro tarballs reais com `npm pack --json` após build; conferir `files`, `exports`, declarações e licenças/avisos efetivamente embutidos. Componentes já copiam avisos ao dist; os outros pacotes devem receber os avisos próprios aplicáveis sem duplicar licenças de dependências instaladas separadamente. Conferir `npm pack --dry-run` antes de criar o artefato.
5. **Smoke externo**: fixture temporária fora da árvore de workspaces, `package.json` com as quatro dependências `file:/caminho/*.tgz` simultaneamente, `npm install` reproduzível com Node/npm fixados, sem dependência remota de nomes `@dvmarques/*` ainda inéditos. Depois `next build`, `tsc`, renderização/hidratação, CSS e subpath opcional. Conferir a exclusão de Shiki ao importar apenas components.
6. **Renomeação seletiva**: revisar código e configurações executáveis, scripts/budgets, README atuais e specs canônicas vigentes. Preservar conteúdo histórico de releases/changes arquivadas e medição de versões antigas; registrar mapa de migração em documentação atual.
7. **Versionamento**: manter a versão coordenada existente nesta issue, sem criar tags, releases ou tentar publicar. A primeira versão publicável é escolhida na #195 durante preparação de release, com gate humano.

## Riscos e compensações

- **Peer novo ainda inexistente no registry**: não usar instalação dos pacotes isoladamente com versões sem `file:`; construir a fixture com os quatro tarballs para que a resolução seja local.
- **Falha de CSS ou Server/Client**: tipar o consumidor e testar build e hidratação, não só presença de arquivos.
- **Shiki indevidamente incluído no pacote principal**: preservar entrada exclusiva, medir cenários de bundle e testar ausência da dependência no caminho de components.
- **Renomeação excessiva**: buscar referências por escopo e classificar cada ocorrência como ativa ou histórica antes de editar.
- **Licenças/arquivos vazados**: inspecionar inventário de `npm pack`, atribuições, exclusão de arquivos temporários e metadados; não publicar apenas para provar instalabilidade.
- **Regressões de CI**: executar gates completos em worktree isolada, registrar saída real, rebase se `develop` mudar e revisão independente.

## Rollback

Como ainda não existe publicação npm nesta entrega, reverter os commits da PR restaura nomes internos e `private: true`, sem tocar em versões já publicadas ou tags. Depois de uma publicação futura a reversão exigirá migração SemVer própria; esta issue não toma essa decisão.

## Limitação da preparação via conector

A branch remota da PR não substitui um checkout/worktree local; não interpretar escrita via API como execução de `npm pack`, `npm run validate`, OpenSpec CLI ou Playwright. Esses gates devem ser executados e registrados durante o Apply antes de tornar a PR Ready.
