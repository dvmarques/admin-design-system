# Inventário de auditoria visual (#152)

## Why

O catálogo cobre exports públicos e stories, mas a #152 precisa separar cobertura cadastrada de inspeção visual comprovada, sem perda de evidências.

## What Changes

- Matriz inicial de inspeções pendentes, vinculada às fontes existentes.
- Verificador não destrutivo de correspondência entre catálogo, Storybook e matriz, com teste em `test:ci`.
- Protocolo documentado para estados, temas, viewports e findings.

## Perfil e impacto

**Fast**: somente documentação e tooling interno; nenhum runtime, API pública, CSS, token, snapshot ou dependência nova. Pacotes distribuídos e consumidores não são afetados. Sem entrada pública no CHANGELOG porque não há alteração observável por consumidores.

## Fora do escopo

Auditoria visual executada, correções, atualização de baselines, fechar #152, mudar #91 ou redesenhar componentes.
