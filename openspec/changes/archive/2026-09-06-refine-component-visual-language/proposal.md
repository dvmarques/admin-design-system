## Why

Os componentes atuais cumprem a maior parte dos contratos funcionais e de acessibilidade, mas ainda apresentam uma linguagem visual básica e pouco diferenciada para produtos administrativos. A fundação de tipografia, forma, elevação e estados precisa amadurecer de maneira coerente para que aplicações consumidoras recebam maior clareza de hierarquia, feedback e densidade sem recriar estilos locais.

## What Changes

- Refinar os tokens públicos de tipografia, raio, elevação, cor de estado e movimento, preservando seus nomes e a possibilidade de sobrescrita por variáveis CSS.
- Ampliar a fundação com papéis semânticos aditivos para superfícies interativas e selecionadas, borda forte, foco, hover de ações, três níveis de elevação e camadas de overlay, sem substituir tokens públicos existentes.
- Atualizar a apresentação visual de `AdsButton`, `AdsSurface`, `AdsBadge`, controles textuais e controles de seleção para tornar variantes, foco, validação, indisponibilidade e carregamento mais distinguíveis nos temas claro e escuro.
- Diferenciar visualmente o estado somente leitura do estado desabilitado e reforçar o ritmo entre rótulo, ajuda, controle e validação nos formulários.
- Reforçar a hierarquia e os estados de navegação estrutural, menus, paginação e overlays, incluindo comportamento intencional em larguras reduzidas, mantendo as APIs públicas e a independência de roteador.
- Refinar a consistência visual de avatar, ícones e indicador de carregamento; introduzir um estado de carregamento esqueletal reutilizável quando a estrutura do conteúdo for previsível.
- Manter compatibilidade retroativa: a mudança não remove nem renomeia componentes, props, variantes ou tokens públicos existentes.

Fora do escopo:

- Alterações de estrutura, navegação, tema, addons ou documentação do Storybook.
- Alterações da aplicação de demonstração, exceto a validação de consumo dos estilos publicados.
- Novas regras de negócio, integração de roteamento ou dependências de runtime adicionais.
- Adoção ou distribuição de uma nova família tipográfica externa.

## Capabilities

### New Capabilities

- `skeleton-loading`: estado esqueletal reutilizável para áreas cujo layout final é conhecido.

### Modified Capabilities

- `design-tokens`: ampliar a fundação visual pública sem alterar os contratos de distribuição e sobrescrita.
- `typography`: refinar a hierarquia padrão para leitura administrativa e preservar sua personalização.
- `button`: reforçar hierarquia de variantes e feedback de interação sem mudar a API.
- `surface`: tornar os níveis de superfície visualmente distinguíveis e coerentes entre temas.
- `badge`: tornar estados compactos mais legíveis e menos genéricos.
- `form-controls`: aperfeiçoar a apresentação de campos textuais nos estados operacionais documentados.
- `form-field-composition`: melhorar o agrupamento visual de rótulo, controle e mensagens de ajuda ou validação.
- `form-selection-controls`: refinar estados visuais e alinhamento dos controles de seleção.
- `navigation-structure`: reforçar hierarquia, estado atual e foco de breadcrumb, nav e tabs.
- `navigation-menus`: refinar a superfície e os estados de menus contextuais.
- `pagination`: melhorar a distinção de página atual, controles adjacentes e estados de interação.
- `overlay-dialogs`: aprimorar a composição visual de dialog e drawer.
- `anchored-overlays`: aprimorar contraste e associação visual de tooltip e popover.
- `toast-notifications`: reforçar leitura, hierarquia de variante e descarte em notificações transitórias.
- `loading-indicator`: alinhar aparência e movimento do indicador à fundação visual revisada.
- `avatar`: alinhar proporção, fallback e forma aos demais componentes.
- `icon`: padronizar presença óptica e comportamento visual dos tamanhos de ícone.

## Impact

- Pacotes afetados: `@admin-ds/tokens` e `@admin-ds/components`.
- Consumidores recebem os refinamentos ao importar os estilos públicos existentes; não precisarão adotar Tailwind, dependências adicionais ou novas APIs para manter o comportamento atual.
- Os testes de componentes, temas, acessibilidade, distribuição CSS e consumo pela aplicação Next.js precisarão ser expandidos para cobrir os estados visuais revisados.
- A nova capacidade de skeleton será uma adição compatível à API pública de componentes.
