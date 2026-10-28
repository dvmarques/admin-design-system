# form-field-composition — delta da issue #243

## ADDED Requirements

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
