## MODIFIED Requirements

### Requirement: Pontos de entrada públicos

Cada um dos quatro pacotes distribuíveis (`@dvmarques/admin-ds-tokens`, `@dvmarques/admin-ds-components`, `@dvmarques/admin-ds-admin` e `@dvmarques/admin-ds-highlighted-code`) MUST declarar pontos de entrada públicos para seu código executável, tipos TypeScript e estilos aplicáveis.

#### Scenario: Consumidor importa uma API pública

- **WHEN** uma aplicação importa uma exportação documentada de um dos quatro pacotes
- **THEN** o módulo e seus tipos são resolvidos sem usar caminhos internos ou o código-fonte do monorepo

#### Scenario: Consumidor importa o destaque de código opcional

- **WHEN** uma aplicação importa `@dvmarques/admin-ds-highlighted-code` e seu CSS público
- **THEN** o componente, seus tipos e o CSS resolvem pelo pacote opcional independente

### Requirement: Dependências de integração declaradas

O pacote MUST declarar dependências obrigatórias, opcionais e peer dependencies de modo que o gerenciador de pacotes possa detectar integrações incompatíveis. Integrações opcionais em subpaths MUST NOT exigir suas dependências de runtime no entrypoint principal. `@dvmarques/admin-ds-admin` MUST declarar a dependência pública coerente de `@dvmarques/admin-ds-components`; `@dvmarques/admin-ds-highlighted-code` MUST manter o Shiki isolado dos demais pacotes.

#### Scenario: Versão incompatível de React é utilizada

- **WHEN** uma aplicação instala um pacote React com versão fora da faixa suportada
- **THEN** o gerenciador de pacotes consegue emitir o alerta de incompatibilidade correspondente

#### Scenario: Integração de máscara não instalada

- **WHEN** uma aplicação consome apenas o entrypoint raiz de `@dvmarques/admin-ds-components` e não instala `react-imask`
- **THEN** os imports, tipos, execução, build e bundle do pacote raiz permanecem funcionais sem exigir a dependência opcional

#### Scenario: Integração de máscara instalada

- **WHEN** uma aplicação opta pelo subpath `@dvmarques/admin-ds-components/masked-input` e instala a versão peer opcional declarada
- **THEN** consegue resolver o subpath e seus tipos sem imports internos ou dependências transitivas implícitas

#### Scenario: Shiki permanece fora do entrypoint principal

- **WHEN** uma aplicação importa somente `@dvmarques/admin-ds-components`
- **THEN** nenhuma dependência de `@dvmarques/admin-ds-highlighted-code` ou do motor Shiki é carregada em decorrência desse import

## ADDED Requirements

### Requirement: Publicação limitada aos quatro pacotes aprovados

A distribuição npm MUST habilitar acesso público somente para os quatro pacotes aprovados, mantendo privados a raiz, as aplicações e outros workspaces que não estejam explicitamente autorizados. Esta fase MUST NOT executar publicação no registry, alterar tags ou escolher uma nova versão de release.

#### Scenario: Inventário de pacotes publicáveis

- **WHEN** a preparação enumera os manifests dos workspaces
- **THEN** apenas `tokens`, `components`, `admin` e `highlighted-code` estão habilitados para publicação pública, e a raiz e os apps permanecem privados

#### Scenario: Preparação e teste sem publicação

- **WHEN** o pipeline de validação empacota os quatro artefatos
- **THEN** nenhum comando publica no registry ou altera tags e releases existentes

### Requirement: Tarballs completos e auditáveis

Os quatro pacotes MUST produzir tarballs com entradas JavaScript, declarações TypeScript, CSS compilado, metadados, licença MIT aprovada e avisos de terceiros aplicáveis, sem arquivos temporários nem dependência do `src/` do monorepo.

#### Scenario: Inventário de conteúdo de cada tarball

- **WHEN** `npm pack` produz os artefatos de distribuição
- **THEN** cada tarball contém os `exports`, tipos, estilos e avisos aplicáveis e não contém arquivos secretos, temporários ou caminhos internos não publicados

### Requirement: Instalação externa reproduzível antes da primeira publicação

Um projeto Next.js App Router limpo MUST instalar conjuntamente os quatro tarballs por referências locais `file:`, sem tentar obter os novos nomes de pacotes no registry. O consumo MUST validar tipos, CSS público sem Tailwind na aplicação, separação Server/Client e hidratação.

#### Scenario: Aplicação sem monorepo instala quatro tarballs

- **WHEN** uma aplicação externa define os quatro pacotes como dependências locais de tarballs com versões coerentes
- **THEN** a instalação, a compilação de tipos e o build Next.js terminam sem depender de pacotes `@dvmarques/admin-ds-*` ainda não publicados no registry

#### Scenario: CSS e hidratação externa

- **WHEN** o consumidor importa CSS público e renderiza componentes Server e Client em App Router sem varrer fontes dos pacotes com Tailwind
- **THEN** os estilos são aplicados e a hidratação ocorre sem divergências atribuíveis aos pacotes

### Requirement: Migração explícita de nomes

A documentação de migração MUST relacionar os quatro nomes antigos aos novos e MUST NOT declarar os nomes `@admin-ds/*` como aliases publicados. Registros históricos arquivados MUST permanecer representativos dos seus commits e releases originais.

#### Scenario: Consumidor atualiza imports

- **WHEN** um consumidor consulta a instrução de migração
- **THEN** encontra a substituição de cada um dos quatro nomes e os imports de CSS/subpath aplicáveis, sem instrução para instalar um alias inexistente
