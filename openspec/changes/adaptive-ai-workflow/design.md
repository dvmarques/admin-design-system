## Decision

A classificação é uma política documental sobre profundidade de análise e artefatos, **não** um novo schema do OpenSpec. Mantemos `schema: spec-driven` e os templates/validadores oficiais.

- Fast: alteração restrita e sem impacto público; proposal, design, tasks e spec delta são escritos de forma concisa quando exigidos pelo schema. Para documentação/tooling sem requisito de produto, registrar justificativa e seguir o comportamento permitido pelo OpenSpec; nunca fabricar requisitos.
- Standard: comportamento interno ou componente não crítico, com cenários e integração proporcionais.
- Critical: contratos públicos, tokens, temas, acessibilidade complexa, arquitetura, licenciamento ou release; revisar compatibilidade, consumidores e riscos.

A skill conduz o trabalho e para em gates humanos. Ao detectar risco novo, promove a classificação, atualiza artefatos e repete a validação aplicável. Os comandos oficiais continuam sendo a fonte de verdade.

## Risks

- Fast ser interpretado como permissão para pular E2E: proibição explícita.
- Documentação duplicada divergir: AGENTS.md aponta para guia e skill aponta para o mesmo guia.
- Skills de agentes divergirem: manter `skills-lock.json` e sincronização; validação obrigatória.

## Verification

- Validar change em modo estrito e executar check:agent-skills, format, lint, build, typecheck e E2E.
- Exercitar três cenários documentados, verificando escolha de perfil, promoção e gates.

## Alternativas e limites

Criar schemas próprios por perfil aumentaria manutenção e divergência; por isso usamos a política documental sobre o schema existente. Não há alterações em Server/Client Components, acessibilidade de componentes, Tailwind, CSS distribuído, tokens, limites de pacotes, APIs, bundle ou dependências. Os exemplos de acessibilidade e consumo são critérios para futuras changes, não implementação desta entrega.

## Ciclo de CI

Draft protege o trabalho incompleto, mas não executa CI neste repositório. Após implementação e validações locais, Ready for review dispara os checks. A revisão verifica o SHA atual, distingue jobs pulados e mantém merge sujeito à aprovação humana.
