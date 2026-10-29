# form-field-composition Specification

## Purpose

Oferecer composição semântica de campos para associar controles, rótulos e mensagens de ajuda ou validação sem duplicar lógica em cada aplicação.

## Requirements

### Requirement: Composição de campo acessível

O sistema MUST exportar componentes públicos prefixados por `Ads` para compor um campo com rótulo, descrição e mensagem de validação, associando essas informações ao controle correspondente por identificadores acessíveis.

#### Scenario: Campo possui rótulo e descrição

- **WHEN** uma aplicação compõe um controle com rótulo e descrição
- **THEN** o rótulo identifica o controle e a descrição fica disponível como orientação associada ao campo

#### Scenario: Campo exibe mensagem de erro

- **WHEN** uma aplicação apresenta uma mensagem de erro para um campo inválido
- **THEN** o controle é identificado como inválido e a mensagem é associada ao campo de forma disponível para tecnologias assistivas

### Requirement: Grupos de entrada e seleção

O sistema MUST oferecer composição pública para grupos de entrada e grupos de seleção relacionados, preservando a semântica e o nome acessível coletivo quando houver mais de uma opção.

#### Scenario: Aplicação agrupa opções relacionadas

- **WHEN** uma aplicação agrupa opções de checkbox ou radio sob um rótulo comum
- **THEN** tecnologias assistivas conseguem identificar o conjunto e seu rótulo antes de interagir com as opções

#### Scenario: Aplicação adiciona conteúdo adjacente ao input

- **WHEN** uma aplicação usa um grupo de entrada com conteúdo antes ou depois de um controle textual
- **THEN** o conteúdo complementar é apresentado sem alterar o nome, o valor ou a operação nativa do controle

### Requirement: Consistência visual da composição

Os componentes de composição MUST espaçar, alinhar e estilizar rótulos, controles e mensagens com tokens semânticos nos temas claro e escuro, permitindo uma `className` segura nos seus elementos públicos.

#### Scenario: Campo alterna entre estados de validação

- **WHEN** uma aplicação altera um campo entre os estados normal, sucesso e erro
- **THEN** a composição apresenta a mensagem e o estado correspondentes de modo consistente, sem modificar dados do campo

### Requirement: Estados de campo não dependem exclusivamente de cor

A composição de campo MUST preservar distância, tipografia e associação semântica suficientes para distinguir ajuda, erro e sucesso; quando houver estado, a comunicação visual MUST combinar cor com ao menos outro sinal já disponível na composição.

#### Scenario: Campo apresenta validação em layout compacto

- **WHEN** uma aplicação apresenta mensagem de validação abaixo de um controle em largura reduzida
- **THEN** rótulo, valor e mensagem permanecem associados, legíveis e sem sobreposição

### Requirement: Grupo de seleção sem moldura nativa

O `fieldset` e a `legend` de `AdsSelectionGroup` MUST NOT exibir a borda, a margem ou o recuo padrão do navegador, nos temas claro e escuro. A aparência do grupo MUST vir apenas dos estilos da biblioteca.

#### Scenario: Grupo de seleção no tema escuro

- **WHEN** um `AdsSelectionGroup` com legenda é renderizado no tema escuro
- **THEN** nem o `fieldset` nem a `legend` mostram a moldura ou o recuo nativos do navegador

### Requirement: Mensagens próximas ao controle sem reset externo

AdsField MUST apresentar ajuda e erro com espaçamento compacto baseado nos tokens existentes e sem margens nativas adicionais de parágrafo. A distância até as mensagens MUST ser menor que a distância entre rótulo e controle. AdsFieldDescription e AdsFieldMessage MUST zerar margens nativas quando usados isoladamente, preservando o layout definido pelo consumidor.

#### Scenario: Campo inválido em aplicação Next.js

- **WHEN** uma aplicação Next.js usa AdsField com Input, Textarea ou Select e importa apenas o CSS compilado público, sem reset de parágrafos
- **THEN** o erro permanece próximo ao controle, associado por aria-describedby e anunciado como alerta, preservando aria-invalid

#### Scenario: Ajuda e erro simultâneos em telas estreitas

- **WHEN** um campo apresenta descrição e erro longos nos temas claro e escuro em viewport estreita
- **THEN** as mensagens quebram linhas sem sobreposição ou overflow e mantêm espaçamento compacto entre si e o controle

#### Scenario: Personalização de espaçamento

- **WHEN** o consumidor personaliza o token de espaçamento compacto
- **THEN** o espaçamento entre controle e mensagens acompanha o token sem recompilar a biblioteca

#### Scenario: Primitivas em composição manual

- **WHEN** o consumidor compõe AdsFieldDescription e AdsFieldMessage sem AdsField
- **THEN** os parágrafos não acrescentam margens nativas ao espaçamento definido pelo consumidor

### Requirement: Adornos e ações do InputGroup não quebram indevidamente

AdsInputGroup MUST preservar em uma linha o conteúdo de prefixos, sufixos e rótulos de botões curtos usados em startContent e endContent, permitindo que o controle textual dentro do grupo ocupe o espaço flexível restante. Esse comportamento MUST ser limitado ao grupo e MUST NOT impor proibição de quebra global aos botões independentes. A composição MUST manter semântica, foco e estados do campo.

#### Scenario: Valor monetário com duas ações

- **WHEN** uma aplicação mostra um AdsInputGroup com prefixo R$, valor editável e ações Limpar e Restaurar em largura suficiente
- **THEN** R$, Limpar e Restaurar permanecem íntegros na mesma linha do campo, sem letras empilhadas nem quebra dentro dos botões

#### Scenario: Campo reduz sem esmagar adornos

- **WHEN** a largura do contêiner diminui, mas ainda comporta prefixo e ações
- **THEN** o campo textual utiliza o espaço restante e adornos permanecem legíveis, sem expansão horizontal da página

#### Scenario: Largura insuficiente e zoom

- **WHEN** o conteúdo total excede a largura disponível em 320px ou zoom de 200%
- **THEN** as ações e o prefixo continuam inteiros e alcançáveis por teclado por uma adaptação responsiva ou rolagem local, sem ocultar funcionalidade nem provocar overflow da página

#### Scenario: Conteúdo variado e temas

- **WHEN** o grupo usa só startContent, só endContent ou ambos, com texto e botões, nos tamanhos sm, md e lg em claro ou escuro
- **THEN** adornos mantêm alinhamento, bordas e tamanhos adequados ao controle e não alteram os estilos de botões fora do grupo

### Requirement: Demonstração funcional e específica de InputGroup

O catálogo MUST demonstrar AdsInputGroup de forma independente da composição de AdsField e MUST preservar ações acessíveis e funcionais no exemplo Valor em reais.

#### Scenario: Pessoa limpa e restaura

- **WHEN** a pessoa escolhe Limpar no exemplo de valor
- **THEN** o campo fica vazio, e ao escolher Restaurar o valor inicial é recolocado; os botões têm nomes acessíveis claros apesar dos rótulos visuais compactos
