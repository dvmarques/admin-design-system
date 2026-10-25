## Why

Issue de acompanhamento: #205.

As mensagens de erro ficam visualmente afastadas dos controles no catálogo. Margens nativas dos parágrafos se somam ao gap do campo, prejudicando a associação visual e o consumo sem reset CSS.

## What Changes

- Aproximar ajuda e erro do controle, com espaçamento compacto e margens explícitas.
- Preservar distância do rótulo, contratos ARIA, tipografia, temas e APIs.
- Documentar e validar a composição no Storybook e no demo Next.js com CSS distribuído.
- Fora do escopo: novas APIs, identidade, regras de validação e espaçamento entre campos.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `form-field-composition`: mensagens próximas ao controle e independentes das margens nativas.

## Impact

Biblioteca: `@admin-ds/components`, `AdsField`, `AdsFieldDescription` e `AdsFieldMessage`, sem alteração de props ou dependências. Consumidores: Input, Textarea, Select e demais controles compostos com AdsField recebem o ajuste. Aplicações: exemplos existentes do catálogo demonstram a correção; Storybook documenta ajuda e erro simultâneos. Tokens e pacote admin não mudam.

## Perfil e compatibilidade

Perfil **Critical**, pois altera CSS distribuído de pacotes públicos e seu consumo no demo e Storybook. Mantém props, exports, DOM e contratos de acessibilidade; o efeito visual foi revisado pelo mantenedor no demo. Sem dependências ou alteração de bundle JavaScript. Rollback: reverter a alteração de estilos e seus baselines em conjunto. Validar a suíte completa e revisar diffs Linux antes da revisão humana da PR.
