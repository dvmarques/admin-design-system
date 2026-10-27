# Design: AdsLoadingText

## Decisions

1. Usar `AdsLoadingText` e classe `ads-loading-text`, seguindo prefixos públicos. `LoadingText` é o nome conceitual da issue.
2. Componente puramente presentacional e renderizável no servidor; nenhum hook, timer, estado global ou `use client`.
3. API mínima: `loading` (padrão false), `speed` (slow/normal/fast; normal 2.5s), `as` (span por padrão, com atributos HTML compatíveis) e `className`. `children` é obrigatório. A variante `as` deve seguir convenções de tipagem do pacote sem tipos inseguros.
4. CSS compilado do pacote aplica gradiente sobre glifos quando `data-loading=true`, deixando texto sem animar no estado inativo. Cor de fundo recortada nos glifos e gradiente mantém caracteres legíveis durante todo o ciclo; usar `--ads-color-text-primary`, `--ads-color-text-muted` (e `--ads-color-text` com movimento reduzido) para contrastes sem hexadecimal.
5. `prefers-reduced-motion: reduce` e `forced-colors: active` desligam shimmer e mostram texto sólido. A animação é decorativa: não atribuir `role=status`, `aria-live` nem `aria-busy` implicitamente; consumidores anunciam progresso por mecanismos separados quando necessário.
6. Seletores isolados com prefixo `ads-`, sem CSS global sobre elementos genéricos. Não adicionar tokens públicos para velocidades inicialmente.
7. Testar estados, props, SSR e preferências de movimento/cores; usar Storybook e demonstração no catálogo com integração CSS do pacote.

## Alternatives

- Copiar `TextoEmAtualizacao` literalmente: rejeitado por não seguir prefixos, tokens e estrutura da biblioteca.
- `use client` para animar: desnecessário; CSS é suficiente.
- Skeleton ou spinner: abstrações diferentes, não preservam texto existente.
- Anunciar `role=status` automaticamente: rejeitado por risco de repetição em polling.

## Dependencies and bundles

Somente React e utilitários já existentes. A inclusão é tree-shakeable (arquivo próprio `loading-text.js`, 588 B, sem hooks) e compatível com a saída CSS compilada.

Medição (`npm run build` limpo e `npm run inspect:packages`, `develop` contra a branch, JS+CSS de `@admin-ds/components`): 187.253 B para 189.161 B (+1.908 B: JS 640 B, CSS 1.268 B); gzip 57.418 B para 58.038 B; `dist` 428.169 B para 432.475 B. Os demais pacotes não mudaram. Como a folga original era de 247 B, o orçamento de bytes de `components` em `docs/browser-budget.json` sobe de 187.500 para 190.000 B (folga de 839 B); gzip e `dist` ficam dentro dos tetos atuais. O CSS do cenário `admin-public` ficou com folga pequena (91.516 de 91.600 B; gzip 13.639 de 13.800 B); esses limites não foram alterados.

O build do Next converte `:dir(rtl)` em `:lang(ar, he, fa, ...)` para navegadores antigos. Nesses consumidores a inversão do brilho em RTL depende do `lang` do documento; em navegadores modernos sem essa conversão, `:dir(rtl)` vale com `dir` herdado.

## Validation

Executar formatação, lint, typecheck, build, testes, Storybook e integração Next.js, E2E e `openspec.cmd validate --all --strict`, comparando comportamento claro/escuro e preferências de acessibilidade.
