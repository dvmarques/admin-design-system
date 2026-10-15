## Purpose

Permite compor filtros de listagens administrativas (texto, seleção, seleção múltipla e data), exibir os filtros ativos e removê-los, com o estado controlado pela aplicação consumidora.

## ADDED Requirements

### Requirement: Composição de filtros controlada

O sistema MUST fornecer `AdsFilterBar` em `@admin-ds/admin`, que renderize os filtros declarados em `filters` dos tipos `text`, `select`, `multiselect`, `date` e `date-range`, reutilizando os campos do design system. O valor MUST ser controlado por `value` (objeto por `id` de filtro) e `onChange`, e `onChange` MUST receber o objeto completo sem chaves de filtros vazios. A barra MUST NOT ler nem gravar a URL, nem acessar o roteador do Next.js.

#### Scenario: Alterar um filtro de texto

- **WHEN** a pessoa digita em um filtro de texto
- **THEN** `onChange` recebe o objeto de valores com o texto digitado, e o campo exibe o valor recebido em `value`

#### Scenario: Escolher uma opção de seleção

- **WHEN** a pessoa escolhe uma opção em um filtro `select`
- **THEN** `onChange` recebe o valor da opção, e escolher a opção vazia remove a chave do filtro

#### Scenario: Marcar opções de seleção múltipla

- **WHEN** a pessoa marca e desmarca opções de um filtro `multiselect`
- **THEN** `onChange` recebe a lista das opções marcadas na ordem das opções, e a chave some quando nenhuma está marcada

#### Scenario: Escolher uma data ou um intervalo

- **WHEN** a pessoa escolhe uma data em um filtro `date` ou um intervalo em um filtro `date-range`
- **THEN** `onChange` recebe a string ISO `AAAA-MM-DD` ou `{ start, end }`

#### Scenario: Persistência pelo consumidor

- **WHEN** a aplicação Next.js converte `searchParams` em `value` e grava o `onChange` na URL
- **THEN** a barra reflete a URL sem importar `next/*` e sem acessar `window.location`

#### Scenario: Valor não aplicado pelo consumidor

- **WHEN** o consumidor não atualiza `value` após `onChange`
- **THEN** os campos continuam exibindo o valor anterior

### Requirement: Filtros ativos removíveis

`AdsFilterBar` MUST exibir cada filtro com valor como um item de lista no formato `Rótulo: valor`, com um botão de remoção de nome acessível `Remover filtro {rótulo}: {valor}`, e MUST oferecer "Limpar filtros" apenas quando houver filtros ativos. Na seleção múltipla, MUST haver um item por opção marcada. Os textos MUST ser configuráveis por `labels`, com padrão em pt-BR.

#### Scenario: Remover um filtro individualmente

- **WHEN** a pessoa ativa o botão de remoção de um item
- **THEN** `onChange` recebe os valores sem aquele filtro, ou sem aquela opção na seleção múltipla, e os demais permanecem

#### Scenario: Limpar todos os filtros

- **WHEN** a pessoa ativa "Limpar filtros"
- **THEN** `onChange` recebe um objeto vazio e a lista passa a mostrar "Nenhum filtro ativo"

#### Scenario: Formato dos valores

- **WHEN** há filtros de data, intervalo e seleção ativos
- **THEN** a seleção mostra o texto da opção, a data usa o formato do locale e o intervalo mostra início e fim, com um marcador para a extremidade ausente

#### Scenario: Anúncio da quantidade

- **WHEN** a quantidade de filtros ativos muda
- **THEN** uma região `aria-live="polite"` visualmente oculta anuncia a nova quantidade

#### Scenario: Contagem por chip

- **WHEN** há filtros ativos e a seleção múltipla tem mais de uma opção marcada
- **THEN** o contador do botão "Filtros" e o anúncio mostram a quantidade de chips ativos, um por opção marcada, e não a quantidade de filtros (por exemplo, 5 com 4 filtros quando "Perfis" tem 2 valores)

#### Scenario: Foco após remover

- **WHEN** a pessoa remove um item pelo teclado ou aciona "Limpar filtros"
- **THEN** o foco vai para o próximo item ou, se não houver, para o anterior
- **AND** se não restar nenhum item e os campos estiverem recolhidos pelo estado do componente (`expanded` falso), o foco vai para o botão "Filtros"; quando esse botão não está visível (tela larga) ou os campos estão expandidos, o foco vai para o primeiro controle da barra
- **AND** quando o consumidor atualiza `value` de forma assíncrona (por exemplo, com `startTransition`), renders intermediários com o valor antigo não consomem o foco pendente: ele só é aplicado quando a lista de chips muda, e é descartado se a pessoa alterar um campo antes disso

### Requirement: Teclado e semântica

`AdsFilterBar` MUST ser uma região rotulada (`label`, padrão "Filtros"), com controles associados a rótulos, grupo com legenda na seleção múltipla, foco visível e operação completa por teclado. Cada campo MUST aceitar `description` e `error` repassados a `AdsField`.

#### Scenario: Navegação por teclado

- **WHEN** a pessoa navega com `Tab`
- **THEN** o foco percorre botão de alternância (quando visível), campos, chips e "Limpar filtros" na ordem visual, com foco visível

#### Scenario: Nomes acessíveis

- **WHEN** um leitor de tela percorre a barra
- **THEN** a região, cada campo, o grupo de seleção múltipla e a lista de filtros ativos têm nome acessível, sem violações de `axe`

#### Scenario: Erro em um campo

- **WHEN** um filtro recebe `error`
- **THEN** a mensagem é associada ao campo e anunciada, e o campo é marcado como inválido
- **AND** na seleção múltipla, a descrição e a mensagem têm `id` e são referenciadas pelo `aria-describedby` do grupo, e cada opção recebe `aria-invalid` enquanto houver erro

### Requirement: Layout responsivo

Em telas estreitas, `AdsFilterBar` MUST recolher os campos atrás de um botão de alternância com `aria-expanded` e `aria-controls`, que mostra a quantidade de filtros ativos, enquanto os filtros ativos permanecem visíveis. Em telas largas, os campos MUST ficar sempre visíveis e o botão de alternância MUST ficar oculto. O estado inicial MUST ser igual no servidor e no cliente.

#### Scenario: Expandir em tela estreita

- **WHEN** a pessoa ativa o botão de alternância em tela estreita
- **THEN** os campos ficam visíveis, `aria-expanded` passa a `true` e `onExpandedChange` é chamado

#### Scenario: Recolhida em tela estreita

- **WHEN** a barra está recolhida em tela estreita
- **THEN** os campos saem da ordem de tabulação e da árvore de acessibilidade, e os filtros ativos continuam visíveis

#### Scenario: Tela larga

- **WHEN** a largura disponível é ampla
- **THEN** os campos aparecem em linha, com quebra de linha, e não há botão de alternância

#### Scenario: Renderização no servidor

- **WHEN** a barra é renderizada no servidor e hidratada no cliente
- **THEN** o HTML inicial coincide e não há erro de hidratação

### Requirement: Estados

`AdsFilterBar` MUST suportar `disabled`, `loading` e a ausência de filtros ativos. Com `disabled`, os campos, os botões de remoção e "Limpar filtros" MUST ficar desabilitados e os chips MUST permanecer visíveis. Com `loading`, a região MUST ter `aria-busy="true"`, MUST anunciar `labels.loading` por região `aria-live="polite"` e MUST permanecer utilizável.

#### Scenario: Desabilitada

- **WHEN** `disabled` é verdadeiro
- **THEN** nenhum campo, botão de remoção de chip ou "Limpar filtros" pode ser acionado, e os filtros ativos continuam legíveis
- **AND** o botão de alternância "Filtros" continua operável apenas para expandir e recolher os campos, sem alterar valores

#### Scenario: Carregando

- **WHEN** `loading` é verdadeiro
- **THEN** a região fica com `aria-busy="true"`, o carregamento é anunciado e a pessoa ainda pode alterar filtros
- **AND** um indicador visual discreto aparece na barra sem depender de cursor ou hover, e fica estático com `prefers-reduced-motion: reduce`

#### Scenario: Sem filtros ativos

- **WHEN** não há filtros ativos
- **THEN** a barra mostra "Nenhum filtro ativo" e não mostra "Limpar filtros"

### Requirement: Temas, tokens e distribuição

`AdsFilterBar` MUST usar classes `ads-filter-bar*` e variáveis `--ads-*`, funcionar nos temas claro e escuro, ser personalizável por sobrescrita de tokens e MUST NOT exigir Tailwind das aplicações consumidoras nem adicionar dependências de runtime. O CSS MUST ser distribuído em `@admin-ds/admin/styles.css`.

#### Scenario: Tema escuro

- **WHEN** a barra é renderizada em `data-theme="dark"`
- **THEN** superfícies, bordas e chips usam os tokens do tema e mantêm contraste legível

#### Scenario: Consumo em Next.js

- **WHEN** uma aplicação Next.js importa `@admin-ds/admin` e `@admin-ds/admin/styles.css`
- **THEN** a barra é estilizada sem configurar Tailwind e sem importar caminhos internos dos pacotes
