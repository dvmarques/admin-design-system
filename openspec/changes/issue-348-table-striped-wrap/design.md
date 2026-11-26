## Contexto

A tabela usa largura mínima intrínseca e hover optativo. A tabela inteligente compõe a tabela base e oferece seleção, larguras controladas e virtualização de altura fixa.

## Decisões

- Props booleanas independentes na tabela, sem alterar o markup padrão. Usar atributos opt-in e CSS em camada; o consumidor pode personalizar a cor via token.
- Listras no corpo, sem cabeçalho nem espaçadores virtuais. Usar a paridade do índice real na virtualização; hover e seleção têm precedência. Preservar semântica HTML e foco.
- Remover a classe de largura mínima intrínseca com wrap; usar quebra normal e `overflow-wrap: anywhere` para texto longo. Controles, larguras explícitas e conteúdo intrinsecamente largo podem ainda exigir scroll.
- Na virtualização, wrap não altera a altura fixa: preservar o contrato de recorte. Documentar essa restrição.
- CSS compilado existente, sem dependências ou novas fronteiras Client/Server. Token gerado a partir da fonte semântica. Alternativa de classe no consumidor rejeitada por duplicação e conflito de cascata.

## Riscos e reversão

Verificar temas, contraste, precedência e scroll. Props ausentes preservam o comportamento; remover as props é a reversão no consumidor. Não alterar snapshots não relacionados.
