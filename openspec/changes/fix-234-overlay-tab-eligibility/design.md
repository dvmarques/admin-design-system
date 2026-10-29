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
- **`<details>`:** controles dentro de `<details>` fechado (`content-visibility: hidden`) não eram detectados por `display`/`visibility` (reproduzido no Chromium: o Tab escapava pelo `summary`), e `summary`, nativamente tabulável, não estava no seletor, o que impedia expandir por teclado quando era a última parada. `isFocusEligible` usa `checkVisibility?.({ visibilityProperty: true })` quando disponível (filtros anteriores como fallback) e o seletor inclui `summary`, aceito apenas se for o primeiro `summary` filho direto de um `details`. `contentVisibilityAuto` fica de fora de propósito: conteúdo `auto` fora da tela continua focável. Teste real em Chromium: Tab leva ao `summary`, Enter abre e os controles internos passam a ser tabuláveis, Enter fecha e eles saem do ciclo. Nota: o seletor `details>summary:first-of-type` foi descartado porque, no JSDOM (nwsapi), combinado com os demais passou a devolver a lista fora da ordem do documento.
- **Orçamentos (medição local; a CI com Node 24 coincidiu byte a byte com a local no SHA 24bca37; o mantenedor autorizou elevar ao valor medido mais folga mínima):**

  | Métrica                                           | Antes (develop) | Depois  | Limite anterior | Limite novo |
  | ------------------------------------------------- | --------------- | ------- | --------------- | ----------- |
  | `components-public` minificado                    | 30.175          | 30.490  | 30.400          | 30.500      |
  | `components-public` gzip                          | 11.142          | 11.321  | 11.300          | 11.330      |
  | JS/CSS publicado de `@admin-ds/components`        | 223.851         | 225.014 | 226.000         | 226.000     |
  | JS/CSS gzip por arquivo de `@admin-ds/components` | 67.666          | 68.136  | 68.500          | 68.500      |
  | Distribuição completa (`dist`, maps e `.d.ts`)    | 503.340         | 505.133 | 503.360         | 505.230     |

  O limite do `dist` deriva de `docs/bundle-baseline.json` (limite = baseline × 1,1): baseline de `@admin-ds/components` 457.600 → 459.300 B (folga de 97 B). Demais cenários e pacotes inalterados; sem dependência nova. Sequência medida no caminho: 30.283/11.245 (helper e tabindex), 30.359/11.276 (`checkVisibility`) e 30.490/11.321 (`summary`).

- **Popup em portal e modais aninhados:** inalterados; testes confirmam que o modal superior governa o Tab e que o foco num popover descendente não é interrompido.
- **Ambiente de medição:** medido com Node 22.22.0/npm 10.9.4 em Linux (a CI usa Node 24/npm 11.19.1); números de bytes não são comparáveis byte a byte entre toolchains.

### Orçamentos sobre a base combinada com `develop` 17d2f08 (#252)

Após `git merge origin/develop`, os limites de `develop` (baseline do `dist` 466.700; JS/CSS publicado 228.000 B e gzip 69.150 B; cenário `components-public` 30.400/11.300) foram remedidos com o build combinado, e só foram elevados ao valor medido mais folga mínima (autorizado pelo mantenedor):

| Métrica de `@admin-ds/components`            | Medido combinado | Limite de `develop` | Limite novo |
| -------------------------------------------- | ---------------- | ------------------- | ----------- |
| `dist` completo (baseline 466.700 → 468.400) | 515.141          | 513.370             | 515.240     |
| JS/CSS publicado                             | 229.093          | 228.000             | 229.100     |
| JS/CSS gzip por arquivo                      | 69.579           | 69.150              | 69.600      |
| `components-public` minificado               | 30.490           | 30.400              | 30.500      |
| `components-public` gzip                     | 11.321           | 11.300              | 11.330      |

Os CSS dos cenários e os demais pacotes seguem dentro dos limites de `develop`. Os valores da CI (Node 24) no SHA final são registrados na PR.
