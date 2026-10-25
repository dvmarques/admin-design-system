## ADDED Requirements

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
