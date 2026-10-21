# Validação e revisão

## CI da implementação antes da atualização de base

A [execução completa da PR #124](https://github.com/dvmarques/admin-design-system/actions/runs/39632628432)
validou o commit `56e1cee0f98913dd4fd7881efc6caf5c70a4a957` com sucesso:

- Qualidade rápida: formatação, lint, builds dos pacotes, tipos e testes de qualidade.
- Testes unitários: 506 testes em 42 arquivos.
- Chromium: 137 testes, incluindo os snapshots existentes.
- Firefox: 4 testes de smoke.
- WebKit: 4 testes de smoke.
- Artefatos de distribuição: builds dos pacotes, Storybook e demo, e inspeção dos pacotes.
- Política de develop: regras de integração e OpenSpec estrito.

O job de release não se aplica a uma PR para `develop` e ficou skipped.
Nenhum teste dos jobs aplicáveis foi dispensado pela classificação de documentação.

## Validação local antes da atualização de base

Executados com Node.js 24 e dependências reinstaladas com npm `11.19.1` pelo lockfile:

- Prettier nos arquivos alterados, incluindo as skills ignoradas pela verificação geral.
- `npm run format`, `npm run lint`, `npm run build` e `npm run typecheck`.
- `npm run test:quality`, incluindo os 506 testes unitários, testes de Node,
  release, política de CI, geração de tokens e sincronia das skills.
- `npm run sync:agent-skills` e `npm run check:agent-skills`.
- `openspec validate cleanup-project-docs-and-design-guidance --strict`.
- `openspec validate --all --strict`: 41 itens aprovados, sem falhas.
- `git diff --check` e conferência dos links locais alterados.

A tentativa local de `npm run test:e2e` não foi uma execução aprovada: terminou
com 130 testes aprovados, sete falhas de comparação de snapshots escuros e uma
falha de inicialização do Firefox; um teste foi interrompido e seis não rodaram.
O Firefox registrou restrições de sandbox e caches sem escrita; o instalador do
Playwright também avisou sobre bibliotecas ausentes para o WebKit. A comparação
visual inspecionada mostrou diferenças pequenas na renderização das letras.
Os baselines foram preservados. A matriz oficial da CI aprovou os mesmos 145
testes nos três navegadores, incluindo os snapshots.

## Revisão do escopo

- Nenhum código de produto, CSS, token, dependência, baseline ou script de release alterado.
- Specs principais e changes arquivadas preservadas; `docs/roadmap.md` não foi recriado.
- Licenças e origem das skills preservadas; versões de dependências continuam nos manifests e lockfile.
- Referências externas restantes pertencem ao histórico, à proveniência ou à documentação técnica.
- Seção `Em andamento`, versões e entradas anteriores do changelog preservadas.
- Change mantida ativa durante a revisão; arquivamento e squash merge autorizados pelo responsável após a aprovação.

## Atualização de base

A branch incorporou `develop` em `be6d9260d3c644948c6feb9ee465c9bbab895633`,
que adicionou `AdsSparkline` e sua integração no `AdsMetricCard`. A resolução
preservou a funcionalidade, os testes, as specs e os baselines dessa entrega,
e atualizou os textos de recursos, arquitetura e limites de gráficos.
O diff desta PR em relação à nova base continua restrito à documentação e
às orientações de agentes.

Os números acima identificam a execução anterior à atualização de base. A CI
completa do commit final, já integrado à base atualizada, é conferida e vinculada
na descrição da PR antes da entrega para revisão.

## Observações da revisão

As duas observações de proveniência da [revisão da PR](https://github.com/dvmarques/admin-design-system/pull/124#issuecomment-6321064762)
foram atendidas:

- A declaração histórica sobre o CoreUI foi preservada abaixo, sem restabelecer
  uma orientação de design para novos trabalhos.
- A origem das três skills foi registrada em `docs/licensing.md`, com a licença
  MIT conferida na origem e uma cópia integral do aviso em
  `docs/licenses/taste-skill-LICENSE.txt`. Os hashes de importação não foram alterados.

### Registro histórico de proveniência

Antes da limpeza, `docs/licensing.md` no commit
`a4b06a20aaf960b5760579fed2ad4aa05020ad9e` registrava:

> O CoreUI foi usado somente como referência visual e funcional; nenhum código,
> asset, ícone, fonte ou recurso proprietário do CoreUI PRO foi incorporado ao
> repositório.

Este registro preserva a declaração existente antes da limpeza; não representa
uma nova auditoria de proveniência. A documentação atual orienta o desenvolvimento
pela identidade própria do projeto.

## Arquivamento

Após a revisão e a autorização do responsável, a change foi arquivada em
`2026-10-21-cleanup-project-docs-and-design-guidance`, com 22 de 22 tarefas concluídas.
O CLI confirmou `skip_specs: true` e ausência de delta specs; não havia requisitos
a sincronizar, e as specs principais permaneceram inalteradas.

A [CI anterior ao arquivamento](https://github.com/dvmarques/admin-design-system/actions/runs/39635884903)
aprovou os seis checks aplicáveis no commit `81f841ff9abcab12210f72ff7bc08e3d52fe4420`.
A movimentação para o arquivo e este registro são publicados na mesma PR #124;
a CI do novo head é conferida antes do squash merge para `develop`.
