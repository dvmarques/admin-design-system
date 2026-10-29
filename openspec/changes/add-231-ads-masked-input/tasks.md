## 1. API e distribuição opt-in

- [ ] 1.1 Estabelecer tipos públicos de `AdsMaskedInput`: `mask`, `value`/`defaultValue` formatados, `onValueChange` com masked/unmasked/typed/complete, `onChange` DOM separado, `ref` e `inputRef`.
- [ ] 1.2 Implementar adaptador IMask opcional isolado no subpath `./masked-input`, sem export no root; declarar peer dependency e versões compatíveis, rever licenças e lockfile.
- [ ] 1.3 Garantir JS/d.ts publicados por build e exports; teste de instalação/consumo sem `react-imask` no root, e com `react-imask` no subpath. Medir tamanho e verificar ausência de import indesejado no bundle principal.

## 2. Interação e acessibilidade

- [ ] 2.1 Implementar máscaras estática/dinâmica e modo sem máscara; colagem, remoção, inserção intermediária, caret, seleção, valor externo e alteração de máscara.
- [ ] 2.2 Testar controlado/não controlado, emissão única de `onValueChange`, comportamento real de `onChange` nativo, `name`, `required`, `disabled`, `readOnly`, `inputMode`, `ref`/`inputRef`.
- [ ] 2.3 Testar IME/composição, foco/teclado, leitor de tela/axe, `AdsField` e mensagens ARIA; SSR/hidratação, StrictMode e desmontagem.
- [ ] 2.4 Cobrir mobile 390px, zoom 200%, CSS sem Tailwind, forced-colors e temas claro/escuro, incluindo máscara numérica com zeros à esquerda.

## 3. Demo e documentação na mesma PR

- [ ] 3.1 Publicar exemplo funcional no Admin Demo com dados fictícios (máscara fixa, dinâmica, sem máscara, controlado, não controlado, validação, colagem e envio).
- [ ] 3.2 Criar stories Storybook e atualizar catálogo/matriz de cobertura.
- [ ] 3.3 Documentar guia `CampoComMascara` → `AdsMaskedInput`, diferença de eventos, valor bruto/formato enviado, validação externa e dependência opt-in; registrar CHANGELOG [0.1.1].

## 4. Gates

- [ ] 4.1 Formatar os arquivos via `npx.cmd prettier --write` e aprovar `npm run format`.
- [ ] 4.2 Executar e aprovar `npm run validate`, `openspec.cmd validate add-231-ads-masked-input --strict` e `openspec.cmd validate --all --strict`; registrar logs, skips e evidências de testes/E2E.
- [ ] 4.3 Revisar tipos, exports, bundle sem IMask no root, compatibilidade com consumidores e snapshots intencionais antes de Ready for review.
