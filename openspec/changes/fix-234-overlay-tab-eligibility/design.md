## Contexto

`useOverlayFocus` atualmente aplica `isInitialFocusEligible` somente na escolha inicial. Já o listener global de `Tab` usa `querySelectorAll(focusableSelector)` sem filtrar `:disabled` herdado por `fieldset`, ancestrais `inert` e ocultação computada. O seletor CSS e a lista resultante não equivalem à ordem real de tabulação.

## Decisões

1. **Teste primeiro:** reproduzir com candidatos inválidos antes e depois de um elemento elegível, Tab e Shift+Tab, inclusive com todos os candidatos inelegíveis. No JSDOM, focar explicitamente o elemento da ponta e disparar o evento; confirmar no Playwright o fluxo real de tabulação (o JSDOM não simula a mudança nativa de foco por Tab).
2. **Uma fonte de elegibilidade:** extrair `getEligibleFocusableElements(container)` ou equivalente, reutilizando `isInitialFocusEligible`. Usar o resultado para foco inicial, primeiro/último do trap e fallback no próprio contêiner quando vazio. Reavaliar a lista a cada Tab: se um elemento já focado ficar inelegível enquanto o modal estiver aberto, a próxima navegação deve ser redirecionada a uma ponta elegível, sem escapar da camada. Não capturar Tab nos controles intermediários elegíveis.
3. **Limites do filtro:** preservar `:disabled` efetivo (inclui `fieldset`), `inert`, `hidden`, `display:none` e `visibility:hidden` em ancestrais relevantes. Testar `tabindex` negativo diferente de `-1`, radio groups e outros casos em que `focusableSelector` diverge da ordem real de Tab; **não** pressupor que todos os elementos com atributo `tabindex` sejam tabuláveis. Registrar e corrigir no mesmo helper somente desvios que afetem o ciclo e o foco inicial, documentando eventual alteração observável.
4. **Overlay lógico:** o modal superior continua dono do Tab; se o foco estiver em popup lógico descendente portalled, o trap não interfere. Preserve a política de Escape, foco ao fechar e interações de `pending`.
5. **Qualidade:** usar os seletores e helpers existentes, sem nova dependência ou contrato público. Qualquer adição à spec só será sincronizada após comportamento comprovado.

## Alternativas e riscos

- Repetir filtro ad hoc no listener: rejeitado por divergência futura.
- Substituir por biblioteca externa de focus trap: rejeitado por dependência e orçamento de bundle.
- Forçar preventDefault em todo Tab: rejeitado por impedir navegação nativa entre controles intermediários.
- Risco de `visibility` herdada, portais e modal aninhado: cobrir explicitamente com testes, não supor compatibilidade.

## Distribuição e integração

Não mudam exports, estilos, tokens, React/Next.js ou contratos CSS. Documentar apenas comportamento observável e regressões relevantes, sem redesenho. A integração no Admin Demo e no Storybook pode reutilizar exemplos existentes, com cobertura acrescentada quando necessária.

## Decisões tomadas no Apply

- **Reprodução:** testes `overlay-tab-eligibility.test.tsx` (JSDOM), `confirm-dialog-tab.test.tsx` (composição) e `e2e/overlay-tab-eligibility.spec.ts` (Chromium). No runtime original o E2E falhou exatamente no Tab a partir do último controle elegível (Dialog e Drawer) e no Shift+Tab a partir do primeiro (ConfirmDialog); depois da correção os três passam.
- **Helper único:** `getEligibleFocusableElements(container)` em `overlay-utils.tsx`, sobre `isFocusEligible` (antes `isInitialFocusEligible`), alimenta foco inicial e ciclo de Tab. `isFocusEligible` passa a rejeitar também `tabindex` explícito negativo, que o navegador não inclui na ordem de Tab. Efeito observável no foco inicial: um botão com `tabindex="-1"` deixa de ser o alvo inicial.
- **Elemento ativo fora da lista:** o ciclo dá a volta quando o ativo está fora do contêiner, é a ponta elegível da direção, ou está dentro do modal mas fora da lista (o próprio painel, ou um controle que ficou inelegível) **e** não há destino elegível adiante na ordem do documento (`compareDocumentPosition`). Com destino adiante, o Tab nativo segue. Isso também fecha o Shift+Tab a partir do painel focado, que antes escapava.
- **Grupos de rádio e `iframe` (limitação registrada, não corrigida):** o navegador trata um grupo de rádio como uma parada única, ao contrário do seletor. Normalizar o grupo custou +226 B minificados e +95 B gzip no cenário `components-public` e excederia seu orçamento; como não faz parte dos critérios da #234, ficou fora e consta em `docs/limitations.md`. Um `iframe` na ponta transfere o foco para o documento interno e não é alcançável pelo ciclo.
- **Orçamento:** o cenário `components-public` cresce 108 B minificados (30.175 → 30.283, limite 30.400) e 103 B gzip (11.142 → 11.245, limite 11.300), sem alterar seus limites. O JS/CSS publicado de `@admin-ds/components` vai de 223.851 para 224.421 B (limite 226.000; gzip 67.666 → 67.935, limite 68.500). A distribuição completa (que inclui source maps e `.d.ts`) passa de 503.340 B, a 20 B do limite, para 504.181 B, o que exigiu elevar o baseline de `@admin-ds/components` em `docs/bundle-baseline.json` de 457.600 para 458.400 B (limite 504.240 B), pelo custo medido e sem dependência nova.
- **Popup em portal e modais aninhados:** inalterados; testes confirmam que o modal superior governa o Tab e que o foco num popover descendente não é interrompido.
- **Ambiente de medição:** medido com Node 22.22.0/npm 10.9.4 em Linux (a CI usa Node 24/npm 11.19.1); números de bytes não são comparáveis byte a byte entre toolchains.
