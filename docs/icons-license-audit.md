# Auditoria de procedência de ícones do Admin DS

**Data da investigação:** 2026-10-29  
**Escopo:** 20 nomes públicos do objeto `iconPaths` em `packages/components/src/icon.tsx` (branch `develop`).  
**Issue:** [#257](https://github.com/dvmarques/admin-design-system/issues/257).  
**Estado:** `building` substituído por SVG com fonte/licença MIT comprovadas na PR #258; **proveniência dos demais desenhos não comprovada individualmente**.

## Método e limites

Foram inspecionados o JSX com seus comandos SVG (`path`, `circle`, `rect`), os SVGs oficiais selecionados de Feather, Lucide, Tabler e Heroicons, e os commits Git que acrescentaram nomes ao `AdsIcon`. Esta comparação é de geometria e topologia, não uma prova documental do processo criativo. Diferenças pequenas podem indicar adaptação, mas também podem resultar de desenho independente. A inexistência de uma correspondência nas referências consultadas **não prova originalidade**.

Não foi feita uma busca exaustiva por todos os acervos existentes, nem análise jurídica de titularidade.

## Resultado por ícone

| Ícone | Fonte comparada | Evidência geométrica | Classificação |
| --- | --- | --- | --- |
| `alertCircle` | Feather `alert-circle` | Mesmo conceito; círculo/traços com medidas diferentes | Sem proveniência demonstrada |
| `alertTriangle` | Feather `alert-triangle` | Triângulo e exclamação; contorno e coordenadas diferentes | Sem proveniência demonstrada |
| `bell` | Feather `bell` | Sino com composição distinta | Sem proveniência demonstrada |
| `building` | **Hugeicons Free `Building06Icon`** | Quatro paths oficiais incorporados, origem e licença MIT rastreáveis; substitui SVG antigo de origem desconhecida | **Origem do SVG atual comprovada — MIT (Hugeicons)** |
| `calendar` | Feather `calendar` | Composição semelhante; medidas e forma do corpo diferem | Sem proveniência demonstrada |
| `check` | Feather `check` | Marca genérica; vértices diferentes | Geometria simples |
| `chevronDown` | Feather `chevron-down` | Segmentos e vértices equivalentes | Equivalência geométrica; autoria não provada |
| `chevronLeft` | Feather `chevron-left` | Segmentos e vértices equivalentes | Equivalência geométrica; autoria não provada |
| `chevronRight` | Feather `chevron-right` | Segmentos e vértices equivalentes | Equivalência geométrica; autoria não provada |
| `chevronsUpDown` | Lucide `chevrons-up-down` | Conceito similar; vértices e coordenadas diferentes | Sem proveniência demonstrada |
| `close` | Feather `x` | Diagonais e extremidades equivalentes | Equivalência geométrica; autoria não provada |
| `logOut` | Feather `log-out` | Caminho da porta e seta com geometria muito próxima | Possível adaptação; autoria não provada |
| `monitor` | Feather `monitor` | Mesma categoria; retângulo e suporte diferentes | Sem proveniência demonstrada |
| `moon` | Feather `moon` | Caminho da lua extremamente próximo, com arredondamento numérico | Possível adaptação; autoria não provada |
| `info` | Feather `info` | Círculo e letra i; raio e posições diferentes | Sem proveniência demonstrada |
| `plus` | Feather `plus` | Segmentos e extremidades equivalentes | Equivalência geométrica; autoria não provada |
| `sun` | Feather `sun` | Sol com raios; medidas e raios diferentes | Sem proveniência demonstrada |
| `settings` | Feather `settings`; Tabler `settings`; Lucide `settings` | Contorno de engrenagem estruturalmente muito próximo do Feather, com números/comandos modificados; diferente de Tabler/Lucide atuais | Possível adaptação Feather; autoria não provada |
| `search` | Feather `search` | Lupa com centro/raio diferentes | Sem proveniência demonstrada |
| `user` | Feather `user` | Figura humana com silhueta inferior diferente | Sem proveniência demonstrada |

### Caso prioritário: `settings`

- Desenho do Admin DS: [arquivo e commit de inclusão de `settings`](https://github.com/dvmarques/admin-design-system/commit/21aba2e7bcde3a0259aee7ef5ac3597a38040f5d).
- Referência externa: [Feather `settings.svg`](https://github.com/feathericons/feather/blob/main/icons/settings.svg).
- Há uma sequência distintiva de curvas e entalhes muito próxima da fonte Feather; os valores (por exemplo, parâmetros de `1.65` arredondados em `1.7`) e comandos diferem. **Possível desenho adaptado**, mas o commit não informa origem nem há atribuição autoral documental.
- Tratamento: preservar **preventivamente** o aviso MIT Feather em [`THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md). Não declarar desenho original nem derivação provada. Não é necessária mudança na API ou no SVG para documentar essa ressalva.

### Caso prioritário: `building` — regularizado por substituição

- **Anterior:** o [desenho introduzido neste commit](https://github.com/dvmarques/admin-design-system/commit/21aba2e7bcde3a0259aee7ef5ac3597a38040f5d) não tinha origem comprovada. Foram comparados [Tabler `building`](https://github.com/tabler/tabler-icons/blob/main/icons/outline/building.svg), [Lucide `building`](https://github.com/lucide-icons/lucide/blob/main/icons/building.svg) e [Heroicons `building-office`](https://github.com/tailwindlabs/heroicons/blob/master/optimized/24/outline/building-office.svg), sem correspondência exata.
- **Atual (PR #258):** o conteúdo de `iconPaths.building` foi substituído pelos quatro paths do [`Building06Icon` de Hugeicons Free](https://github.com/hugeicons/hugeicons/blob/main/packages/core-free-icons/src/Building06Icon.ts) ([arquivo-fonte identificado por blob SHA `d4fea3215dce64febad36b610b3834fd4eaaf222`](https://github.com/hugeicons/hugeicons/blob/d4fea3215dce64febad36b610b3834fd4eaaf222/packages/core-free-icons/src/Building06Icon.ts)). O pacote [`@hugeicons/core-free-icons`](https://github.com/hugeicons/hugeicons/tree/main/packages/core-free-icons) fornece licença [MIT](https://github.com/hugeicons/hugeicons/blob/main/packages/core-free-icons/LICENSE.md), copyright (c) 2025 Hugeicons.
- **Licença:** aviso MIT integral preservado no [`THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md); os comandos `d` e `strokeWidth="1.5"` são os oficiais, com pontas preservadas explicitamente para neutralizar herança do componente.
- **Compatibilidade:** `AdsIcon name="building"` e `AdsIconName` permanecem públicos, sem dependência runtime; há mudança visual deliberada (porta no desenho, contorno do prédio diferente).
- **Limite:** isto confirma a fonte/licença do **SVG substituto**, não certifica que o SVG antigo tenha sido criado independentemente.

## Evidência de histórico

- [Commit de `building`, `settings`, `bell`, `logOut` e outros](https://github.com/dvmarques/admin-design-system/commit/21aba2e7bcde3a0259aee7ef5ac3597a38040f5d).
- [Commit dos modos de tema (`moon`, `sun`, `monitor`)](https://github.com/dvmarques/admin-design-system/commit/0c47fc8acd68f41d4b568fddc76c56860393d99d).
- [Commit dos alertas (`alertCircle`, `alertTriangle`)](https://github.com/dvmarques/admin-design-system/commit/b7c1019e0818b7b64b44da18e63642584d9d5c32).
- [Commit de ícones de calendário e navegação](https://github.com/dvmarques/admin-design-system/commit/df3f1d38410d8f1f5022ace7c2665ba5bc42e9fd).

Os commits registram incorporação ao repositório; não certificam quem criou o traçado original.

## Licenças verificadas

| Origem examinada | Licença oficial | Tratamento nesta revisão |
| --- | --- | --- |
| [Admin DS](../LICENSE.md) | MIT, Daniel Marques (2026) | Aplicável ao código próprio; não apaga direitos de terceiros |
| [Feather](https://github.com/feathericons/feather/blob/main/LICENSE) | MIT, Cole Bemis (2013–2023) | Aviso integral preservado preventivamente em [`THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md) |
| [Lucide](https://github.com/lucide-icons/lucide/blob/main/LICENSE) | ISC, com parte de seu catálogo derivada de Feather MIT | Referência comparativa; nenhuma derivação Lucide-específica comprovada |
| [Tabler](https://github.com/tabler/tabler-icons) | MIT | Referência comparativa; uso não comprovado |
| [Heroicons](https://heroicons.com/) | MIT | Referência comparativa; uso não comprovado |
| [Hugeicons Free](https://github.com/hugeicons/hugeicons/blob/main/packages/core-free-icons/LICENSE.md) | MIT, copyright (c) 2025 Hugeicons | **Fonte comprovada do novo `building`**, aviso integral preservado no `THIRD_PARTY_NOTICES.md` |

## Decisão e próximos passos

- **Não foi encontrada incompatibilidade de licença nas fontes consultadas.** Isso não equivale à prova de que todos os SVGs têm origem nelas ou são originalmente do Admin DS.
- Manter o projeto MIT e o aviso Feather MIT preventivo; **atribuir exclusivamente o novo `building` à Hugeicons Free (MIT)**. Não atribuir fornecedores não comprovados aos demais desenhos.
- A procedência do **novo `building` foi documentada**. A certificação de autoria independente dos outros 19 ícones continua não comprovada; para publicação independente, confirmar essas origens ou substituir traçados incertos por fontes licenciadas.
- O desenho de `building` foi alterado intencionalmente (quatro paths oficiais Hugeicons Free). Nenhuma dependência runtime ou assinatura pública foi alterada; os demais desenhos permanecem idênticos.
