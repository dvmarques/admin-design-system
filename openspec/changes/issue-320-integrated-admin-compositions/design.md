# Design — integração de composições

## Decisões

1. **Reuso:** manter a consulta, formulário e dashboard em suas rotas atuais, enriquecendo estados que faltam. A nova rota índice `/exemplos/integracao` apenas apresenta matriz e links, sem reimplementar as mesmas páginas ou criar um segundo shell. O `(admin)/layout.tsx` continua fornecendo uma única região `main`, cabeçalho, sidebar, menus, controle de tema e footer opt-in.
2. **Client/Server:** índice e dashboard sem estado são Server Components; consulta e formulário são Client Components apenas onde há estado/ações. Dados são fictícios e definidos localmente; sem fetch, storage ou router privado nos pacotes.
3. **Acessibilidade:** manter H1 único do `AdsPageHeader`, H2 nas seções, foco programático apenas quando necessário, regiões rotuladas de tabela, estados anunciados por `role=status`/`role=alert` e controles com nomes próprios. Não usar anúncio de status duplicado.
4. **CSS:** composição por classes públicas `ads-layout-*`, estilos da Demo existentes e tokens `--ads-*`. Não adicionar CSS dos pacotes, nem exigir Tailwind no consumidor. O CSS compilado permanece carregado pelo layout raiz na ordem tokens → components → admin.
5. **Paginação e estado:** alterar apenas estado local da consulta (filtro reinicia página; loading/erro suprimem resultados; retry volta aos dados). Usar a API pública de `AdsPagination`. Ação de linha demonstra feedback, sem operações reais. Evitar timers ou simulação de rede.
6. **Storybook:** manter histórias públicas atuais de cabeçalhos e composições; acrescentar documentação navegável da integração e estados sem importar código interno da aplicação Next.js.

## Alternativas rejeitadas

- Criar outro `AdsAdminShell` para integração: duplicaria landmarks e navegação.
- Criar abstração nova de página/card/tabela: duplicaria exports existentes do épico.
- Criar backend falso com temporizadores e fetch: adicionaria comportamento incidental, sem melhorar as provas de contratos.
- Copiar as três rotas da Demo para um único componente Storybook: criaria duas fontes de verdade; preferir documentação da matriz e stories de cada padrão.

## Compatibilidade, bundle e rollback

O diff esperado é somente em consumidores, testes e documentação: nenhum orçamento de pacote deve ser elevado, nenhum import profundo ou dependência nova deve ser aceito. Medir com `npm run build` e `npm run inspect:packages` no mesmo toolchain Node 24/npm 11.19.1; comparar métricas por SHA e registrar possíveis variações de bundles de rotas Next/Storybook separadamente. Um teste automatizado deve sinalizar import profundo, falta de CSS público e regressões de SSR/hidratação. Em caso de regressão, reverter apenas a composição/testes, sem migrar contratos de pacotes.

## Evidência e revisão

Matriz: 320/390/768/1440px × light/dark, navegação por teclado, foco, axe WCAG, overflow, menu/sidebar e footer opcional; reflow de zoom simulado não substitui zoom real 200%, NVDA/VoiceOver e inspeção visual humana. Snapshots somente após diff visual revisado. A PR permanece sem merge e a change sem archive.
