# Design

## Context

Ver proposal.md. Header hoje ocupa a largura total; Body contém sidebar e main. A sidebar tem uma única instância desktop ou Drawer móvel. O dashboard herda demo-section com padding de até 4,5rem e usa auto-fit, causando 3+1.

## Goals / Non-Goals

Alinhar marca/header com altura natural; preservar contratos anteriores e manter ajustes editoriais locais. Não criar sistema genérico de posicionamento nem alterar AdsDashboardGrid para todas as quantidades.

## Decisions

- Root recebe layout="sidebar-header" opcional (padrão "standard"); Sidebar recebe header ReactNode opcional. A mesma Sidebar renderiza esse conteúdo antes da navegação no desktop e dentro do Drawer no mobile. Não cria organização nem espaço quando o slot está ausente.
- Desktop opt-in usa CSS grid e subgrid: aside ocupa as duas linhas; seu header participa da linha natural do header principal. Body usa display:contents somente nessa variante. Main e navegação continuam rolando separadamente; topo da sidebar permanece disponível. Alternativas: altura fixa cortaria texto; ResizeObserver duplicaria estado de layout e custo de JS.
- Ajuste aprovado após revisão visual: marca compacta "Admin DS" em uma linha; toggle circular com chevron na divisória, centralizado no topo, fora do fluxo do branding. Recolher não muda a altura da linha superior (64px na composição padrão); headers maiores continuam com altura natural. A variante não anima a largura, evitando reflow transitório do texto ao expandir; o layout standard preserva sua transição. Área de acionamento ampliada e foco visível; símbolo e botão não se sobrepõem. O toggle permanece separado da marca.
- AdsOrganization ganha avatarTone opcional, encaminhado ao AdsAvatar no gatilho e nas opções. Padrão neutral preserva consumidores existentes; o demo fornece primary para obter o mesmo fundo do avatar da conta, com cores semânticas de cada tema.
- Header, Body, Main e Root continuam componíveis por Server Components; estado/Sidebar/toggle seguem Client Components. Nenhum novo acesso ao DOM ou armazenamento; SSR permanece determinístico.
- CSS público ads-* compilado pelo processo existente, sem Tailwind exigido no consumidor. Nenhuma dependência ou fonte nova; apenas markup/CSS adicionais, impacto de bundle verificado no build.
- Demo recebe classe exclusiva de overview com tokens de espaçamento. Container queries locais 40rem/64rem definem 1/2/4 colunas. Mantém ordem do DOM, valores longos quebráveis e métricas arbitrárias no grid público.
- Seleção light é ajustada por variável CSS pública da navegação, com fallback atual na biblioteca. Somente o demo sobrescreve essa variável em light; texto/faixa/foco preservados. Dark não muda.
- Acessibilidade: menu móvel fora do Drawer; marca decorativa com nome textual; toggle separado; ícones e abreviações preservados; foco, retorno, isolamento e grupos existentes não são reimplementados.

## Risks / Trade-offs

- Subgrid exige navegadores modernos → navegadores suportados pelo projeto e E2E; layout padrão fica intacto.
- Header alto e sidebar compacta → linha compartilhada natural, testes de resize/texto longo/200%.
- Mudança intencional nos snapshots globais → capturas antes/depois nas mesmas viewports e revisão antes do workflow Linux.
- Contraste do ativo light → preservar texto atual e faixa; testar axe, foco e cores forçadas.

## Migration Plan

API opt-in, nenhuma migração obrigatória. Integrar biblioteca e consumidores juntos em develop. Rollback: remover layout/header do consumidor e reverter estilos locais. Não arquivar nem fazer merge sem revisão humana.

## Refinamento de seleção e largura do seletor

- No desktop recolhido, somente a cor da borda do gatilho de organização fica transparente; espessura, padding, tamanho e posição do avatar são preservados. O modo expandido mantém a borda.
- Expandido, o seletor organiza a âncora do popover como item de grid esticado: o gatilho ocupa toda a largura disponível, independente do nome. Não há largura fixa em pixels nem alteração global do Popover; rótulos longos continuam truncáveis.
- O item ativo recolhido tem 2,75rem por 2,75rem. A navegação é um container inline: unidades cqi permitem calcular a expansão lateral do item considerando o espaço tomado pela scrollbar. No expandido, a mesma expansão considera a diferença entre as larguras da sidebar. Assim o recuo da seleção é igual nos dois estados, sem mudar largura da barra, posição dos ícones ou indentação das categorias. Só o item ativo ganha essa largura adicional.
- Alternativa descartada: ampliar tudo com uma margem negativa constante produziria seleção maior que 44px em navegadores com scrollbar sobreposta. O cálculo é CSS, sem medição ou estado JavaScript novo.
