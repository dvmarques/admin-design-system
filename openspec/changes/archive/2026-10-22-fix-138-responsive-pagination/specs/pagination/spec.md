# Delta de especificação: AdsPagination

## ADDED Requirements

### Requirement: Adaptação à largura real

O componente MUST ajustar a quantidade de páginas adjacentes à largura observada do próprio contêiner, sem depender exclusivamente de breakpoints de viewport. MUST preservar primeira, atual, última e controles anterior/próxima sem números duplicados, com fallback horizontal acessível apenas quando fisicamente necessário. MUST preservar bordas, hover e foco vertical.

#### Scenario: Redimensionamento com página intermediária

- **WHEN** o contêiner da página 25 de 50 é reduzido por sidebar ou zoom
- **THEN** números adjacentes são removidos antes dos números obrigatórios e as reticências representam lacunas reais

#### Scenario: Páginas extremas

- **WHEN** a página é 1, 2, penúltima ou última, ou pageCount é 0, 1 ou 2
- **THEN** não há duplicatas e os limites de navegação são respeitados

### Requirement: Navegação opcional e localizada

O componente MUST preservar texto anterior/próxima por padrão e MAY oferecer setas, conteúdo customizado, primeira/última, labels configuráveis e estado de carregamento por props opcionais. MUST preservar aria-current, nome acessível, foco visível e teclado.

#### Scenario: Navegação com setas em carregamento

- **WHEN** o consumidor habilita setas e loading
- **THEN** os botões mantêm nomes acessíveis e não disparam navegação duplicada

### Requirement: Salto direto opcional

O componente MUST oferecer showPageJump desativado por padrão, campo numérico rotulado e confirmação por Enter ou clique, rejeitando vazio, fração, valor fora do intervalo e página atual. MUST sincronizar com mudanças externas de page e suportar renderPageLink sem interativos aninhados.

#### Scenario: Salto inválido

- **WHEN** o usuário tenta navegar para uma página inválida
- **THEN** onPageChange não é chamado e o erro é comunicado de forma acessível

### Requirement: Robustez e compatibilidade

O componente MUST representar uma única página omitida quando houver espaço, minimizar saltos de largura de dígitos e documentar a correção controlada quando pageCount diminui. MUST evitar callbacks durante render e hidratação divergente.

#### Scenario: Redução do total

- **WHEN** pageCount diminui abaixo de page controlada
- **THEN** a página exibida permanece válida, e a política de sincronização com o consumidor é previsível e documentada

#### Scenario: SSR e links

- **WHEN** renderizado no servidor e hidratado com links customizados
- **THEN** não ocorre mismatch e os links permanecem semanticamente válidos

### Requirement: Correção controlada e foco estável

O componente MUST solicitar a correção de uma página inválida por callback após montagem, no máximo uma vez por combinação de página e total positivo, sem emitir durante carregamento. Sem callback, o consumidor MUST normalizar URL e dados. MUST preservar foco em controles mantidos e não mover foco em mudanças externas.

#### Scenario: Consumidor não aplica imediatamente a correção

- **WHEN** page é 25, pageCount cai para 10 e o consumidor mantém page 25 em novas renderizações
- **THEN** a página 10 é exibida e apenas uma solicitação de correção é emitida, fora do render

#### Scenario: Total vazio

- **WHEN** pageCount é zero
- **THEN** não há página ativa nem solicitação de correção para uma página inexistente

#### Scenario: Loading com link focado

- **WHEN** loading inicia com foco em um link de página
- **THEN** o link e o foco permanecem, a navegação é bloqueada e a região informa estado ocupado

#### Scenario: Salto com link e formulário consumidor

- **WHEN** a paginação está em um formulário e renderPageLink é fornecido sem callback
- **THEN** Enter e confirmação ativam o link válido do consumidor sem formulário ou controles interativos aninhados

#### Scenario: Personalização e estabilidade de largura

- **WHEN** textos traduzidos, fonte, número de dígitos ou largura do contêiner mudam
- **THEN** a capacidade considera os controles reais, os números usam largura estável e foco, hover e bordas continuam visíveis
