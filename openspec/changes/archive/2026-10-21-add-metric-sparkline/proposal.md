## Why

O `AdsMetricCard` já mostra valor, variação, tendência por ícone e texto, e `sentiment` independente da direção, mas não mostra a evolução da métrica no tempo, e os dashboards dependem disso para ler "sobe, cai ou oscila" de relance. Os tokens de cor para gráficos (`--ads-color-chart1`…`8`) e o suporte a `forced-colors`, `prefers-contrast` e movimento reduzido já existem; falta um componente que os use (issue #89, filha do épico #85).

## What Changes

- **`AdsSparkline` em `@admin-ds/components`:** gráfico de linha minúsculo em SVG, sem eixos nem dependência de runtime nova, que recebe `values`, escala opcional (`min`, `max`), `labels` por ponto, `tone` (`default`, `positive`, `negative`) e `formatValue`. Funciona em Server Components.
- **Alternativa textual:** o SVG usa `role="img"` com `aria-label` gerado (quantidade de pontos, primeiro e último valor, mínimo e máximo), com `label` para nomear a série e `summary` para substituir o texto inteiro.
- **`AdsMetricCard` com prop `sparkline`:** exibe o sparkline abaixo da variação, colorido pelo `sentiment` do card, com skeleton de mesma altura no carregamento.
- **Indicador de variação:** sem API nova; o comportamento existente (`trend`, `sentiment`, `trendLabel`) ganha cobertura de testes (componente, SSR e `axe`), story do caso de `sentiment` invertido (queda de churn é positiva) e uso na demo.
- **Contraste:** `success` e `danger` passam a constar na lista central de pares de contraste contra `surface` e `surfaceRaised` (3:1), pois colorem o traço.
- **Documentação, stories e demo:** story do `AdsSparkline`, stories do card com sparkline, atualização dos textos que dizem que gráficos estão fora do escopo (continuam fora: gráficos completos) e a visão geral da demo com série e `sentiment`.

## Capabilities

### New Capabilities

- `sparkline`: gráfico de linha minúsculo e acessível, sem regras de negócio.

### Modified Capabilities

- `dashboard-metric-card`: sparkline opcional no card e cobertura do `sentiment` invertido.
- `admin-demo-application`: a visão geral exibe séries nos indicadores.

## Impact

- **Pacotes e APIs públicas:** `@admin-ds/components` (novo `AdsSparkline`, `AdsSparklineProps`, `AdsSparklineTone`; classes `ads-sparkline*`; sem mudança nas APIs existentes) e `@admin-ds/admin` (nova prop opcional `sparkline` e tipo `AdsMetricSparklineProps`; compatível com o uso atual). `@admin-ds/tokens` não muda de API; só a lista de testes de contraste cresce.
- **Biblioteca x demonstração:** a biblioteca entrega componente, estilos, stories e testes; a demo (`apps/admin-demo`) só valida o consumo e ganha séries em dados de exemplo, sem regras de negócio.
- **Visual:** a visão geral da demo muda; as baselines visuais afetadas devem ser regeneradas pelo workflow "Atualizar baselines visuais" e o diff, revisado.
- **Distribuição:** JS e CSS crescem pouco em `@admin-ds/components` e `@admin-ds/admin`; o baseline de tamanho é atualizado se necessário. Sem dependência de runtime nova; Tailwind continua interno e o CSS compilado segue utilizável sem Tailwind no consumidor.

### Fora do escopo

- Componente de gráfico completo, eixos, tooltips, legendas, interatividade e paletas sequencial e divergente.
- Prop numérica `delta` ou formatação automática de variação no card: o consumidor continua informando `change`, `trend` e `sentiment`.
- Tabela oculta com todos os pontos como alternativa textual.
