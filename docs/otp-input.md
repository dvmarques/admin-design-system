# AdsOTPInput — entrada de código de uso único

`AdsOTPInput` é um componente client-side para digitar códigos numéricos de uso único sem exigir backend. Usa **um** `input` nativo acessível e caixas visuais: a pessoa pode colar o código inteiro, usar Backspace/Delete/setas, selecionar trechos e aproveitar sugestões de SMS no navegador (`autoComplete="one-time-code"`).

```tsx
'use client';

import { useState } from 'react';
import { AdsField, AdsOTPInput } from '@dvmarques/admin-ds-components';

export function Exemplo() {
	const [codigo, setCodigo] = useState('');
	return (
		<AdsField label="Código de verificação" description="Digite os 6 dígitos recebidos">
			<AdsOTPInput
				length={6}
				name="codigo"
				required
				value={codigo}
				onChange={setCodigo}
				onComplete={(valor) =>
					console.info('Código completo recebido pela aplicação', valor.length)
				}
			/>
		</AdsField>
	);
}
```

Importe `@dvmarques/admin-ds-tokens/styles.css` e `@dvmarques/admin-ds-components/styles.css` uma vez no layout da aplicação. Não é necessário configurar Tailwind no consumidor.

## Contrato

- `length`: inteiro positivo, 6 por padrão; `value`/`defaultValue` representam texto de dígitos e preservam zeros à esquerda.
- `onChange(codigo)`: chamado somente quando uma edição muda o código; `onComplete(codigo)`: quando uma edição completa o comprimento, sem disparo em mount ou atualização externa.
- `size`: `sm`/`md`/`lg`; `validationState`: `default`/`success`/`error`; `disabled`, `readOnly`, `required`, `name`, `ref` e atributos ARIA nativos.
- `AdsField` vincula rótulo, descrição e erro por `id` e `aria-describedby`. Não exija tabulação em cada caixa visual: elas não são controles separados.
- Este componente **não** gera, envia, valida ou armazena códigos; a aplicação é responsável por autenticação, expiração, antifraude, throttling e privacidade. O exemplo ilustra apenas o tamanho do valor, não registre códigos reais em logs.

Exemplos interativos: [Admin Demo](/catalogo/otp-input) e Storybook (`Forms/OTP input`).
