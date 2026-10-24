## Decisões

1. Manter a métrica de distribuição atual (incluindo mapas e declarações) como proteção independente.
2. Separar bytes JS/CSS publicados, bytes minificados e gzip; cenários de consumo devem informar entradas, externalizações e tree shaking.
3. Guardar baselines versionados e exigir revisão explícita em alterações de orçamento.
4. Emitir diagnóstico por pacote/cenário/métrica, atual e limite; falhar com código não zero.
5. Publicar cobertura como artefato de CI, sem criar dependência de serviço externo.
6. Manter a documentação em pt-BR.

## Trade-offs

Soma de dist é simples e protege publicação, mas não representa download do navegador. Cenários empacotados são mais realistas, porém dependem das entradas, externalizações e configuração do bundler; ambos serão reportados, sem misturar as métricas.

## Compatibilidade

Sem mudanças nos limites Server/Client, Tailwind, tokens CSS ou exports públicos. Os cenários de consumo deverão usar apenas exports públicos e CSS compilado.
