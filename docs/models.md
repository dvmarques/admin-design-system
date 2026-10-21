# Seleção de modelos por tarefa

O modelo padrão **não é fixo por nome ou versão**. Escolha, entre os modelos disponíveis na assinatura/ferramenta, a menor capacidade que conclui a tarefa com qualidade e validação suficiente. Compare **custo efetivo por tarefa concluída** (tokens de entrada e saída, preço ou franquia, latência e retrabalho), não apenas preço por token.

| Classe | Exemplos | Escolha inicial | Escalonamento |
| --- | --- | --- | --- |
| Mecânica | Formatação, docs, tasks e ajustes pontuais | Modelo rápido/econômico; reasoning baixo | Falha repetida ou ambiguidade |
| Padrão | Componentes, testes, bugs reproduzíveis | Modelo equilibrado; reasoning médio | Integração complexa, falhas persistentes |
| Crítica | APIs públicas, acessibilidade complexa, arquitetura e segurança | Modelo de maior capacidade; reasoning alto | Revisão independente e evidências adicionais |

## Por fase OpenSpec

- **Proposal e tasks:** opção econômica quando escopo e critérios são claros.
- **Specs e design:** opção equilibrada; escalar em mudanças transversais ou contratos críticos.
- **Implementação:** usar o menor modelo que passa os testes focais; elevar após duas tentativas sem progresso ou identificação de risco.
- **Revisão crítica:** usar um modelo mais capaz ou revisão independente, com o diff e critérios de aceite, sem reler todo o repositório.
- **Sincronização e arquivamento:** opção econômica e validação automatizada.

## Política de contexto

1. Ler AGENTS.md e docs/agent-context-map.md; identificar pacotes e arquivos afetados.
2. Abrir documentação e specs **somente** dos contratos tocados; preferir diffs e trechos relevantes a arquivos inteiros.
3. Reutilizar resultados de testes e logs curtos; ampliar logs apenas para diagnóstico.
4. Após duas tentativas sem progresso, parar, registrar hipótese e ampliar contexto/modelo; não repetir o mesmo prompt.
5. Não reduzir testes ou requisitos obrigatórios para economizar tokens.

## Cursor Teams, Codex e Claude Code

Considere franquias e limites da assinatura, não só o custo nominal da API. Direcione tarefas mecânicas à opção de menor consumo de franquia, implementação padrão à ferramenta com melhor taxa de sucesso e revisão crítica à ferramenta/modelo de maior capacidade. Não assuma que nomes, preços, limites ou modelos disponíveis permanecem constantes; revise a matriz periodicamente.

## Benchmark

Para cada ferramenta, executar o mesmo conjunto de tarefas pequenas, médias e críticas em condições equivalentes. Registrar: versão do modelo, reasoning, contexto inicial (tokens), tokens totais de entrada/saída quando disponíveis, duração, número de tentativas, testes aprovados, retrabalho e custo/fração de franquia. Comparar mediana e taxa de sucesso antes/depois. Se o provedor não expuser tokens, registrar **não disponível**, sem estimar como medição real.
