# Inventário de auditoria visual (#152)

## Why

O catálogo cobre exports públicos e stories, mas a #152 precisa separar cobertura cadastrada de inspeção visual comprovada, sem perda de evidências.

## What Changes

- Matriz inicial de inspeções pendentes, vinculada às fontes existentes.
- Verificador não destrutivo de correspondência entre catálogo, Storybook e matriz, com teste em `test:ci`.
- Protocolo documentado para estados, temas, viewports e findings.
- Auditor opcional com capturas Chromium (390px/1440px; light/dark), métricas e relatório Markdown/JSON, com workflow manual para publicar os artefatos.

## Perfil e impacto

**Standard**: adiciona uma suíte Playwright opt-in e relatório automatizado de geometria, sem alterar o runtime público, API, CSS, token, snapshot oficial ou dependência nova. Pacotes distribuídos e consumidores não são afetados. Sem entrada pública no CHANGELOG porque não há alteração observável por consumidores.

## Fora do escopo

Aprovar visualmente todos os estados, corrigir componentes, atualizar baselines oficiais, fechar #152, mudar #91 ou redesenhar componentes.
