# Proposal

## Why

A issue #193 identificou que as stories possuem `autodocs`, porém o Storybook de `apps/docs` não carrega o addon de documentação. O teste atual apenas compara `true` com `true`; não comprova referência de API publicada. A entrega #151 já mantém matriz de exports e exemplos, que deve ser reutilizada.

## What Changes

- Configurar documentação navegável e geração de referência de API compatível com Storybook 10.5.x, sem dependências de runtime nos pacotes.
- Documentar, por export público de UI atual, propósito, propriedades/tipos, obrigatoriedade, padrões, variantes, estados, acessibilidade e exemplos reais. Usar inferência TypeScript quando fiel e documentação explícita quando não for suficiente (partes compostas, tipos genéricos e defaults calculados).
- Confrontar os documentos publicados com a matriz mantida em `docs/admin-demo-catalog.md`; registrar e justificar exclusões sem ocultar novos exports.
- Substituir a verificação vazia por testes de saída gerada e acrescentar verificação de navegação, temas e publicação no subcaminho `/admin-design-system/storybook/`.
- Preservar stories, links da navegação do demo, identidade e composição existentes.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `component-documentation`: referência de API gerada, complementada e validada na publicação.

## Impact

Perfil **Standard**: muda o comportamento de documentação do catálogo, sem mudar API pública, CSS distribuído, runtime ou componentes de `@admin-ds/components`, `@admin-ds/admin` e seus consumidores. Aplicação afetada: `apps/docs`; verificação de integração em `apps/admin-demo` e site Pages. Dependências novas, se necessárias, devem ser apenas `devDependencies`. Valor: o consumidor consulta contratos de API reais e exemplos sem recorrer ao código interno.

Fora do escopo: reconstruir o catálogo do demo (#151), criar componentes previstos em #141, escrever texto de adoção/migração e links de consumo da #198, corrigir novamente a publicação Pages (#189), alterar APIs ou redesenhar a UI.

## Dependências

A reconciliação normativa #196 foi concluída. A base é `develop` atual; novos exports integrados antes do fechamento da PR devem entrar na cobertura.
