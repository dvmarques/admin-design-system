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

## Orçamento de distribuição

A CI Linux do SHA `a78e73f` (26/11/2026, Node 24.22.3, npm 11.19.1) mediu 309.193 B de JS/CSS publicados de components, ante o teto de 308.800 B, e 711.388 B no dist completo (abaixo do teto de 762.897 B). O custo aditivo das opções e dos seletores CSS motivou ajuste de 500 B no teto de JS/CSS, para 309.300 B (107 B de margem sobre a medição). Nenhuma dependência ou gate foi removido. Gzip e demais orçamentos permanecem inicialmente inalterados; novas medições devem confirmar o resultado. Evidência: [CI / distribuição](https://github.com/dvmarques/admin-design-system/actions/runs/45897648077/job/140175495187).
