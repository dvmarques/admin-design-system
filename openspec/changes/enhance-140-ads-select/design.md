## Contexto

`AdsSelect` recebe atualmente `SelectHTMLAttributes<HTMLSelectElement>` e aplica `ads-select` + `formControlClasses()`. A seta nativa estilizada já possui espaço, RTL e fallback em alto contraste; preservá-los. `AdsField` associa label/descrição/erro via clonagem e `aria-describedby`.

## Contrato de API proposto para revisão

- `placeholder?: string`, sem efeito quando omitido; não cria placeholder automático em chamadas antigas.
- Para select simples com placeholder, `value={null}` / `defaultValue={null}` indicam **sem seleção**; `value=""` / `defaultValue=""` selecionam a opção legítima de valor vazio, sem ambiguidade. `undefined` mantém semântica de estado não controlado do HTML. Sem alterar a identidade nem o conteúdo de `children`.
- A opção visual de placeholder será interna, desabilitada e com sentinela distinta dos valores reais. A sentinela nunca deve aparecer no callback de mudança nem na submissão. Antes de fechar a implementação, medir e documentar explicitamente reset de formulário, atribuição externa e ausência inicial em navegador real.
- O `required` do HTML deve considerar **ausência** inválida, mas permitir uma opção legítima de valor `""` quando o consumidor assim a definir. O algoritmo não pode depender apenas da cor ou do valor bruto `select.value`. Uma validação controlada mínima (`setCustomValidity` e atualização nos ciclos relevantes, se necessária) poderá complementar a constraint validation nativa, sem impedir `reportValidity` e `FormData`. Uma opção de `""` não se confunde com a sentinela.
- O contrato com `onChange` permanece nativo para escolhas reais; propagação de `name`, `form`, `disabled` e atributos ARIA permanece. Confirmar casos de `multiple` / `size`: placeholder opt-in é exclusivo de select simples; não alterar sua renderização ou semântica.
- Colisões entre sentinela e valores de opções são inaceitáveis: resolver identidade interna estável por instância (SSR-safe) ou negar sentinela inadequada em tempo de desenvolvimento. Não converter valores válidos em ausência.

## Aparência e acessibilidade

- Texto comprido restringido à largura e truncado visualmente apenas na caixa do `AdsSelect`; acessibilidade nativa expõe o rótulo inteiro da opção selecionada. Não sobrescrever nome acessível informado por label/`AdsField`; não depender de `title` como único canal.
- Placeholder difere de seleção por texto explícito e estilo, com contraste adequado; estado inválido continua ligado a `AdsField`/`aria-invalid`.
- Aplicar CSS apenas a `select.ads-select:not([multiple]):not([size])`, preservando seta, padding e RTL. Não modificar `formControlClasses()`.
- Verificar browser nativo, tamanhos `sm/md/lg`, `disabled`, foco, sucesso e erro, zoom 200%, viewport 390px, forced-colors, temas e CSS publicado sem Tailwind no consumidor.

## Alternativas e trade-offs

- `<option value="">` como placeholder: rejeitado, pois conflita com a opção `""` válida e com `required`.
- Trocar por combobox customizado: rejeitado por comportamento nativo e compatibilidade.
- Apenas placeholder CSS/pseudo-elemento: rejeitado, pois não representa ausência de seleção nativa.
- Sentinela interna: exige testes rigorosos de constraint validation e serialização; a implementação deve demonstrar viabilidade sem alterar significado de `value` legado.

## Limites e rollback

Nenhuma dependência, tema ou token novo; estilos CSS compilados continuam escopados. Se a abordagem sentinela não preservar constraints nativas em todos os navegadores suportados, interromper Apply e revisar design/API antes de substituir o select nativo. Rollback pela remoção da API opt-in sem regressão em chamadas antigas.
