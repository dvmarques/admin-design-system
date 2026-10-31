## ADDED Requirements

### Requirement: Entrada documental orientada à adoção

O README raiz MUST apresentar proposta de valor verificável, links públicos da Demo e do Storybook, exemplo de consumo e caminho progressivo, mantendo instruções operacionais de desenvolvimento e release em documentos próprios.

#### Scenario: Visitante avalia a biblioteca

- **WHEN** um visitante abre o README do projeto
- **THEN** identifica os benefícios implementados, experimenta a Demo, consulta a referência de API no Storybook e localiza os guias de integração, migração, limitações, histórico, contribuição e licença

### Requirement: Pacotes com instruções autossuficientes

Cada um dos quatro pacotes MUST ter README com finalidade, dependências/peers, instalação condicional, imports públicos e CSS aplicável, incluindo links absolutos que funcionam na página do npm. O destaque de código e o peer de máscaras MUST ser descritos como opcionais.

#### Scenario: Consumidor escolhe somente componentes básicos

- **WHEN** a aplicação precisa de tokens e componentes sem máscaras ou realce de código
- **THEN** o guia não exige instalar `admin`, `highlighted-code`, Shiki ou `react-imask` como dependência de uso básico

#### Scenario: Consumidor precisa do pacote opcional

- **WHEN** a aplicação opta por realce de código ou entrada mascarada
- **THEN** encontra o pacote/subpath próprio, a dependência opcional, o CSS correspondente e exemplo com exports existentes

### Requirement: Integração Next.js externa reproduzível

A documentação MUST mostrar caminho de consumo externo por nomes públicos, CSS compilado em ordem e limites Server/Client em App Router, sem aliases internos, fontes do monorepo ou exigência de Tailwind no consumidor. MUST documentar fonte, temas e responsabilidade da aplicação pela persistência da preferência.

#### Scenario: Aplicação Next.js usa o design system

- **WHEN** um consumidor segue a receita de instalação e cria layout e componente interativo
- **THEN** os imports e peers correspondem aos manifests, o CSS usa os subpaths públicos e os limites de cliente/servidor e tema são apresentados sem prometer comportamento não implementado

### Requirement: Informação correta antes e depois da publicação

A documentação MUST distinguir pacotes preparados e validados por tarballs de disponibilidade efetiva no registry. Antes da primeira publicação verificada, MUST NOT apresentar instalação npm remota como já testada; a atualização pós-publicação será coordenada com #195.

#### Scenario: Leitor consulta o guia antes da primeira release npm

- **WHEN** os pacotes ainda não foram publicados no registry
- **THEN** o leitor vê aviso inequívoco e entende que comandos npm remotos serão aplicáveis apenas após #195

### Requirement: Migração e histórico verificáveis

O guia MUST mapear os quatro nomes anteriores para os atuais sem tratar os anteriores como aliases npm, orientar a migração de `ThemeToggle` para `AdsThemeControl` sem depreciação inexistente, e manter histórico por componente coerente com issues, versões registradas e API efetiva.

#### Scenario: Consumidor migra do workspace anterior

- **WHEN** o leitor atualiza imports e preferência de tema
- **THEN** encontra nomes novos, CSS/subpaths, persistência de Sistema/fallback e os limites de compatibilidade, com referência aos históricos #182, #185 e #187

### Requirement: Limites e cobertura do catálogo rastreáveis

A documentação MUST permitir localizar limitações por componente e MUST diferenciar testes automatizados de validações manuais. As exclusões textuais do catálogo MUST coincidir com `apps/admin-demo/catalog-coverage.test.ts`, sem modificar testes apenas para corrigir a descrição.

#### Scenario: Export auxiliar não possui demo visual

- **WHEN** o leitor consulta as exclusões do catálogo
- **THEN** encontra `getAdsSmartTableCsv` e os demais auxiliares que o teste efetivamente exclui, sem confundir exclusão visual com ausência da API
