# Baseline inicial de distribuição

Os pacotes ainda estão em fase de fundação. O baseline será registrado a
cada build com os tamanhos de `dist/`, antes de o catálogo de componentes
começar a crescer.

Dependências de runtime devem ser justificadas na change que as introduzir.
React e React DOM são peer dependencies dos pacotes de renderização e não
devem ser incluídos nos artefatos distribuídos.
