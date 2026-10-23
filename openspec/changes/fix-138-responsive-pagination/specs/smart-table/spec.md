# Delta de especificação: AdsSmartTable

## ADDED Requirements

### Requirement: Rodapé opcional de paginação
AdsSmartTable MUST permitir composição de AdsPagination com salto direto e MAY expor seletor controlado de tamanho de página e resumo de registros quando receber informações suficientes. MUST preservar o rodapé atual quando as opções não forem fornecidas, sem realizar buscas de dados.

#### Scenario: Resumo e seletor em contêiner estreito
- **WHEN** o consumidor fornece total, tamanho e callback e o contêiner diminui
- **THEN** resumo e seletor permanecem acessíveis, sem números inventados nem recorte vertical

#### Scenario: Total desconhecido ou vazio
- **WHEN** o total é desconhecido ou zero
- **THEN** o resumo não inventa intervalo de registros e os controles continuam consistentes
