## Why

A issue #268 identifica referências mutáveis de GitHub Actions, imagens Playwright por tag e execução de dependências/testes no mesmo job com permissão de escrita para snapshots. O objetivo é reduzir riscos de supply chain e execução privilegiada sem modificar o produto nem enfraquecer os gates.

## What Changes

- Fixar todas as actions de terceiros e oficiais por SHA de commit completo, com comentários de versão e política de atualização controlada pelo Dependabot.
- Fixar a imagem Playwright 1.64.1 Noble pelo digest oficial do MCR nos três workflows e validar consistência entre referência de imagem, manifesto/lockfile e pacote instalado.
- Tornar o token de checkout efêmero/não persistente por padrão, manter permissões de leitura para validações e isolar o job de push de baselines.
- Restringir o workflow manual de baselines à branch de feature do mesmo repositório, com geração sem escrita e aplicação de PNGs revisáveis em job isolado.
- Proteger via testes estáticos os contratos de SHA, imagem, permissões e sequência dos jobs; documentar matriz antes/depois, risco residual, revisão e rollback.

## Out of Scope

- Aprovações obrigatórias por terceiros/rulesets, publicação npm/Trusted Publishing/OIDC (#195), upgrades gerais de dependências (#265), mudanças funcionais de React/CSS/tokens, publicação/merge e arquivamento desta change.
- Fixar pacotes executados por npm fora dos mecanismos existentes do lockfile sem avaliação; OpenSpec permanece na versão exata 1.15.0 e configurações MCP continuam versionadas sem alterações desnecessárias.

## Impact

- Workflows CI, Pages, Release, Security Gate, métricas e baselines; scripts de teste/validação e documentação, sem mudança nas APIs de bibliotecas ou demo.
- Perfil **Critical**: executa código em CI e toca permissões de escrita, release e cadeia de fornecimento. Garantias dependem também das permissões efetivas do GitHub e de futuras atualizações controladas.
- Referências: issue #268; dependências #265 e #267. Base: develop, Node 24/npm 11.19.1, Playwright 1.64.1.
