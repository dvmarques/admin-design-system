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

O histórico abaixo distingue falhas corrigidas e evidências atuais. A conclusão
exige CI no SHA mais recente; execuções skipped não comprovam validação.

## Primeiro retorno da CI

O commit 3405ab4 foi publicado na mesma PR e ela foi marcada Ready para
executar a CI 39880281718. O disparo anterior ficou skipped por ser Draft.
Build/distribuição, política/OpenSpec, Firefox e WebKit passaram. Qualidade
falhou no tipo da story PaginationFooter, que exigia args. A inspeção do log
local confirmou a mesma falha, que havia sido reportada incorretamente como
aprovação do typecheck completo. A story recebeu os args obrigatórios e
o comando npm run typecheck foi repetido isoladamente: exit code 0.

A interface do workflow oficial de baselines foi consultada porque o plugin
GitHub não oferece workflow_dispatch. Ela está sem sessão autenticada e não
foi possível disparar a atualização. Nenhum snapshot foi copiado do executor.
A conclusão depende dos checks da nova revisão e dos baselines Linux revisados.

O primeiro job Chromium da CI terminou com **199 passaram / 3 falharam**,
exclusivamente os snapshots componentes-dark, clientes-dark e data-display-dark.
Os três têm aumento de 32px na altura, coerente com controles e folga vertical
da paginação. Logo, as outras duas divergências não são tratadas como simples
variação local nesta change: a CI confirma que precisam de revisão e atualização
intencional. Firefox e WebKit passaram seus dez casos cada.

## Revisão visual e de compatibilidade final

A comparação das três telas confirmou a necessidade de mais altura e folga
vertical. Em clientes, identificou também uma regressão não intencional de
alinhamento à esquerda: corrigida antes de aceitar o baseline. A SmartTable
conserva o alinhamento à direita, com E2E dedicado. Na nova revisão, **18 E2E
focados passaram**. A CI 39880767049 do commit c3279ed aprovou qualidade
(760 Vitest / 52 arquivos), distribuição, política, Firefox e WebKit; o teste
condicional de checkout com outro proprietário foi skipped no runner não-root,
e não é declarado aprovado. A revisão posterior altera CSS/alinhamento e o
E2E correspondente; seus checks devem ser conferidos no novo SHA.

## Baselines oficiais Linux revisados

A CI 39881174015 de 3c1ea3d aprovou qualidade, distribuição, política/OpenSpec,
Firefox (10) e WebKit (10); Chromium teve 200 aprovações e três falhas visuais.
O workflow oficial 39884978145, disparado na branch da PR, terminou com sucesso:
**203 Chromium passaram na geração e outros 203 na confirmação sem atualização**.
O commit a15eff6 contém somente seis PNGs de clientes, componentes e data-display,
nos temas claro e escuro. Os dois disparos anteriores em develop foram skipped.

Comparados os seis PNGs oficiais com o commit pai: todas as telas ganharam
32px de altura, por controles de 40px e folga vertical para hover/foco. Clientes
preserva alinhamento à direita; componentes conserva primeira/atual/última no
exemplo estreito, com rolagem acessível quando o mínimo não cabe. Data-display
conserva o conteúdo e desloca as seções seguintes pela altura da paginação.
Nenhuma mudança visual alheia ao escopo foi encontrada. Nenhum snapshot local
foi copiado; somente o workflow oficial alterou os baselines.

A atualização de evidências dispara nova CI da PR, pois o commit criado com
GITHUB_TOKEN pelo workflow de baselines não a dispara sozinho. Os gates dessa revisão foram conferidos conforme o registro a seguir.

## Gates completos e entrega para revisão humana

A CI 39885552737 do commit 8600bc439bae7c7c3990abdf39ca267ade5b54e8
terminou com sucesso: qualidade (format, lint, typecheck e test:quality),
distribuição (build dos cinco workspaces e inspect:packages), política de
develop/OpenSpec, Chromium **203**, Firefox **10** e WebKit **10**. Total:
**223 E2E passaram**, sem falhas nem casos E2E ignorados. Vitest: **760 testes
em 52 arquivos**, sem skips. Os testes Node tiveram 28 e 67 aprovações; um
caso condicional de propriedade de checkout foi skipped no runner não-root,
sem ser declarado aprovado. Validação de release ficou skipped por não se
tratar de PR de release; não substitui nenhum gate obrigatório desta change.

Format e OpenSpec estrito foram repetidos após os baselines: 48 itens aprovados.
Revisão final do diff e git diff --check passaram; somente os seis PNGs oficiais
e a evidência documental foram acrescentados após a revisão funcional. Develop
91d47c9 permanece ancestral da branch; sem conflitos. Todas as dez tasks possuem
evidência. A atualização final de tasks/evidências recebe nova verificação de
CI no seu SHA antes da entrega; seu resultado ficará no corpo da PR #176.

Limitações locais anteriores permanecem registradas, sem simular aprovação.
Riscos de consumo e custo de bundle descritos acima continuam aplicáveis.
PR Ready para revisão humana; sem merge, squash, archive ou fechamento manual
da issue. A change permanece ativa.

## Ajustes documentais e arquivamento autorizados

Após revisão do SHA bcb9148 e CI 39885923490 aprovada, o usuário autorizou
expressamente ajustes de documentação, archive e squash. Foram esclarecidos
o limite de siblingCount, a personalização conjunta de texto/nome acessível
e a escolha de input/select nativos, incluindo estados e melhoria visual futura.
O comentário CSS foi corrigido para indicar override fora de @layer components.
Nenhuma regra CSS executável ou comportamento React foi alterado nesta etapa.

As specs pagination e smart-table receberam respectivamente cinco e um novos
requisitos da change, preservando integralmente os requisitos e Purpose anteriores.
A validação estrita das specs passou (47 itens). Dez tasks concluídas e todos
os artefatos completos foram confirmados pelo CLI oficial antes do archive.
O archive usa a data local do usuário, 2026-10-22. Os gates da revisão documental
e do archive serão novamente conferidos no SHA publicado antes do squash.
