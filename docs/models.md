# Modelos recomendados por fase

Use o **GPT-5.6 Terra com reasoning `medium`** como padrão. Ele oferece o
melhor equilíbrio entre qualidade, velocidade e consumo. Reserve o
**GPT-5.6 Sol** para decisões complexas, problemas difíceis e validações
críticas.

| Fase | Modelo | Reasoning |
| --- | --- | --- |
| Explorar e criar proposta | Terra | `medium` |
| Atualizar proposta ou executar tarefas mecânicas | Terra | `low` ou `medium` |
| Implementar e testar | Terra | `medium` |
| Arquitetura complexa ou investigação de bugs difíceis | Sol | `high` |
| Revisão final de mudanças críticas | Sol | `high` |
| Sincronizar specs e arquivar | Terra | `low` |

## Proposal, spec e tasks

| Artefato ou etapa | Modelo | Reasoning | Uso recomendado |
| --- | --- | --- | --- |
| Proposal | GPT-5.6 Terra | `medium` | Definir objetivo, escopo e impactos |
| Spec | GPT-5.6 Sol | `high` | Garantir precisão, consistência e cobertura de cenários |
| Criação das tasks | GPT-5.6 Terra | `medium` | Dividir a spec em etapas claras e executáveis |
| Implementação das tasks | GPT-5.6 Terra | `medium` | Implementar tarefas que já estão bem detalhadas |

Para economizar, uma spec simples também pode começar com Terra
`medium`. Use Sol `high` quando houver decisões arquiteturais, requisitos
ambíguos, riscos relevantes ou muitos cenários de borda.

## Regra prática

Realize 80–90% do trabalho com Terra. Comece em `medium`, reduza para
`low` em tarefas simples e use Sol com `high` apenas quando o ganho de
qualidade justificar mais tempo e tokens. Evite `xhigh` e `max` no fluxo
normal.

## Quando aumentar o reasoning

Considere aumentar o nível quando a tarefa envolver:

- decisões arquiteturais com impacto em vários pacotes;
- investigação de falhas difíceis de reproduzir;
- compatibilidade entre Server e Client Components;
- acessibilidade de componentes interativos complexos;
- revisão de segurança ou mudanças incompatíveis de API;
- diagnóstico de divergências de hidratação ou empacotamento.

Para alterações documentais, atualizações de checklists e tarefas
mecânicas, `low` ou `medium` normalmente é suficiente.
