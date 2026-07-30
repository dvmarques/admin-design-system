# theming Specification

## Purpose

Fornecer temas claro e escuro consistentes e personalizáveis, preservando acessibilidade e evitando que consumidores precisem recompilar a biblioteca.

## Requirements

### Requirement: Temas claro e escuro

O sistema MUST fornecer conjuntos completos de valores semânticos para os temas claro e escuro.

#### Scenario: Tema claro é aplicado

- **WHEN** a aplicação seleciona o tema claro
- **THEN** os tokens semânticos resolvem para os valores definidos para o tema claro

#### Scenario: Tema escuro é aplicado

- **WHEN** a aplicação seleciona o tema escuro
- **THEN** os tokens semânticos resolvem para os valores definidos para o tema escuro

### Requirement: Seleção explícita de tema

O sistema MUST permitir que a aplicação consumidora selecione o tema por meio de um contrato público baseado em atributo ou classe no elemento raiz documentado.

#### Scenario: Tema muda em tempo de execução

- **WHEN** a aplicação altera o seletor público de tema no elemento raiz
- **THEN** os componentes passam a usar o novo tema sem recarregar a página

### Requirement: Preferência do sistema operacional

O sistema MUST oferecer uma estratégia documentada para adotar a preferência de cores do sistema operacional quando a aplicação não tiver selecionado um tema explícito.

#### Scenario: Usuário prefere esquema escuro

- **WHEN** não existe seleção explícita e o sistema operacional informa preferência por esquema escuro
- **THEN** a aplicação pode apresentar o tema escuro usando apenas os estilos públicos do design system

### Requirement: Contraste acessível

Os pares de cores padrão usados para conteúdo e controles essenciais MUST atender aos critérios de contraste aplicáveis do WCAG 2.2 nível AA nos dois temas.

#### Scenario: Texto padrão sobre superfície padrão

- **WHEN** o texto e a superfície usam os tokens padrão correspondentes em qualquer tema
- **THEN** o par de cores atende ao contraste mínimo aplicável do WCAG 2.2 nível AA

### Requirement: Personalização preservada entre temas

O sistema MUST permitir a sobrescrita independente de tokens para cada tema.

#### Scenario: Marca define cores diferentes por tema

- **WHEN** uma aplicação sobrescreve o token primário nos escopos claro e escuro
- **THEN** cada tema utiliza sua respectiva sobrescrita sem recompilar os componentes
