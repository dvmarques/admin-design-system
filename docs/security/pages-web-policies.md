# Segurança web do Admin Demo e Storybook no GitHub Pages

> Issue [#269](https://github.com/dvmarques/admin-design-system/issues/269), inventário estático de código em 13/11/2026. **Não é pentest, varredura dinâmica nem auditoria completa dos headers efetivamente servidos no domínio público.**

## Escopo e o que foi observado

| Superfície | Evidência observada | Classificação e consequência |
| --- | --- | --- |
| HTML de layout | `apps/admin-demo/app/layout.tsx` insere `themeInitScript` em `dangerouslySetInnerHTML`; `apps/admin-demo/lib/theme.ts` forma a string internamente e lê cookie apenas no navegador | **Não é evidência de XSS**: script fixo, com preferência limitada a light/dark/system; ainda é inline e restringiria uma futura CSP `script-src` |
| Exportação de Next | `apps/admin-demo/next.config.ts` usa `output: 'export'`, `basePath` e assets estáticos no Pages | `next.config.ts` não instala headers HTTP no conteúdo estático publicado |
| Storybook | `apps/docs/.storybook/{main.ts,manager-head.html,preview-head.html,preview.tsx}`; build Vite publica manager e iframe de preview | HTML gerado pode conter bootstrap/chunks; exigir `script-src`/nonce/hashes antes de inventariar o output e validar é risco de quebra |
| Fonte e CSS | CSS de `@fontsource/inter` e dos pacotes `@dvmarques/admin-ds-*` importado pelos apps | Assets próprios, sem exigência comprovada de CDN externa; estilos inline de componentes exigem análise específica para `style-src` |
| Destaque de código | `packages/highlighted-code/src/highlighter.ts` importa `shiki/wasm` dinamicamente, temas e linguagens; `highlighted-code-snippet.tsx` renderiza tokens como texto React | Carga WASM e chunks devem ser testados antes de restringir `script-src` ou `worker-src`; entrada de código não vira HTML bruto |
| Links | `apps/admin-demo/app/storybook-link.tsx` é o link `target="_blank"` localizado na revisão; usa `rel="noopener"` com destino da mesma origem | Proteção já presente contra acesso `window.opener`; `noreferrer` não é necessário para esse destino |
| Auth simulado | `apps/admin-demo/app/auth/*`, `apps/admin-demo/lib/auth-demo.ts` e `docs/demo-auth-flow.md` | **Não é login real**. Sem backend, sessão, autorização, e-mail enviado ou armazenamento de credenciais; campos sem `name` evitam vazamento em submissão GET nativa sem JS |
| HTML dinâmico | A renderização dos exemplos usa escaping padrão do React; o `dangerouslySetInnerHTML` do layout é o uso direto encontrado no app | Não se conclui ausência de XSS por busca estática; novas entradas HTML não confiáveis exigem análise e sanitização |

Inventário feito nos caminhos citados, nas publicações de Next/Storybook e na busca por `dangerouslySetInnerHTML` e `target="_blank"` na revisão do repositório. Ocorreu também `dangerouslySetInnerHTML` em `packages/components/src/data-table.tsx` apenas como chave **excluída** do tipo `containerProps`, não como sink de HTML. Não foram inspecionados os headers publicados nem testados ataques reais.

## Controles que serão realmente emitidos no HTML

Todos os documentos Next e os dois HTMLs de entrada do Storybook recebem:

```html
<meta http-equiv="Content-Security-Policy" content="object-src 'none'; base-uri 'self'; form-action 'self'" />
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

- `object-src 'none'`: bloqueia elementos `object`/`embed` depois de processado o meta.
- `base-uri 'self'`: impede `base` externo que alteraria a resolução de URLs relativas.
- `form-action 'self'`: restringe a origem para onde os formulários submetem. O fluxo de auth continua simulado, sem backend ou credenciais reais.
- `referrer`: em navegação entre origens, envia no máximo a origem sob o comportamento `strict-origin-when-cross-origin`. Não é um header `Referrer-Policy` fornecido pelo servidor.

**CSP parcial, não anti-XSS:** propositalmente sem `default-src`, `script-src`, `style-src`, `worker-src`, `connect-src` ou `font-src`; portanto **não restringe** scripts, recursos, estilos, fetches ou WASM. O meta não protege recursos carregados antes dele. As diretivas presentes não são uma CSP estrita.

### Políticas que não se tornam efetivas no Pages

| Controle | Local tecnicamente correto | Estado desta mudança |
| --- | --- | --- |
| `frame-ancestors` e proteção contra clickjacking | Header CSP na resposta HTTP | **Não instalado**; `meta` ignora essa diretiva; Storybook iframe precisa admitir o manager da mesma origem |
| `X-Frame-Options` | Header HTTP | Não instalado; `DENY` global quebraria o iframe das stories |
| `Permissions-Policy` (camera, geolocation, microphone etc.) | Header HTTP (e eventuais atributos `allow` por iframe) | Não instalado; verificar necessidade e suporte ao migrar de host |
| `X-Content-Type-Options: nosniff` | Header HTTP | Não instalado |
| `Content-Security-Policy-Report-Only` e endpoints de relatório | Header HTTP e infraestrutura de recebimento | Não disponível em `meta`; nenhum modo de observação fictício |
| COOP, COEP, CORP, HSTS | Headers HTTP | Não instalado; avaliar isolamentos e compatibilidade do Storybook antes de adotar |
| `Referrer-Policy` | Header HTTP | Não instalado; substituto limitado via `<meta name="referrer">` aplicado |
| CSP estrita com scripts, estilos, fontes, workers | Preferencialmente header HTTP após inventário/Report-Only | **Não instalada**; nenhuma permissão `unsafe-inline`/`unsafe-eval` foi concedida para contornar incompatibilidades |

A configuração `headers()` do Next depende de servidor/adapter que sirva as respostas; um export estático para GitHub Pages não controla arbitrariamente os headers de resposta. Para impor clickjacking e políticas completas é preciso servir o site por um proxy/CDN/host que permita definir headers por rota. Uma política `frame-ancestors 'self'` na **página do iframe Storybook** é diferente de `'none'` no demo, e precisa ser verificada conforme o domínio real.

## Proposta para uma CSP de scripts futura

1. Produzir ambos os builds do mesmo commit; inventariar HTML real, scripts injetados pelo Next e Storybook, fontes, `import()`, CSS inline, fontes, fetch e WebAssembly Shiki.
2. Examinar alternativas ao script inline de tema: script externo síncrono adequado ao `basePath`, ou hash SHA-256 estável **do script exato**. Conferir flash de tema antes de hidratar. Nonce por resposta exige host capaz de gerar/propagar nonce; hash de um único script não cobre os demais scripts inline de Next/Storybook.
3. Habilitar **Report-Only real** num host de teste com headers configuráveis, sem `unsafe-inline`/`unsafe-eval`; exercitar manager e iframe Storybook, Next export, fontes, CSS, lazy imports, WebAssembly e condições de cache.
4. Validar em Chromium, Firefox e WebKit, incluindo console, hidratação, mudança de tema, links, login simulado e Shiki. Só então adotar CSP estrita por rota, com revisão dos relatórios e rollback.
5. Na migração, avaliar em separado `Referrer-Policy`, `Permissions-Policy` proporcional a recursos usados, `X-Content-Type-Options`, clickjacking e COOP/COEP (podem afetar o Storybook). Não confundir projeto demonstrativo com aplicação autenticada.

## Regressões automáticas

- `apps/admin-demo/tests/pages-security.test.ts`: consistência de fontes e templates; proteção existente de link.
- `apps/docs/tests/storybook-output.check.mjs`: metas presentes nos dois HTMLs finais do Storybook, após build.
- `e2e-pages/pages-site.spec.ts`: meta CSP/referrer em páginas de auth, hidratação/tema e carregamento do Shiki; mantém checks preexistentes de console.
- `e2e-pages/storybook-api.spec.ts`: abertura do iframe de Shiki com políticas e highlight.
- `e2e/smoke.spec.ts`: metas e ausência de erros nos três navegadores do E2E principal.
- `npm run build:pages` e `npm run test:e2e:pages` validam a publicação real sob `/admin-design-system/`; `npm run validate`, `npm run format` e `openspec validate --all --strict` são gates. A evidência final deve citar runs reais da PR Ready: uma suíte pulada não comprova nada.

Fontes normativas: [W3C CSP2](https://www.w3.org/TR/CSP2/#delivery-html-meta-element), [W3C CSP Level 3](https://www.w3.org/TR/CSP/) e [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/CSP). As referências descrevem limitações da plataforma, não comprovam os headers do Pages.
