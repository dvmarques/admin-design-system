## Motivação

A issue #348 solicita listras e quebra de texto opt-in nas tabelas, sem exigir CSS ou Tailwind do consumidor.

Perfil **Critical**: APIs públicas, tokens, CSS distribuído e múltiplos pacotes.

## Mudanças

- Acrescentar `striped?: boolean` e `wrap?: boolean` a `AdsTable` e `AdsSmartTable`.
- Publicar `--ads-color-table-stripe` nos temas claro e escuro.
- Preservar padrões, semântica, hover, seleção e contratos de virtualização.
- Documentar e demonstrar as opções no Storybook; testar componentes e consumo.

## Capabilities

### Modified Capabilities

- `data-tables`: opções de apresentação.
- `smart-table`: repasse das opções e compatibilidade com seleção e virtualização.

## Impacto

Tokens, components, admin, Storybook e consumidores Next.js. Sem novas dependências, mudanças de dados ou redesenho da demo. Não inclui configuração por coluna; larguras explícitas e virtualização de altura fixa mantêm precedência.
