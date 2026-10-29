# Design — fonte consistente sem reset do consumidor

## Diagnóstico

AdsInput e AdsTextarea invocam formControlClasses(size, validationState, className). A cadeia inclui text-sm e cores, mas não explicita font-family. O pacote distribui classes Tailwind compiladas sem o preflight: textarea e outros elementos de formulário podem usar a fonte user-agent em vez da fonte do body. Confirmar em ambiente real com getComputedStyle antes de aplicar correção.

## Decisão

Conferir todos os controles atendidos por formControlClasses, especialmente AdsInput, AdsTextarea e AdsSelect, e aplicar a família tipográfica pública no ponto mais compartilhado que preserva a personalização: utilitário font-sans mapeado em @theme inline para --ads-typography-font-family, ou equivalente comprovado no CSS compilado. Não definir valor fixo Inter: o token público permite customização por consumidor/tema.

A classe opcional className segue podendo alterar o estilo deliberadamente, respeitada a semântica do mecanismo de merge de classes atual. O placeholder herda a font-family do elemento e deve conservar a cor de placeholder definida por tokens. Tamanhos sm/md/lg e estados invalid, readonly e disabled continuam independentes dessa escolha.

## Limites de pacotes e integração

Nenhuma prop/export muda. A classe é gerada pelo CSS compilado de @admin-ds/components e funciona sem Tailwind no Next.js consumidor; @admin-ds/admin herda comportamento apenas quando compõe esses controles. Não mexer na definição de tokens, no carregamento da Inter pelo demo ou em CSS global do body.

Controladores server-safe permanecem compatíveis com renderização no servidor; não requer use client adicional, estado, efeito ou runtime JS. Testes podem usar computed styles no Playwright em página que não aplica reset/preflight. Verificar especificidade de classe de consumidor com estilo customizado e o caso de um ancestral que altera o token.

## Alternativas e trade-offs

- Corrigir só AdsTextarea: resolve captura, mas deixa inconsistência em outros elementos nativos; rejeitado sem evidência de necessidade.
- Usar font: inherit: inclui propriedades não desejadas, como tamanho/altura herdados; preferir somente família tokenizada.
- Configurar fonte apenas no body do Admin Demo: mascara o defeito em consumidores externos; rejeitado.
- Definir font-family no controle compartilhado: mantém design tokens públicos e reduz divergência; decisão preferida após diagnóstico.

## Riscos, rollback e revisão

A troca da fonte do user-agent pela fonte do token pode alterar sutilmente a largura do texto e do placeholder; comparar antes/depois em temas, zoom e tamanhos. Como `classNames` apenas concatena classes (sem tailwind-merge), uma utilitária de fonte do consumidor via `className` compete com `font-sans` pela ordem do CSS (mesma especificidade), como ocorre com as demais utilitárias do controle; a personalização garantida é pelo token `--ads-typography-font-family`. Não atualizar snapshots sem revisão dos deltas. Rollback é remover a regra compartilhada caso regressões não resolvidas sejam identificadas; não há migração de API.
