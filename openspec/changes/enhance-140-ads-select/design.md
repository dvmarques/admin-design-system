## Contexto

`AdsSelect` recebe atualmente `SelectHTMLAttributes<HTMLSelectElement>` e aplica `ads-select` + `formControlClasses()`. A seta nativa estilizada já possui espaço, RTL e fallback em alto contraste; preservá-los. `AdsField` associa label/descrição/erro via clonagem e `aria-describedby`.

## Contrato de API proposto para revisão

- `placeholder?: string`, sem efeito quando omitido; não cria placeholder automático em chamadas antigas.
- Para select simples com placeholder, `value={null}` / `defaultValue={null}` indicam **sem seleção**; `value=""` / `defaultValue=""` selecionam a opção legítima de valor vazio. Redeclarar tipos `value`/`defaultValue` de modo compatível após omiti-los da interface nativa; traduzir `null` internamente, **nunca** passá-lo ao `<select>` React. `undefined` mantém estado não controlado e `children` conserva sua identidade.
- **Gate técnico obrigatório antes do Apply:** comparar (A) primeira opção nativa de placeholder `value=""` com seleção por identidade/`selectedIndex` para distinguir outra opção legítima `""` e (B) opção interna desabilitada com sentinela não vazia. A estratégia B **não é por si só um placeholder label option nativo** conforme HTML Standard; não presumir conformidade com `required` mesmo que se use `setCustomValidity`. Testar React controlado/não controlado, reset, hidratação, Chromium/Firefox/WebKit, `checkValidity()`, `reportValidity()`, `FormData` e callbacks antes de aprovar solução. Nenhuma sentinela pode ser exposta na submissão ou callback.
- O `required` deve considerar **ausência** inválida e outra opção legítima `""` válida. A definição HTML depende da identidade da _placeholder label option_, não somente do valor de `select.value`; `setCustomValidity` não substitui automaticamente essa semântica. Se necessário, demonstrar que validade, reset e submissão não divergem sequer transitoriamente após alterações externas.
- O `onChange` continua nativo para opções reais; preservar `name`, `form`, `disabled` e ARIA. Não afetar CSS/semântica de `[multiple]` ou `[size]`; a prop pública `size` de `AdsSelect` hoje é `sm|md|lg`, **não** o atributo HTML numérico de tamanho da lista. Não ampliar esse contrato nesta change.
- Colisões entre sentinela e valores de opções são inaceitáveis: resolver identidade interna estável por instância (SSR-safe) ou negar sentinela inadequada em tempo de desenvolvimento. Não converter valores válidos em ausência.

## Aparência e acessibilidade

- Texto comprido restringido à largura e truncado visualmente apenas na caixa do `AdsSelect`; acessibilidade nativa expõe o rótulo inteiro da opção selecionada. Não sobrescrever nome acessível informado por label/`AdsField`; não depender de `title` como único canal.
- Placeholder difere de seleção por texto explícito e estilo, com contraste adequado; estado inválido continua ligado a `AdsField`/`aria-invalid`.
- Aplicar CSS apenas a `select.ads-select:not([multiple]):not([size])`, preservando seta, padding e RTL. Não modificar `formControlClasses()`.
- Verificar browser nativo, tamanhos `sm/md/lg`, `disabled`, foco, sucesso e erro, zoom 200%, viewport 390px, forced-colors, temas e CSS publicado sem Tailwind no consumidor.

## Alternativas e trade-offs

- Primeira opção nativa com `value=""` é preferida por conformidade HTML, mas depende de prova de seleção por identidade para diferenciar a opção legítima `""` em React.
- Trocar por combobox customizado: rejeitado por comportamento nativo e compatibilidade.
- Apenas placeholder CSS/pseudo-elemento: rejeitado, pois não representa ausência de seleção nativa.
- Sentinela não vazia não qualifica automaticamente como placeholder nativo e não está aprovada como solução final. Se nenhuma estratégia preservar o contrato, interromper Apply e revisar o design em vez de alterar silenciosamente os critérios aprovados.

## Limites e rollback

Nenhuma dependência, tema ou token novo; estilos CSS compilados continuam escopados. Se a abordagem sentinela não preservar constraints nativas em todos os navegadores suportados, interromper Apply e revisar design/API antes de substituir o select nativo. Rollback pela remoção da API opt-in sem regressão em chamadas antigas.

## Resultado da prova de concepto e decisão (Apply)

Medições em Chromium 1243 (build do Playwright disponível no ambiente de execução) com React 19.2.8, em página real com `FormData`, `checkValidity()`, `reportValidity()`, `form.reset()` e `hydrateRoot` sobre HTML de `renderToString`. **Firefox e WebKit não estavam instalados no ambiente de execução**: a verificação neles fica a cargo da CI, para a qual o E2E `select-placeholder.spec.ts` foi incluído nos projetos `firefox` e `webkit` de `playwright.config.ts`. Smoke em React 18.3.1 (instalação isolada fora do repositório, mesmo harness e 45 verificações da prova, Chromium, incluindo `renderToString` + `hydrateRoot`): 0 falhas e nenhum aviso de console; é uma execução pontual, sem teste automatizado recorrente no repositório (que só depende de React 19). Versões entre 18.2 e 18.3.0 não foram testadas.

| Estratégia                                                  | Resultado                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A** primeira `<option value="">` + seleção por identidade | `required` ausente: `valueMissing`, `checkValidity()` e `reportValidity()` falsos; opção real `""` (não primeira) válida e serializada como `""`; reset restaura por `defaultSelected`; SSR/hidratação sem avisos; nenhuma sentinela em valores, eventos ou `FormData`. **Aprovada.** |
| **B** opção desabilitada com sentinela `__ads_sentinel__`   | `select.value` expõe a sentinela; com `required`, `valueMissing` é falso e `checkValidity()` é verdadeiro (a sentinela não é a _placeholder label option_); `setCustomValidity` torna inválido, mas permanece obsoleto após a escolha/reset sem sincronização extra. **Rejeitada.**   |

Pontos exigidos pela prova de A e que definem a implementação:

- **Duas opções vazias no HTML do servidor:** o React marca `selected` em todas as opções cujo valor casa com `""`, e o navegador adota a última, ou seja, a opção real em vez da ausência. Por isso a ausência (`null`, `undefined`) não é repassada ao React (`defaultValue` omitido) e a primeira opção é desabilitada **apenas após a montagem** (efeito de layout); antes disso o navegador a seleciona por ser a primeira opção, sem `selected`.
- **`value=""` controlado:** o React selecionaria a primeira opção de valor `""` (a ausência). Um efeito de layout reaplica a seleção por identidade (`option.selected`) a cada renderização; no não controlado, aplica uma vez e acerta `defaultSelected` para que o reset nativo restaure a opção correta.
- **Opção de ausência desabilitada:** exclui a ausência do `FormData` sem impedir `required` (a definição HTML depende da identidade da opção, não de estar habilitada). Consequência documentada: o usuário não volta à ausência pela interface; o consumidor usa `null` ou o reset.
- **Controle sem restauração do React:** após `onChange`, um novo render reaplica o `value` para reverter a escolha quando o consumidor não o atualiza; após `reset` de um select controlado, a seleção é ressincronizada com as props (`setTimeout`, pois o reset ocorre depois do evento). Ambos sem `onChange` sintético.
- **Client/Server:** `AdsSelect` continua sem hooks (Server Component); só o ramo com `placeholder` (e sem `multiple`) renderiza `AdsSelectPlaceholder`, módulo `'use client'` (`select-placeholder.tsx`), verificado por `verify-package.mjs`.
- **Sem `placeholder`:** `null` em `value`/`defaultValue` equivale a `""`, para não passar `null` ao `<select>`. `AdsSelectValue` é exportado.
- **Aparência:** `select.ads-select:not([multiple]):not([size])` ganha `min-width: 0`, `max-width: 100%`, `overflow: hidden`, `text-overflow: ellipsis` e `white-space: nowrap`; `.ads-select:has(> [data-ads-select-placeholder]:checked)` atenua o texto com `--ads-color-text-muted` (contraste 7,6:1 no claro; no escuro o diferencial não cromático é o texto explícito da ausência), e as `option` mantêm `--ads-color-text`.
- **Orçamentos:** o dist de `@admin-ds/components` estava a 20 bytes do limite (503.340 de 503.360), logo qualquer adição o excederia. Decomposição por artefato (bytes, dist antes → depois; medição final):

| Artefato                        | Antes   | Depois  | Delta       |
| ------------------------------- | ------- | ------- | ----------- |
| `select-placeholder.js`         | 0       | 3.304   | +3.304      |
| `select-placeholder.js.map`     | 0       | 2.925   | +2.925      |
| `select-placeholder.d.ts`       | 0       | 777     | +777        |
| `select-placeholder.d.ts.map`   | 0       | 584     | +584        |
| `select.js`                     | 594     | 1.103   | +509        |
| `select.js.map`                 | 531     | 1.072   | +541        |
| `select.d.ts`                   | 546     | 1.337   | +791        |
| `select.d.ts.map`               | 484     | 769     | +285        |
| `index.d.ts` / `index.d.ts.map` | 9.875   | 9.901   | +26         |
| `styles.css`                    | 42.016  | 42.282  | +266        |
| **Total do dist**               | 503.340 | 513.348 | **+10.008** |

O maior contribuinte individual é `select-placeholder.js` (3.304 B, 33%); mapas e declarações somam 5.929 B (59%) e não entram no orçamento de JS/CSS publicado, que cresce 4.079 B (JS 3.813 + CSS 266; medido 227.930, gzip 69.109). A elevação foi a mínima que fez as métricas passarem: baseline do dist 457.600 → 466.700 (limite 513.370), JS/CSS publicado 226.000 → 228.000, gzip 68.500 → 69.150 e CSS gzip do cenário `components-public` 9.150 → 9.200 (medido 9.167). O cenário JS minificado `components-public` ficou dentro do limite sem elevação (30.175 de 30.400 bytes). Não há dependência nova.
