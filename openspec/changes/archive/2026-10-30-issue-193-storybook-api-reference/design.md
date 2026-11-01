# Design

## Context

A configuração existente usa `@storybook/react-vite` 10.5.x, `addons: []`, stories `autodocs` e exemplos funcionais. Muitas stories demonstram várias APIs sem `meta.component`; logo, tags isoladas não produzem referência de props/tipos. A matriz canônica de `docs/admin-demo-catalog.md` mantém a lista de exports públicos de UI, incluindo subcomponentes e o entrypoint opcional de máscara.

## Goals / Non-Goals

Gerar documentação consultável e verificável para cada export de UI implementado, mantendo os exemplos e sua navegação. Não alterar bibliotecas de runtime, contratos de componentes nem inventar defaults extraídos de exemplos que não sejam valores padrão reais.

## Decisions

1. Usar `@storybook/addon-docs` na mesma versão do Storybook para Autodocs e páginas MDX quando necessário; dependências exclusivamente de desenvolvimento e lockfile coerente por `npm install`. Preferir docgen TypeScript para props exportadas, verificando custo de build e a resolução de tipos nos workspaces.
2. Garantir uma entrada de referência de API identificável por export de UI. Stories com `meta.component` podem ser reaproveitadas; para famílias com múltiplos exports, criar referências individualizadas sem duplicar nem substituir histórias existentes. Composição aninhada deve documentar suas partes e o contexto obrigatório. APIs genéricas, especialmente `AdsSmartTable<T>`, devem mostrar os parâmetros genéricos e limites de inferência.
3. Complementar a inferência com `argTypes`, descrições e tabelas explícitas, com origem apontada para declaração de tipos e implementação. Valores padrão devem ser verificados no código, não deduzidos de `args` de uma story. Explicar acessibilidade, teclado, estados e variantes com exemplos existentes.
4. Usar a matriz da #151 como inventário verificável, com exceções justificadas para types, funções auxiliares e hooks sem UI. O teste deve detectar qualquer novo export visual sem referência, evitando allowlists silenciosas e duplicações de páginas.
5. Testar artefatos **gerados**, e não `tags` ou expressões do código: `index.json` precisa expor páginas `type: docs` correspondentes aos exports e exemplos `type: story`. Testes no navegador devem abrir a documentação efetiva, verificar tabela/descrição de API, exemplos, troca de tema e URLs estáticas sob `/admin-design-system/storybook/`. Documentar dependência de build no teste e evitar um build duplicado por caso.
6. Não alterar o mecanismo de deploy Pages: continuar usando `scripts/build-pages-site.mjs` e validar a montagem em `site/storybook`; preservar o acesso pelo demo (#189).

## Trade-offs and Risks

- Docgen automático pode omitir props herdadas, assinaturas genéricas e defaults dinâmicos. Complementar explicitamente, com verificações focalizadas; não aceitar tabelas vazias como documentação concluída.
- Mais referências podem elevar custo do build e tamanho do Storybook: medir, sem impor orçamento arbitrário ao runtime dos pacotes.
- Testes `index.json` não comprovam renderização dinâmica da tabela de props. Complementar com Playwright real, não substituir a execução de browser por parsing de arquivos.
- URLs do Pages possuem base path; conferir assets, links internos, refresh e tema em execução estática.
- Sem checkout/instalação local, este planejamento não comprova build, `npm run validate` nem OpenSpec estrito; gates permanecem pendentes até execução verificável.

## Rollback

Reverter somente a configuração/documentação do `apps/docs` e os testes associados, preservando o catálogo do demo e contratos das bibliotecas.
