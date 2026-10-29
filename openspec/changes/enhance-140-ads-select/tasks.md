## 1. Contrato de placeholder opt-in

- [ ] 1.1 Especificar e testar `placeholder`, `null` como ausência e `""` como opção válida, sem mudar `AdsSelect` legado e sem substituir `children`.
- [ ] 1.2 Implementar controle/descontrole, `required`, `form`, `name`, `disabled`, reset, `onChange` nativo, valor externo e sentinela privada não serializada; documentar edge cases e colisões.
- [ ] 1.3 Confirmar constraint validation e `FormData` em navegadores suportados, incluindo opção vazia válida; revisar o design antes de avançar se a semântica não puder ser preservada.

## 2. Visual e acessibilidade

- [ ] 2.1 Limitar texto longo, truncamento e indicador ao CSS escopado do `AdsSelect`; manter RTL/forced-colors e nenhum efeito em `multiple`/`size`.
- [ ] 2.2 Testar `AdsField`, `aria-describedby`, label/erro/estado, foco, disabled, contraste, `sm/md/lg` e temas.
- [ ] 2.3 Cobrir 390px, zoom 200%, navegadores nativos suportados e CSS publicado sem Tailwind na aplicação.

## 3. Consumidores e documentação

- [ ] 3.1 Demonstrar placeholder, `""` válido, value/defaultValue, required, states e texto longo no Admin Demo **na mesma PR** e em stories Storybook.
- [ ] 3.2 Documentar contrato de ausência versus vazio, migração opt-in, limitações e compatibilidade em `docs/integration.md`; atualizar matriz do catálogo se aplicável.
- [ ] 3.3 Registrar CHANGELOG [0.1.1] com change #140 e efeito observável. Validar regressões de todos os controles que compartilham `formControlClasses()`.

## 4. Gates

- [ ] 4.1 Formatar arquivos alterados via `npx.cmd prettier --write` e aprovar `npm run format`.
- [ ] 4.2 Aprovar `npm run validate`, `openspec.cmd validate enhance-140-ads-select --strict` e `openspec.cmd validate --all --strict`; registrar testes unitários, acessibilidade, E2E e status real de skips.
- [ ] 4.3 Medir JS/CSS, revisar snapshots apenas após mudança intencional, verificar consumidores Next.js e revisão de compatibilidade de API.
