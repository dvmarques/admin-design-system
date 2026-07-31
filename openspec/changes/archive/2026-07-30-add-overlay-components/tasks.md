## 1. Infraestrutura compartilhada de overlays

- [x] 1.1 Criar utilitários internos com limite de cliente para portal seguro após a montagem, IDs acessíveis, rastreamento/restauração de foco e listeners de Escape e clique externo.
- [x] 1.2 Implementar e testar o utilitário de foco modal, incluindo lista de elementos focalizáveis e navegação Tab e Shift+Tab em ciclo.
- [x] 1.3 Estender `@admin-ds/tokens` apenas com os papéis semânticos de overlay ainda ausentes, regenerar os artefatos e mapear todas as classes Tailwind estáticas no CSS distribuído.

## 2. Diálogos modais e drawers

- [x] 2.1 Implementar `AdsDialog` controlado com painel composicionável, nome acessível, backdrop, opções de fechamento e retorno de foco.
- [x] 2.2 Implementar `AdsDrawer`/offcanvas controlado com os mesmos contratos modais, posicionamento lateral e largura responsiva.
- [x] 2.3 Exportar os componentes e seus tipos públicos pelo ponto de entrada de `@admin-ds/components` e verificar o build do pacote.
- [x] 2.4 Adicionar testes de unidade e acessibilidade para semântica, abertura controlada, Escape, backdrop, botão de fechar, foco cíclico e retorno ao gatilho.

## 3. Tooltips e popovers ancorados

- [x] 3.1 Implementar `AdsTooltip` com gatilho composicionável, associação descritiva, revelação por foco/apontamento e sem captura de foco.
- [x] 3.2 Implementar `AdsPopover` controlado com relação acessível ao gatilho, conteúdo interativo, Escape, clique externo e retorno de foco por teclado.
- [x] 3.3 Implementar o cálculo interno de posicionamento ancorado e seus ajustes em rolagem, redimensionamento e proximidade das bordas da viewport.
- [x] 3.4 Exportar APIs e tipos de overlays ancorados e adicionar testes de comportamento, teclado, acessibilidade e limites responsivos.

## 4. Toasts

- [x] 4.1 Implementar `AdsToast` composicionável com variantes info, sucesso, aviso e erro, sem estado global ou autoclose implícito.
- [x] 4.2 Adicionar regiões de anúncio adequadas a cada variante e controle de fechar acessível que solicita remoção ao consumidor.
- [x] 4.3 Exportar `AdsToast` e seus tipos, aplicar estilos estáticos tematizáveis e testar variantes, anúncios, fechamento por teclado e viewport estreita.

## 5. Documentação e integração

- [x] 5.1 Criar uma story no Storybook para cada componente público, cobrindo estado fechado/aberto, fechamento, teclado, temas claro/escuro e layouts estreitos relevantes.
- [x] 5.2 Adicionar exemplos no admin demo que consumam somente exports e `styles.css` públicos para dialog, drawer, tooltip, popover e toast.
- [x] 5.3 Atualizar os testes de consumo público e CSS compilado da aplicação Next.js para incluir a nova família de componentes.

## 6. Validação

- [x] 6.1 Criar ou atualizar testes Playwright para os fluxos críticos de foco modal, Escape, clique externo, retorno ao gatilho e navegação por teclado.
- [x] 6.2 Executar typecheck, lint, testes, geração de tokens, inspeção de CSS, build e validação do consumo no admin demo.
- [x] 6.3 Formatar os arquivos novos e alterados e executar `npm run format` com sucesso antes de concluir a change.
