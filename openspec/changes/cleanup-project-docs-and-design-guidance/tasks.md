## 1. Documentação atual

- [ ] 1.1 Atualizar `README.md`: retirar CoreUI como referência, usar o presente, substituir “Tecnologias planejadas” e condensar “Estado atual” em capacidades e links, sem repetir o histórico de changes.
- [ ] 1.2 Atualizar `docs/architecture.md`: conferir os nomes nos exports de `packages/*`, corrigir aplicações e componentes descritos no futuro e retirar a ressalva específica sobre CoreUI PRO.
- [ ] 1.3 Corrigir a introdução e os itens obsoletos de `docs/limitations.md`, preservando limites técnicos e responsabilidades do consumidor.
- [ ] 1.4 Simplificar `docs/licensing.md` sem eliminar atribuições, licenças, origens de materiais ou os avisos da Inter e de `@fontsource/inter`.
- [ ] 1.5 Revisar o restante de `docs/`, especialmente `docs/visual-identity.md`, para retirar textos de etapa concluída e referências operacionais obsoletas a roadmap; preservar publicação npm pendente, limitações reais e links técnicos úteis.

## 2. Orientações de projeto e skills

- [ ] 2.1 Atualizar `openspec/config.yaml` para orientar novas changes pela identidade e implementação próprias, substituindo a diretriz CoreUI e generalizando o respeito a licenças.
- [ ] 2.2 Registrar em `AGENTS.md` a precedência da identidade atual e dos tokens sobre preferências genéricas de skills, mantendo a Inter.
- [ ] 2.3 Ajustar `.agents/skills/high-end-visual-design/SKILL.md`: retirar a proibição de Inter e as imposições de estética externa, variação visual e estilos incompatíveis com os tokens existentes.
- [ ] 2.4 Ajustar `.agents/skills/design-taste-frontend/SKILL.md` e `.agents/skills/redesign-existing-projects/SKILL.md` para preservar a Inter e impedir substituições automáticas de identidade, componentes ou dependências por referências externas.
- [ ] 2.5 Executar `npm run sync:agent-skills` e `npm run check:agent-skills`; revisar a proveniência em `skills-lock.json` sem inventar hashes upstream e sem editar skills geradas do OpenSpec.

## 3. Histórico e coerência

- [ ] 3.1 Revisar ocorrências de CoreUI, PrimeReact, shadcn/ui, Ant Design, Chakra UI e sites de referência nas fontes atuais; retirar orientações de imitação e registrar a justificativa de referências técnicas ou legais preservadas.
- [ ] 3.2 Conferir menções a roadmap, próximos passos, pendências e andamento: remover resíduos desatualizados sem recriar `docs/roadmap.md`, apagar o arquivo histórico ou alterar exemplos funcionais.
- [ ] 3.3 Adicionar a entrada da limpeza em `CHANGELOG.md`, preservando headings, versões, entradas existentes e a seção `Em andamento` usada pela automação de release.
- [ ] 3.4 Revisar links locais e confirmar que o diff preserva código dos pacotes e apps, CSS, tokens, dependências, specs principais, changes arquivadas e baselines.

## 4. Validação e conclusão

- [ ] 4.1 Formatar os arquivos alterados com Prettier e executar `npm run format`, corrigindo falhas.
- [ ] 4.2 Executar `openspec validate cleanup-project-docs-and-design-guidance --strict` e `openspec validate --all --strict`, confirmando o tratamento de `skip_specs: true`.
- [ ] 4.3 Executar `npm run lint`, `npm run build`, `npm run typecheck` e `npm run test:quality`, preservando códigos de falha e investigando problemas com a saída de diagnóstico.
- [ ] 4.4 Executar `npm run test:e2e` e confirmar ausência de falhas; esta limpeza não deve exigir atualização de snapshots.
- [ ] 4.5 Revisar o diff final e registrar comandos executados e limitações de validação. Arquivar a change somente depois da implementação e dos checks obrigatórios.
