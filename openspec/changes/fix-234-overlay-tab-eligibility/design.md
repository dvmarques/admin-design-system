## Contexto

`useOverlayFocus` atualmente aplica `isInitialFocusEligible` somente na escolha inicial. Já o listener global de `Tab` usa `querySelectorAll(focusableSelector)` sem filtrar `:disabled` herdado por `fieldset`, ancestrais `inert` e ocultação computada. O seletor CSS e a lista resultante não equivalem à ordem real de tabulação.

## Decisões

1. **Teste primeiro:** reproduzir com candidatos inválidos antes e depois de um elemento elegível, Tab e Shift+Tab, inclusive com todos os candidatos inelegíveis. No JSDOM, focar explicitamente o elemento da ponta e disparar o evento; confirmar no Playwright o fluxo real de tabulação (o JSDOM não simula a mudança nativa de foco por Tab).
2. **Uma fonte de elegibilidade:** extrair `getEligibleFocusableElements(container)` ou equivalente, reutilizando `isInitialFocusEligible`. Usar o resultado para foco inicial, primeiro/último do trap e fallback no próprio contêiner quando vazio.
3. **Limites do filtro:** preservar `:disabled` efetivo (inclui `fieldset`), `inert`, `hidden`, `display:none` e `visibility:hidden` em ancestrais relevantes. Avaliar também `tabindex="-1"`, `tabindex` negativo explícito e radio groups sem ampliar escopo desnecessariamente; documentar qualquer diferença entre focável e tabulável.
4. **Overlay lógico:** o modal superior continua dono do Tab; se o foco estiver em popup lógico descendente portalled, o trap não interfere. Preserve a política de Escape, foco ao fechar e interações de `pending`.
5. **Qualidade:** usar os seletores e helpers existentes, sem nova dependência ou contrato público. Qualquer adição à spec só será sincronizada após comportamento comprovado.

## Alternativas e riscos

- Repetir filtro ad hoc no listener: rejeitado por divergência futura.
- Substituir por biblioteca externa de focus trap: rejeitado por dependência e orçamento de bundle.
- Forçar preventDefault em todo Tab: rejeitado por impedir navegação nativa entre controles intermediários.
- Risco de `visibility` herdada, portais e modal aninhado: cobrir explicitamente com testes, não supor compatibilidade.

## Distribuição e integração

Não mudam exports, estilos, tokens, React/Next.js ou contratos CSS. Documentar apenas comportamento observável e regressões relevantes, sem redesenho. A integração no Admin Demo e no Storybook pode reutilizar exemplos existentes, com cobertura acrescentada quando necessária.
