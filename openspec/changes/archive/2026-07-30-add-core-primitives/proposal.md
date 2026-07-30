## Why

A fundação já oferece tokens, temas e infraestrutura de distribuição, mas aplicações consumidoras ainda precisam criar seus próprios elementos básicos de interface. Disponibilizar primitivas consistentes agora reduz duplicação e estabelece as APIs reutilizáveis que as próximas famílias de formulários, overlays, navegação e composições administrativas irão compor.

## What Changes

- Adicionar ao pacote `@admin-ds/components` primitivas públicas de botão, badge, avatar, superfície, tipografia, ícone e indicador de carregamento, com o prefixo de API `Ads`.
- Definir variantes, tamanhos e estados aplicáveis para cada primitiva, com estilos baseados exclusivamente nos tokens semânticos já distribuídos.
- Garantir suporte aos temas claro e escuro, personalização segura via `className`, responsividade e requisitos de acessibilidade aplicáveis.
- Publicar documentação e exemplos executáveis de cada API no Storybook, incluindo estados relevantes e os dois temas.
- Adicionar testes de comportamento, acessibilidade e consumo do CSS compilado pelo aplicativo Next.js de referência.

Fora do escopo: campos e validação de formulários; componentes de sobreposição ou navegação; tabelas e outros componentes de apresentação de dados; layout estrutural de admin; e qualquer código, ativo ou implementação proprietária do CoreUI PRO.

## Capabilities

### New Capabilities

- `button`: botões acionáveis com variantes, tamanhos, estado desabilitado e carregamento acessíveis.
- `badge`: rótulos compactos e semânticos para status e classificação visual.
- `avatar`: representação de pessoas ou entidades com imagem, fallback e tamanhos consistentes.
- `surface`: superfícies composicionais neutras e elevadas para estruturar conteúdo sem regras de negócio.
- `typography`: elementos tipográficos semânticos e escalas reutilizáveis para conteúdo administrativo.
- `icon`: mecanismo tipado e acessível para apresentar ícones usados pelas APIs públicas.
- `loading-indicator`: indicador de progresso indeterminado para estados de espera.

### Modified Capabilities

Nenhuma.

## Impact

- `packages/components`: novas APIs React públicas, declarações de tipos, estilos compilados e testes.
- `apps/docs`: histórias e documentação visual para cada componente público.
- `apps/admin-demo`: exemplos de consumo somente pelos exports públicos e pelo CSS distribuído.
- APIs React e tipos públicos passam a usar o namespace `Ads`; classes públicas usam `ads-` e tokens permanecem no namespace `--ads-*`.
- A mudança reutiliza `@admin-ds/tokens` e os contratos existentes de temas, distribuição, Next.js e garantia de qualidade; não introduz dependências de runtime sem justificativa registrada no design.
