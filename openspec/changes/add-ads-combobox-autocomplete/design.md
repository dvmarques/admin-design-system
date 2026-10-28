# Design — AdsCombobox / AdsAutocomplete

## Decisão e alternativas
AdsCombobox fornece a primitiva ARIA de seleção única com lista de sugestões, independentemente da fonte de dados. AdsAutocomplete envolve a primitiva e filtra opções locais ou chama loadOptions(query, signal) com debounce. Alternativa de biblioteca externa rejeitada no MVP por peso, licenciamento e API adicional; reusar overlay-utils, AdsField e formControlClasses.

## Contratos
Option: { value: string; label: string; disabled?: boolean } com metadados adicionais opcionais por renderOption. value e defaultValue representam o value selecionado; onValueChange recebe value ou null e opção. inputValue/defaultInputValue e onInputValueChange controlam exclusivamente o texto. Clear mantém foco no input e limpa valor + texto; seleção define texto visível ao label e foco fica no input. Em modo controlado, callbacks solicitam mudanças mas a fonte de verdade continua no consumidor. Campo oculto name conserva value para FormData.

## Acessibilidade e UX
Padrão ARIA 1.2 combobox editable com input role combobox, aria-autocomplete list, aria-controls para listbox aberta, aria-expanded, aria-activedescendant para opção real; opções role option, aria-selected. Setas/Home/End mudam destaque sem mover foco; Enter seleciona; Escape fecha; Tab fecha sem sequestrar; foco visível, aria-invalid/aria-describedby herdados do AdsField e rótulo via htmlFor. Anúncio discreto de loading/vazio/erro por status, sem duplicar alertas. IDs gerados por useStableId e compatíveis com SSR.

## Overlay, estilos e riscos
OverlayPortal reutiliza empilhamento e tema, preserva foco no input, posição fixed via useAnchoredPosition para dialog/scroll/overflow, largura acompanha trigger quando disponível. Botões de limpar não fazem submit. Portais só montam após hidratação. Ao usar nested dialog, preservar o sistema existente de Escape. Estilos usam classes ads- e tokens CSS compilados nos três tamanhos e temas. Riscos: corridas assíncronas, race no blur/ponteiro, cliques no portal e seleção controlada; testes devem cobrir.

## Busca assíncrona
A consulta de AdsAutocomplete pode ser local, síncrona ou assíncrona com AbortController; debounce padrão 250 ms; cleanup invalida todas as respostas anteriores, inclusive as que ignoram signal. Erro disponível para exibição e onLoadError sem forçar API real. No modo remoto, não exibir resultados obsoletos enquanto a consulta atual não conclui; termos vazios podem apresentar [] sem request, documentado.

## Demonstração e migração
Demo no catálogo existente, com busca local, servidor simulado, erros, vazios, latência invertida, estados e controle de valor. Storybook documenta controles. Migração: CampoAutocomplete => AdsAutocomplete(options) / AdsCombobox; CampoAutocompleteAsync => AdsAutocomplete(loadOptions). mapear react-select {label,value} para value string; formatOptionLabel => renderOption; menuPortalTarget/menuPosition tratados internamente.

## Reversão
Reverter a PR remove apenas novas APIs e registros de demo, mantendo componentes anteriores intactos.

## Ajustes da revisão

- Digitar após selecionar limpa imediatamente o value anterior (e emite onValueChange(null, null)); não é permitido enviar o valor antigo com um novo texto.
- Em modo controlado, limpar o value para null não apaga a digitação em andamento.
- Listbox usa a camada overlay (40), pois dropdown (30) ficaria atrás da camada do AdsDialog (40); portal registrado como descendente lógico do modal.
- Resultados e erros remotos são associados ao query que os originou; nenhuma resposta anterior é exibida entre um render controlado e o próximo efeito.
- AdsAutocomplete disabled não dispara consulta remota.
