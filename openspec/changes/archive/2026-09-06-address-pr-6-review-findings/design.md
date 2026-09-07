## Context

Os tokens públicos já expõem papéis independentes de superfície selecionada e
texto primário, além de uma escala de camada para dropdown, overlay e toast.
Os componentes de navegação combinam os dois primeiros papéis, enquanto os
overlays ancorados usam atualmente a camada de toast.

## Goals / Non-Goals

**Goals:**

- Tornar o par de cores do estado selecionado explicitamente personalizável.
- Separar a prioridade visual de tooltip/popover e notificações.
- Impedir que um artefato local volte a ser versionado.

**Non-Goals:**

- Alterar APIs de interação, gerenciamento de foco ou posicionamento dos
  overlays.
- Mudar a densidade padrão de `AdsSurface`.
- Criar dependências ou uma nova camada de empilhamento.

## Decisions

### Usar um token pareado para conteúdo selecionado

Será incluído `onSurfaceSelected` nos dois temas e no formato TypeScript, e as
classes de conteúdo ativo de navegação e tabs passarão a consumi-lo. Isso
permite que consumidores alterem o fundo selecionado sem depender de
`textPrimary` para manter contraste. Manter `textPrimary` seria compatível com
os valores atuais, mas deixaria a associação implícita para temas customizados.

### Aplicar a camada de overlay a conteúdo ancorado

Tooltip e popover usarão a camada de overlay, mantendo-os acima do conteúdo
comum e abaixo de toasts. A camada de dropdown foi descartada porque popovers
interativos podem exigir prioridade equivalente a outros overlays.

### Ignorar explicitamente logs locais

O arquivo rastreado será removido e `debug.log` será ignorado na raiz. Isso não
altera artefatos de distribuição nem o comportamento de runtime.

## Risks / Trade-offs

- [Um tema consumidor pode definir cores sem contraste] → o novo token fornece
  um contrato pareado e os valores padrão preservam contraste nos dois temas.
- [Overlays ancorados e dialogs compartilham a mesma camada] → os portais
  preservam a ordem de abertura; uma camada adicional só será considerada se
  houver um caso de uso observável que a exija.

## Migration Plan

1. Publicar o token aditivo nos formatos CSS e TypeScript.
2. Atualizar os componentes consumidores e seus testes.
3. Regenerar os artefatos de tokens e o CSS distribuído.
4. Caso seja necessário reverter, restaurar as classes anteriores; o token novo
   pode permanecer sem quebrar consumidores.
