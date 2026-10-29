## Contexto e decisão aprovada

O `CampoComMascara` do Back Admin envolve `CFormInput` com `IMaskMixin`; o DS possui `AdsInput`, `AdsField` e `formControlClasses`, sem `react-imask` no pacote principal. O requisito aprovado é **`onValueChange` com valores bruto e formatado, `onChange` separado e subpath opcional**.

## API pública proposta (sujeita a typecheck antes do Apply)

- Import opt-in: `import { AdsMaskedInput } from '@admin-ds/components/masked-input'`. Não reexportar esse módulo do `@admin-ds/components` raiz.
- Props tipadas com atributos aplicáveis de input e `AdsFormControlBase`; `mask` aceita configuração estática/dinâmica suportada por IMask e pode ser omitido. Definir `AdsMaskedInputProps` sem expor `CFormInputProps`.
- `value?: string` e `defaultValue?: string` representam o **texto formatado exibido**. O estado controlado só muda quando o consumidor atualizar `value`; normalização de entrada não deverá gerar loops de callbacks. O valor bruto não é assumido como valor controlado nem substitui implicitamente o valor visível.
- `onValueChange?: (values: { maskedValue: string; unmaskedValue: string; typedValue?: unknown; complete: boolean }) => void`. Emitir uma vez por alteração significativa aceita pela máscara, inclusive quando incompleta; **não** emitir por montagem, hidratação ou sincronização externa de `value`. O valor bruto é string inclusive em máscaras numéricas, preservando zeros à esquerda; `typedValue` depende do tipo de máscara e será documentado.
- `onChange` permanece o handler de evento nativo do input quando disparado pelo navegador/React; não sintetizar um `ChangeEvent` fictício nem prometer equivalência de frequência com `onValueChange`/`onAccept` da IMask. Documentar integração com forms que esperam `onChange` e orientar consumo de `onValueChange` quando se quer valor bruto/formatado.
- `ref` como referência ao `HTMLInputElement` subjacente; `inputRef` como alias/adaptador explícito para compatibilidade do uso de `IMaskMixin`. Definir comportamento com ambos presentes (ambos recebem mesmo elemento). `AdsField` fornece `id`, `aria-describedby`, estado e `aria-invalid`.
- `name` envia o texto formatado exibido pelo input nativo; valor bruto só é enviado se a aplicação optar por um campo explícito próprio. `required` é semântica HTML do input, **não** validação de máscara completa. Oferecer `complete` no evento para validação externa.

## Distribuição e arquitetura

1. Isolar integração IMask num entrypoint próprio (ex.: `packages/components/src/masked-input.tsx`). Adaptar `react-imask` sem copiar imports CoreUI.
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

## Migração sem alterar o Back Admin

Documentar map de `CampoComMascara` para `AdsMaskedInput`, sem assumir equivalência de `onChange`/`onAccept`, `size`, `value`, `inputRef` ou CSS do CoreUI. A substituição no consumidor terá sua própria revisão e testes; não entra nesta PR.
