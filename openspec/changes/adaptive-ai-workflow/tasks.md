## 1. Planejamento

- [x] 1.1 Definir matriz objetiva Fast / Standard / Critical e critérios de promoção.
- [x] 1.2 Especificar limites de simplificação sem alterar schema ou gates obrigatórios.

## 2. Implementação

- [x] 2.1 Criar guia com três exemplos completos e checkpoints.
- [x] 2.2 Criar skill reutilizável de orquestração, com passos Issue → PR → CI → code review.
- [x] 2.3 Integrar referência em AGENTS.md e instruções OpenSpec.
- [x] 2.4 Sincronizar skills próprias para Claude e verificar registro em skills-lock.json.

## 3. Revisão e validação

- [x] 3.1 Revisar critérios de classificação e consistência com políticas de release e agentes.
- [ ] 3.2 Validar OpenSpec estrito, formatação, lint, build, tipos e check:agent-skills.
- [ ] 3.3 Executar E2E completo antes de concluir, registrar evidência e corrigir falhas.
- [ ] 3.4 Abrir PR para develop, verificar CI e encaminhar para code review.

## Evidências e limitações

- Skill canônica e cópia Claude com conteúdo idêntico, ambas registradas no lockfile para checagem de sincronia.
- Cenários Fast/Standard/Critical documentados com gatilhos de promoção e gates humanos.
- Os testes automatizados e a CI ainda não foram executados nesta sessão de edição remota; manter 3.2 e 3.3 abertos até comprovação.
