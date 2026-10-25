## Context

AdsField usa gap de 8 px (6 px em telas estreitas) entre todos os filhos. Os parágrafos não zeram margens e a biblioteca não distribui Preflight; margens do navegador aumentam a distância observada.

## Goals / Non-Goals

Aproximar ajuda e erro de seu campo e preservar agrupamento entre campos e distância do rótulo. Não alterar props, validação, identidade ou ordem de leitura.

## Decisions

- Usar `--ads-spacing-1` (4 px por padrão) como gap do AdsField. Compensar apenas o rótulo com margem inferior de 4 px (2 px no mobile), preservando os atuais 8/6 px até o controle.
- Zerar margens em descrições e mensagens internas e nas primitivas públicas. A composição manual continua definindo seu próprio layout.
- Manter DOM, aria-describedby, aria-invalid e role alert. Texto longo continua quebrando naturalmente em telas estreitas e nos dois temas.
- Usar utilitários internos compilados no CSS público, sem exigir Tailwind no consumidor. Classes ads-* limitam o escopo; não adicionar reset global.
- AdsField continua compatível com Server Components, sem novos limites cliente, dependências ou efeito significativo de bundle.
- Reduzir apenas o gap sem zerar margens manteria a causa do problema; reset global afetaria conteúdo não relacionado.

## Risks / Trade-offs

A altura dos formulários diminui intencionalmente. Composições manuais recebem apenas a remoção de margens nativas. Testar geometria real com CSS compilado e sem reset; conferir temas, mobile, mensagens longas e personalização do token.

## Validation

Storybook e demo consomem exports públicos. Executar build, lint, tipos, qualidade, E2E e validação estrita OpenSpec. Snapshots Linux, se afetados, somente pelo workflow update-visual-baselines.yml e com revisão do diff. Não gerar baselines Windows.
