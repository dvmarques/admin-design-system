# Design — adornos compactos e input flexível

## Diagnóstico e decisão
AdsInputGroup é flex com spans de início/fim contendo texto e botões AdsButton; sem política explícita de shrink e quebra, o controle w-full pode pressionar prefixo/sufixo até quebrar palavras. Inspecionar a geometria/estilos calculados em várias larguras para confirmar onde o flex-shrink ocorre.

Aplicar comportamento reutilizável ao InputGroup:
- os adendos textuais e botões anexados preservam conteúdo curto em linha, com width baseada no conteúdo e sem shrink indevido;
- o controle editável permite encolher até min-width:0 em vez de forçar uma largura intrínseca que esmague os adornos;
- regras de nowrap para botões limitam-se ao contexto dos adendos; classes globais de AdsButton permanecem intactas;
- quando todos os adornos excedem a largura realmente disponível, escolher scroll horizontal local acessível ou outra estratégia explicitamente testada que conserve ações inteiras e não faça a página transbordar; não prometer impossibilidade geométrica.

A solução deverá funcionar com startContent isolado, endContent isolado e ambos, incluindo um ou vários botões e elementos não-AdsButton. Preservar altura alinhada, bordas unificadas, foco e estados do controle, além dos tokens semânticos. Não ocultar prefixo nem cortar rótulo com ellipsis no fluxo normal.

## Demo específico e experiência
Atualmente catalogEntries mapeia AdsInputGroup à demo Field, cujo cabeçalho genérico descreve Field. Criar InputGroupDemo dedicado e preservar FieldDemo para Field/Label/Description/Message, com snippets AST coerentes. No exemplo Valor em reais, o valor inicial é 120; Limpar deve produzir string vazia e Restaurar deve restaurar 120. Os botões podem ter nome acessível contextual Limpar valor e Restaurar valor, preservando rótulos visuais curtos.

Adicionar tamanhos sm/md/lg, variação apenas texto, botões à esquerda/direita e combinações. Se o fallback em viewport extremamente estreita usar rolagem local, permitir alcançar ações por teclado com foco visível e sinalização de rolagem quando necessário.

## Compatibilidade, pacotes e layout
O CSS distribuído é compilado em @admin-ds/components e deve funcionar em Next.js sem Tailwind/preflight no consumidor. Nada muda na API pública ou nos exports. Não modificar tokens, escala de fontes ou hierarquia de famílias; AdsInputGroup continua página independente da família Field (#240). Sem alterações de Server/Client Components, além da interatividade local do demo; classes devem ser estáticas para o Tailwind compilá-las.

## Alternativas
- Encurtar apenas Limpar valor: melhora demo, mas não corrige R$ nem outros consumidores; rejeitado como solução exclusiva.
- nowrap em todo AdsButton: causaria regressões fora do grupo; rejeitado.
- esconder botões/forçar truncamento: perda de função; rejeitado.
- reservar tamanho natural para adornos e encolher input com fallback local: solução preferida, com inspeção real de overflow e acessibilidade.

## Riscos, rollback e revisão
Risco de overflow, foco clipado, bordas sobrepostas e campos demasiado estreitos no zoom 200%. Testes geométricos e snapshots revisados em light/dark. Reverter apenas classes do grupo caso não atendam consumidores, sem mexer na API.
