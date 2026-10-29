# combobox-autocomplete Specification

## Purpose

Definir o comportamento observável de AdsCombobox e AdsAutocomplete: seleção única acessível e pesquisável, com valor separado do texto digitado, busca local ou assíncrona com debounce e descarte de respostas obsoletas, e opções com ícone ou avatar opcionais.

## Requirements

### Requirement: Seleção acessível de uma opção

O sistema SHALL exportar AdsCombobox para escolha de uma opção por value independente do label, com modo controlado ou não controlado e renderização customizável.

#### Scenario: Navegação e seleção

- **WHEN** a pessoa digita ou usa ArrowDown ou ArrowUp no campo
- **THEN** o destaque acompanha opções habilitadas sem mover o foco do campo; Home e End preservam a edição de texto
- **WHEN** pressiona Enter
- **THEN** a opção destacada é selecionada, o menu fecha e o foco permanece no campo
- **WHEN** pressiona Escape
- **THEN** o menu fecha sem alterar o valor selecionado

### Requirement: Texto pesquisado e valor selecionado independentes

O sistema SHALL manter inputValue diferente de value, suportar estado controlado/não controlado, limpeza e submissão de formulário.

#### Scenario: Digitação e limpeza

- **WHEN** o usuário altera o texto após selecionar um valor
- **THEN** o texto pesquisado muda sem converter texto livre em valor selecionado
- **WHEN** limpa uma seleção
- **THEN** o valor e o texto são esvaziados e o foco retorna ao campo
- **WHEN** o formulário é submetido com name configurado
- **THEN** o value selecionado é submetido sem depender do label

### Requirement: Busca síncrona e assíncrona

O sistema SHALL disponibilizar AdsAutocomplete com filtragem local e busca remota optativa, debounce configurável, loading, vazio e erro.

#### Scenario: Digitação rápida

- **WHEN** duas pesquisas remotas retornam fora de ordem
- **THEN** apenas o resultado da consulta atual fica visível, sem duplicação de seleções
- **WHEN** a consulta é cancelada por desmontagem ou edição posterior
- **THEN** seus resultados e erros antigos não alteram a interface

#### Scenario: Estados remotos

- **WHEN** a consulta está em andamento, não retorna resultados ou falha
- **THEN** o campo apresenta loading, vazio ou erro respectivamente, com feedback acessível

### Requirement: Integração visual e acessibilidade

O sistema SHALL utilizar ARIA combobox/listbox, AdsField, tamanhos existentes, CSS distribuído e temas claro/escuro, sem depender do backend.

#### Scenario: Uso em diálogo e Next.js

- **WHEN** o campo aparece em AdsDialog ou contêiner com overflow e recebe foco
- **THEN** a lista permanece visível em portal na camada correta e acompanha scroll
- **WHEN** o componente é renderizado no servidor e hidratado no cliente
- **THEN** não gera IDs duplicados nem acessa document durante SSR
- **WHEN** AdsField aplica descrição ou erro
- **THEN** o campo expõe as relações aria-describedby e aria-invalid

### Requirement: Exemplos demonstráveis na mesma entrega

O sistema SHALL apresentar exemplos funcionais no Admin Demo e Storybook com teclado, estados e uma origem remota simulada.

#### Scenario: Catálogo navegável

- **WHEN** a pessoa acessa o catálogo do Admin Demo
- **THEN** encontra páginas demonstráveis para AdsCombobox e AdsAutocomplete e pode testar busca local, remota, erro, vazio, loading e dados fora de ordem.

### Requirement: Elementos visuais opcionais

As opções MAY incluir ícones ou imagens com fallback e o consumidor MUST poder habilitar ou desabilitar sua exibição sem alterar valores ou nomes acessíveis.

#### Scenario: Exibição e seleção

- **WHEN** uma opção com elemento visual é selecionada
- **THEN** o elemento acompanha o texto selecionado e o formulário envia somente o valor da opção
- **WHEN** a exibição é desabilitada ou a opção não tem elemento visual
- **THEN** nenhum espaço é reservado para o elemento

#### Scenario: Imagem indisponível e busca remota

- **WHEN** a imagem falha ou a opção selecionada deixa os resultados remotos
- **THEN** o fallback ou o elemento da opção selecionada permanece disponível

#### Scenario: Teclado e acessibilidade

- **WHEN** uma pessoa navega pelas opções com teclado ou leitor de tela
- **THEN** os elementos decorativos não duplicam o nome acessível e os estados são preservados nos temas e tamanhos suportados

### Requirement: Texto controlado divergente

O `AdsCombobox` MUST tratar como texto livre um `inputValue` controlado que diverge do rótulo da opção selecionada, sem submeter o `value` anterior.

#### Scenario: Atualização externa do texto

- **WHEN** o consumidor altera `inputValue` externamente sem alterar `value`
- **THEN** o formulário não envia o `value` antigo por `name`
- **AND** voltar o texto ao rótulo da opção restaura o envio do `value`, inclusive após uma edição do usuário

### Requirement: Identidade da origem de dados

O `AdsAutocomplete` MUST permitir identificar a origem dos dados por `requestKey`, invalidando consulta pendente e resultados quando ela muda.

#### Scenario: Troca de origem com o mesmo termo

- **WHEN** `requestKey` muda mantendo o mesmo termo pesquisado
- **THEN** a consulta anterior é abortada, os resultados antigos deixam de ser exibidos e a busca é refeita

#### Scenario: Primeiro render após a troca

- **WHEN** `requestKey` muda e uma resposta ou erro da origem anterior já estava armazenado
- **THEN** o primeiro render da nova origem não exibe esses dados

#### Scenario: Função inline

- **WHEN** apenas a identidade de `loadOptions` muda entre renders
- **THEN** nenhuma nova consulta é disparada

### Requirement: AdsCombobox oferece apresentação popover genérica

`AdsCombobox` MUST oferecer `presentation="popover"` como extensão opt-in ao modo input, com gatilho customizável `renderTrigger`, conteúdo `footer` separado da lista e refs distintas para gatilho e campo de pesquisa, busca opcional `searchable` e filtro opcional `filterOption`. O modo input padrão MUST preservar o contrato anterior, inclusive `AdsAutocomplete`.

#### Scenario: Gatilho com conteúdo customizado

- **WHEN** o consumidor fornece `presentation="popover"` e `renderTrigger` com avatar, título, descrição e indicador
- **THEN** um botão acessível exibe a seleção atual e abre um painel portalled com busca e opções, sem exigir conteúdo de organizações

#### Scenario: Modo input legado

- **WHEN** o consumidor não informa `presentation` ou usa `input`
- **THEN** as props, callbacks, ref do input, teclado, foco, formulário e semântica `combobox/listbox` existentes não mudam

#### Scenario: Sem busca e com filtro configurado

- **WHEN** o consumidor configura `searchable={false}` ou `filterOption` para texto normalizado e descrição
- **THEN** o popup conserva navegação por teclado sem busca ou filtra opções sem duplicar seleção

#### Scenario: Footer com ação

- **WHEN** o consumidor fornece link ou botão no `footer`
- **THEN** a ação fica fora da `listbox`, alcançável por teclado e sem opção interativa aninhada

### Requirement: Seleção e consulta independentes no modo popover

A apresentação popover MUST preservar `value`/`defaultValue` controlados ou não, `onValueChange`, `open`/`defaultOpen`, opções desabilitadas, renderização customizada, filtragem, empty/loading/error e valor de formulário independente do label e da consulta.

#### Scenario: Pesquisa sem confirmar outra seleção

- **WHEN** a pessoa digita no campo de busca separado com uma opção previamente selecionada
- **THEN** apenas a consulta e o filtro mudam; o `value` confirmado e o valor enviado ao formulário continuam inalterados

#### Scenario: Seleção não otimista e fechamento controlado

- **WHEN** um consumidor controlado usa `closeOnSelect={false}` e o usuário solicita outra opção
- **THEN** o callback é emitido, mas seleção visual e abertura seguem as props até o consumidor confirmá-las; não há atualização otimista

#### Scenario: Pesquisa não altera o valor confirmado

- **WHEN** o usuário pesquisa ou limpa a consulta com uma opção já confirmada
- **THEN** o valor do gatilho/formulário persiste e a consulta não emite seleção fictícia

#### Scenario: Formulário, reset e disabled

- **WHEN** um formulário usa `name` e `required` na apresentação popover
- **THEN** somente o valor confirmado é serializado, ausência é detectada por `reportValidity()` com foco/feedback acessíveis mesmo em formulário externo e `disabled` segue semântica de formulário; nenhum rótulo nem consulta é submetido

#### Scenario: Estados e opções

- **WHEN** opções estão desabilitadas, há erro remoto, carregamento ou nenhuma correspondência
- **THEN** seleção por teclado ignora indisponíveis e o painel comunica estados com mensagens e ação de retry acessíveis

### Requirement: Popover de seleção usa semântica e foco de diálogo apropriados

No modo popover, o gatilho MUST ser um botão com `aria-haspopup="dialog"`, `aria-expanded` e relação com painel rotulado; o painel MUST usar semântica de diálogo não modal com campo de pesquisa e lista de opções adequados. O sistema MUST preservar foco, Escape hierárquico, click outside e posicionamento em portal.

#### Scenario: Teclado com busca

- **WHEN** o usuário abre o popover com teclado, digita, percorre opções com setas e pressiona Enter
- **THEN** foco, destaque e seleção seguem o contrato documentado; Escape fecha apenas o popover e devolve foco ao gatilho

#### Scenario: Sem campo de busca

- **WHEN** o consumidor oculta o campo de busca
- **THEN** a lista continua operável por setas e Enter com alvo inicial de foco perceptível

#### Scenario: Footer e Tab

- **WHEN** o painel possui footer e o usuário pressiona Tab ou Shift+Tab
- **THEN** é possível alcançar os controles interativos do painel e sair dele de forma previsível, sem prender foco num diálogo não modal nem perder o foco

#### Scenario: Modal aninhado, overflow e mobile

- **WHEN** o popover é aberto dentro de `AdsDialog` ou drawer mobile, em área com scroll/overflow
- **THEN** fica acima do modal lógico, responde a Escape/clique externo sem fechar camada ancestral, respeita rolagem/viewport e restaura foco ao gatilho

#### Scenario: Acessibilidade visual e Next.js

- **WHEN** a apresentação é usada nos temas claro/escuro, zoom de 200%, viewport 390px, alto contraste ou SSR/hidratação Next.js
- **THEN** os controles, nomes e estados permanecem acessíveis, sem overflow ou IDs inconsistentes

### Requirement: Apresentações do AdsCombobox são demonstráveis na mesma entrega

O sistema MUST oferecer no Admin Demo e Storybook exemplos funcionais de modo input versus popover, gatilho visual, filtro, seleção, formulário, controlado/não controlado, loading, vazio, erro, disabled e footer.

#### Scenario: Catálogo navegável

- **WHEN** a pessoa abre o catálogo
- **THEN** consegue exercitar as duas apresentações e observar seus contratos de foco, teclado e envio de valor
