## ADDED Requirements

### Requirement: Toolchain de qualidade versionado e consistente

O monorepo MUST manter compilador TypeScript, ambiente DOM, runner de testes e ferramenta de hook em versões estáveis compatíveis entre si e com a linha Node.js 24 utilizada na CI, sem introduzir mudanças não documentadas no contrato público dos pacotes.

#### Scenario: Testes unitários e cobertura após migração

- **WHEN** as suítes de qualidade e cobertura são executadas no ambiente Node 24 com as dependências instaladas do lockfile
- **THEN** Vitest e seu provider de cobertura usam a mesma versão principal e os testes, relatórios de cobertura e verificações de DOM completam sem regressões não aprovadas

#### Scenario: Compilação e consumo externo após migração

- **WHEN** os quatro pacotes públicos são compilados com TypeScript e importados por uma aplicação consumidora Next.js
- **THEN** suas exportações, declarações de tipos e estilos compilados permanecem utilizáveis sem introduzir dependência do Next no runtime da biblioteca

#### Scenario: Hook de commit

- **WHEN** os arquivos suportados são preparados para commit com Husky e lint-staged instalados
- **THEN** lint e formatação são aplicados apenas aos arquivos selecionados, e erros reais bloqueiam a conclusão do hook

#### Scenario: Compatibilidade da linha Node 24

- **WHEN** a suíte de desenvolvimento executa no patch Node 24 suportado pelas ferramentas
- **THEN** as verificações executam sem erro de engine, mantendo o requisito público `engines.node >=24.0.0` sem teto

#### Scenario: Regressão de browser após upgrade do toolchain

- **WHEN** a matriz E2E e o site estático são validados em Chromium, Firefox e WebKit
- **THEN** foco, acessibilidade, temas, nomes acessíveis e snapshots existentes são preservados sem mudanças visuais não autorizadas
