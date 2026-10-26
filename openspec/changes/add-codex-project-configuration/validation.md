# Validação da configuração Codex

- Ambiente: Windows, worktree `admin-design-system-openspec-1-15`, sem modificar a `.codex` não versionada do checkout principal.
- `npm run validate`: format, lint, build (pacotes, Storybook e demo), typecheck e test:quality passaram. E2E terminou com 302 aprovados e nove falhas exclusivamente por ausência dos baselines Windows, como na entrega inicial; capturas geradas removidas e baselines Linux preservados.
- Unitários: 62 arquivos, 1081 testes aprovados. Suíte Node de CI: 101 aprovados, um ignorado, nenhuma falha; inclui 11 testes dos hooks.
- Os comandos declarados em hooks.json foram executados com stdin JSON em repositórios temporários com espaços no caminho e a partir de subdiretório. Cobertos bloqueio de patch misto, origem/destino de Move, Delete, caminhos absolutos/relativos, separadores Windows, symlinks (inclusive destino externo ausente), arquivo com caracteres de shell, formatação focal, erro de sintaxe e Prettier ausente.
- TOML validado por `tomllib` para config e os dois agentes; `codex mcp list --json` lista Context7 e Playwright habilitados. `--strict-config` não é suportado por `codex mcp` nesta instalação; não foi tratado como uma validação de schema bem-sucedida.
- `openspec.cmd validate --all --strict --report findings`: 56 itens válidos, nenhuma falha.
- Ativação dos hooks na UI e descoberta em uma nova sessão dependem da confiança/revisão do usuário; os testes de subprocesso não concedem confiança. Não foi usado bypass.
- Acompanhamento do CI Linux atualizado será registrado na PR #208, vinculada à issue #209.

## CI Linux aprovado

No commit `79d36c141d95d44aeb375c3ac7d4f691de00f9ca`, o [CI completo](https://github.com/dvmarques/admin-design-system/actions/runs/40396865296) aprovou qualidade (incluindo os 11 testes de hooks), cobertura, artefatos, política de develop e 311 E2E: 281 Chromium, 15 Firefox e 15 WebKit. Os snapshots Linux existentes passaram sem atualização. O [Pages](https://github.com/dvmarques/admin-design-system/actions/runs/40396865305) também passou. Release e publicação não eram aplicáveis. O commit posterior de registro altera apenas tasks/evidência; não modifica configuração ou implementação testada. Nenhum merge ou archive realizado.
