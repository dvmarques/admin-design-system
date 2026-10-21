## Why
As instruções dos agentes e o contexto do OpenSpec repetem contratos e políticas. O custo de leitura e exploração cresce mesmo em alterações pequenas; a recomendação de modelos é fixa e envelhece rapidamente.

## What Changes
- Concentrar regras invariantes no AGENTS.md e substituir duplicações extensas do contexto OpenSpec por referências direcionadas.
- Introduzir um índice conciso de caminhos e dependências do monorepo para leitura sob demanda.
- Atualizar a política de seleção de modelos por complexidade e orçamento, sem atrelar o processo a nomes ou preços temporários.
- Documentar um benchmark reproduzível de contexto e correção.

## Impact
- Arquivos: AGENTS.md, openspec/config.yaml, docs/models.md e docs/agent-context-map.md.
- Nenhuma API pública ou comportamento de componentes muda.
- Compatibilidade com Claude Code, Cursor, Codex e processo de release preservada.

## Out of Scope
- Otimização de CI, execução incremental de testes e orquestração Issue → PR (issues #164 e #163).
- Alterações de dependências ou identidade visual.
