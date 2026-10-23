# Catálogo navegável do admin demo (#151)

## Why

A navegação plana e exemplos incompletos dificultam descobrir componentes públicos e validar seu uso real. Um catálogo rastreável permite inspecionar composição, variações e acessibilidade antes de integrar os pacotes em uma aplicação.

## What Changes

- Índice pesquisável, sidebar por categorias e rota estável por export público visual.
- Exemplos executáveis com estados pertinentes, snippets TSX da mesma implementação, cópia e inspeção de temas/larguras.
- Matriz de cobertura e verificações contra os exports públicos, mais testes de interação, acessibilidade e responsividade.
- Preservação das páginas de negócio e de todas as URLs existentes.

## Perfil e risco

**Critical**, por envolver navegação e acessibilidade em toda a aplicação de demonstração. A revisão final confere o diff contra os critérios de aceite e os testes em uma etapa separada da implementação. O merge aguarda revisão humana. Não há mudança de API pública, tokens nem CSS distribuído dos pacotes.

## Impact

Afeta `apps/admin-demo`, documentação, testes e exemplos complementares em `apps/docs`. Os pacotes `components`, `admin` e `tokens` são consumidos por seus exports e CSS públicos, sem alterar a biblioteca. A aplicação de referência fornece às consumidoras exemplos funcionais e copiáveis. Sem dependência nova de runtime.

## Fora do escopo

Implementar componentes planejados no épico #141, copiar código/telas/identidade do CoreUI ou alterar comportamento relacionado à issue #91.
