# Codex no projeto

A configuração compartilhada usa os formatos atuais do Codex e não depende de arquivos locais do checkout principal.

## Organização

- `.agents/skills/`: skills de projeto, incluindo OpenSpec; não duplicar em `.codex/skills`.
- `.codex/config.toml`: MCPs Context7 e Playwright com versões alinhadas a `.mcp.json` e `.cursor/mcp.json`. A configuração pessoal continua em `~/.codex/config.toml`.
- `.codex/agents/*.toml`: revisores `a11y-reviewer` e `public-api-reviewer`, equivalentes em objetivo aos do Claude, com instruções de somente análise e diff da branch e das alterações locais. Herdam modelo, ferramentas e permissões da sessão; o arquivo não cria uma sandbox de somente leitura.
- `.codex/hooks.json` e `.codex/hooks/*.mjs`: proteção e formatação de edições nativas `apply_patch`.

Mantenha credenciais, escolhas pessoais de modelo e permissões fora desses arquivos. A configuração do projeto só é carregada em projetos confiáveis e pode ser limitada por políticas administradas.

## Checkout com configuração local antiga

Se o checkout já contém uma `.codex` não versionada, preserve uma cópia antes de trazer os arquivos desta branch. O Git pode impedir a atualização para não sobrescrever esses arquivos locais. Revise diferenças e mantenha credenciais e preferências pessoais em `~/.codex/config.toml`; não descarte a configuração antiga automaticamente. A implementação foi criada na worktree da tarefa e não altera a pasta local do checkout principal.

## Ativação

1. Use Node.js e Git disponíveis no PATH e instale as dependências com `npm ci` na worktree de trabalho.
2. Abra uma nova sessão Codex nessa worktree para carregar configuração e agentes. Confira os MCPs em `/mcp`.
3. Use `/hooks` no CLI para revisar e confiar nas definições dos hooks. Uma definição nova ou alterada precisa de nova revisão; hooks não confiáveis são ignorados. Não desabilite a verificação de confiança para ativar esta configuração.
4. Confira os hooks configurados antes de depender do comportamento automático. Os testes abaixo validam os comandos e payloads; não concedem confiança nem comprovam que uma sessão já aberta recarregou a configuração.

Os comandos dos hooks resolvem a raiz com `git rev-parse --show-toplevel` e usam Node com argumentos e stdin herdado. Funcionam a partir de subdiretórios e em worktrees com espaços no caminho, sem caminhos absolutos de máquina nem dependência de Bash no Windows.

## Comportamento dos hooks

O matcher `^apply_patch$` limita os hooks à ferramenta nativa de edição. O script lê o patch em `tool_input.command` (ou o argumento textual equivalente), incluindo Add, Update, Delete e Move.

Antes da edição, qualquer caminho protegido nega o patch inteiro e informa a ferramenta correta:

- `package-lock.json`: atualizar com npm;
- `packages/tokens/src/generated.ts`: atualizar pela fonte e geração de tokens;
- `packages/tokens/dist/`: atualizar por build;
- `e2e/*-snapshots/`: atualizar pelo workflow Linux de baselines, com revisão visual.

Origem e destino de movimentações são verificados. Caminhos relativos são resolvidos pelo `cwd` da chamada, e symlinks são considerados para não formatar arquivos fora da worktree. Payload inválido gera uma negação explícita no hook pré-edição.

Após uma edição, somente os arquivos finais existentes e não protegidos são enviados ao Prettier instalado no repositório. Remoções são excluídas. Tipos de arquivo desconhecidos pelo Prettier são ignorados. O subprocesso recebe nomes como argumentos, sem interpretação por shell. Se o Prettier estiver ausente ou falhar, o hook informa o problema e preserva a edição; `npm run format` continua obrigatório.

## Limites e validação

Esses hooks são uma ajuda para o fluxo de edição, não uma barreira completa de segurança. Não analisam comandos de terminal, ferramentas MCP de escrita ou todos os mecanismos de alteração de arquivo. Builds, geração de tokens e instalação de dependências continuam permitidos pelo fluxo normal. As políticas de `AGENTS.md`, permissões do Codex e os gates de CI continuam aplicáveis.

Execute a suíte específica:

```powershell
node --test scripts/codex-hooks.test.mjs
```

Ela também faz parte de `npm run test:ci` e de `npm run test:quality`. Cobre os comandos reais de hooks.json, payloads via stdin, paths de patch, movimentações, subdiretórios, espaços e symlinks, proteção de gerados e formatação com Prettier real. A execução em Linux é conferida na CI.

Referências oficiais: [hooks](https://learn.chatgpt.com/docs/hooks), [agentes personalizados](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents), [MCP](https://learn.chatgpt.com/docs/extend/mcp#connect-codex-to-an-mcp-server) e [skills](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills).
