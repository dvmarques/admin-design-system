## ADDED Requirements

### Requirement: Opções de apresentação da tabela inteligente

AdsSmartTable MUST oferecer striped e wrap e preservar os contratos de seleção, ordenação, acessibilidade e virtualização.

#### Scenario: Opções habilitadas

- **WHEN** o consumidor habilita striped ou wrap
- **THEN** a tabela subjacente aplica a opção sem alterar estado controlado, nome acessível ou cabeçalhos

#### Scenario: Seleção e virtualização

- **WHEN** linhas selecionadas ou virtualizadas são exibidas com striped
- **THEN** a seleção permanece distinguível, a paridade acompanha o índice dos dados e espaçadores não são listrados

#### Scenario: Altura e largura controladas

- **WHEN** wrap é usado com virtualização ou largura explícita
- **THEN** o contrato de altura fixa e de largura controlada permanece, podendo recortar conteúdo
