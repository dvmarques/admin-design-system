## Approach
AGENTS.md permanece fonte única de políticas invariantes. O OpenSpec conserva regras de artefatos e orientações operacionais, mas reduz seu bloco de contexto descritivo, que será obtido dos arquivos de referência quando necessário. O índice de contexto aponta caminhos e critérios de leitura, sem duplicar documentação. docs/models.md define heurísticas e escalonamento em vez de uma versão fixa.

## Trade-offs
Referências sob demanda economizam tokens em tarefas localizadas, mas exigem uma leitura extra quando a tarefa cruza pacotes. As instruções obrigatórias permanecem disponíveis em AGENTS.md e nos gates automatizados.

## Verification
Revisar diferenças contra as regras anteriores, executar check:agent-skills, validação estrita OpenSpec e verificações documentais; registrar comparação de tokens usando o mesmo tokenizer e tarefas fixas quando houver ambiente de execução disponível.
