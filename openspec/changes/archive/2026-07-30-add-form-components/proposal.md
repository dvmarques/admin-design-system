## Why

As primitivas visuais já estão disponíveis, mas as aplicações consumidoras ainda precisam implementar controles de formulário e seus estados de validação de forma independente. Uma família de formulários acessível e consistente reduz duplicação e estabelece a base para filtros, fluxos administrativos e composições que serão entregues nas próximas changes.

## What Changes

- Adicionar ao pacote `@admin-ds/components` controles públicos de texto, textarea, checkbox, radio, switch e select, todos com APIs React prefixadas por `Ads`.
- Incluir composição de campos — rótulo, descrição, mensagem de erro e grupos de entrada — para associar semântica, ajuda e validação aos controles de maneira acessível.
- Definir estados e estilos consistentes para foco, desabilitado, somente leitura, inválido e sucesso, usando exclusivamente tokens semânticos existentes e o CSS compilado da biblioteca.
- Documentar cada controle e seus estados no Storybook, com exemplos nos temas claro e escuro, e demonstrar o consumo pelas APIs públicas no aplicativo Next.js de referência.
- Cobrir comportamento, navegação por teclado, acessibilidade, temas e consumo do CSS distribuído com testes automatizados.

Fora do escopo: gerenciamento de estado ou submissão de formulários; validação de regras de negócio; seleção de data, upload de arquivos, autocomplete ou editores ricos; overlays, navegação, tabelas e composições de tela administrativas; e qualquer código, ativo ou implementação proprietária do CoreUI PRO.

## Capabilities

### New Capabilities

- `form-controls`: campos textuais, textarea e select com estados, acessibilidade e personalização segura.
- `form-selection-controls`: checkbox, radio e switch acessíveis, incluindo agrupamento e estados controlados ou não controlados.
- `form-field-composition`: associação reutilizável de rótulos, descrições, mensagens de validação e grupos de entrada aos controles públicos.

### Modified Capabilities

Nenhuma.

## Impact

- `packages/components`: novas APIs React públicas, tipos, estilos compilados e testes para a família de formulários.
- `apps/docs`: histórias e documentação visual dos controles, grupos e estados de formulário.
- `apps/admin-demo`: exemplos que consomem exclusivamente exports públicos e o CSS distribuído da biblioteca.
- A change reutiliza `@admin-ds/tokens`, os contratos de temas, distribuição, compatibilidade Next.js e garantia de qualidade existentes; não adiciona dependências de runtime sem necessidade justificada no design.
