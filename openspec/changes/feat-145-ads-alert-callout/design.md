# Design: AdsAlert / AdsCallout

## API e composição
`AdsAlert` único com `appearance="compact" | "callout"` (padrão compact), `variant="info" | "success" | "warning" | "error"`, `title?: ReactNode`, `children?: ReactNode`, `icon?: ReactNode | null`, `actions?: ReactNode`, `dismissible?: boolean`, `closeLabel?: string`, `open?: boolean`, `defaultOpen?: boolean`, `onClose?: () => void`. `role` opcional via atributos HTML para casos especiais. Sem portal e sem expiração.

## Decisões
- Um único componente evita duplicação de lógica entre Alert e Callout; alias público desnecessário.
- Fechamento interno não controlado usa state; controlado requer que consumidor atualize `open` depois de `onClose`. Botão de fechar é button type=button, rotulado e focável.
- Variante error usa `role=alert`; demais usam `role=status`; não usar `aria-live` adicional e não remontar por timestamps. A aplicação decide quando inserir mensagem no DOM.
- Ações são ReactNode, não handlers hardcoded; quem consome controla semântica, loading e navegação.
- Componente client apenas pela interação de fechamento. Isolar o estado para evitar efeitos globais.
- Reutilizar classes e tokens `--ads-`, sem cores hardcoded; CSS compilado pelas classes estáticas no pacote. Sem nova dependência.
- Layout flex responsivo, wrap das ações, leitura e foco visível. Contraste via tokens existentes e suporte a forced-colors.

## Alternativas
Dois componentes independentes causariam divergência de acessibilidade; provider global seria excesso para mensagens inline. `AdsToast` não atende persistência e localização no fluxo.

## Compatibilidade e riscos
API aditiva; possibilidade de alertas repetidos quando aplicação remonta mensagens fica documentada. Validar build de pacotes, Storybook, demo, E2E e contraste nos dois temas. Rollback remove apenas arquivos/export adicionados.
