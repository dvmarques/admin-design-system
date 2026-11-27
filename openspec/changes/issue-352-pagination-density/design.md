## Contexto

A paginação atual combina AdsButton sm com mínimos de 40px, inclusive no CSS distribuído. A medição responsiva usa a largura real dos itens.

## Decisões

- Usar a prop density, como nas tabelas, em vez de size ou CSS ad hoc. O padrão comfortable preserva o layout anterior.
- Usar um modificador público no nav e CSS escopado fora da camada de componentes para vencer os utilitários existentes. Remover os mínimos de 40px das classes compactas; manter fonte sm, cores, foco e estados. A altura mínima usa o token de controle sm; largura numérica mínima de 24px (1.5rem com raiz padrão), largura de navegação mínima de 26px e largura numérica estável conforme os dígitos. Espaçamento menor e sem deslocamento por hover.
- Preservar folga para foco no scroll; recalcular a capacidade quando density muda. Não limitar largura de textos traduzidos ou conteúdo customizado.
- WCAG 2.2 AA 2.5.8: alvos de pelo menos 24 × 24 CSS px na configuração padrão; comfortable continua recomendado para toque. Não reduzir fonte nem alterar semântica, teclado, carregamento ou limites.
- AdsPagination permanece Client Component; SSR determinístico. Links de consumidores recebem as mesmas classes e não aninham interativos. CSS compilado pelo pipeline existente, sem Tailwind no consumidor.
- Sem novos tokens globais ou dependências; impacto pequeno no bundle. Rollback: omitir a prop.

## Riscos

Alterações de métricas afetam a capacidade responsiva e o foco. Testar troca de densidade, links, múltiplos dígitos, temas e CSS real. O salto direto mantém seu campo existente.

## Orçamento de distribuição

A primeira CI mediu 310122 bytes de JS/CSS publicados de components, contra limite de 309300 bytes. A prop e o CSS opt-in adicionam comportamento público; ajustar apenas esse limite para 310500 bytes (+1200, cerca de 0,39%), mantendo os demais limites até evidência de necessidade. O gate continua ativo.

A segunda CI mediu 92798 bytes gzip por arquivo contra 92700; o limite gzip de components passa a 93000 bytes (+300, cerca de 0,32%), sem alterar limites de outros pacotes.
