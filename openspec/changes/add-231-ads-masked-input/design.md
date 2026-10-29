## Contexto e decisão aprovada

Aplicações consumidoras podem usar `IMaskMixin` sobre controles de terceiros; o DS possui `AdsInput`, `AdsField` e `formControlClasses`, sem `react-imask` no entrypoint principal. O requisito aprovado é **`onValueChange` com valores bruto e formatado, `onChange` separado e subpath opcional**.

## API pública proposta (sujeita a typecheck antes do Apply)

- Import opt-in: `import { AdsMaskedInput } from '@admin-ds/components/masked-input'`. Não reexportar esse módulo do `@admin-ds/components` raiz.
- Props tipadas com atributos aplicáveis de input e `AdsFormControlBase`; `mask` aceita configuração estática/dinâmica suportada por IMask e pode ser omitido. Definir `AdsMaskedInputProps` sem expor `props internas de bibliotecas visuais`.
- `value?: string` e `defaultValue?: string` representam o **texto formatado exibido**. O estado controlado só muda quando o consumidor atualizar `value`; normalização de entrada não deverá gerar loops de callbacks. O valor bruto não é assumido como valor controlado nem substitui implicitamente o valor visível.
- `onValueChange?: (values: { maskedValue: string; unmaskedValue: string; typedValue?: unknown; complete: boolean }) => void`. Emitir uma vez por alteração significativa aceita pela máscara, inclusive quando incompleta; **não** emitir por montagem, hidratação ou sincronização externa de `value`. O valor bruto é string inclusive em máscaras numéricas, preservando zeros à esquerda; `typedValue` depende do tipo de máscara e será documentado.
- `onChange` permanece apenas o handler nativo do input quando disparado pelo navegador/React. A documentação pública da IMask recomenda **não** utilizá-lo para acompanhar alterações mascaradas: `onValueChange` será produzido a partir de `onAccept` com a instância atual da máscara. Não sintetizar `ChangeEvent`, nem prometer emissão de `onChange` para cada alteração aceita. Bibliotecas de formulário devem integrar-se explicitamente via `onValueChange`.
- `ref` e `inputRef` expõem ambos o `HTMLInputElement` subjacente. O `ref` da própria `IMaskInput` aponta ao componente e não deve ser confundido com o nó HTML; compor refs e verificar ambas por teste. Definir comportamento com ambos presentes (ambos recebem mesmo elemento). `AdsField` fornece `id`, `aria-describedby`, estado e `aria-invalid`.
- Fixar internamente `unmask=false`: `value` representa o texto exibido. A partir de `onAccept`, ler `mask.value`, `mask.unmaskedValue`, `mask.typedValue` e completude; não expor `unmask` que altere silenciosamente a semântica de `value`.
- Sem `mask`, renderizar entrada nativa sem instância IMask, mantendo `onValueChange` coerente em edições reais.
- `name` envia o texto formatado exibido pelo input nativo; valor bruto só é enviado se a aplicação optar por um campo explícito próprio. `required` é semântica HTML do input, **não** validação de máscara completa. Oferecer `complete` no evento para validação externa.

## Distribuição e arquitetura

1. Isolar integração IMask num entrypoint próprio (ex.: `packages/components/src/masked-input.tsx`). Adaptar `react-imask` sem copiar imports bibliotecas visuais de terceiros.
2. Declarar `react-imask` como peer opcional (metadata `peerDependenciesMeta`), verificar versões/licenças e lockfile, sem import no root index nem no CSS básico salvo regras já existentes.
3. Construir `dist/masked-input.js` e `dist/masked-input.d.ts` com export `./masked-input` e verificar resolução TypeScript e Next.js. Inspecionar o grafo/bundle realmente publicado para demonstrar que import root não carrega `react-imask`; medir gzip JS/CSS.
4. Aplicar `formControlClasses` e tokens existentes. Styling responsivo nos temas claro/escuro, forced-colors e zoom; nenhum Tailwind necessário ao consumidor.
5. Componente client-side, sem tocar `window/document` na renderização do servidor. Testar hidratação em Next.js App Router e mount/unmount em StrictMode.

## Interação/segurança

Preservar caret e seleção ao inserir/excluir no meio, selecionar/substituir, colar, mudar `value` externamente e alternar `mask`. Tratar composição IME sem consumir caracteres intermediários erroneamente; aplicar máscara após composição conforme motor. Testar celular e `inputMode` adequado. Não mascarar como substituição de validação de conteúdo, não armazenar valores sensíveis na biblioteca.

## Alternativas e riscos

- Depender de IMask no entrypoint raiz: rejeitado por aumento de bundle base.
- Implementar engine própria: rejeitado por bugs de caret, colagem e locale.
- Pacote de workspace separado: não escolhido neste ciclo por custo adicional de publicação; reavaliar se subpath não isolar dependência.
- Expor diretamente API completa do `react-imask`: evitar acoplamento instável; suportar opções de máscara necessárias com tipos documentados e registrar limites de passthrough.

## Migração sem alterar o aplicação consumidora

Documentar map de `campo mascarado existente` para `AdsMaskedInput`, sem assumir equivalência de `onChange`/`onAccept`, `size`, `value`, `inputRef` ou CSS do bibliotecas visuais de terceiros. A substituição no consumidor terá sua própria revisão e testes; não entra nesta PR.
