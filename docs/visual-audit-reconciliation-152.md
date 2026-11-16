# Reconciliação de evidências visuais — issue #152

Data da análise: **15/11/2026 (UTC)**. Base de comparação: `develop`, sem alteração visual, de componentes, tokens ou snapshots nesta documentação.

## Fontes e escopo efetivamente examinado

| Fase                                     | Execução / commit                                                                                                                      | Artefato                                                                                                        | Evidência                                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Antes das correções (primeira varredura) | [#43617023449](https://github.com/dvmarques/admin-design-system/actions/runs/43617023449) · `6f111328135ede626cd4ddd610f05f0c3e2f436f` | [#14122518533](https://github.com/dvmarques/admin-design-system/actions/runs/43617023449/artifacts/14122518533) | 328 capturas; 4 sinais automáticos                                                                      |
| PR #325, antes do squash                 | [#43767891395](https://github.com/dvmarques/admin-design-system/actions/runs/43767891395)                                              | [#14182903200](https://github.com/dvmarques/admin-design-system/actions/runs/43767891395/artifacts/14182903200) | 336 capturas iniciais + estados e acessibilidade                                                        |
| Pós-merge da #325                        | [#43771926565](https://github.com/dvmarques/admin-design-system/actions/runs/43771926565) · `53409443cfb87eac8a5f4fb5a4c08528a9d4b064` | [#14184394534](https://github.com/dvmarques/admin-design-system/actions/runs/43771926565/artifacts/14184394534) | 336 capturas iniciais; 0 sinais; 113 testes Playwright, 22 cenários seletivos, 31 a11y e 14 zoom nativo |

Os três ZIPs foram obtidos para comparação. A verificação automática de pixels percorreu **todos os 328 pares com caminhos coincidentes** do baseline inicial e do pós-merge; as pranchas gerais foram inspecionadas para os **84 exports × 4 combinações** (claro/escuro e 390/1440). Foram examinadas diretamente capturas originais selecionadas, sobretudo `organization-switcher`, `file-upload`, `icon`, `dropdown-keys` e zoom. **Não** houve inspeção perceptual individual de todos os 336 PNGs em resolução integral, nem teste manual de navegação no browser nesta rodada.

## Comparação histórica real: baseline inicial → pós-merge

- **328/328** nomes de screenshot do baseline presentes no pós-merge; **8 novas capturas de catálogo** (4 `page-header` e 4 `icon-slot`) sem par equivalente nesse baseline. Não atribuir diferenças dessas adições à correção da #152 sem histórico intermediário.
- **255/328 PNGs binariamente idênticos**; 73 diferem em bytes. Desses 328, **8 mudaram de dimensão**: `file-upload` (4 combinações) e `icon` (4 combinações). Essa mudança de dimensão inviabiliza um percentual de pixels sobreposto sem alinhamento/corte.
- Entre os **320 pares de mesmo tamanho**, somente **12** possuem algum pixel cuja diferença máxima de canal RGB excede 20. **2** são os `organization-switcher` em dark (47,3003% em 390px; 54,1325% em 1440px): a troca dos dois previews incorporados de claro para escuro foi observada diretamente, coerente com a correção do bug de propagação de tema. Nos outros **10**, a área acima do limiar é **≤0,0837%** cada; isso não comprova defeito.
- O relatório de triagem passou de **4 sinais** no baseline inicial para **0** no artefato pós-merge. Dos quatro iniciais, **2** eram iframes em tema incorreto (`AdsOrganizationSwitcher`, dark em 390/1440); **2** eram suspeitas de overflow no `AdsAdminShell` desktop (light/dark), triadas historicamente como falso positivo do medidor, sem clipping visível confirmado. Não tratar redução de sinais como evidência de aprovação perceptual completa.
- `AdsFileUpload` em 390px: lado a lado evidencia separação e quebra das ações antes visualmente aglomeradas. Em 1440px o espaçamento também muda sem recorte perceptível na amostra examinada. A alteração é da composição da demo, não prova de alteração da API pública do componente.
- `AdsIcon`: o pós-merge apresenta um exemplo adicional de SVG local no slot genérico. É uma mudança de demonstração, **não uma regressão encontrada**.

Metodologia numérica: screenshot com mesmo caminho; imagens convertidas a RGB, comparação de cada pixel por `max(abs(RGB_antes-RGB_depois)) > 20`; relatório percentual sobre a área comum **somente quando as dimensões coincidiam**. Diferenças de antialiasing, fonte, temporização ou viewport podem produzir bytes diferentes sem defeito. A revisão do impacto visual concentrou-se nos casos de maior variação e nas quatro combinações do catálogo.

## Triagem específica: PR #325 pré-squash → pós-merge

Os dois ZIPs desta fase contêm **445 PNGs de mesmos caminhos**, dos quais **403 idênticos em bytes** e 42 com bytes diferentes; na matriz inicial **315/336** são idênticos e 21 diferem. Isso **não** constitui o baseline histórico anterior às correções.

Sete diferenças de alta prioridade da triagem anterior foram pareadas. As imagens foram alinhadas exploratoriamente por uma translação vertical entre -50 e +50 pixels, medindo erro de RGB em uma região central amostrada (fora do cabeçalho), para testar a hipótese de deslocamento de enquadramento:

| Captura em `screenshots/a11y/`                    | Diferença bruta de pixels >20 | Melhor translação vertical | Diferença na região amostrada após alinhamento |
| ------------------------------------------------- | ----------------------------: | -------------------------: | ---------------------------------------------: |
| `dropdown-keys-light-390.png`                     |                       14,035% |                      +24px |                                         0,542% |
| `zoom-dropdown-dark-native-200-dark-1440.png`     |                        6,578% |                       +5px |                                         0,616% |
| `zoom-dropdown-light-native-200-light-1440.png`   |                        6,170% |                       -4px |                                         0,558% |
| `zoom-popover-dark-native-200-dark-1440.png`      |                        5,602% |                       -4px |                                         1,241% |
| `zoom-popover-light-native-200-light-1440.png`    |                        4,822% |                       +5px |                                         0,595% |
| `zoom-adminshell-dark-native-200-dark-1440.png`   |                        2,982% |                      +13px |                                         0,024% |
| `zoom-adminshell-light-native-200-light-1440.png` |                        2,992% |                      -13px |                                         0,085% |

**Atenção:** as porcentagens da última coluna usam apenas a região central amostrada após o alinhamento, e portanto **não são diretamente comparáveis** à porcentagem de imagem total na segunda coluna. O alinhamento forte sustenta a hipótese de alteração de posição/scroll durante a captura, mas **não determina a causa** nem demonstra ausência de falha funcional. Nas capturas `dropdown-keys-light-390`, menu aberto e opções permanecem legíveis antes e depois; nas amostras de zoom revisadas não foi confirmado clipping impeditivo.

## Registro de findings e decisão provisória

| Componente / contexto                                                    | Esperado × observado antes                                                       | Evidência pós-correção                                                             | Classificação / severidade                                                                       |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `AdsOrganizationSwitcher`, dark, 390/1440                                | Iframes internos também escuros × dois previews claros                           | Previews agora escuros em ambos; relatório automático sem mismatch                 | **Correção histórica confirmada; severidade atual: sem falha confirmada**                        |
| `AdsFileUpload` demo, mobile 390                                         | Ações separadas, sem contato visual × ações próximas no baseline                 | Ações separadas/quebra de linha visível                                            | **Correção estética da demo confirmada; severidade atual: sem falha confirmada**                 |
| `AdsAdminShell`, light/dark, 1440                                        | Controle sem recorte × alerta automático sobre dimensão do ícone                 | Ausência de sinal no resultado final, evidência histórica de falso positivo        | **Falso positivo histórico; sem defeito visual confirmado**                                      |
| `AdsDropdown`, teclado, light 390                                        | Menu acessível e foco/itens visíveis × diferença de deslocamento entre execuções | Opções legíveis nas duas imagens; translação +24px explica grande parte do diff    | **Variação de enquadramento provável; causa pendente de reprodução; severidade: não atribuída**  |
| `AdsDropdown`, `AdsPopover`, `AdsAdminShell`, zoom 200%, light/dark 1440 | Reflow e overlays sem perda funcional × deslocamentos verticais entre execuções  | Diferenças muito menores após alinhamento; testes objetivos do run final aprovados | **Variação de captura provável; confirmar em reprodução específica antes de declarar regressão** |

Revisão panorâmica de tipografia, densidade, alturas de controles, elevação e affordance de `.demo-panel` e `.demo-utility-panel`: **nenhuma nova divergência inequívoca confirmada nas pranchas**. Isso é uma triagem geral, **não** substitui a inspeção individual em resolução original e não equivale a aval global de contraste ou usabilidade por teclado.

## Pendências para aceite definitivo

1. Reprodução específica dos overlays de dropdown/popover e reflow/zoom no browser para distinguir mudança de scroll na captura de regressão real, caso se decida elevar a hipótese a um finding.
2. Inspeção perceptual individual integral dos 84 exports e estados aplicáveis com evidência rastreável; as quatro pranchas são amostras reduzidas, não substitutos.
3. Registrar eventuais novos defeitos com viewport/tema/estado, esperado/observado, severidade, antes/depois e issue/PR de correção. Nenhum novo bug foi confirmado na presente rodada.
4. Obter autorização expressa antes de **merge** desta documentação ou **fechamento** da #152. O archive OpenSpec anterior não deve ser refeito.

Artefatos do GitHub Actions têm **retenção limitada**; manter as referências de run, commit e artefato e não apresentar seus links como evidência permanente. Esta documentação preserva a distinção entre **aprovação declarada pelo usuário** em [`visual-audit-review-152.md`](visual-audit-review-152.md), **checagens automáticas** e a **inspeção efetivamente executada nesta rodada**.
