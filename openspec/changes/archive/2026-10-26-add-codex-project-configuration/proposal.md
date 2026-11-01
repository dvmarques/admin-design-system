# Configuração compartilhada do Codex

## Why

O projeto compartilha hooks e revisores para Claude Code, mas o Codex depende de arquivos locais não versionados. Configurar o Codex no formato oficial permite reproduzir as ferramentas e os cuidados de edição em clones e worktrees.

## What Changes

- Adicionar `.codex/config.toml`, `.codex/hooks.json`, scripts de hooks e dois revisores TOML.
- Ler o payload nativo de `apply_patch`, incluindo múltiplos arquivos e movimentações, com resolução relativa à worktree atual.
- Testar o contrato dos hooks e documentar ativação, confiança e limites.
- Manter skills em `.agents/skills` e preservar as configurações existentes de Claude/Cursor.
- Fora do escopo: sandbox, permissões pessoais, modelos fixos, alterações em componentes, identidade e dependências de runtime.

## Capabilities

### New Capabilities

- `agent-project-configuration`: configuração Codex compartilhada, revisão especializada e hooks de edição portáveis.

### Modified Capabilities

Nenhuma.

## Impact

Afeta `.codex`, scripts de testes, `package.json`, orientações de agentes e documentação de desenvolvimento. Nenhum pacote ou API Ads* muda; biblioteca e aplicações não exigem implementação, stories ou ajustes visuais. Consumidores se beneficiam da consistência do processo.

## Perfil

Standard: comportamento interno de tooling, sem alteração das permissões do Codex nem da superfície pública. Hooks são uma ajuda de edição, não uma barreira de segurança completa. Manter gates do repositório.

Acompanhamento: [issue #209](https://github.com/dvmarques/admin-design-system/issues/209), na PR #208.

## Guia unificado dos agentes

A pedido do usuário, substituir o guia exclusivo do Codex por `docs/agent-setup.md`, reunindo base comum, configuração, ativação e limites reais de Codex, Claude Code e Cursor. Preservar os detalhes do Codex e atualizar os links. Incremento exclusivamente documental, sem mudar comportamento ou exigir novos deltas de specs.
