# Validação

## Medição em navegador (Chromium via Playwright, CSS distribuído)

Teste: `e2e/button-loading-geometry.spec.ts`: sm/md/lg × texto curto, texto longo, ícone e texto, somente ícone, largura total e rótulo com quebra, em ltr/rtl e claro/escuro (24 cenários por tamanho e tema), mais a preservação de `position: absolute` vindo de `className`.

| Versão               | Botão `sm`, "Ok"   | Resultado                                                                    |
| -------------------- | ------------------ | ---------------------------------------------------------------------------- |
| Antes (develop)      | 43,125 → 67,125 px | Reproduzido: +24 px (indicador 16 px + gap 8 px); rótulo deslocado           |
| Depois (esta change) | 43,125 → 43,125 px | Largura, altura e rótulo iguais (tolerância 0,05 px); indicador centralizado |

A hipótese da issue #191 foi confirmada por medição. Com `relative` no botão (primeira versão), `className="absolute"` do consumidor era sobrescrito; a versão com grid não usa `position` e o spec cobre o caso. A auditoria geral permanece na #152.

## Orçamento de distribuição

`@admin-ds/components` (JS/CSS publicados): 187.253 B na develop → 187.501 B (+248 B: dois contêineres internos e as utilidades `grid`, `m-auto` e `[grid-area:1/1]`). O limite em `docs/browser-budget.json` sobe de 187.500 para 187.750 B, justificado pelo custo medido da correção geométrica, sem `position` que conflitaria com o `className` do consumidor. O gzip permanece dentro do limite.

## CI no SHA `1757bc0`

Localmente (Windows) passaram format, lint, build, typecheck, 1153 testes unitários e `openspec validate --all --strict` (58); no E2E, 9 snapshots visuais `win32` não versionados falham por não terem baseline. Na CI Linux, com a PR Ready for review: Qualidade rápida, Fluxos no navegador (Chromium, Firefox e WebKit), Artefatos de distribuição, Construir o site e Política de develop passaram (run 40547740388). Publicar e Validação de release foram ignorados por não se aplicarem. Nenhum snapshot foi atualizado.
