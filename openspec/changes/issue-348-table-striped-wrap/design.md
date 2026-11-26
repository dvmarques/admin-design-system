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

A CI de `7bf2005` mediu 92.602 B de gzip publicado (teto 92.500 B); o teto passa a 92.700 B (98 B de margem). [Medição Linux](https://github.com/dvmarques/admin-design-system/actions/runs/45898012327/job/140176668543).

A [medição completa de `3f8bbae`](https://github.com/dvmarques/admin-design-system/actions/runs/45898273973/job/140177550795) confirmou os demais excessos. Ajustes restritos aos tetos afetados:

| Métrica | Medido (B) | Teto anterior (B) | Novo teto (B) |
| --- | ---: | ---: | ---: |
| Admin publicado | 173171 | 173100 | 173300 |
| Components e masked-input CSS | 63712 | 63300 | 63800 |
| Components e masked-input CSS gzip | 10572 | 10500 | 10600 |
| Admin cenário JS | 71989 | 71800 | 72100 |
| Admin cenário JS gzip | 24205 | 24200 | 24300 |
| Admin cenário CSS | 105499 | 105100 | 105600 |
| Admin cenário CSS gzip | 15869 | 15800 | 15900 |

A medição temporariamente agrupou falhas sem desativar o gate; o script original foi restaurado. Os cenários JS de components e masked-input não cresceram; os outros tetos permanecem inalterados.
