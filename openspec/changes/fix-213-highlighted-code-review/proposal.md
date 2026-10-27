# Proposal

## Why

A revisão integral da #213 (PR #215, já mergeada em `develop`) encontrou defeitos no `AdsHighlightedCodeSnippet`: o tema `auto` ignora o `data-theme` de um ancestral, o primeiro paint é sempre claro e a página escura tokeniza duas vezes; linhas vazias colapsam depois do destaque; uma falha do motor/WASM fica permanente; o número de linha tem contraste ruim quando o tema do snippet difere do da página; a ação de copiar tem acessibilidade incompleta; código extenso trava a interface; há imports de `@shikijs/*` sem dependência declarada; e a cobertura de testes mockava quase toda a tokenização.

## What Changes

Perfil: **Standard** (correção de comportamento público do pacote opcional, testes e documentação).

- `theme="auto"` resolve pelo `[data-theme]` válido (`light`/`dark`) mais próximo, depois `documentElement`, depois `prefers-color-scheme`; valores inválidos são ignorados (na raiz valem `light`, como nos tokens); observa mudanças com `MutationObserver` e resolve antes da pintura no cliente. Antes disso (SSR/hidratação) o snippet não tokeniza e usa, por CSS, o fundo e as cores do tema da página; o destaque ocorre uma única vez, no tema correto.
- Linhas vazias mantêm a altura de uma linha; CRLF/CR são normalizados e uma única quebra final não cria linha extra (plain e destacado iguais).
- Falhas de motor, gramática ou tema não ficam em cache; carregamentos simultâneos são deduplicados.
- Cor do número de linha definida por tema do snippet (contraste ≥ 4,5:1).
- Feedback de cópia numa região de status persistente, limpa por tempo e ao trocar o código, e reanunciada em cópias seguidas; bloco rolável com nome acessível.
- Código acima de 1000 linhas ou 100 000 caracteres permanece em plain.
- `@shikijs/langs` e `@shikijs/themes` declarados (versão exata 4.5.0, a mesma já resolvida) no pacote opcional; carregador de linguagens tipado sem expor tipos internos; `name` da gramática deve ser igual ao `id`.
- Testes reais de tokenização das 12 linguagens, falha com nova tentativa, concorrência, SSR/hidratação, tema por ancestral (inclusive valor inválido e evento `change` do sistema), componente com o motor real e isolamento de bundle também para `admin` e `tokens`.

Fora do escopo: peso do WASM Oniguruma / motor de regex JavaScript (decisão de produto), `CodeEditor`, novo `CodeSnippet` plain, archive desta change.

## Capabilities

### Modified Capabilities

- `highlighted-code`: tema automático por ancestral sem flash claro; recuperação de falhas; linhas; limite de código extenso; acessibilidade da cópia.

## Impact

- `packages/highlighted-code` (código, CSS, testes, `package.json` e lockfile), `docs/highlighted-code-snippet.md`, `e2e/highlighted-code-demo.spec.ts`, `CHANGELOG.md`.
- `@admin-ds/components`, `@admin-ds/admin` e `@admin-ds/tokens` sem alteração de código nem de bundle.
