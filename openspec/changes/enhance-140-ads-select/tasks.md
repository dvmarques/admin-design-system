## 1. Contrato de placeholder opt-in

- [ ] 1.1 **Antes de Apply:** validar spike técnico das estratégias nativa (`value=""` por identidade/índice) e sentinela interna, em Chromium/Firefox/WebKit, React controlado/não controlado, reset, `required`, `checkValidity`, `FormData` e SSR/hidratação; revisar design se não houver solução conforme.
- [x] 1.2 Implementar somente a estratégia validada no spike; tipar e traduzir `null` internamente sem passá-lo a `<select>`, preservar controle/descontrole, `required`, `form`, `name`, `disabled`, reset, `onChange` nativo e não expor sentinela.
- [ ] 1.3 Confirmar constraint validation e `FormData` em navegadores suportados, incluindo opção vazia válida; revisar o design antes de avançar se a semântica não puder ser preservada.

## 2. Visual e acessibilidade

- [x] 2.1 Limitar texto longo, truncamento e indicador ao CSS escopado do `AdsSelect`; manter RTL/forced-colors e nenhum efeito em `multiple`/`size`.
- [x] 2.2 Testar `AdsField`, `aria-describedby`, label/erro/estado, foco, disabled, contraste, `sm/md/lg` e temas.
- [ ] 2.3 Cobrir 390px, zoom 200%, navegadores nativos suportados e CSS publicado sem Tailwind na aplicação.

## 3. Consumidores e documentação

- [x] 3.1 Demonstrar placeholder, `""` válido, value/defaultValue, required, states e texto longo no Admin Demo **na mesma PR** e em stories Storybook.
- [x] 3.2 Documentar contrato de ausência versus vazio, migração opt-in, limitações e compatibilidade em `docs/integration.md`; atualizar matriz do catálogo se aplicável.
- [x] 3.3 Registrar CHANGELOG [0.1.1] com change #140 e efeito observável. Validar regressões de todos os controles que compartilham `formControlClasses()`.

## 4. Gates

- [x] 4.1 Formatar arquivos alterados via `npx.cmd prettier --write` e aprovar `npm run format`.
- [ ] 4.2 Aprovar `npm run validate`, `openspec.cmd validate enhance-140-ads-select --strict` e `openspec.cmd validate --all --strict`; registrar testes unitários, acessibilidade, E2E e status real de skips.
- [ ] 4.3 Medir JS/CSS, revisar snapshots apenas após mudança intencional, verificar consumidores Next.js e revisão de compatibilidade de API.
