## Por quê
A inspeção atual soma todos os arquivos dist, sem distinguir distribuição de custo do navegador. A CI não publica cobertura, e a documentação de migração e limitações precisa de organização por componente.

## O que muda
- Preservar a verificação de distribuição por pacote, explicitando orçamentos e tolerâncias.
- Medir separadamente JS/CSS de navegador, minificado e gzip, em cenários públicos reproduzíveis.
- Publicar cobertura na CI.
- Documentar migração, changelog por componente e limitações agrupadas.

## Impacto
Pacotes: tokens, components e admin; scripts de inspeção, CI e docs. Sem alteração intencional de APIs públicas, identidade visual ou comportamento do demo.

## Fora do escopo
Novos componentes, mudanças de API e correções de bugs funcionais.
