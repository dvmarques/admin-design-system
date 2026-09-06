## 1. Fundação visual e distribuição

- [x] 1.1 Refinar os valores e papéis semânticos de tipografia, raio, elevação, estados interativos e movimento em `@admin-ds/tokens`, preservando nomes públicos existentes, e verificar a geração de CSS e TypeScript com `npm run generate --workspace @admin-ds/tokens`.
- [x] 1.2 Atualizar `AdsTypography`, `AdsSurface` e `AdsBadge` para consumir a fundação revisada e verificar seus testes de componente nos temas claro e escuro.
- [x] 1.3 Compilar os estilos de `@admin-ds/components` e verificar que o CSS distribuído contém apenas classes públicas prefixadas e referências a tokens com `npm run build --workspace @admin-ds/components`.

## 2. Ações e formulários

- [x] 2.1 Refinar variantes e estados táteis de `AdsButton`, incluindo foco visível, pressionamento, carregamento e indisponibilidade, e verificar com testes de teclado e estados existentes ou novos.
- [x] 2.2 Refinar `AdsInput`, `AdsTextarea` e `AdsSelect` para os estados vazio, preenchido, foco, erro, sucesso, somente leitura e desabilitado, e verificar comportamento nativo e contraste nos dois temas.
- [x] 2.3 Ajustar `AdsField`, grupos de entrada e controles de seleção para ritmo, alinhamento e validação consistentes, e verificar associações acessíveis entre rótulos, ajuda, erro e controles.

## 3. Navegação e feedback contextual

- [x] 3.1 Refinar estados visuais de breadcrumb, nav, tabs e paginação sem alterar seus contratos de teclado, e verificar destino atual, foco e comportamento em largura reduzida.
- [x] 3.2 Refinar superfície e estados de `AdsDropdown`, `AdsTooltip` e `AdsPopover`, e verificar contraste, foco e posicionamento com os testes de overlays ancorados.
- [x] 3.3 Refinar hierarquia visual de `AdsDialog`, `AdsDrawer` e `AdsToast`, e verificar backdrop, ação de fechar, foco e layout estreito nos dois temas.

## 4. Indicadores de identidade e carregamento

- [x] 4.1 Refinar proporção, fallback e alinhamento de `AdsAvatar` e `AdsIcon`, e verificar que a semântica acessível e os tamanhos públicos permanecem compatíveis.
- [x] 4.2 Refinar `AdsLoadingIndicator` para tokens e movimento reduzido, e verificar que a indicação permanece perceptível sem animação contínua.
- [x] 4.3 Implementar e exportar `AdsSkeleton` como componente composicional compatível com Server Components, e verificar tipos públicos, temas, redução de movimento e semântica acessível.

## 5. Qualidade e consumo externo

- [x] 5.1 Expandir os testes de componentes para cobrir a matriz de temas, foco, indisponibilidade, validação, carregamento e responsividade das famílias alteradas, e verificar com `npm run test --workspace @admin-ds/components`.
- [x] 5.2 Verificar consumo do CSS compilado e dos exports públicos pela aplicação Next.js de demonstração sem alterar sua apresentação, e executar `npm run test --workspace @admin-ds/admin-demo` e `npm run build --workspace @admin-ds/admin-demo`.
- [x] 5.3 Executar a validação completa de tipos, lint, build, testes e formatação com `npm run validate` e corrigir qualquer falha antes de concluir a mudança.

## 6. Refinamento de interação e responsividade

- [x] 6.1 Adicionar e mapear os tokens semânticos de superfície interativa e selecionada, borda forte, foco, hover de ações, elevação e camadas nos formatos públicos, preservando tokens existentes, e verificar a geração de CSS e TypeScript.
- [x] 6.2 Refinar os estados de AdsButton, controles textuais, controles de seleção e composição de campo para separar foco, hover, validação, somente leitura e indisponibilidade, e verificar contraste e comportamento nativo nos dois temas.
- [x] 6.3 Ajustar a seleção estrutural e o comportamento compacto de breadcrumb, navegação, tabs e paginação, mantendo contratos de teclado, foco visível e acesso a todos os destinos.
- [x] 6.4 Aplicar a escala de superfície, elevação e camada a dialogs, drawers, tooltips, popovers e toasts, com espaçamento responsivo abaixo de 768 px e sem alterar gerenciamento de foco ou posicionamento público.
- [x] 6.5 Expandir os testes de estado visual e largura reduzida das famílias alteradas, executar `npm run validate` e validar o consumo dos estilos públicos sem alterar Storybook ou a aplicação de demonstração.
