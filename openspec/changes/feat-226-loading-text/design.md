# Design: AdsLoadingText

## Decisions
1. Usar `AdsLoadingText` e classe `ads-loading-text`, seguindo prefixos públicos. `LoadingText` é o nome conceitual da issue.
2. Componente puramente presentacional e renderizável no servidor; nenhum hook, timer, estado global ou `use client`.
3. API mínima: `loading` (padrão false), `speed` (slow/normal/fast; normal 2.5s), `as` (span por padrão, com atributos HTML compatíveis) e `className`. `children` é obrigatório. A variante `as` deve seguir convenções de tipagem do pacote sem tipos inseguros.
4. CSS compilado do pacote aplica gradiente sobre glifos quando `data-loading=true`, deixando texto sem animar no estado inativo. Duas camadas de background mantêm caracteres legíveis durante todo o ciclo; usar `--ads-color-text` e `--ads-color-text-muted` para contrastes sem hexadecimal.
5. `prefers-reduced-motion: reduce` e `forced-colors: active` desligam shimmer e mostram texto sólido. A animação é decorativa: não atribuir `role=status`, `aria-live` nem `aria-busy` implicitamente; consumidores anunciam progresso por mecanismos separados quando necessário.
6. Seletores isolados com prefixo `ads-`, sem CSS global sobre elementos genéricos. Não adicionar tokens públicos para velocidades inicialmente.
7. Testar estados, props, SSR e preferências de movimento/cores; usar Storybook e demonstração no catálogo com integração CSS do pacote.

## Alternatives
- Copiar `TextoEmAtualizacao` literalmente: rejeitado por não seguir prefixos, tokens e estrutura da biblioteca.
- `use client` para animar: desnecessário; CSS é suficiente.
- Skeleton ou spinner: abstrações diferentes, não preservam texto existente.
- Anunciar `role=status` automaticamente: rejeitado por risco de repetição em polling.

## Dependencies and bundles
Somente React e utilitários já existentes. A inclusão deve ser tree-shakeable e compatível com a saída CSS compilada. Registrar medição de bundle após build.

## Validation
Executar formatação, lint, typecheck, build, testes, Storybook e integração Next.js, E2E e `openspec.cmd validate --all --strict`, comparando comportamento claro/escuro e preferências de acessibilidade.
