# Design — paginação responsiva

## Medição e estabilidade

AdsPagination permanece Client Component. O HTML inicial é determinístico e não acessa DOM no render; a adaptação acontece após montagem. ResizeObserver acompanha a área disponível e a lista, inclusive mudanças de fonte, conteúdo e zoom. As larguras reais dos controles de navegação, espaços e itens numéricos determinam a capacidade; não usamos breakpoints ou estimativas fixas para textos. Atualizações são agrupadas em requestAnimationFrame, com igualdade de estado e cleanup de observer/frame/listener. A largura disponível independe da largura intrínseca da lista.

Números têm dígitos tabulares e largura estável para o total de páginas. Primeira, atual e última são obrigatórias. Reticências representam lacunas de duas ou mais páginas e são omitidas antes do fallback quando só os números obrigatórios cabem; uma lacuna unitária usa seu número. siblingCount limita adjacentes, mantendo a expansão antiga de totais pequenos quando couber. Se o mínimo não couber, a região rolável é nomeada, focalizável e tem folga para hover e foco. Salto e rodapé quebram linha separadamente.

## Contratos públicos e acessibilidade

Texto continua padrão; navigationMode, previousContent, nextContent, showFirstLast, showPageJump, loading e labels são opcionais. Labels distinguem texto visível e nome acessível. Loading mantém os elementos montados/focáveis com aria-disabled e aria-busy e bloqueia ativação em captura (também links e renderPage legado). Não realiza busca de dados.

O salto usa grupo rotulado, não form aninhável: Enter e botão validam inteiro decimal entre 1 e pageCount, distinto da página atual. Erros usam aria-invalid, aria-describedby e alert. Com renderPageLink, a confirmação usa o link do consumidor e Enter ativa esse mesmo link; não cria button dentro de anchor. onPageChange continua reservado ao modo de callback. O campo sincroniza page e pageCount externos.

Quando o total positivo torna page inválida, renderizamos a página limitada e solicitamos onPageChange uma vez por combinação inválida, em efeito após commit, adiado durante loading. O consumidor aplica a correção ao estado/dados. Em modo exclusivamente de links, o consumidor normaliza a URL/dados; não há navegação automática. Total zero não solicita página inexistente. Mudanças externas não deslocam o foco; keys numéricas estáveis evitam substituições e, se um item focado sai durante uma interação/resize, o foco permanece na página atual, somente quando se perdeu dentro da paginação.

## SmartTable e CSS distribuído

A composição recebe paginação pelas props existentes, sem regra de tabela na biblioteca base. pageSize/onPageSizeChange habilitam seletor controlado; totalItems/pageSize habilitam resumo somente com intervalo verificável nas rows recebidas. Não inventa registros quando vazio, total desconhecido ou página inválida. Labels do rodapé são personalizáveis. Loading da tabela ou da paginação bloqueia o seletor e a navegação. Mudar tamanho não busca dados nem muda página automaticamente; o consumidor atualiza ambos.

Classes ads- e tokens semânticos existentes preservam identidade, temas e personalização. Estilos são distribuídos no CSS compilado; Next.js importa apenas exports públicos, sem Tailwind no consumidor. Nenhuma dependência nova de runtime. Bundle medido: components 356809 → 382334 bytes (+25525); JavaScript do módulo em gzip 1092 → 3956 (+2864). A nova API exige atualização explícita do baseline de components; tolerância de 10% preservada. Detalhes e método em docs/bundle-baseline.md.

## Alternativas, riscos e rollback

Breakpoints e larguras mágicas falham com traduções e sidebar; medir apenas a lista renderizada sem controlar largura disponível pode oscilar. Escolhemos medição de controles reais e slots estáveis. Fallback horizontal é necessário somente para impossibilidade física. Links customizados devem espalhar as props recebidas e renderizar um único controle sem interativos aninhados; renderPage é preservado como legado. A aparência responsiva muda intencionalmente a quantidade de números e o espaçamento vertical, exigindo inspeção visual. Rollback reverte conjuntamente componente, CSS, integração e testes desta change; não altera #91.

## Decisões registradas na revisão humana

A adaptação reduz a lista de siblingCount; não expande adjacentes além desse
limite em contêiner largo. A documentação exige personalizar conjuntamente
texto visível e nome acessível. Input numérico e select nativos preservam a
composição compacta e a gestão local de largura/foco; AdsInput/AdsSelect não
são tecnicamente incompatíveis. O erro usa ARIA e alerta textual, sem borda
de erro dedicada; uniformização visual de estados de campo fica como melhoria
futura. A revisão não encontrou bloqueios; o usuário autorizou documentação,
archive e squash, aceitando o custo de bundle registrado nesta change.
