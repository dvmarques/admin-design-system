# Configuração dos agentes no projeto

Este guia reúne a configuração versionada de Codex, Claude Code e Cursor, com os procedimentos de ativação e os limites de cada integração.

## Base comum

- `AGENTS.md` é a fonte única das políticas do projeto; `CLAUDE.md` o importa. O Cursor também reconhece `AGENTS.md` na raiz.
- Use uma worktree isolada e abra a ferramenta nessa pasta, conforme `AGENTS.md`. Tenha Node.js e Git no PATH e instale as dependências com `npm ci`; veja os requisitos no `README.md`.
- `.agents/skills/` contém as skills compartilhadas de Codex e Cursor. As skills próprias são espelhadas em `.claude/skills/`; as skills geradas do OpenSpec também existem em `.cursor/skills/`.
- Os MCPs Context7 e Playwright usam os mesmos servidores e versões em `.codex/config.toml`, `.mcp.json` e `.cursor/mcp.json`. Mantenha essas três configurações alinhadas.
- Credenciais, escolhas pessoais de modelo e permissões individuais ficam fora da configuração compartilhada. Políticas administradas e a confiança no projeto podem limitar o carregamento.

## Claude Code

### Organização

- `CLAUDE.md`: importa `AGENTS.md` para carregar as políticas comuns.
- `.mcp.json`: MCPs compartilhados do projeto.
- `.claude/settings.json` e `.claude/hooks/*.mjs`: hooks de proteção de gerados e formatação de edições.
- `.claude/agents/*.md`: revisores `a11y-reviewer` e `public-api-reviewer`, com instruções de análise sem edição.
- `.claude/skills/`: skills do OpenSpec e cópias das skills próprias.
- `.claude/settings.local.json`: preferências locais, ignoradas pelo Git.

### Ativação

1. Inicie o Claude Code na raiz da worktree, para que os caminhos relativos dos hooks e do Prettier funcionem como configurados.
2. Revise a confiança no projeto e as autorizações dos MCPs solicitadas pelo Claude Code. Use `/mcp` para conferir servidores e `/hooks` para inspecionar os hooks carregados.
3. Confira a disponibilidade das skills e dos revisores na ferramenta. Após mudar configurações, abra uma nova sessão se elas não aparecerem.

### Hooks e limites

O projeto usa `PreToolUse` e `PostToolUse` com matcher `Edit|Write`. Os scripts leem `tool_input.file_path`: o primeiro bloqueia edição manual de lockfile, tokens gerados, distribuição de tokens e baselines visuais; o segundo executa o Prettier local para o arquivo editado.

Esses hooks não analisam escritas feitas por Bash ou por outros mecanismos. O formatador atual não roda se o Prettier estiver ausente e não comunica as falhas do subprocesso; instale as dependências e mantenha `npm run format` como gate. A implementação do Claude usa caminhos relativos e não oferece todas as verificações de normalização, movimentação e mensagens da implementação Codex descrita abaixo.

## Cursor

### Organização

- `AGENTS.md`: políticas do projeto, reconhecidas pelo Cursor.
- `.cursor/mcp.json`: MCPs compartilhados.
- `.agents/skills/`: skills próprias compartilhadas; `.cursor/skills/` contém as skills geradas do OpenSpec.

A documentação atual do Cursor também prevê descoberta de skills em `.claude/skills/` e de subagentes em `.claude/agents/` e `.codex/agents/` por compatibilidade. Por isso, confira quais revisores aparecem e a origem carregada, sem criar cópias adicionais nem presumir que nomes iguais serão mesclados.

### Ativação e limites

1. Abra a raiz da worktree como projeto no Cursor.
2. Nas configurações de MCP, confira os servidores definidos em `.cursor/mcp.json` e revise as autorizações solicitadas antes de usá-los.
3. Confira as skills e os subagentes disponíveis na área de personalização. Se uma alteração não aparecer, reabra a sessão ou recarregue o projeto.

Este repositório não possui `.cursor/hooks.json` nem revisores próprios em `.cursor/agents/`. Não presuma que os eventos e scripts configurados para Claude ou Codex executam automaticamente no Cursor. A formatação e a proteção de gerados continuam orientadas por `AGENTS.md`, pelo Prettier, pelo hook Git de pre-commit quando instalado e pelos gates de CI.

## Codex

### Organização

- `.codex/config.toml`: MCPs Context7 e Playwright com versões alinhadas a `.mcp.json` e `.cursor/mcp.json`. A configuração pessoal continua em `~/.codex/config.toml`.
- `.codex/agents/*.toml`: revisores `a11y-reviewer` e `public-api-reviewer`, equivalentes em objetivo aos do Claude, com instruções de somente análise e diff da branch e das alterações locais. Herdam modelo, ferramentas e permissões da sessão; o arquivo não cria uma sandbox de somente leitura.
- `.codex/hooks.json` e `.codex/hooks/*.mjs`: proteção e formatação de edições nativas `apply_patch`.

Mantenha credenciais, escolhas pessoais de modelo e permissões fora desses arquivos. A configuração do projeto só é carregada em projetos confiáveis e pode ser limitada por políticas administradas.

### Checkout com configuração local antiga

Se o checkout já contém uma `.codex` não versionada, preserve uma cópia antes de trazer os arquivos desta branch. O Git pode impedir a atualização para não sobrescrever esses arquivos locais. Revise diferenças e mantenha credenciais e preferências pessoais em `~/.codex/config.toml`; não descarte a configuração antiga automaticamente.

### Ativação

1. Use Node.js e Git disponíveis no PATH e instale as dependências com `npm ci` na worktree de trabalho.
2. Abra uma nova sessão Codex nessa worktree para carregar configuração e agentes. Confira os MCPs em `/mcp`.
3. Use `/hooks` no CLI para revisar e confiar nas definições dos hooks. Uma definição nova ou alterada precisa de nova revisão; hooks não confiáveis são ignorados. Não desabilite a verificação de confiança para ativar esta configuração.
4. Confira os hooks configurados antes de depender do comportamento automático. Os testes abaixo validam os comandos e payloads; não concedem confiança nem comprovam que uma sessão já aberta recarregou a configuração.

Os comandos dos hooks resolvem a raiz com `git rev-parse --show-toplevel` e usam Node com argumentos e stdin herdado. Funcionam a partir de subdiretórios e em worktrees com espaços no caminho, sem caminhos absolutos de máquina nem dependência de Bash no Windows.

### Comportamento dos hooks

O matcher `^apply_patch$` limita os hooks à ferramenta nativa de edição. O script lê o patch em `tool_input.command` (ou o argumento textual equivalente), incluindo Add, Update, Delete e Move.

Antes da edição, qualquer caminho protegido nega o patch inteiro e informa a ferramenta correta:

- `package-lock.json`: atualizar com npm;
- `packages/tokens/src/generated.ts`: atualizar pela fonte e geração de tokens;
- `packages/tokens/dist/`: atualizar por build;
- `e2e/*-snapshots/`: atualizar pelo workflow Linux de baselines, com revisão visual.

Origem e destino de movimentações são verificados. Caminhos relativos são resolvidos pelo `cwd` da chamada, e symlinks são considerados para não formatar arquivos fora da worktree. Payload inválido gera uma negação explícita no hook pré-edição.

Após uma edição, somente os arquivos finais existentes e não protegidos são enviados ao Prettier instalado no repositório. Remoções são excluídas. Tipos de arquivo desconhecidos pelo Prettier são ignorados. O subprocesso recebe nomes como argumentos, sem interpretação por shell. Se o Prettier estiver ausente ou falhar, o hook informa o problema e preserva a edição; `npm run format` continua obrigatório.

### Limites e validação

Esses hooks são uma ajuda para o fluxo de edição, não uma barreira completa de segurança. Não analisam comandos de terminal, ferramentas MCP de escrita ou todos os mecanismos de alteração de arquivo. Builds, geração de tokens e instalação de dependências continuam permitidos pelo fluxo normal. As políticas de `AGENTS.md`, permissões do Codex e os gates de CI continuam aplicáveis.

Execute a suíte específica:

```powershell
node --test scripts/codex-hooks.test.mjs
```

Ela também faz parte de `npm run test:ci` e de `npm run test:quality`. Cobre os comandos reais de hooks.json, payloads via stdin, paths de patch, movimentações, subdiretórios, espaços e symlinks, proteção de gerados e formatação com Prettier real. A execução em Linux é conferida na CI.

## Manutenção e verificação comum

Para atualizar as skills geradas após atualizar o CLI OpenSpec, execute `openspec.cmd update .`. Não edite essas skills manualmente. Consulte [Comandos do OpenSpec](openspec-commands.md).

Após alterar skills próprias em `.agents/skills`, execute:

```powershell
npm run sync:agent-skills
npm run check:agent-skills
```

Antes da entrega, execute as validações proporcionais exigidas em `AGENTS.md`, incluindo formatação e OpenSpec estrito quando aplicável. Hooks de ferramenta e revisores ajudam o fluxo, mas não substituem testes, CI ou revisão humana. Veja [workflow de desenvolvimento](ai-development-workflow.md) e [seleção de modelos](models.md).

## Referências oficiais

- Codex: [hooks](https://learn.chatgpt.com/docs/hooks), [agentes personalizados](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents), [MCP](https://learn.chatgpt.com/docs/extend/mcp#connect-codex-to-an-mcp-server) e [skills](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills).
- Claude Code: [configurações](https://code.claude.com/docs/en/settings) e [hooks](https://code.claude.com/docs/en/hooks).
- Cursor: [regras e AGENTS.md](https://cursor.com/docs/rules), [skills](https://cursor.com/docs/skills), [subagentes](https://cursor.com/docs/subagents) e [MCP](https://cursor.com/docs/mcp).
