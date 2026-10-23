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

#### Scenario: Página incompleta ou dados ainda indisponíveis

- **WHEN** a última página contém menos linhas que pageSize, está vazia ou ainda carrega
- **THEN** o resumo limita-se às linhas verificáveis e não anuncia intervalos inexistentes ou dados antigos durante loading

#### Scenario: Controle de tamanho e internacionalização

- **WHEN** o consumidor habilita o seletor ou personaliza seus rótulos e o resumo
- **THEN** o callback recebe apenas tamanho válido e diferente, sem buscar dados ou alterar página implicitamente; carregamento bloqueia ações

#### Scenario: Rodapé padrão preservado

- **WHEN** a tabela recebe somente as props de paginação já existentes
- **THEN** mantém a paginação alinhada à direita, sem resumo ou seletor, com adaptação ao espaço e folga para foco
