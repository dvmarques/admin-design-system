# Proposal — #198: documentação de adoção para distribuição npm

## Why

A preparação dos quatro tarballs foi concluída na #194 e a referência navegável de API existe após a #193, mas a primeira visita ao README continua centrada no monorepo. Um consumidor precisa conhecer as responsabilidades dos pacotes, instalar apenas os necessários, importar CSS corretamente e migrar APIs sem confundir preparação com publicação efetiva.

## What Changes

- Reorganizar o README principal como ponto de entrada para consumidores: benefícios reais, Demo/Storybook, instalação, App Router, quatro pacotes, temas, limitações, migração e documentação; contribuição e release ficam em guias próprios.
- Completar os quatro READMEs exibidos no npm com escopo, casos de uso, peers, CSS, exemplo mínimo e links absolutos.
- Disponibilizar caminho de adoção progressiva reproduzível nos guias, usando apenas exports públicos e sem exigir Tailwind ou código de workspace; destacar máscaras e Shiki como opt-ins.
- Consolidar a migração dos quatro nomes e de ThemeToggle para AdsThemeControl sem depreciação fictícia; localizar limitações e histórico por componente; reconciliar exclusões do catálogo com o teste real.
- Distinguir com rigor pacotes preparados em tarballs de pacotes realmente publicados no npm. A atualização posterior de disponibilidade, após confirmação da #195, será responsabilidade do fluxo de publicação.

## Capabilities

### New Capabilities

- `consumer-adoption`: orientação verificável de instalação, integração, migração e descoberta pública.

### Modified Capabilities

Nenhuma alteração comportamental nas capabilities existentes: esta change introduz apenas requisitos de documentação consumidora, sem modificar os contratos runtime da biblioteca.

## Impact

Perfil **Fast** (skill `adaptive-ai-workflow`): edição exclusivamente de Markdown, sem mudança de API pública, compilação, CSS, testes ou release. Consumidores de React/Next.js ganham caminhos explícitos; `apps/admin-demo` e `apps/docs` são somente referências. Documentação afetada: README raiz, quatro READMEs dos pacotes, `docs/integration.md`, `docs/migration-guide.md`, `docs/component-changelog.md`, `docs/limitations.md`, `docs/admin-demo-catalog.md`, `CHANGELOG.md`.

## Fora do escopo e dependências

Dependências já concluídas: #194 (tarballs), #193 (API Storybook), #196 (política da CI) e #192 (foco do ConfirmDialog). A #195 publica no npm depois; não escolher versão, publicar, criar tags ou alterar workflow aqui. #197 mantém histórico separado; #182, #185 e #187 são fontes do histórico. Não mover evidências, alterar código nem reabrir issues anteriores.

## Critérios verificáveis

Conferir imports e CSS com `exports` e fontes reais, links absolutos dos pacotes, lista de exclusões versus teste, ausência de promessa de disponibilidade no registry, condições Server/Client/tema, e CI de documentação. Registrar limites de execução e checks skipped; não afirmar execução local não realizada.
