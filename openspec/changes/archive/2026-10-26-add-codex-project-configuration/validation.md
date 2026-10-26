# Validação da configuração Codex

- Ambiente: Windows, worktree `admin-design-system-openspec-1-15`, sem modificar a `.codex` não versionada do checkout principal.
- `npm run validate`: format, lint, build (pacotes, Storybook e demo), typecheck e test:quality passaram. E2E terminou com 302 aprovados e nove falhas exclusivamente por ausência dos baselines Windows, como na entrega inicial; capturas geradas removidas e baselines Linux preservados.
- Unitários: 62 arquivos, 1081 testes aprovados. Suíte Node de CI após revisão: 106 aprovados, dois ignorados, nenhuma falha; inclui 17 testes dos hooks (16 aprovados e um POSIX ignorado no Windows).
- Os comandos declarados em hooks.json foram executados com stdin JSON em repositórios temporários com espaços no caminho e a partir de subdiretório. Cobertos bloqueio de patch misto, origem/destino de Move, Delete, caminhos absolutos/relativos, separadores Windows, symlinks (inclusive destino externo ausente), arquivo com caracteres de shell, formatação focal, erro de sintaxe e Prettier ausente.
- TOML validado por `tomllib` para config e os dois agentes; `codex mcp list --json` lista Context7 e Playwright habilitados. `--strict-config` não é suportado por `codex mcp` nesta instalação; não foi tratado como uma validação de schema bem-sucedida.
- `openspec.cmd validate --all --strict --report findings`: 56 itens válidos, nenhuma falha.
- Ativação dos hooks na UI e descoberta em uma nova sessão dependem da confiança/revisão do usuário; os testes de subprocesso não concedem confiança. Não foi usado bypass.
- Acompanhamento do CI Linux atualizado será registrado na PR #208, vinculada à issue #209.

## CI Linux aprovado

No commit `79d36c141d95d44aeb375c3ac7d4f691de00f9ca`, o [CI completo](https://github.com/dvmarques/admin-design-system/actions/runs/40396865296) aprovou qualidade (incluindo os 11 testes de hooks), cobertura, artefatos, política de develop e 311 E2E: 281 Chromium, 15 Firefox e 15 WebKit. Os snapshots Linux existentes passaram sem atualização. O [Pages](https://github.com/dvmarques/admin-design-system/actions/runs/40396865305) também passou. Release e publicação não eram aplicáveis. O commit posterior de registro altera apenas tasks/evidência; não modifica configuração ou implementação testada. Nenhum merge ou archive realizado.

## Guia único dos três agentes

O incremento documental substitui `docs/codex-setup.md` por `docs/agent-setup.md`, preserva os detalhes do Codex e acrescenta configuração, ativação e limites reais de Claude Code e Cursor. Documentação oficial conferida e 36 links locais de README, AGENTS, mapa de contexto e guia validados. Sem alterações em scripts, configurações executáveis, pacotes, dependências ou snapshots. `npm run format`, `npm run check:agent-skills`, `git diff --check` e OpenSpec estrito aprovados (56 itens). Build e E2E locais não foram repetidos para este incremento exclusivamente documental; a implementação anterior já passou no CI completo dos commits `79d36c1` e `14b1057`, e os checks automáticos da PR serão conferidos novamente após o push.

## Revisão independente Claude Code

O Claude Code revisou o diff de `2f4424e` em modo plano com ferramentas apenas de leitura (Read/Grep/Glob), sem edição, shell ou subagentes. Apontou casos de borda sem bloqueadores. Foram reproduzidas quatro falhas no Windows e corrigidos bootstrap pré/pós, cwd por junction, casing de gerados no Windows e resolução do parent físico de symlinks relativos. A segunda conferência, também somente leitura, considerou B1/B2/O1/O3 resolvidos, não encontrou novos bugs introduzidos e aceitou O2 como limitação explicitamente documentada. Limites residuais de `..` após symlink, volumes macOS, entrega de eventos/trust no aplicativo e `tool_response` estão no guia. Nenhum bypass de permissões foi usado.

Após as correções: `node --test scripts/codex-hooks.test.mjs` aprovou 16 de 17 testes no Windows, com um caso POSIX ignorado; `npm run test:quality` passou (106 aprovados e dois ignorados na suíte Node de CI), assim como lint, sincronia de skills e artefatos gerados. A execução Linux e o SHA correspondente serão conferidos antes do archive. Os testes unitários continuam com 1081 aprovados. As restrições dos baselines Windows são as mesmas já registradas, sem mudanças em runtime/CSS/apps.

## Correções revisadas e CI antes do archive

Após integrar `develop` (182edb1 / PR #211), preservando as duas entradas do conflito de changelog, o commit `7bb045dfa7ce53f6480e7f2d52202fe3abc7d0bd` passou no [CI completo](https://github.com/dvmarques/admin-design-system/actions/runs/40411634735) e no [Pages](https://github.com/dvmarques/admin-design-system/actions/runs/40411634271). A qualidade executou os 17 testes dos hooks com as condições por plataforma; o caso POSIX de symlink relativo foi aprovado no Linux, e o casing Windows já havia sido validado localmente. Chromium, Firefox e WebKit passaram, sem atualizar snapshots. A revisão independente do Claude foi concluída em duas rodadas; a segunda não apontou novos bugs nas correções. O usuário autorizou archive/sync de todas as changes abertas e squash após os gates. A limitação de confiança na UI e as demais coberturas explicitadas no guia permanecem registradas.
