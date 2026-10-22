# Mapa de contexto para agentes

Use este índice **após** ler as regras obrigatórias de `AGENTS.md`. Consulte apenas os documentos relevantes para a tarefa; em mudanças transversais, siga as dependências.

| Escopo                      | Diretórios                               | Contexto sob demanda                                            | Validação prioritária                          |
| --------------------------- | ---------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------- |
| Tokens e temas              | `packages/tokens`                        | `docs/visual-identity.md`, `docs/visual-accessibility.md`       | geração, artefatos gerados, build e consumo    |
| Componentes públicos        | `packages/components`                    | `docs/architecture.md`, `docs/quality.md`, stories relacionados | testes focalizados, CSS, tipos, acessibilidade |
| Composições administrativas | `packages/admin`                         | `docs/architecture.md`, `docs/integration.md`                   | build, tipos, testes e consumo                 |
| Aplicação de demonstração   | `apps/admin-demo`                        | `docs/integration.md`                                           | build Next.js e E2E pertinente                 |
| Storybook                   | `apps/docs`                              | `docs/quality.md`, docs visuais se aplicável                    | build Storybook e stories afetadas             |
| Navegador                   | `e2e`                                    | `docs/quality.md`                                               | Playwright e snapshots intencionais            |
| OpenSpec                    | `openspec`                               | `docs/openspec-commands.md`, `CHANGELOG.md`                     | `openspec validate --all --strict`             |
| Release                     | `scripts/*release*`, `.github/workflows` | `docs/release-process.md`                                       | políticas de release e testes próprios         |
| CI e validação por impacto  | `scripts/ci-*`, `.github/workflows`      | `docs/ci-impact-validation.md`, `docs/release-process.md`       | `npm run test:ci`; `npm run validate:impact`   |
| Modelos e skills            | `.agents/skills`, `.claude`, `.cursor`   | `docs/models.md`, `skills-lock.json`                            | `npm run check:agent-skills`                   |

## Dependências relevantes

- `tokens → components → admin → admin-demo`: mudanças de contratos ou CSS podem exigir validação dos consumidores.
- `components → apps/docs`: novos componentes públicos precisam de stories, tipos e testes.
- `AGENTS.md` é a fonte única de políticas; `CLAUDE.md` apenas importa as instruções.
- `openspec/config.yaml` define regras de artefatos e operações, não substitui as políticas obrigatórias.

## Estratégia de leitura

1. Identificar issue, arquivos afetados e dependências; buscar nomes/símbolos antes de abrir diretórios inteiros.
2. Ler a spec ativa e os arquivos diretamente relacionados à alteração.
3. Ampliar a leitura quando a mudança atingir API pública, estilos distribuídos, acessibilidade ou integração.
4. Para releases e mudanças críticas, seguir a documentação completa aplicável, sem atalhos nos gates.

## Medição

Compare tarefas equivalentes antes/depois com modelo e configuração registrados. Registre tokens de entrada/saída quando expostos pela ferramenta, duração, tentativas, testes, falhas e retrabalho. Sem dados reais, não declare redução percentual comprovada. O mapa é uma otimização de descoberta, não uma dispensa de validação.
