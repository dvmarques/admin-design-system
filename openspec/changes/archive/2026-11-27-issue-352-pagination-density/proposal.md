## Motivação

A issue #352 pede paginação compacta para acompanhar tabelas administrativas densas, sem CSS do consumidor.

Perfil **Critical**: nova prop pública e CSS distribuído.

## Mudanças

- Expor `density?: 'comfortable' | 'compact'` em AdsPagination, preservando o padrão atual.
- Aplicar dimensões compactas aos botões e links, inclusive reticências e espaçamento, preservando a tipografia.
- Demonstrar a comparação no Storybook e validar o CSS distribuído no Admin Demo.

## Capabilities

### Modified Capabilities

- `pagination`: densidade visual opt-in.

## Impacto

Components, Storybook e Admin Demo. Sem novas dependências, mudanças de roteamento, dados ou propagação automática da densidade de AdsSmartTable. Não altera os tokens globais nem a paginação confortável.
