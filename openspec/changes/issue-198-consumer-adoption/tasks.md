## 1. Preparação e OpenSpec

- [x] 1.1 Conferir #198, dependências encerradas, contratos dos pacotes, skill adaptativa, configuração OpenSpec e guias existentes.
- [x] 1.2 Criar branch `docs/issue-198-consumer-adoption` a partir de `develop` e a change spec-driven; revisar escopo e risco Fast.
- [x] 1.3 Validar a change em OpenSpec estrito e corrigir inconsistências encontradas. Gate `Política de develop` da CI #279 no SHA `16886ae` passou com OpenSpec 1.15.0 estrito.

## 2. Documentação da entrada de adoção

- [x] 2.1 Reestruturar README raiz: preservar logo claro/escuro, proposta de valor real, Demo/Storybook, instalação progressiva, exemplo Next.js, tabela dos quatro pacotes, temas, limitações, licenciamento e contribuição curta.
- [x] 2.2 Completar READMEs de tokens, components, admin e highlighted-code com requisitos, exemplos, CSS, peers, opt-in e links absolutos válidos no npm.
- [x] 2.3 Documentar em integração exemplo externo reproduzível com CSS em ordem, limites Server/Client, fonte, tema e ausência de Tailwind no consumidor; conferir contra manifests/exports da #194.

## 3. Identidade, histórico e rastreabilidade

- [x] 3.1 Retirar o guia de migração pré-lançamento e seus links; orientar diretamente nomes públicos dos pacotes e opções atuais de controle de tema.
- [x] 3.2 Atualizar changelog por componente com ThemeControl, AccountMenu, NotificationCenter, OrganizationSwitcher, evolução do shell e referências #182, #185 e #187, sem inventar versões publicadas.
- [x] 3.2a Criar `docs/development.md` com ambiente, instalação, build, execução da Demo/Storybook, estrutura, testes, OpenSpec, CI, release e troubleshooting; linkar no README/CONTRIBUTING.
- [x] 3.3 Revisar limitações por componente, tema, acessibilidade e demonstração, preservando a diferença entre validação manual e automatizada.
- [x] 3.4 Corrigir exclusões descritas em `docs/admin-demo-catalog.md` de acordo com o teste real, incluindo `getAdsSmartTableCsv`; não alterar o teste.
- [x] 3.5 Registrar efeito em `CHANGELOG.md` e conferir links cruzados, disponibilidade pré-npm e fronteira documental da #195.

## 4. Revisão e validação

- [x] 4.1 Revisar cada snippet com exports, manifests e CSS reais; conferir ausência de imports internos e dependência obrigatória de Shiki/máscara.
- [x] 4.2a Conferir na CI do SHA `a667e37` `npm run format`, lint, builds, typecheck, `npm run test:quality`, distribuição e OpenSpec 1.15.0 estrito, mais Playwright em Chromium, Firefox e WebKit: [CI 41221157015](https://github.com/dvmarques/admin-design-system/actions/runs/41221157015), concluída com sucesso.
- [ ] 4.2b Executar e registrar separadamente no checkout local os comandos `npm run validate` e OpenSpec estrito conforme AGENTS, se exigida prova da execução local; indisponíveis nesta sessão (sem checkout/dependências). A CI executou os gates equivalentes, mas **não** executou o comando agregado `npm run validate` nem constitui teste local. Não marcar como executado sem prova.
- [x] 4.3a Abrir PR Draft #279 para `develop`, aplicar label/assignee e marcar Ready for review.
- [x] 4.3b Conferir CI do SHA `a667e37` da PR #279: [CI](https://github.com/dvmarques/admin-design-system/actions/runs/41221157015), [Security Gate](https://github.com/dvmarques/admin-design-system/actions/runs/41221156967) e [Pages](https://github.com/dvmarques/admin-design-system/actions/runs/41221156900) concluídos com sucesso. Release skipped por não ser release. **Reverificar checks do novo SHA deste commit documental antes de aprovar**; sem archive ou merge.

## Evidências da revisão estática

- Branch e change registradas, com proposta, design, tasks e delta de spec.
- README principal com imagem original, quatro READMEs de pacote, guia de desenvolvimento, integração externa, histórico, limitações e catálogo revisados e commitados; guia de migração pré-lançamento removido; CHANGELOG da versão em andamento atualizado.
- Nomes, imports, `package.json#exports`, peer `react-imask` e Shiki opcional comparados ao código/manifests de `develop`; correção do exemplo de `ReactNode` na revisão.
- A lista de exclusões do catálogo foi corrigida para incluir `getAdsSmartTableCsv`, conforme o teste existente, sem alteração do teste.
- Links e anchors cruzados entre README, integração, desenvolvimento, limitações e histórico revisados estaticamente; referências ao guia retirado corrigidas.
- Verificação integrada na PR #279, SHA `a667e37e89f58afa2ab915e6249a2291269324d3`: CI [41221157015](https://github.com/dvmarques/admin-design-system/actions/runs/41221157015) **success** (Política de develop/OpenSpec estrito, Prettier, lint, builds, tipos, qualidade, artefatos de distribuição e E2E Chromium/Firefox/WebKit); Security Gate [41221156967](https://github.com/dvmarques/admin-design-system/actions/runs/41221156967) **success**; Pages [41221156900](https://github.com/dvmarques/admin-design-system/actions/runs/41221156900) **success**. Validação de release corretamente `skipped` (não é release). As falhas antigas de Prettier foram corrigidas e não reapareceram nesse SHA.
- Conferidos os exemplos de App Router e imports CSS com os manifests/exports reais dos quatro pacotes; o smoke externo dos tarballs foi executado na #194. Os alvos de links internos, os SVGs e as âncoras essenciais foram revisados estaticamente; a resposta HTTP das páginas públicas Demo/Storybook não pôde ser testada neste ambiente, embora o workflow Pages tenha passado.
- Não houve execução local nesta sessão de `npm run validate`, de `npx prettier --write` ou de `npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive`, por ausência de checkout e dependências; não descrever CI como execução local. A primeira publicação real no npm permanece pendente na #195 e não bloqueia esta documentação.
- Qualquer commit posterior a `a667e37` (incluindo esta atualização de evidências) altera o SHA da PR; conferir as novas execuções de CI antes do handoff para revisão humana.

## Evidências e limites

A execução desta sessão usa GitHub conectado, sem checkout de trabalho no container; validação de comandos locais depende de ambiente com Node 24.15+/npm 11.19.1 ou CI da PR. Tasks não verificadas permanecem abertas.
