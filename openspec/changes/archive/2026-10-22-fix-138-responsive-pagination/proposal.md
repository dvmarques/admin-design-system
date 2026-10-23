# Paginação responsiva e controles opcionais (#138)

## Perfil de risco

**Critical**: altera API pública de AdsPagination, comportamento acessível, CSS distribuído e composição de múltiplos pacotes. Exige revisão independente e validação de consumidores Next.js, zoom, SSR e E2E.

## Problema

AdsPagination calcula números sem considerar a largura do contêiner; overflow horizontal recorta foco e hover. A SmartTable herda o problema.

## Objetivo

Adaptar os números à largura real e manter primeira, atual, última e navegação. Oferecer setas, salto direto, carregamento, labels, primeira/última, tamanho da página e resumo apenas por opt-in, preservando APIs e padrões atuais.

## Pacotes e contratos

- Biblioteca: packages/components (AdsPaginationProps, getAdsPaginationItems, CSS compilado).
- Composição: packages/admin (AdsSmartTableProps, rodapé controlado).
- Consumidores: apps/admin-demo, apps/docs (Storybook), integração Next.js e e2e.

## Fora do escopo

Paginação sem pageCount conhecido, busca de dados, alteração da issue #91 e mudança de identidade visual.

## Compatibilidade e rollback

Manter texto Anterior/Próxima, siblingCount, renderPage e renderPageLink. Novas props são opcionais. Reverter commits da change se os gates de acessibilidade, CSS ou consumidores falharem; não alterar exports existentes.
