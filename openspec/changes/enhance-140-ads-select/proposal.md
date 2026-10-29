## Why

A issue #140 permanece aberta após a seta/RTL/forced-colors da #142 (PRs #238 e #245). O `AdsSelect` nativo ainda precisa de tratamento verificável de textos longos, placeholder opcional, estados com `AdsField` e responsividade/zoom. O uso atual com `children` e opções de valor vazio MUST continuar compatível.

## What Changes

- Adicionar API **opt-in** `placeholder?: string` para ausência de escolha, com semântica distinta de uma opção de negócio de valor `""`.
- Definir explicitamente `value={null}` / `defaultValue={null}` como ausência de seleção quando `placeholder` é fornecido; `value=""` / `defaultValue=""` continua sendo seleção legítima da opção de valor vazio, quando presente.
- Tratar `required`, `disabled`, reset, `onChange` e submissão nativa sem serializar valor sintético de placeholder. Preservar selects existentes sem placeholder, inclusive `multiple` e `size`.
- Conter/truncar texto longo sem sobrepor seta nem causar scroll horizontal; preservar valor completo na API de acessibilidade; conferir `AdsField`, estados e tamanhos.
- Acrescentar demonstrações, stories, regressões cross-control e E2E (390px/zoom 200%/RTL/forced-colors).

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `form-controls`: placeholder opcional e adequação visual do select nativo.

## Impact

Perfil **Critical**: nova prop pública, comportamento de formulário, CSS distribuído e acessibilidade. `@admin-ds/components` (`select.tsx`, seletor CSS `ads-select` em `styles.css`), consumo via `AdsField`, `apps/admin-demo`, `apps/docs` e testes. Sem mudar `formControlClasses()` global, sem nova dependência ou migração obrigatória.

Fora do escopo: reimplementar seta entregue, multiselect customizado, substituir `<select>` nativo, alterar #91 ou #138. Decisão de produto aprovada: placeholder opt-in com distinção explícita entre ausência e `""` válido.
