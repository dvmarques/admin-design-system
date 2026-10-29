## Contexto

`AdsSelect` recebe atualmente `SelectHTMLAttributes<HTMLSelectElement>` e aplica `ads-select` + `formControlClasses()`. A seta nativa estilizada já possui espaço, RTL e fallback em alto contraste; preservá-los. `AdsField` associa label/descrição/erro via clonagem e `aria-describedby`.

## Contrato de API proposto para revisão

- `placeholder?: string`, sem efeito quando omitido; não cria placeholder automático em chamadas antigas.
- Para select simples com placeholder, `value={null}` / `defaultValue={null}` indicam **sem seleção**; `value=""` / `defaultValue=""` selecionam a opção legítima de valor vazio. Redeclarar tipos `value`/`defaultValue` de modo compatível após omiti-los da interface nativa; traduzir `null` internamente, **nunca** passá-lo ao `<select>` React. `undefined` mantém estado não controlado e `children` conserva sua identidade.
- **Gate técnico obrigatório antes do Apply:** comparar (A) primeira opção nativa de placeholder `value=""` com seleção por identidade/`selectedIndex` para distinguir outra opção legítima `""` e (B) opção interna desabilitada com sentinela não vazia. A estratégia B **não é por si só um placeholder label option nativo** conforme HTML Standard; não presumir conformidade com `required` mesmo que se use `setCustomValidity`. Testar React controlado/não controlado, reset, hidratação, Chromium/Firefox/WebKit, `checkValidity()`, `reportValidity()`, `FormData` e callbacks antes de aprovar solução. Nenhuma sentinela pode ser exposta na submissão ou callback.
- O `required` deve considerar **ausência** inválida e outra opção legítima `""` válida. A definição HTML depende da identidade da *placeholder label option*, não somente do valor de `select.value`; `setCustomValidity` não substitui automaticamente essa semântica. Se necessário, demonstrar que validade, reset e submissão não divergem sequer transitoriamente após alterações externas.
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
