## Documentação pós-publicação

- [x] 1.1 Remover avisos de pré-publicação e atualizar instalação no README principal e nos quatro READMEs de pacote.
- [x] 1.2 Atualizar o guia de integração com instalação pelo registry, versão publicada fixa e exemplos existentes.
- [x] 1.3 Corrigir menções de disponibilidade obsoletas na documentação Pages, desenvolvimento e histórico por componente.
- [x] 1.4 Generalizar as instruções de bootstrap e documentar a expiração e recriação dos Trusted Publishers.
- [x] 1.5 Registrar a mudança na seção `[0.1.2] - Em andamento`, sem modificar a versão fechada `[0.1.1]`.
- [x] 1.6 Atualizar a regra dinâmica de versão do CHANGELOG em `AGENTS.md` e o texto editorial da página de API no demo.
- [x] 1.7 Executar `npm run format`, `openspec.cmd validate --all --strict` e `git diff --check`.
- [x] 1.8 Buscar avisos e links para anchors removidos/renomeados em docs, OpenSpec, apps, pacotes, E2E e workflows; conferir os testes do texto editorial e `npm view` dos quatro pacotes.

## Evidências

- `npm run format`: passou.
- `openspec.cmd validate --all --strict`: 66/66 itens passaram após o archive.
- `git diff --check`: passou.
- Busca por `docs/integration.md#antes-da-primeira-publicação-npm`, âncoras de headings renomeados e avisos em docs, OpenSpec, apps, packages, E2E e `.github`: sem referências obsoletas. Os links mantidos para `#tema-fonte-e-hidratação` continuam válidos.
- `e2e/highlighted-code-demo.spec.ts` verifica headings, regiões acessíveis e interação sem assertar o texto editorial antigo. Snapshots visuais não cobrem a rota `/catalogo`.
- `npm view` de cada um dos quatro pacotes `@dvmarques/admin-ds-* @0.1.1` confirmou versão e `dist.integrity`; `packages/highlighted-code/package.json` declara `private: false`.
