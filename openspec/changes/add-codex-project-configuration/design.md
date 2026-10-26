# Design

## Context

O Claude usa PreToolUse/PostToolUse de Edit|Write e `file_path`; o Codex usa `apply_patch` e `tool_input.command`. A configuração local antiga não é fonte da implementação. Referências oficiais: https://learn.chatgpt.com/docs/hooks, https://learn.chatgpt.com/docs/agent-configuration/subagents e https://learn.chatgpt.com/docs/extend/mcp.

## Goals / Non-Goals

Disponibilizar recursos equivalentes no formato nativo Codex. Não alterar Claude/Cursor, modelos, sandbox, permissões, produto ou skills OpenSpec. Acessibilidade, temas, Server/Client Components, Tailwind, CSS distribuído e bundles não são afetados; stories e exemplos existentes permanecem aplicáveis.

## Decisions

- Configuração de MCP em `.codex/config.toml`, revisores TOML em `.codex/agents` e ciclo de edição em `.codex/hooks.json`. Sem `.codex/skills` duplicada.
- Hooks síncronos com matcher `^apply_patch$`, leitura de todos os cabeçalhos Add/Delete/Update/Move e normalização por `cwd` e raiz Git. Negar caminhos fora do repositório ou resolvidos por symlink para fora antes de formatar; não interpretar conteúdo como comandos.
- Bootstrap Node idêntico em Windows/Linux resolve a raiz com Git e inicia o hook com argumentos e stdin herdado. Evita caminhos absolutos da máquina, dependência de Bash/PowerShell e execução a partir do checkout errado.
- Compartilhar extração de caminhos e regras entre os dois hooks Codex, sem modificar as implementações do Claude. Hooks pré-edição negam payload inválido; pós-edição reporta falhas sem reverter edições. Prettier do próprio repositório, sem dependências novas e sem shell para nomes de arquivos.
- Revisores herdam modelo/permissões da sessão. Instruções de somente leitura não representam uma sandbox adicional; o esquema atual não permite impor sandbox por agente.
- Testes Node de integração com stdin JSON e comandos declarados em hooks.json, executados pelo gate `test:quality` via `test:ci`.

## Risks / Trade-offs

- Hooks precisam de confiança → documentar ativação manual pelo usuário, sem bypass.
- Edições por shell não produzem patch → declarar limite, manter lint, format, testes e políticas como gates reais.
- Mudança de formato do Codex → testes do payload oficial e documentação de referência; erros de payload são explícitos.
- Falha de formatação → mensagem no hook e gate `npm run format` continua obrigatório.

## Migration Plan

Versionar a configuração, testar os hooks e atualizar a PR existente com escopo claro. Novas sessões carregam configuração e agentes; revisar hooks em `/hooks`. Reversão por commit, sem alteração em dados, tags, pacotes ou configurações pessoais.
