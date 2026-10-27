# Validação

## Medição em navegador (Chromium via Playwright, CSS distribuído)

Teste: `e2e/button-loading-geometry.spec.ts` (sm/md/lg × rótulo curto "Ok" / longo, temas claro e escuro).

| Versão               | Botão `sm`, "Ok"  | Resultado                                                                                 |
| -------------------- | ----------------- | ----------------------------------------------------------------------------------------- |
| Antes (develop)      | 43,1 px → 67,1 px | Reproduzido: +24 px de largura ao carregar (indicador 16 px + gap 8 px), rótulo deslocado |
| Depois (esta change) | inalterado        | Largura, altura e posição do rótulo iguais; indicador centralizado                        |

A hipótese da issue #191 foi confirmada por medição, não só por inspeção estática. A auditoria geral permanece na #152.
