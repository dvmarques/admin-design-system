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

## Cor da listra

`tableStripe` usa hex literais (`#e8eef5` no claro, `#293548` no escuro), pois nenhum passo da escala `reference` serve: `slate100` iguala o cabeçalho (`surfaceMuted`), `slate200` iguala a borda das linhas, e no escuro `slate700` iguala `surfaceRaised` e fica a poucos pontos do hover (`slate650`). Adicionar passos à escala alteraria o contador de tokens exibido em `/componentes` e os baselines visuais; fica como evolução futura.

No tema claro, o hover (`slate50`) é mais claro que a listra: a linha listrada clareia ao passar o mouse. No escuro, o hover é mais claro e o efeito é o esperado. O contraste do texto sobre a listra é validado em `contrast-pairs.mjs`.

## Orçamento de distribuição

Os tetos de `docs/browser-budget.json` e `docs/scenario-budget.json` foram elevados apenas onde a CI Linux (Node 24.22.3, npm 11.19.1) mediu excesso, com margem de cerca de 100 B, sem remover gates:

- Components (JS/CSS publicados): 309.193 B medidos, teto de 308.800 para 309.300 B; gzip 92.602 B, teto de 92.500 para 92.700 B.
- Admin publicado: 173.171 B, teto de 173.100 para 173.300 B.
- Components e masked-input, CSS: 63.712 B (gzip 10.572 B), tetos para 63.800 B (10.600 B).
- Admin, cenário JS: 71.989 B (gzip 24.205 B), tetos para 72.100 B (24.300 B); cenário CSS: 105.499 B (gzip 15.869 B), tetos para 105.600 B (15.900 B).

Medições: [components](https://github.com/dvmarques/admin-design-system/actions/runs/45897648077/job/140175495187) e [completa](https://github.com/dvmarques/admin-design-system/actions/runs/45898273973/job/140177550795). Após a remoção de regras CSS redundantes, a medição real tende a ficar abaixo dos tetos; recalibrar se a margem ficar excessiva.
