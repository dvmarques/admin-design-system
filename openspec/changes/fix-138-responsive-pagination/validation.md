# Validação da revisão — issue #138

## Escopo e revisão

Continuação da PR #176 e branch fix/138-responsive-pagination, sobre develop
91d47c9. Perfil Critical. A change permanece ativa; não houve merge ou archive.
Nenhuma alteração na #91 ou dependência de runtime adicionada. Node 24.19.0,
npm 11.19.1, npm ci --ignore-scripts e dependências do lockfile.

Problemas encontrados na versão publicada: regex rejeitava saltos válidos;
medição usava estimativas fixas para textos; loading substituía links por
botões e perdia foco; keys dependiam do índice; salto não funcionava em modo
somente de links; total inválido era limitado silenciosamente; resumo podia
anunciar linhas inexistentes; faltavam export do tipo de labels, testes e
consumo Next.js. Corrigidos e cobertos por regressões.

Na revisão posterior: utilitários CSS sem camada prevaleciam sobre min-height;
reticências consumiam slots e forçavam overflow quando os números obrigatórios
ainda cabiam; um aviso de ResizeObserver sem mudança deixava restauração de
foco pendente para uma alteração externa. Corrigidos. Os campos adicionados
a AdsSmartTableLabels são opcionais para preservar objetos tipados existentes.

## Evidência local

- Build completo normal passou nos cinco workspaces após limpar a saída gerada
  de Storybook (EEXIST na tentativa com saída anterior).
- Format, lint, typecheck, check:agent-skills e OpenSpec estrito passaram.
- Testes focados de componentes/admin passaram; regressões cobrem geometria,
  limpeza de observer/frame, foco, loading, legado, links, salto, labels e SSR.
- 17 E2E novos passaram em Chromium: páginas, sidebar, resize, teclado, salto,
  links, loading, SmartTable, fallback, zoom CSS 125%/200% e CSS compilado Next.js.
- A suíte completa executou 222 casos: **199 passaram / 23 falharam**. Vinte
  falhas são de inicialização/timeouts de Firefox/WebKit no executor; faltam
  bibliotecas do sistema, e install-deps foi bloqueado por setgroups/seteuid.
  Três são snapshots (data-display-dark, componentes-dark e clientes-dark).
  Não são tratados como aprovados; dependem da CI em ambiente suportado.
- test:quality falhou no teste de propriedade de checkout: o sandbox não permite
  chown para UID 1001. **760 Vitest / 52 arquivos passaram**; 86 testes focados
  de paginação/navegação/SmartTable passaram. O teste de chown não foi aprovado. Nenhum teste foi removido, alterado para ignorar
  essa falha nem considerado aprovado por não executar.
- Snapshots locais não foram atualizados. A apresentação de /data-display foi
  comparada visualmente: controles passam a ter altura mínima efetiva de 40px,
  e há folga vertical para hover/foco, deslocando o conteúdo seguinte. A mudança
  é intencional para corrigir o recorte; baselines devem ser regenerados apenas
  pelo workflow oficial Linux e revisados antes do aceite. As outras duas
  divergências locais já ocorreram neste executor; a CI decide sua validade.

## Inspeção visual

Capturas do exemplo em 390px e tema claro/escuro foram revisadas. Stories
PaginationResponsive e PaginationFooter foram construídas, abertas no navegador
e inspecionadas: controles e salto quebram linha, resumo/seletor permanecem
utilizáveis, e a tabela mantém sua própria rolagem de colunas. O fallback de
140px conserva primeira/atual/última e oferece região nomeada para teclado.
Zoom testado é CSS no Chromium; não é uma alegação de teste de zoom nativo
do navegador nem de dispositivos Safari/iOS reais.

## Bundle e riscos

Ver docs/bundle-baseline.md: medição isolada da develop, crescimento explícito
do módulo e dist e atualização do baseline exigida pela nova API funcional.
Tolerância de 10% preservada. Nenhum teste é publicado no dist.

Riscos: largura fisicamente insuficiente ainda exige rolagem; links customizados
devem espalhar as props e ser um único controle; modo somente de links exige
normalização de URL/dados pelo consumidor quando o total muda. Com callback,
a correção é solicitada uma vez por combinação inválida após commit, adiada
durante loading. O consumidor continua responsável por dados, tamanho e página.

## CI

Pendente de publicação desta revisão e execução sobre o SHA mais recente.
PR Draft não comprova validação. Não pronta para revisão enquanto houver
checks ou atualização oficial dos baselines pendentes.
