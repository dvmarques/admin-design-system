## MODIFIED Requirements

### Requirement: Consumo pelo App Router

A biblioteca MUST permitir que uma aplicação Next.js com App Router importe suas APIs públicas e seus estilos globais por caminhos documentados. A validação de distribuição MUST contemplar os quatro pacotes `@dvmarques/admin-ds-*` em tarballs instalados por `file:` fora do monorepo, incluindo o pacote opcional `highlighted-code`.

#### Scenario: Aplicação Next.js executa build de produção

- **WHEN** a aplicação de referência importa os pacotes apenas por pontos de entrada públicos
- **THEN** o build de produção é concluído sem configuração baseada em caminhos internos do workspace

#### Scenario: Aplicação Next.js externa instala tarballs antes da publicação

- **WHEN** uma aplicação Next.js App Router limpa, fora dos workspaces, instala os quatro tarballs locais e importa os estilos públicos
- **THEN** os peers internos são resolvidos pelas dependências `file:`, tipos e build funcionam sem buscar pacotes `@dvmarques/admin-ds-*` ainda inexistentes no npm, e componentes Client hidratam sem divergências atribuíveis à biblioteca
